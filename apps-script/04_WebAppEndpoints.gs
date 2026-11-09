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
      var bullets = Array.isArray(m.bulletPoints) ? m.bulletPoints.join("\n") : (m.topicsBullets || m.topics_bullets || "");
      return [
        m.id || ("cur-" + (i + 1)),
        m.courseId || m.course_id || "",
        m.courseName || m.course_name || "",
        Number(m.moduleNumber || m.module_number || (i + 1)),
        m.title || m.module_title || "",
        m.duration || "2 tuần",
        Number(m.lessonsCount || m.lessons_count || 4),
        bullets,
        Number(m.sortOrder || m.sort_order || (i + 1))
      ];
    });
    curSheet.getRange(2, 1, curRows.length, 9).setValues(curRows);
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

