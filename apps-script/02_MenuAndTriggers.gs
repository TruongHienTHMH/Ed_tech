/**
 * ==============================================================================
 * MODULE 02: THANH MENU VÀ BỘ BẮT SỰ KIỆN (MENU & EVENT TRIGGERS)
 * ==============================================================================
 * 1. onOpen(): Khởi tạo menu điều khiển [🚀 DataWithLy CMS] khi mở file Sheets.
 * 2. onEdit(e): Tự động phát hiện chỉnh sửa, sinh UUID v4 & SEO Slug, bảo vệ ô ID/Slug.
 * ==============================================================================
 */

/**
 * Bảng cấu hình tiền tố UUID cho từng Tab nghiệp vụ
 */
var TABLE_PREFIX_CONFIG = {
  courses: "crs-",
  curriculum: "cur-",
  promotions: "promo-",
  blog_posts: "blg-",
  packages_pricing: "pkg-",
  testimonials: "tst-",
  mentor_profiles: "men-",
  faqs: "faq-"
};

/**
 * 1. Khởi tạo thanh menu tùy biến [🚀 DataWithLy CMS]
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 DataWithLy CMS")
    // Khởi tạo
    .addItem("⚡ CÀI ĐẶT TOÀN BỘ 12 TAB (1-Click Setup)", "setupDataWithLyTables")
    .addSeparator()

    // Khóa học & Lộ trình
    .addItem("➕ Thêm Khóa Học Mới", "showAddCourseModal")
    .addItem("📚 Thêm Chương Lộ Trình Học", "showAddCurriculumModal")
    .addItem("📦 Thêm Gói Combo & Bảng Giá", "showPackageModal")
    .addSeparator()

    // Thương hiệu & Nội dung
    .addItem("👤 Quản Trị Hồ Sơ Mentor & AboutUs", "showMentorModal")
    .addItem("💬 Thêm Đánh Giá Học Viên", "showTestimonialModal")
    .addItem("❓ Thêm Câu Hỏi Thường Gặp", "showFaqModal")
    .addItem("✍️ Thêm Bài Viết Blog", "showBlogModal")
    .addSeparator()

    // Khuyến mãi & Cấu hình
    .addItem("🏷️ Quản Trị Khuyến Mãi & Flash Sale", "showPromotionsModal")
    .addItem("⚙️ Cấu Hình Hệ Thống (Settings)", "showSettingsModal")
    .addItem("🔐 Cài Đặt Mã Secret (Script Properties)", "promptSetSharedSecret")
    .addItem("👥 Cập Nhật Trạng Thái Lead", "showUpdateLeadStatusPrompt")
    .addSeparator()

    // Tiện ích bảo trì
    .addItem("⚡ Tự Động Sinh UUID & Chuẩn Hóa Toàn Bộ Slug/ID", "autoFillMissingUuidsAndSlugs")
    .addItem("🔄 Tự Động Tạo Slug & ID Cho Hàng Trống", "autoFillMissingSlugsAndIds")
    .addItem("🗑️ Lưu Trữ / Ẩn Khóa Học", "showSoftDeletePrompt")
    .addItem("🔍 Kiểm Tra Lỗi Dữ Liệu", "runDataLinter")
    .addItem("⚡ Đồng Bộ Lên Website Ngay Lập Tức", "triggerWebsiteRevalidation")
    .addToUi();
}

/**
 * Helper: Bảo vệ ô ID (Cột 1) chống xóa hoặc gõ đè sai định dạng
 */
function protectIdCell(sheet, row, value, oldValue, prefix, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";

  // 1. Nếu người dùng xóa trống ô ID
  if (!trimmed) {
    if (oldTrimmed) {
      sheet.getRange(row, 1).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Cột ID được hệ thống bảo vệ! Đã khôi phục ID gốc: " + oldTrimmed, "🛡️ Bảo Vệ Ô ID", 6);
    } else {
      var newUuid = generateUUID(prefix);
      sheet.getRange(row, 1).setValue(sanitizeFormula(newUuid));
      ss.toast("⚠️ Ô ID không được để trống! Đã tự động sinh UUID mới: " + newUuid, "🛡️ Tự Động Sinh UUID", 6);
    }
    return;
  }

  // 2. Nếu người dùng gõ đè giá trị không chuẩn UUID v4
  if (!isValidUUID(trimmed, prefix) && !isValidUUID(trimmed)) {
    if (oldTrimmed && (isValidUUID(oldTrimmed, prefix) || isValidUUID(oldTrimmed))) {
      sheet.getRange(row, 1).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Không thể chỉnh sửa trực tiếp ID hệ thống! Đã khôi phục ID chuẩn: " + oldTrimmed, "🛡️ Bảo Vệ Ô ID", 6);
    } else {
      var standardUuid = generateUUID(prefix);
      sheet.getRange(row, 1).setValue(sanitizeFormula(standardUuid));
      ss.toast("⚠️ ID không hợp lệ chuẩn UUID v4! Đã thay thế bằng UUID chuẩn: " + standardUuid, "🛡️ Chuẩn Hóa UUID", 6);
    }
  }
}

