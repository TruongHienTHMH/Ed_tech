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

    var ss = SpreadsheetFactory.getContentSpreadsheet();

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

    // 0. NẠP TOÀN BỘ DATABASE CHUẨN FIGMA TỪ SEEDER (seed_database)
    if (action === "seed_database" || action === "bulk_seed") {
      var seedStats = applySeedSnapshotToSpreadsheet(payload.snapshot || payload.data);
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        action: "seed_database",
        message: "Đã nạp toàn bộ dữ liệu chuẩn Figma 100% vào Google Sheets thành công!",
        stats: seedStats
      })).setMimeType(ContentService.MimeType.JSON);
    }

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

    // 10. TRUY VẤN DANH SÁCH LEADS (get_leads) - Bảo mật SHARED_SECRET cho Web Leads CRM
    if (action === "get_leads") {
      var leadsSs = SpreadsheetFactory.getLeadsSpreadsheet();
      var leadsSheet = leadsSs.getSheetByName("leads") || leadsSs.getSheetByName("leads (private)") || leadsSs.getSheetByName("Leads");
      if (!leadsSheet || leadsSheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: true, action: "get_leads", total: 0, data: []
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var leadRows = getSheetRowsAsObjects(leadsSheet);
      var filterStatus = (payload.status || "ALL").toUpperCase();
      var searchTerm = (payload.search || "").toLowerCase().trim();
      if (filterStatus !== "ALL") {
        leadRows = leadRows.filter(function(r) { return (r.status || "").toUpperCase() === filterStatus; });
      }
      if (searchTerm) {
        leadRows = leadRows.filter(function(r) {
          return (r.name || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.phone || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.email || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.coaching_course || r.course_name || "").toLowerCase().indexOf(searchTerm) !== -1;
        });
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        action: "get_leads",
        total: leadRows.length,
        data: leadRows
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 11. CẬP NHẬT TRẠNG THÁI LEAD (update_lead) - Hỗ trợ Web Leads CRM
    if (action === "update_lead") {
      var updateSs = SpreadsheetFactory.getLeadsSpreadsheet();
      var updateSheet = updateSs.getSheetByName("leads") || updateSs.getSheetByName("leads (private)") || updateSs.getSheetByName("Leads");
      if (!updateSheet || updateSheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: { code: "NOT_FOUND", message: "Không tìm thấy dữ liệu Leads." }
        })).setMimeType(ContentService.MimeType.JSON);
      }
      var targetSubId = (payload.submission_id || "").toString().trim();
      var sheetData = updateSheet.getDataRange().getValues();
      var isUpdated = false;
      var rawHeaders = sheetData[0].map(function(h) {
        return h.toString().toLowerCase().trim().replace(/[\s-]+/g, "_").replace(/_?\(private\)/g, "");
      });

      for (var r = 1; r < sheetData.length; r++) {
        if ((sheetData[r][0] || "").toString().trim() === targetSubId) {
          var targetRow = r + 1;
          if (payload.status) {
            var sIdx = rawHeaders.indexOf("status");
            if (sIdx !== -1) updateSheet.getRange(targetRow, sIdx + 1).setValue(sanitizeFormula(payload.status));
          }
          if (payload.notes !== undefined) {
            var nIdx = rawHeaders.indexOf("notes");
            if (nIdx !== -1) updateSheet.getRange(targetRow, nIdx + 1).setValue(sanitizeFormula(payload.notes));
          }
          if (payload.assigned_to !== undefined) {
            var aIdx = rawHeaders.indexOf("assigned_to");
            if (aIdx !== -1) updateSheet.getRange(targetRow, aIdx + 1).setValue(sanitizeFormula(payload.assigned_to));
          }
          var uIdx = rawHeaders.indexOf("updated_at");
          if (uIdx !== -1) {
            updateSheet.getRange(targetRow, uIdx + 1).setValue(new Date().toISOString());
          }
          isUpdated = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: isUpdated,
        action: "update_lead",
        message: isUpdated ? "Cập nhật Lead thành công!" : "Không tìm thấy submission_id: " + targetSubId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 12. THỐNG KÊ DASHBOARD LEADS (get_lead_stats)
    if (action === "get_lead_stats") {
      var statsSs = SpreadsheetFactory.getLeadsSpreadsheet();
      var statsSheet = statsSs.getSheetByName("leads") || statsSs.getSheetByName("leads (private)") || statsSs.getSheetByName("Leads");
      var stats = { total: 0, new: 0, contacting: 0, consulted: 0, enrolled: 0, dropped: 0, spam: 0 };
      if (statsSheet && statsSheet.getLastRow() > 1) {
        var allLeads = getSheetRowsAsObjects(statsSheet);
        stats.total = allLeads.length;
        allLeads.forEach(function(l) {
          var st = (l.status || "NEW").toUpperCase();
          if (st === "NEW") stats.new++;
          else if (st === "CONTACTING") stats.contacting++;
          else if (st === "CONSULTED") stats.consulted++;
          else if (st === "ENROLLED") stats.enrolled++;
          else if (st === "DROPPED") stats.dropped++;
          else if (st === "SPAM") stats.spam++;
        });
      }
      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "get_lead_stats", stats: stats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 13. TIẾP NHẬN LEAD HỌC VIÊN (submit_lead) - Chuẩn Figma Node 12-3320 & Ghi vào Leads Spreadsheet
    var targetLeadSs = SpreadsheetFactory.getLeadsSpreadsheet();
    var sheet = targetLeadSs.getSheetByName("leads") || targetLeadSs.getSheetByName("leads (private)") || targetLeadSs.getSheetByName("Leads");

    if (!sheet) {
      sheet = setupLeadsDatabaseSpreadsheet(targetLeadSs, "leads");
    }

    var timestamp = payload.client_submitted_at || new Date().toISOString();
    var safePhone = payload.phone ? ("'" + payload.phone.toString().trim().replace(/^[=+\-@\t\r]+/, "")) : "";
    var coachingCourse = sanitizeFormula(payload.course_name || payload.interested_courses || payload.course_id || "SQL for Data Analytics");
    var targetOrGoal = sanitizeFormula(payload.message || payload.target_or_goal || "");
    var attendanceCommit = sanitizeFormula(payload.attendance_commitment || "Tôi chắc chắn");
    var statusVal = sanitizeFormula(payload.status || "NEW");
    var notesVal = sanitizeFormula(payload.notes || "");
    var assignedToVal = sanitizeFormula(payload.assigned_to || "");
    var sourceVal = sanitizeFormula(payload.source || payload.form_id || "website");
    var updatedAt = new Date().toISOString();

    // Đối chiếu cấu trúc header để ghi đúng vị trí cột
    var headerRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0] || [];
    var hasFigmaSchema = headerRow.indexOf("coaching_course") !== -1 || headerRow.length >= 13;

    if (hasFigmaSchema) {
      sheet.appendRow([
        sanitizeFormula(payload.submission_id || Utilities.getUuid()),
        timestamp,
        sanitizeFormula(payload.name || ""),
        safePhone,
        sanitizeFormula(payload.email || ""),
        coachingCourse,
        targetOrGoal,
        attendanceCommit,
        statusVal,
        notesVal,
        assignedToVal,
        sourceVal,
        updatedAt
      ]);
    } else {
      // Fallback cho tab leads (private) cũ (9 cột)
      sheet.appendRow([
        sanitizeFormula(payload.submission_id || Utilities.getUuid()),
        timestamp,
        sanitizeFormula(payload.name || ""),
        safePhone,
        sanitizeFormula(payload.email || ""),
        sanitizeFormula(payload.course_id || "general"),
        coachingCourse,
        targetOrGoal,
        statusVal
      ]);
    }

    if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
      sendTelegramNotification(payload);
    }

    // Gửi email thông báo 2 chiều (Client hientruongthmh@gmail.com & Học viên kèm Zalo)
    try {
      sendLeadEmails(payload);
    } catch (mailErr) {
      console.warn("Lỗi gửi email lead:", mailErr);
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

/**
 * GHI ĐÈ DỮ LIỆU CHUẨN FIGMA TỪ DATABASE SEEDER VÀO SPREADSHEET
 */
function applySeedSnapshotToSpreadsheet(snapshot) {
  if (!snapshot) throw new Error("Dữ liệu snapshot không hợp lệ hoặc để trống.");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var stats = {};

  // 1. Courses
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
    cSheet.getRange(2, 1, cRows.length, 14).setValues(cRows);
    cSheet.getRange(2, 6, cRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.courses = cRows.length;
  }

  // 2. Curriculum
  if (snapshot.curriculum && snapshot.curriculum.length) {
    var curSheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));
    if (curSheet.getLastRow() > 1) {
      curSheet.getRange(2, 1, curSheet.getLastRow() - 1, curSheet.getLastColumn()).clearContent();
    }
    var curRows = snapshot.curriculum.map(function(m, i) {
      var bullets = Array.isArray(m.subContent) ? m.subContent.join("\n")
        : (Array.isArray(m.bulletPoints) ? m.bulletPoints.join("\n")
        : (m.sub_content || m.topicsBullets || m.topics_bullets || ""));
      var weekNum = Number(m.week || m.weekNumber) || Math.ceil((i + 1) / 2);
      var dayNum = Number(m.day || m.moduleNumber || m.module_number) || (i + 1);
      var dateBadge = m.date || m.sessionDateBadge || ("TH10 " + (dayNum < 10 ? "0" + dayNum : dayNum));
      var sessionTitle = m.sessionTitle || m.title || m.module_title || ("Buổi " + dayNum);
      var sessionDesc = m.sessionDesc || m.summary || m.content || "";
      var durationVal = m.duration || (m.durationHours ? m.durationHours + " giờ" : "3 giờ");
      var sortVal = Number(m.sortOrder || m.sort_order || (i + 1));

      return [
        m.id || ("cur-" + (i + 1)),
        m.courseId || m.course_id || "",
        m.courseName || m.course_name || "",
        weekNum,
        dayNum,
        dateBadge,
        sessionTitle,
        sessionDesc,
        bullets,
        durationVal,
        sortVal
      ];
    });
    curSheet.getRange(2, 1, curRows.length, 11).setValues(curRows);
    stats.curriculum = curRows.length;
  }

  // 3. Packages
  if (snapshot.packages && snapshot.packages.length) {
    var pkgSheet = ss.getSheetByName("packages_pricing") || (setupPackagesPricingTab(ss), ss.getSheetByName("packages_pricing"));
    if (pkgSheet.getLastRow() > 1) {
      pkgSheet.getRange(2, 1, pkgSheet.getLastRow() - 1, pkgSheet.getLastColumn()).clearContent();
    }
    var pkgRows = snapshot.packages.map(function(p, i) {
      var feats = Array.isArray(p.featuresList) ? p.featuresList.join("\n") : (p.features_list || "");
      return [
        p.id || ("pkg-" + (i + 1)),
        p.packageId || p.package_id || p.id || "",
        p.name || "",
        Number(p.originalPrice || p.original_price || 0),
        Number(p.salePrice || p.sale_price || 0),
        p.badge || "",
        feats,
        p.isPopular === true,
        p.isActive !== false,
        Number(p.sortOrder || p.sort_order || (i + 1))
      ];
    });
    pkgSheet.getRange(2, 1, pkgRows.length, 10).setValues(pkgRows);
    pkgSheet.getRange(2, 4, pkgRows.length, 2).setNumberFormat('#,##0 "đ"');
    stats.packages = pkgRows.length;
  }

  // 4. Student Projects
  if (snapshot.projects && snapshot.projects.length) {
    var pSheet = ss.getSheetByName("student_projects") || (setupStudentProjectsTab(ss), ss.getSheetByName("student_projects"));
    if (pSheet.getLastRow() > 1) {
      pSheet.getRange(2, 1, pSheet.getLastRow() - 1, pSheet.getLastColumn()).clearContent();
    }
    var pRows = snapshot.projects.map(function(p, i) {
      var tools = Array.isArray(p.tools) ? p.tools.join(", ") : (p.toolsRaw || p.tools || "");
      return [
        p.projectId || p.id || ("proj-" + (i + 1)),
        p.title || "",
        p.category || "Data Analytics",
        p.authorName || p.author_name || p.author || "Học viên",
        tools,
        p.metrics || "",
        p.imageUrl || p.image_url || "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
        Number(p.sortOrder || p.sort_order || (i + 1)),
        p.isActive !== false
      ];
    });
    pSheet.getRange(2, 1, pRows.length, 9).setValues(pRows);
    stats.projects = pRows.length;
  }

  // 5. Mentors
  if (snapshot.mentors && snapshot.mentors.length) {
    var mSheet = ss.getSheetByName("mentor_profiles") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));
    if (mSheet.getLastRow() > 1) {
      mSheet.getRange(2, 1, mSheet.getLastRow() - 1, mSheet.getLastColumn()).clearContent();
    }
    var mRows = snapshot.mentors.map(function(m, i) {
      var comps = Array.isArray(m.companies) ? m.companies.join(", ") : (m.companiesWorked || m.companies_worked || "");
      return [
        m.id || ("men-" + (i + 1)),
        m.name || "Hứa Thảo Ly",
        m.role || "Founder & Lead Mentor",
        m.title || m.role || "",
        m.bio || "",
        comps,
        m.avatarUrl || m.avatar_url || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        m.linkedinUrl || m.linkedin_url || "",
        m.isActive !== false
      ];
    });
    mSheet.getRange(2, 1, mRows.length, 9).setValues(mRows);
    stats.mentors = mRows.length;
  }

  // 6. Testimonials
  if (snapshot.testimonials && snapshot.testimonials.length) {
    var tSheet = ss.getSheetByName("testimonials") || (setupTestimonialsTab(ss), ss.getSheetByName("testimonials"));
    if (tSheet.getLastRow() > 1) {
      tSheet.getRange(2, 1, tSheet.getLastRow() - 1, tSheet.getLastColumn()).clearContent();
    }
    var tRows = snapshot.testimonials.map(function(t, i) {
      return [
        t.id || ("tst-" + (i + 1)),
        t.studentName || t.student_name || t.name || "",
        t.studentRole || t.role || "",
        t.company || "",
        t.avatarUrl || t.avatar_url || "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png",
        t.courseId || t.course_id || "ALL",
        t.rating ? t.rating.toString() : "5",
        t.reviewText || t.comment || "",
        t.isFeatured === true,
        t.isActive !== false
      ];
    });
    tSheet.getRange(2, 1, tRows.length, 10).setValues(tRows);
    stats.testimonials = tRows.length;
  }

  return stats;
}

