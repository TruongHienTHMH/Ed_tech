/**
 * ==============================================================================
 * MODULE 04: BỘ ĐỊNH TUYẾN WEB APP (WEB APP ROUTING & REST ENDPOINTS)
 * ==============================================================================
 * 1. doGet(e): Xuất toàn bộ 11 tab nội dung công khai ra JSON cho Next.js CMS.
 * 2. doPost(e): Tiếp nhận Leads bảo mật & Thực thi 9 thao tác ghi dữ liệu từ Web Form:
 *    add_course, add_curriculum, save_mentor, add_promotion, add_package,
 *    add_testimonial, add_faq, save_settings, add_blog.
 * 3. Bảo vệ an toàn tuyệt đối PII trong tab leads (private), chống đọc trộm qua GET.
 * ==============================================================================
 */

/**
 * Endpoint GET: Đọc dữ liệu từ Google Sheets
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = params.action || "ping";
    var secret = params.secret || "";

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        status: "healthy",
        service: "DataWithLy Google Sheets CMS Engine",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // VÁ LỖ HỔNG: Nếu server chưa cấu hình secret hoặc secret gửi lên không khớp -> Chặn ngay!
    var configuredSecret = CONFIG.SHARED_SECRET;
    if (!configuredSecret || configuredSecret.trim() === "" || secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ. Vui lòng cấu hình SHARED_SECRET trong Script Properties." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Lấy riêng 1 tab
    if (action === "get_tab") {
      var tabName = params.tab || "courses";
      if (tabName.toLowerCase().indexOf("private") !== -1 || tabName.toLowerCase().indexOf("leads") !== -1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false,
          error: { code: "FORBIDDEN", message: "Tab chứa thông tin PII bảo mật không thể truy xuất công khai." }
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var sheet = ss.getSheetByName(tabName);
      if (!sheet) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false,
          error: { code: "TAB_NOT_FOUND", message: "Không tìm thấy tab: " + tabName }
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var tabData = getSheetRowsAsObjects(sheet);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        tab: tabName,
        total: tabData.length,
        data: tabData
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Đọc tất cả 11 tab nội dung công khai
    var coursesSheet = ss.getSheetByName("courses");
    var curriculumSheet = ss.getSheetByName("curriculum");
    var pricingSheet = ss.getSheetByName("packages_pricing");
    var studentProjectsSheet = ss.getSheetByName("student_projects");
    var mentorSheet = ss.getSheetByName("mentor_profiles");
    var testimonialsSheet = ss.getSheetByName("testimonials");
    var faqsSheet = ss.getSheetByName("faqs");
    var trustSheet = ss.getSheetByName("trust_metrics");
    var settingsSheet = ss.getSheetByName("settings");
    var blogsSheet = ss.getSheetByName("blog_posts");
    var promoSheet = ss.getSheetByName("promotions");

    var courses = coursesSheet ? getSheetRowsAsObjects(coursesSheet) : [];
    var curriculum = curriculumSheet ? getSheetRowsAsObjects(curriculumSheet) : [];
    var packages = pricingSheet ? getSheetRowsAsObjects(pricingSheet) : [];
    var studentProjects = studentProjectsSheet ? getSheetRowsAsObjects(studentProjectsSheet) : [];
    var mentors = mentorSheet ? getSheetRowsAsObjects(mentorSheet) : [];
    var testimonials = testimonialsSheet ? getSheetRowsAsObjects(testimonialsSheet) : [];
    var faqs = faqsSheet ? getSheetRowsAsObjects(faqsSheet) : [];
    var trustMetrics = trustSheet ? getSheetRowsAsObjects(trustSheet) : [];
    var settings = settingsSheet ? getSheetRowsAsObjects(settingsSheet) : [];
    var blogPosts = blogsSheet ? getSheetRowsAsObjects(blogsSheet) : [];
    var promotions = promoSheet ? getSheetRowsAsObjects(promoSheet) : [];

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      source: "google_sheets_live",
      fetchedAt: new Date().toISOString(),
      tabs: {
        courses: courses,
        curriculum: curriculum,
        packages_pricing: packages,
        student_projects: studentProjects,
        mentor_profiles: mentors,
        testimonials: testimonials,
        faqs: faqs,
        trust_metrics: trustMetrics,
        settings: settings,
        blog_posts: blogPosts,
        promotions: promotions
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "GET_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Đọc dữ liệu từ sheet và chuyển thành mảng Objects chuẩn hóa keys
 */
function getSheetRowsAsObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_").replace(/_?\(private\)/g, "");
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

/**
 * Endpoint POST: Tiếp nhận Leads & Thao tác ghi dữ liệu từ Web
 */
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

    // VÁ LỖ HỔNG: Nếu server chưa cấu hình secret hoặc secret gửi lên không khớp -> Chặn ngay!
    var configuredSecret = CONFIG.SHARED_SECRET;
    if (!configuredSecret || configuredSecret.trim() === "" || payload.secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ. Vui lòng cấu hình SHARED_SECRET trong Script Properties." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = payload.action || "submit_lead";

    // 1. THÊM KHÓA HỌC (add_course)
    if (action === "add_course") {
      var courseResult = addNewCourseFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_course", data: courseResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. THÊM CHƯƠNG LỘ TRÌNH (add_curriculum)
    if (action === "add_curriculum") {
      var currResult = addNewCurriculumModuleFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_curriculum", data: currResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. QUẢN TRỊ HỒ SƠ MENTOR (save_mentor)
    if (action === "save_mentor") {
      var mentorResult = saveMentorProfileFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_mentor", data: mentorResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. THÊM KHUYẾN MÃI (add_promotion)
    if (action === "add_promotion") {
      var promoResult = addNewPromotionFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_promotion", data: promoResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. THÊM GÓI COMBO & BẢNG GIÁ (add_package)
    if (action === "add_package") {
      var pkgResult = savePackageFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_package", data: pkgResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. THÊM ĐÁNH GIÁ HỌC VIÊN (add_testimonial)
    if (action === "add_testimonial") {
      var testResult = saveTestimonialFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_testimonial", data: testResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. THÊM CÂU HỎI FAQ (add_faq)
    if (action === "add_faq") {
      var faqResult = saveFaqFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_faq", data: faqResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 8. CẤU HÌNH HỆ THỐNG (save_settings)
    if (action === "save_settings") {
      var settingsResult = saveSettingsFromModal(payload.settings || payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "save_settings", data: settingsResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 9. THÊM BÀI VIẾT BLOG (add_blog)
    if (action === "add_blog") {
      var blogResult = saveBlogFromModal(payload);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "add_blog", data: blogResult
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 10. TIẾP NHẬN LEAD HỌC VIÊN (submit_lead)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads") || ss.getSheetByName("private_leads");

    if (!sheet) {
      sheet = ss.insertSheet("leads (private)");
      sheet.appendRow([
        "submission_id", "timestamp", "name (private)", "phone (private)", "email (private)",
        "course_id", "course_name", "message (private)", "status"
      ]);
    }

    var timestamp = new Date().toISOString();
    var safePhone = payload.phone ? ("'" + payload.phone.toString().trim().replace(/^[=+\-@\t\r]+/, "")) : "";
    sheet.appendRow([
      sanitizeFormula(payload.submission_id || Utilities.getUuid()),
      timestamp,
      sanitizeFormula(payload.name || ""),
      safePhone,
      sanitizeFormula(payload.email || ""),
      sanitizeFormula(payload.course_id || "general"),
      sanitizeFormula(payload.course_name || "Tư vấn chung"),
      sanitizeFormula(payload.message || ""),
      "NEW"
    ]);

    if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
      sendTelegramNotification(payload);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      submissionId: payload.submission_id,
      status: "stored"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "SERVER_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