/**
 * Helper: Bảo vệ ô Slug (Cột slug) chống xóa hoặc trùng lặp
 */
function protectSlugCell(sheet, row, slugCol, titleCol, value, oldValue, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";
  var titleVal = titleCol ? sheet.getRange(row, titleCol).getValue() : "";

  // Thu thập các slug khác trong sheet để đối chiếu
  var lastRow = sheet.getLastRow();
  var otherSlugs = [];
  if (lastRow > 1) {
    var allSlugs = sheet.getRange(2, slugCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < allSlugs.length; i++) {
      var rNum = i + 2;
      if (rNum !== row && allSlugs[i][0]) {
        otherSlugs.push(allSlugs[i][0].toString());
      }
    }
  }

  // 1. Nếu người dùng xóa trống Slug
  if (!trimmed) {
    if (titleVal && titleVal.toString().trim()) {
      var regeneratedSlug = resolveUniqueSlug(titleVal, otherSlugs);
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(regeneratedSlug));
      ss.toast("⚠️ Ô Slug không được để trống! Đã tự động sinh lại từ Tiêu đề: " + regeneratedSlug, "🛡️ Bảo Vệ Slug", 6);
    } else if (oldTrimmed) {
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Ô Slug không được để trống! Đã khôi phục Slug gốc: " + oldTrimmed, "🛡️ Bảo Vệ Slug", 6);
    }
    return;
  }

  // 2. Nếu người dùng gõ tay Slug mới -> Chuẩn hóa SEO & kiểm tra chống trùng lặp
  var resolved = resolveUniqueSlug(trimmed, otherSlugs, oldTrimmed);
  if (resolved !== trimmed) {
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(resolved));
    ss.toast("⚠️ Slug đã được chuẩn hóa / chống trùng lặp: " + resolved, "🛡️ Chuẩn Hóa Slug", 5);
  }
}

/**
 * Helper: Xử lý khi người dùng chỉnh sửa Tiêu đề (Tự động sinh ID UUID & SEO Slug)
 */
function handleTitleEditWithUuidAndSlug(sheet, row, titleValue, idCol, slugCol, prefix, ss) {
  var idCell = sheet.getRange(row, idCol);
  var currentId = idCell.getValue();
  var generatedUuid = null;

  // 1. Kiểm tra cột ID (cột 1): Nếu trống -> Tự động sinh UUID v4 kèm prefix
  if (!currentId || currentId.toString().trim() === "") {
    generatedUuid = generateUUID(prefix);
    idCell.setValue(sanitizeFormula(generatedUuid));
  }

  // 2. Kiểm tra cột Slug (nếu tab có cột slug)
  if (slugCol) {
    var slugCell = sheet.getRange(row, slugCol);
    var currentSlug = slugCell.getValue();

    // Thu thập danh sách slug của các dòng khác để chống trùng lặp
    var lastRow = sheet.getLastRow();
    var otherSlugs = [];
    if (lastRow > 1) {
      var allSlugs = sheet.getRange(2, slugCol, lastRow - 1, 1).getValues();
      for (var i = 0; i < allSlugs.length; i++) {
        var rNum = i + 2;
        if (rNum !== row && allSlugs[i][0]) {
          otherSlugs.push(allSlugs[i][0].toString());
        }
      }
    }

    var uniqueSlug = resolveUniqueSlug(titleValue, otherSlugs, currentSlug);

    if (!currentSlug || currentSlug.toString().trim() === "") {
      slugCell.setValue(sanitizeFormula(uniqueSlug));
    }

    // Hiển thị Toast thông báo trạng thái
    if (uniqueSlug.match(/-v\d+$/)) {
      ss.toast("⚡ Phát hiện trùng tiêu đề! Đã tự động tạo: " + uniqueSlug + " (UUID: " + (generatedUuid || currentId) + ")", "DataWithLy Auto-Versioning", 5);
    } else {
      ss.toast("⚡ Đã tự động tạo UUID (" + (generatedUuid || currentId) + ") & SEO Slug: " + uniqueSlug, "DataWithLy Automation", 4);
    }
  } else {
    // Tab không có cột slug (như curriculum, faqs...)
    if (generatedUuid) {
      ss.toast("⚡ Đã tự động sinh UUID định danh: " + generatedUuid, "DataWithLy Automation", 4);
    }
  }
}

