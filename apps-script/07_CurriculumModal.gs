/**
 * MODULE 07: HỘP THOẠI THÊM CHƯƠNG LỘ TRÌNH (CURRICULUM MODAL DIALOG)
 */
function showAddCurriculumModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var courseSheet = ss.getSheetByName("courses") || (setupCoursesTab(ss), ss.getSheetByName("courses"));
  var curriculumSheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var coursesList = [];
  var lastRow = courseSheet.getLastRow();
  if (lastRow > 1) {
    var vals = courseSheet.getRange(2, 1, lastRow - 1, 3).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0] && vals[i][1]) {
        coursesList.push({ id: vals[i][0].toString().trim(), title: vals[i][1].toString().trim(), slug: (vals[i][2] || vals[i][0]).toString().trim(), maxModule: 0 });
      }
    }
  }

  var currLastRow = curriculumSheet.getLastRow();
  if (currLastRow > 1) {
    var cVals = curriculumSheet.getRange(2, 2, currLastRow - 1, 3).getValues();
    for (var j = 0; j < cVals.length; j++) {
      var rCId = cVals[j][0] ? cVals[j][0].toString().trim() : "";
      var mNum = Number(cVals[j][2]) || 0;
      for (var k = 0; k < coursesList.length; k++) {
        if (coursesList[k].id === rCId && mNum > coursesList[k].maxModule) coursesList[k].maxModule = mNum;
      }
    }
  }

  var template = createModalTemplate("CurriculumModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(600).setHeight(620).setTitle("📚 Thêm Chương Lộ Trình Học - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📚 Thêm Chương Lộ Trình Học");
}

function addNewCurriculumModuleFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var courseId = (data.course_id || "").toString().trim();
  var moduleTitle = (data.module_title || "").toString().trim();
  if (!courseId || !moduleTitle) throw new Error("Khóa học và Tiêu đề chương không được để trống.");

  var modNum = Number(data.module_number) || 1;
  var pkId = (data.id || (courseId + "-mod-" + modNum)).toString().trim();

  sheet.appendRow([
    sanitizeFormula(pkId), sanitizeFormula(courseId), sanitizeFormula(data.course_name), modNum, sanitizeFormula(moduleTitle),
    sanitizeFormula(data.duration || "2 tuần"), Number(data.lessons_count) || 6,
    sanitizeFormula(data.topics_bullets), Number(data.sort_order) || modNum
  ]);

  ss.toast("🎉 Đã thêm chương lộ trình: " + moduleTitle, "DataWithLy CMS", 5);
  return { success: true, id: pkId, title: moduleTitle };
}
