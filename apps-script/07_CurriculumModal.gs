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
    var cHeaders = courseSheet.getRange(1, 1, 1, courseSheet.getLastColumn()).getValues()[0].map(function(h) {
      return h ? h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
    });
    var startIdx = cHeaders.indexOf("start_date");
    var endIdx = cHeaders.indexOf("end_date");
    var allVals = courseSheet.getRange(2, 1, lastRow - 1, courseSheet.getLastColumn()).getValues();

    for (var i = 0; i < allVals.length; i++) {
      var row = allVals[i];
      if (row[0] && row[1]) {
        var sDate = startIdx !== -1 && row[startIdx] ? row[startIdx].toString().trim() : "";
        var eDate = endIdx !== -1 && row[endIdx] ? row[endIdx].toString().trim() : "";
        coursesList.push({
          id: row[0].toString().trim(),
          title: row[1].toString().trim(),
          slug: (row[2] || row[0]).toString().trim(),
          startDate: sDate,
          endDate: eDate,
          maxModule: 0
        });
      }
    }
  }

  var currLastRow = curriculumSheet.getLastRow();
  if (currLastRow > 1) {
    var cVals = curriculumSheet.getRange(2, 2, currLastRow - 1, 4).getValues();
    for (var j = 0; j < cVals.length; j++) {
      var rCId = cVals[j][0] ? cVals[j][0].toString().trim() : "";
      var mNum = Number(cVals[j][3]) || Number(cVals[j][2]) || 0;
      for (var k = 0; k < coursesList.length; k++) {
        if (coursesList[k].id === rCId && mNum > coursesList[k].maxModule) {
          coursesList[k].maxModule = mNum;
        }
      }
    }
  }

  var template = createModalTemplate("CurriculumModal");
  template.coursesList = coursesList;
  var html = template.evaluate().setWidth(720).setHeight(780).setTitle("📚 Quản Trị Lộ Trình Khóa Học - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "📚 Quản Trị Lộ Trình Khóa Học");
}

function addCurriculumBatchFromModal(payload) {
  var curriculumList = [];
  var courseId = "";
  var startDate = "";
  var endDate = "";

  if (Array.isArray(payload)) {
    curriculumList = payload;
  } else if (payload && typeof payload === "object") {
    curriculumList = payload.curriculum_list || payload.modules || [];
    courseId = (payload.course_id || "").toString().trim();
    startDate = (payload.course_start_date || "").toString().trim();
    endDate = (payload.course_end_date || "").toString().trim();
  }

  if (!curriculumList || !curriculumList.length) {
    throw new Error("Danh sách buổi học không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("curriculum") || (setupCurriculumTab(ss), ss.getSheetByName("curriculum"));

  var rowsToAdd = [];
  var addedItems = [];

  for (var i = 0; i < curriculumList.length; i++) {
    var item = curriculumList[i];
    var cId = (item.course_id || courseId || "").toString().trim();
    var sessionTitle = (item.session_title || item.module_title || item.week_title || item.title || "").toString().trim();
    if (!cId) {
      throw new Error("Buổi học #" + (i + 1) + ": Khóa học áp dụng không được để trống.");
    }
    if (!sessionTitle) {
      throw new Error("Buổi học #" + (i + 1) + ": Nội dung buổi học không được để trống.");
    }

    var dayNum = Number(item.day || item.module_number) || (i + 1);
    var weekNum = item.week ? (Number(item.week) || item.week.toString().trim()) : Math.ceil(dayNum / 2);
    var dateBadge = (item.date || item.session_date || "TH10 " + (dayNum < 10 ? "0" + dayNum : dayNum)).toString().trim();
    var sessionDesc = (item.session_desc || item.content || item.summary || "").toString().trim();

    // Tự động sinh ID duy nhất
    var pkId = item.id && isValidUUID(item.id, "cur-")
      ? item.id.toString().trim()
      : ("cur-" + cId.replace(/[^a-z0-9-]/gi, "") + "-d" + dayNum + "-" + generateUUID().substring(0, 4));

    // Chuẩn hóa và bóc tách nội dung sub_content dot list (Enter / Alt+Enter)
    var rawSub = (item.sub_content || item.topics_bullets || item.bullet_points || "").toString();
    var cleanSubContent = rawSub
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(function (line) { return line.trim(); })
      .filter(function (line) { return line.length > 0; })
      .join("\n");

    var durationVal = (item.duration || "3 giờ").toString().trim();
    var sortOrder = Number(item.sort_order) || dayNum;

    rowsToAdd.push([
      sanitizeFormula(pkId),
      sanitizeFormula(cId),
      sanitizeFormula(item.course_name || ""),
      weekNum,
      dayNum,
      sanitizeFormula(dateBadge),
      sanitizeFormula(sessionTitle),
      sanitizeFormula(sessionDesc),
      sanitizeFormula(cleanSubContent),
      sanitizeFormula(durationVal),
      sortOrder
    ]);

    addedItems.push({ id: pkId, title: sessionTitle, day: dayNum, week: weekNum });
  }

  var startRow = sheet.getLastRow() + 1;
  sheet.getRange(startRow, 1, rowsToAdd.length, 11).setValues(rowsToAdd);

  // Nếu có cập nhật ngày bắt đầu / kết thúc cho khóa học -> Lưu vào tab 'courses'
  if (courseId && (startDate || endDate)) {
    try {
      var courseSheet = ss.getSheetByName("courses");
      if (courseSheet && courseSheet.getLastRow() > 1) {
        var cHeaders = courseSheet.getRange(1, 1, 1, courseSheet.getLastColumn()).getValues()[0].map(function(h) {
          return h ? h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
        });
        var startCol = cHeaders.indexOf("start_date") + 1;
        var endCol = cHeaders.indexOf("end_date") + 1;

        if (startCol > 0 || endCol > 0) {
          var cData = courseSheet.getRange(2, 1, courseSheet.getLastRow() - 1, 1).getValues();
          for (var r = 0; r < cData.length; r++) {
            if (cData[r][0] && cData[r][0].toString().trim() === courseId) {
              var targetRow = r + 2;
              if (startCol > 0 && startDate) courseSheet.getRange(targetRow, startCol).setValue(startDate);
              if (endCol > 0 && endDate) courseSheet.getRange(targetRow, endCol).setValue(endDate);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Không thể cập nhật ngày khóa học:", e);
    }
  }

  var msg = "🎉 Đã lưu thành công " + rowsToAdd.length + " buổi học vào lộ trình khóa học!";
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