/**
 * 2. Bộ bắt sự kiện onEdit: Tự động hóa thời gian thực khi người dùng gõ phím
 */
function onEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  var value = (e.value !== undefined) ? e.value : e.range.getValue();
  var oldValue = e.oldValue;
  var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();

  // Bỏ qua dòng tiêu đề (Dòng 1)
  if (row <= 1) return;

  var prefix = TABLE_PREFIX_CONFIG[sheetName] || "";

  // ==========================================
  // 1. BẢO VỆ CỘT ID (CỘT 1) TRÊN MỌI TAB DỮ LIỆU CHÍNH
  // ==========================================
  if (col === 1 && TABLE_PREFIX_CONFIG[sheetName]) {
    protectIdCell(sheet, row, value, oldValue, prefix, ss);
    return;
  }

  // ==========================================
  // 2. TAB: courses
  // ==========================================
  if (sheetName === "courses") {
    // Cột 2 (Title): Sinh UUID (Cột 1) & SEO Slug (Cột 3)
    if (col === 2 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, 3, "crs-", ss);
    }

    // Cột 3 (Slug): Bảo vệ và chuẩn hóa Slug
    if (col === 3) {
      protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    }

    // Cột 6 & 7: Học phí VNĐ
    if ((col === 6 || col === 7) && value !== "") {
      var num = Number(value);
      if (isNaN(num) || num < 0) {
        ss.toast("⚠️ Cảnh báo: Học phí phải là số nguyên dương hợp lệ (VNĐ)!", "Lỗi Định Dạng", 5);
      } else {
        sheet.getRange(row, col).setNumberFormat("#,##0 \"đ\"");
      }
    }
  }

  // ==========================================
  // 3. TAB: blog_posts
  // ==========================================
  if (sheetName === "blog_posts") {
    // Cột 2 (Title): Sinh UUID (Cột 1) & SEO Slug (Cột 3)
    if (col === 2 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, 3, "blg-", ss);
    }

    // Cột 3 (Slug): Bảo vệ và chuẩn hóa Slug
    if (col === 3) {
      protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    }
  }

  // ==========================================
  // 4. TAB: curriculum
  // ==========================================
  if (sheetName === "curriculum") {
    // Cột 5 (module_title): Sinh UUID (Cột 1) nếu còn thiếu
    if (col === 5 && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "cur-", ss);
    }
  }

  // ==========================================
  // 5. TAB: promotions
  // ==========================================
  if (sheetName === "promotions") {
    // Cột 2 (code) hoặc Cột 3 (title): Sinh UUID (Cột 1)
    if ((col === 2 || col === 3) && value) {
      handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "promo-", ss);
    }
    // Cột 2 (code): Chuẩn hóa UPPERCASE
    if (col === 2 && value) {
      var upperCode = value.toString().trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
      if (upperCode !== value) {
        sheet.getRange(row, 2).setValue(sanitizeFormula(upperCode));
      }
    }
  }

  // ==========================================
  // 6. CÁC TAB KHÁC: packages_pricing, testimonials, mentor_profiles, faqs
  // ==========================================
  if (sheetName === "packages_pricing" && col === 3 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "pkg-", ss);
  } else if (sheetName === "testimonials" && col === 2 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "tst-", ss);
  } else if (sheetName === "mentor_profiles" && col === 2 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "men-", ss);
  } else if (sheetName === "faqs" && col === 3 && value) {
    handleTitleEditWithUuidAndSlug(sheet, row, value, 1, null, "faq-", ss);
  }
}
