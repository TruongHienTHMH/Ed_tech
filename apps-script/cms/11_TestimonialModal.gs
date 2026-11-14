/**
 * MODULE 11: HỘP THOẠI ĐÁNH GIÁ HỌC VIÊN (TESTIMONIALS MODAL DIALOG)
 */
function showTestimonialModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  if (!ss.getSheetByName("testimonials")) setupTestimonialsTab(ss);

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim() });
      }
    }
  }

  var template = createModalTemplate("TestimonialModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(600).setHeight(680).setTitle("💬 Thêm Đánh Giá Học Viên - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "💬 Thêm Đánh Giá Học Viên");
}

function saveTestimonialFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("testimonials") || (setupTestimonialsTab(ss), ss.getSheetByName("testimonials"));

  var name = (data.student_name || "").toString().trim();
  var review = (data.review_text || "").toString().trim();
  if (!name || !review) throw new Error("Tên học viên và Nội dung đánh giá không được để trống.");

  var tId = (data.id || ("t-" + sheet.getLastRow())).toString().trim();
  var rating = Number(data.rating) || 5;

  sheet.appendRow([
    sanitizeFormula(tId),
    sanitizeFormula(name),
    sanitizeFormula(data.role),
    sanitizeFormula(data.company),
    sanitizeFormula(data.avatar_url),
    sanitizeFormula(data.course_id || "ALL"),
    rating,
    sanitizeFormula(review),
    data.is_featured === true,
    data.is_active === true
  ]);

  ss.toast("🎉 Đã thêm đánh giá của học viên: " + name, "DataWithLy CMS", 5);
  return { success: true, id: tId, student_name: name };
}

