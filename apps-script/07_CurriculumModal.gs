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
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("📚 Thêm Chương Lộ Trình Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📚 Thêm Chương Lộ Trình Hàng Loạt");
}

function addCurriculumBatchFromModal(curriculumList) {
  if (!curriculumList || !curriculumList.length) {
    throw new Error("Danh sách chương học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var rowsToAdd = [];
  var addedItems = [];

  for (var i = 0; i < curriculumList.length; i++) {
    var item = curriculumList[i];
    var courseId = (item.course_id || "").toString().trim();
    var moduleTitle = (item.module_title || "").toString().trim();
    if (!courseId) {
      throw new Error("Chương #" + (i + 1) + ": Khóa học áp dụng không được để trống.");
    }
    if (!moduleTitle) {
      throw new Error("Chương #" + (i + 1) + ": Tiêu đề chương không được để trống.");
    }

    var modNum = Number(item.module_number) || (i + 1);

    // Tự động sinh module_id / UUID v4 chuẩn RFC 4122
    var pkId = item.id && isValidUUID(item.id, "cur-")
      ? item.id.toString().trim()
      : generateUUID("cur-");

    // Chuẩn hóa và bóc tách nội dung bullet points Alt+Enter đúng format
    var rawTopics = (item.topics_bullets || "").toString();
    var cleanTopics = rawTopics
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line.length > 0; })
      .join("\n");

    var lessonsCount = Number(item.lessons_count) || 6;
    var sortOrder = Number(item.sort_order) || modNum;

    rowsToAdd.push([
      sanitizeFormula(pkId),
      sanitizeFormula(courseId),
      sanitizeFormula(item.course_name || ""),
      modNum,
      sanitizeFormula(moduleTitle),
      sanitizeFormula(item.duration || "2 tuần"),
      lessonsCount,
      sanitizeFormula(cleanTopics),
      sortOrder
    ]);

    addedItems.push({ id: pkId, title: moduleTitle, module_number: modNum });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 9).setValues(rowsToAdd);

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " chương lộ trình học vào bảng curriculum!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: rowsToAdd.length, modules: addedItems };
}

function addNewCurriculumModuleFromModal(data) {
  var res = addCurriculumBatchFromModal([data]);
  return {
    success: true,
    id: res.modules[0].id,
    title: res.modules[0].title
  };
}