/**
 * Gửi email thông báo 2 chiều khi tiếp nhận Lead học viên mới:
 * 1. Email cho Client / Đội ngũ tuyển sinh (hientruongthmh@gmail.com)
 * 2. Email cảm ơn & xác nhận cho Học viên kèm link và mã kết nối Zalo
 */
function sendLeadEmails(payload) {
  if (!payload) return;

  var leadName = payload.name || "Học viên";
  var leadPhone = payload.phone || "Chưa cung cấp";
  var leadEmail = payload.email || "";
  var courseName = payload.course_name || "Data Analytics";
  var courseId = payload.course_id || "general";
  var message = payload.message || "Không có";
  var timeStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var zaloUrl = CONFIG.ZALO_CONTACT_URL || "https://zalo.me/0901234567";

  // --- 1. EMAIL GỬI CHO CLIENT (ADMIN / TUYỂN SINH) ---
  var clientRecipients = CONFIG.CLIENT_NOTIFICATION_EMAILS;
  if (clientRecipients && clientRecipients.length > 0) {
    var clientSubject = "🔥 [DataWithLy - Lead Mới] " + leadName + " vừa đăng ký tư vấn khóa " + courseName;
    var clientHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;'>",
      "<div style='background: #8B1D2C; color: #FFFFFF; padding: 15px 20px; border-radius: 6px 6px 0 0;'>",
      "<h2 style='margin: 0; font-size: 18px;'>🔥 THÔNG BÁO HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI</h2>",
      "</div>",
      "<div style='padding: 20px; background: #FFFFFF;'>",
      "<p style='font-size: 14px; color: #374151;'>Hệ thống vừa tiếp nhận một lượt đăng ký tư vấn mới từ website DataWithLy:</p>",
      "<table style='width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;'>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; width: 35%;'>Họ và tên:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #111827;'>" + leadName + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Số điện thoại:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='tel:" + leadPhone + "' style='color: #8B1D2C; font-weight: bold; text-decoration: none;'>" + leadPhone + "</a> (Bấm để gọi)</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Email:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='mailto:" + leadEmail + "' style='color: #2563EB; text-decoration: none;'>" + leadEmail + "</a></td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Khóa học quan tâm:</td><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; color: #784080;'>" + courseName + " (" + courseId + ")</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Lời nhắn / Ghi chú:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'>" + message + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Thời gian đăng ký:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #6B7280;'>" + timeStr + "</td></tr>",
      "</table>",
      "<div style='margin-top: 20px; padding: 12px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px; font-size: 13px; color: #92400E;'>",
      "⚡ <strong>Hành động nhanh:</strong> Vui lòng liên hệ học viên trong vòng 15-30 phút để đạt tỷ lệ chuyển đổi cao nhất.",
      "</div>",
      "</div>",
      "</div>"
    ].join("");

    for (var i = 0; i < clientRecipients.length; i++) {
      try {
        MailApp.sendEmail({
          to: clientRecipients[i],
          subject: clientSubject,
          htmlBody: clientHtml
        });
      } catch (err) {
        console.warn("Không thể gửi email đến client " + clientRecipients[i] + ":", err);
      }
    }
  }

  // --- 2. EMAIL GỬI CHO HỌC VIÊN (CẢM ƠN & KẾT NỐI ZALO) ---
  if (leadEmail && leadEmail.indexOf("@") !== -1) {
    var studentSubject = "🎓 [DataWithLy] Xác nhận đăng ký tư vấn khóa học " + courseName;
    var studentHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; background: #FFFFFF;'>",
      "<div style='text-align: center; padding-bottom: 20px; border-bottom: 1px solid #F3F4F6;'>",
      "<h1 style='color: #8B1D2C; font-size: 24px; margin: 0 0 8px 0; font-weight: bold;'>DATAWITHLY</h1>",
      "<p style='color: #6B7280; font-size: 14px; margin: 0;'>Đào Tạo Data Analytics Thực Chiến cùng Mentor Hứa Thảo Ly</p>",
      "</div>",
      "<div style='padding: 24px 0;'>",
      "<p style='font-size: 16px; color: #111827; margin-top: 0;'>Chào <strong>" + leadName + "</strong>,</p>",
      "<p style='font-size: 14px; color: #4B5563; line-height: 1.6;'>Cảm ơn bạn đã quan tâm và đăng ký tư vấn khóa học <strong>" + courseName + "</strong> tại DataWithLy!</p>",
      "<p style='font-size: 14px; color: #4B5563; line-height: 1.6;'>Đội ngũ tuyển sinh và Mentor đã nhận được thông tin của bạn. Chúng tôi sẽ <strong>liên hệ trực tiếp qua Điện thoại / Zalo trong vòng 15 - 30 phút tới</strong> để lắng nghe nhu cầu, tư vấn lộ trình học tối ưu và gửi tặng bạn các ưu đãi học phí tốt nhất.</p>",
      "<div style='background: #FDF2F4; border: 1px solid #FBCFE8; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;'>",
      "<h3 style='color: #8B1D2C; margin: 0 0 8px 0; font-size: 16px;'>Cần hỗ trợ hoặc nhận đề cương ngay?</h3>",
      "<p style='color: #4B5563; font-size: 13px; margin: 0 0 16px 0;'>Bạn có thể kết nối trực tiếp với Mentor qua Zalo để được giải đáp thắc mắc ngay lập tức:</p>",
      "<a href='" + zaloUrl + "' target='_blank' style='display: inline-block; background: #0068FF; color: #FFFFFF; font-weight: bold; font-size: 15px; padding: 12px 28px; border-radius: 25px; text-decoration: none; box-shadow: 0 4px 10px rgba(0, 104, 255, 0.25);'>💬 Kết Nối Zalo Với Mentor Ngay</a>",
      "<p style='color: #9CA3AF; font-size: 11px; margin: 10px 0 0 0;'>Hoặc tìm kiếm số Zalo Hotline: 0901 234 567</p>",
      "</div>",
      "<div style='background: #F9FAFB; padding: 16px; border-radius: 8px; margin-top: 20px; font-size: 13px; color: #4B5563;'>",
      "<p style='margin: 0 0 8px 0; font-weight: bold; color: #111827;'>Tóm tắt thông tin đăng ký của bạn:</p>",
      "<p style='margin: 4px 0;'>• <strong>Khóa học:</strong> " + courseName + "</p>",
      "<p style='margin: 4px 0;'>• <strong>Số điện thoại:</strong> " + leadPhone + "</p>",
      "<p style='margin: 4px 0;'>• <strong>Email:</strong> " + leadEmail + "</p>",
      "</div>",
      "</div>",
      "<div style='border-top: 1px solid #F3F4F6; padding-top: 16px; text-align: center; color: #9CA3AF; font-size: 12px;'>",
      "<p style='margin: 0;'>DataWithLy — Học Data Analytics từ tư duy đến thực hành</p>",
      "<p style='margin: 4px 0 0 0;'>Email: tuyensinh@datawithly.edu.vn | Hotline / Zalo: 0901 234 567</p>",
      "</div>",
      "</div>"
    ].join("");

    try {
      MailApp.sendEmail({
        to: leadEmail,
        subject: studentSubject,
        htmlBody: studentHtml
      });
    } catch (err) {
      console.warn("Không thể gửi email cảm ơn đến học viên " + leadEmail + ":", err);
    }
  }
}

