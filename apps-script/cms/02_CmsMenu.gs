/**
 * ==============================================================================
 * MODULE 02: THANH MENU VÀ BỘ BẮT SỰ KIỆN CMS CONTENT (MENU & EVENT TRIGGERS)
 * ==============================================================================
 * 1. onOpen(): Khởi tạo menu điều khiển [🚀 DataWithLy CMS] trên Sheet CMS Content.
 * 2. onEdit(e): Tự động phát hiện chỉnh sửa, sinh UUID v4 & SEO Slug, bảo vệ ô ID/Slug.
 * ==============================================================================
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

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 DataWithLy CMS")
    .addItem("⚡ CÀI ĐẶT 10 TAB CMS CONTENT (1-Click Setup)", "setupDataWithLyTables")
    .addItem("🌱 NẠP LẠI DATA CHUẨN FIGMA 100% (Ghi đè bản mẫu)", "forceReseedFigmaData")
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
    .addItem("🔗 Cài Đặt URL Website Vercel", "promptSetWebDeployUrl")
    .addItem("🔐 Cài Đặt Mã Secret CMS (SHARED_SECRET)", "promptSetSharedSecret")
    .addItem("🔑 Cài Đặt Revalidation Secret", "promptSetRevalidationSecret")
    .addSeparator()

    // Tiện ích bảo trì
    .addItem("⚡ Tự Động Sinh UUID & Chuẩn Hóa Toàn Bộ Slug/ID", "autoFillMissingUuidsAndSlugs")
    .addItem("🔄 Tự Động Tạo Slug & ID Cho Hàng Trống", "autoFillMissingSlugsAndIds")
    .addItem("🗑️ Lưu Trữ / Ẩn Khóa Học", "showSoftDeletePrompt")
    .addItem("🔍 Kiểm Tra Lỗi Dữ Liệu", "runDataLinter")
    .addItem("⚡ Đồng Bộ Lên Website Ngay Lập Tức", "triggerWebsiteRevalidation")
    .addToUi();
}

function protectIdCell(sheet, row, value, oldValue, prefix, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";

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

function protectSlugCell(sheet, row, slugCol, titleCol, value, oldValue, ss) {
  var trimmed = (value !== null && value !== undefined) ? value.toString().trim() : "";
  var oldTrimmed = (oldValue !== null && oldValue !== undefined) ? oldValue.toString().trim() : "";
  var titleVal = titleCol ? sheet.getRange(row, titleCol).getValue() : "";

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

  if (!trimmed) {
    if (titleVal && titleVal.toString().trim()) {
      var autoSlug = resolveUniqueSlug(titleVal.toString(), otherSlugs);
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(autoSlug));
      ss.toast("⚠️ Ô Slug không được để trống! Đã tự động sinh SEO Slug: " + autoSlug, "🛡️ Tự Động Sinh Slug", 6);
    } else if (oldTrimmed) {
      sheet.getRange(row, slugCol).setValue(sanitizeFormula(oldTrimmed));
      ss.toast("⚠️ Cột Slug được bảo vệ! Đã khôi phục: " + oldTrimmed, "🛡️ Bảo Vệ Ô Slug", 6);
    }
    return;
  }

  var standardFormat = generateSlug(trimmed);
  if (trimmed !== standardFormat) {
    var resolvedFormat = resolveUniqueSlug(standardFormat, otherSlugs, oldTrimmed);
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(resolvedFormat));
    ss.toast("⚠️ Slug đã được chuẩn hóa lại không dấu: " + resolvedFormat, "🛡️ Chuẩn Hóa SEO Slug", 6);
    return;
  }

  if (otherSlugs.indexOf(trimmed) !== -1) {
    var uniqueSlug = resolveUniqueSlug(trimmed, otherSlugs, oldTrimmed);
    sheet.getRange(row, slugCol).setValue(sanitizeFormula(uniqueSlug));
    ss.toast("⚠️ Phát hiện trùng lặp Slug! Đã đổi thành: " + uniqueSlug, "🛡️ Chống Trùng Slug", 6);
  }
}

function onEdit(e) {
  if (!e || !e.range) return;

  var range = e.range;
  var sheet = range.getSheet();
  var sheetName = sheet.getName();
  var row = range.getRow();
  var col = range.getColumn();
  var value = e.value;
  var oldValue = e.oldValue;
  var ss = e.source || SpreadsheetApp.getActiveSpreadsheet();

  if (row === 1) return;

  var prefix = TABLE_PREFIX_CONFIG[sheetName];
  if (prefix && col === 1) {
    protectIdCell(sheet, row, value, oldValue, prefix, ss);
    return;
  }

  if (sheetName === "courses") {
    if (col === 3) protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    else if (col === 2 && value) {
      var existingSlug = sheet.getRange(row, 3).getValue();
      if (!existingSlug || existingSlug.toString().trim() === "") {
        var allSlugsC = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues()
          .map(function(r, idx) { return (idx + 2 !== row && r[0]) ? r[0].toString() : null; })
          .filter(Boolean);
        sheet.getRange(row, 3).setValue(sanitizeFormula(resolveUniqueSlug(value.toString(), allSlugsC)));
      }
    }
  } else if (sheetName === "blog_posts") {
    if (col === 3) protectSlugCell(sheet, row, 3, 2, value, oldValue, ss);
    else if (col === 2 && value) {
      var currentSlugB = sheet.getRange(row, 3).getValue();
      if (!currentSlugB || currentSlugB.toString().trim() === "") {
        var allSlugsB = sheet.getRange(2, 3, Math.max(sheet.getLastRow() - 1, 1), 1).getValues()
          .map(function(r, idx) { return (idx + 2 !== row && r[0]) ? r[0].toString() : null; })
          .filter(Boolean);
        sheet.getRange(row, 3).setValue(sanitizeFormula(resolveUniqueSlug(value.toString(), allSlugsB)));
      }
    }
  }
}
