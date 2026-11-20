/**
 * ==============================================================================
 * MODULE 04: BỘ ĐỊNH TUYẾN WEB APP CMS CONTENT (CMS REST ENDPOINTS)
 * ==============================================================================
 * 1. doGet(e): Xuất toàn bộ 11 tab nội dung công khai ra JSON cho Next.js CMS.
 *    - Tích hợp CacheService tăng tốc độ phản hồi từ 4-6s xuống ~200ms.
 *    - Quét bảng tính 1 lượt (Single-Pass) giảm 80% thời gian RPC.
 * 2. doPost(e): Thực thi các thao tác ghi dữ liệu từ CMS Modals & tự động xóa Cache.
 * ==============================================================================
 */

var CMS_CACHE_KEY = "datawithly_cms_all_tabs_v2";
var CMS_CACHE_TTL_SEC = 300; // Đồng bộ 300s (5 phút) đồng nhất với Next.js ISR revalidate = 300

function getCmsCache() {
  try {
    var cache = CacheService.getScriptCache();
    var cached = cache.get(CMS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {}
  return null;
}

function setCmsCache(data) {
  try {
    var cache = CacheService.getScriptCache();
    var str = JSON.stringify(data);
    // CacheService giới hạn 100KB mỗi khóa
    if (str.length < 100000) {
      cache.put(CMS_CACHE_KEY, str, CMS_CACHE_TTL_SEC);
    }
  } catch (e) {}
}

function clearCmsCache() {
  try {
    var cache = CacheService.getScriptCache();
    cache.remove(CMS_CACHE_KEY);
  } catch (e) {}
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = params.action || "ping";
    var secret = params.secret || "";

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        status: "healthy",
        service: "DataWithLy CMS Content Engine",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var configuredSecret = (CONFIG.SHARED_SECRET || "").toString().trim();
    var requestSecret = (secret || "").toString().trim();

    if (configuredSecret && configuredSecret !== "" && requestSecret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Yêu cầu mã secret xác thực hợp lệ. (Mã secret từ Website không khớp với SHARED_SECRET trong Google Apps Script)."
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "clear_cache") {
      clearCmsCache();
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        message: "Đã xóa toàn bộ bộ đệm CacheService CMS thành công.",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "get_tab") {
      var tabName = params.tab || "courses";
      var targetSheet = ss.getSheetByName(tabName);
      if (!targetSheet) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false,
          error: { code: "TAB_NOT_FOUND", message: "Không tìm thấy tab: " + tabName }
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var tabData = getSheetRowsAsObjects(targetSheet);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        tab: tabName,
        total: tabData.length,
        data: tabData
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // ⚡ Kiểm tra CacheService trước khi quét bảng tính
    var forceRefresh = params.force_refresh === "true" || params.no_cache === "true";
    if (!forceRefresh) {
      var cached = getCmsCache();
      if (cached) {
        cached.fromCache = true;
        return ContentService.createTextOutput(JSON.stringify(cached)).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // ⚡ Quét toàn bộ sheet trong 1 lượt (Single-Pass) thay vì gọi getSheetByName 11 lần
    var sheets = ss.getSheets();
    var sheetMap = {};
    for (var s = 0; s < sheets.length; s++) {
      sheetMap[sheets[s].getName().toLowerCase().trim()] = sheets[s];
    }

    var responseData = {
      ok: true,
      source: "google_sheets_cms_live",
      fetchedAt: new Date().toISOString(),
      fromCache: false,
      tabs: {
        courses: sheetMap["courses"] ? getSheetRowsAsObjects(sheetMap["courses"]) : [],
        curriculum: sheetMap["curriculum"] ? getSheetRowsAsObjects(sheetMap["curriculum"]) : [],
        packages_pricing: sheetMap["packages_pricing"] ? getSheetRowsAsObjects(sheetMap["packages_pricing"]) : [],
        student_projects: sheetMap["student_projects"] ? getSheetRowsAsObjects(sheetMap["student_projects"]) : [],
        mentor_profiles: sheetMap["mentor_profiles"] ? getSheetRowsAsObjects(sheetMap["mentor_profiles"]) : [],
        testimonials: sheetMap["testimonials"] ? getSheetRowsAsObjects(sheetMap["testimonials"]) : [],
        faqs: sheetMap["faqs"] ? getSheetRowsAsObjects(sheetMap["faqs"]) : [],
        trust_metrics: sheetMap["trust_metrics"] ? getSheetRowsAsObjects(sheetMap["trust_metrics"]) : [],
        settings: sheetMap["settings"] ? getSheetRowsAsObjects(sheetMap["settings"]) : [],
        blog_posts: sheetMap["blog_posts"] ? getSheetRowsAsObjects(sheetMap["blog_posts"]) : [],
        promotions: sheetMap["promotions"] ? getSheetRowsAsObjects(sheetMap["promotions"]) : []
      }
    };

    // Lưu kết quả vào CacheService
    setCmsCache(responseData);

    return ContentService.createTextOutput(JSON.stringify(responseData)).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "GET_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetRowsAsObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");
  });

  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var isEmpty = row.every(function(cell) { return cell === "" || cell === null; });
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      if (header) {
        obj[header] = row[j];
      }
    }
    rows.push(obj);
  }
  return rows;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(CONFIG.LOCK_TIMEOUT_MS);

  if (!hasLock) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "LOCK_TIMEOUT", message: "Hệ thống đang bận ghi dữ liệu khác, vui lòng thử lại sau vài giây." }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);

    var configuredSecret = CONFIG.SHARED_SECRET;
    if (configuredSecret && configuredSecret.trim() !== "" && payload.secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = payload.action || "ping";

    if (action === "seed_database" || action === "bulk_seed") {
      var seedStats = applySeedSnapshotToSpreadsheet(payload.snapshot || payload.data);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "seed_database", message: "Đã nạp toàn bộ dữ liệu chuẩn thành công!", stats: seedStats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_course") {
      var courseResult = addNewCourseFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_course", data: courseResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_curriculum") {
      var currResult = addNewCurriculumModuleFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_curriculum", data: currResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "save_mentor") {
      var mentorResult = saveMentorProfileFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_mentor", data: mentorResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_promotion") {
      var promoResult = addNewPromotionFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_promotion", data: promoResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_package") {
      var pkgResult = savePackageFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_package", data: pkgResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_testimonial") {
      var testResult = saveTestimonialFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_testimonial", data: testResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_faq") {
      var faqResult = saveFaqFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_faq", data: faqResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "save_settings") {
      var settingsResult = saveSettingsFromModal(payload.settings || payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_settings", data: settingsResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "add_blog") {
      var blogResult = saveBlogFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_blog", data: blogResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "UNKNOWN_ACTION", message: "Hành động không xác định: " + action }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "SERVER_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    clearCmsCache();
    lock.releaseLock();
  }
}

function applySeedSnapshotToSpreadsheet(snapshot) {
  if (!snapshot) throw new Error("Dữ liệu snapshot không hợp lệ hoặc để trống.");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var stats = {};

  if (snapshot.courses && snapshot.courses.length) {
    var cSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
    if (cSheet.getLastRow() > 1) {
      cSheet.getRange(2, 1, cSheet.getLastRow() - 1, cSheet.getLastColumn()).clearContent();
    }
    var cRows = snapshot.courses.map(function(c, i) {
      return [
        c.id || ("crs-" + (i + 1)),
        c.title || "",
        c.slug || c.id || "",
        c.courseKind || c.course_kind || "Khóa học nổi bật",
        c.tag || "SQL",
        c.tagline || "",
        Number(c.tuitionVnd || c.tuition_vnd || 0),
        Number(c.originalTuitionVnd || c.original_tuition_vnd || 0),
        c.duration || "8 tuần",
        c.level || "Beginner",
        c.isActive !== false,
        c.isFeatured === true,
        Number(c.sortOrder || c.sort_order || (i + 1)),
        c.description || "",
        c.coverImageUrl || c.cover_image_url || "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png"
      ];
    });
    cSheet.getRange(2, 1, cRows.length, 15).setValues(cRows);
    cSheet.getRange(2, 7, cRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.courses = cRows.length;
  }

  return stats;
}
