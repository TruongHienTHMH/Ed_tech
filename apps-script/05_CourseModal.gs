/**
 * MODULE 05: HỘP THOẠI MODAL NHẬP LIỆU KHÓA HỌC (COURSE MODAL DIALOG)
 */
function showAddCourseModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses");
  var existingSlugs = [];

  if (sheet && sheet.getLastRow() > 1) {
    var vals = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var template = createModalTemplate("CourseModal");
  template.existingSlugs = existingSlugs;
  var html = template.evaluate().setWidth(580).setHeight(680).setTitle("➕ Thêm Khóa Học Mới - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "➕ Thêm Khóa Học Mới");
}

function addNewCourseFromModal(formData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));

  var title = (formData.title || "").toString().trim();
  if (!title) throw new Error("Tên khóa học không được để trống.");

  var lastRow = sheet.getLastRow();
  var existingSlugs = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString());
    }
  }

  var uniqueSlug = resolveUniqueSlug(formData.slug || title, existingSlugs);
  var uniqueId = formData.id ? resolveUniqueSlug(formData.id, existingSlugs) : uniqueSlug;
  var tuition = Number(formData.tuition_vnd) || 0;
  var originalTuition = Number(formData.original_tuition_vnd) || tuition;
  var sortOrder = Number(formData.sort_order) || sheet.getLastRow();

  sheet.appendRow([
    sanitizeFormula(uniqueId), sanitizeFormula(title), sanitizeFormula(uniqueSlug), sanitizeFormula(formData.tag || "SQL"), sanitizeFormula(formData.tagline || ""),
    tuition, originalTuition, sanitizeFormula(formData.duration || "8 tuần (24 buổi)"),
    sanitizeFormula(formData.level || "Beginner"), formData.is_active === true, formData.is_featured === true,
    sortOrder, sanitizeFormula(formData.description || ""), sanitizeFormula(formData.cover_image_url || "")
  ]);

  var newRow = sheet.getLastRow();
  sheet.getRange(newRow, 6).setNumberFormat("#,##0 \"đ\"");
  sheet.getRange(newRow, 7).setNumberFormat("#,##0 \"đ\"");

  var msg = uniqueSlug.match(/-v\d+$/)
    ? "⚡ Khóa học đã thêm với slug: " + uniqueSlug + " (tự động gắn version)"
    : "🎉 Đã thêm khóa học thành công: " + title;
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, id: uniqueId, slug: uniqueSlug, title: title };
}
