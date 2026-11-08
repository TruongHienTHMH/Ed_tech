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
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("➕ Thêm Khóa Học Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "➕ Thêm Khóa Học Hàng Loạt");
}

function addCoursesBatchFromModal(courseList) {
  if (!courseList || !courseList.length) {
    throw new Error("Danh sách khóa học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));

  var lastRow = sheet.getLastRow();
  var existingSlugs = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingSlugs.push(vals[i][0].toString().trim().toLowerCase());
    }
  }

  var rowsToAdd = [];
  var addedCourses = [];

  for (var k = 0; k < courseList.length; k++) {
    var item = courseList[k];
    var title = (item.title || "").toString().trim();
    if (!title) {
      throw new Error("Tên khóa học #" + (k + 1) + " không được để trống.");
    }

    var tuition = Number(item.tuition_vnd);
    if (isNaN(tuition) || tuition < 0) {
      throw new Error("Học phí ưu đãi cho khóa học #" + (k + 1) + " phải là số dương hợp lệ.");
    }
    var originalTuition = Number(item.original_tuition_vnd);
    if (isNaN(originalTuition) || originalTuition < 0) {
      originalTuition = tuition;
    }

    // Tự động sinh Slug chuẩn SEO & giải quyết xung đột với existingSlugs và chính mảng đang thêm
    var uniqueSlug = resolveUniqueSlug(item.slug || title, existingSlugs);
    existingSlugs.push(uniqueSlug.toLowerCase());

    // Sinh UUID v4 cho từng khóa học (nếu chưa có hoặc không hợp lệ)
    var uniqueId = item.id && isValidUUID(item.id, "crs-")
      ? item.id.toString().trim()
      : generateUUID("crs-");

    var sortOrder = Number(item.sort_order) || (lastRow + k);

    rowsToAdd.push([
      sanitizeFormula(uniqueId),
      sanitizeFormula(title),
      sanitizeFormula(uniqueSlug),
      sanitizeFormula(item.tag || "SQL"),
      sanitizeFormula(item.tagline || ""),
      tuition,
      originalTuition,
      sanitizeFormula(item.duration || "8 tuần (24 buổi)"),
      sanitizeFormula(item.level || "Beginner"),
      item.is_active === true || item.is_active === "true",
      item.is_featured === true || item.is_featured === "true",
      sortOrder,
      sanitizeFormula(item.description || ""),
      sanitizeFormula(item.cover_image_url || "")
    ]);

    addedCourses.push({ id: uniqueId, title: title, slug: uniqueSlug });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 14).setValues(rowsToAdd);

  // Định dạng hiển thị VNĐ
  sheet.getRange(startRow, 6, rowsToAdd.length, 2).setNumberFormat('#,##0 "đ"');

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " khóa học vào bảng courses!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: rowsToAdd.length, courses: addedCourses };
}

function addNewCourseFromModal(formData) {
  var res = addCoursesBatchFromModal([formData]);
  return {
    success: true,
    id: res.courses[0].id,
    slug: res.courses[0].slug,
    title: res.courses[0].title
  };
}
