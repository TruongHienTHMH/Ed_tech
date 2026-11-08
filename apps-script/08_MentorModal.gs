/**
 * MODULE 08: HỘP THOẠI QUẢN TRỊ HỒ SƠ MENTOR (MENTOR PROFILE MODAL DIALOG)
 */
function showMentorModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

  var currentMentor = {
    id: "mentor-ly-hua",
    name: "Hứa Thảo Ly",
    title: "Lead Mentor & Founder DataWithLy",
    bio: "Hơn 7 năm kinh nghiệm thực chiến trong ngành Dữ liệu tại các tập đoàn công nghệ và tài chính hàng đầu Việt Nam. Từng trực tiếp xây dựng hạ tầng báo cáo phục vụ hàng triệu người dùng.",
    companies_worked: "MoMo, Tiki, ACB Bank",
    avatar_url: "/uploads/mentors/ly-hua.jpg",
    linkedin_url: "https://linkedin.com/in/lyhuadata",
    is_active: true
  };

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var rowValues = sheet.getRange(2, 1, 1, 8).getValues()[0];
    if (rowValues[0]) {
      currentMentor = {
        id: rowValues[0].toString(),
        name: rowValues[1] ? rowValues[1].toString() : "",
        title: rowValues[2] ? rowValues[2].toString() : "",
        bio: rowValues[3] ? rowValues[3].toString() : "",
        companies_worked: rowValues[4] ? rowValues[4].toString() : "",
        avatar_url: rowValues[5] ? rowValues[5].toString() : "",
        linkedin_url: rowValues[6] ? rowValues[6].toString() : "",
        is_active: rowValues[7] === true || String(rowValues[7]).toUpperCase() === "TRUE"
      };
    }
  }

  var template = createModalTemplate("MentorModal");
  template.currentMentor = currentMentor;
  var html = template.evaluate().setWidth(640).setHeight(720).setTitle("👤 Quản Trị Hồ Sơ Mentor & AboutUs - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "👤 Quản Trị Hồ Sơ Mentor & Giảng Viên");
}

function saveMentorProfileFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

  var id = (data.id || "mentor-ly-hua").toString().trim();
  var name = (data.name || "").toString().trim();
  if (!name) throw new Error("Họ và tên Mentor không được để trống.");

  var rowData = [
    sanitizeFormula(id), sanitizeFormula(name), sanitizeFormula(data.title), sanitizeFormula(data.bio),
    sanitizeFormula(data.companies_worked), sanitizeFormula(data.avatar_url),
    sanitizeFormula(data.linkedin_url), data.is_active === true
  ];

  var lastRow = sheet.getLastRow();
  var foundRow = 0;
  if (lastRow > 1) {
    var idList = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < idList.length; i++) {
      if (idList[i][0] && idList[i][0].toString().trim() === id) {
        foundRow = i + 2;
        break;
      }
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, 1, 1, 8).setValues([rowData]);
    ss.toast("🎉 Đã cập nhật thành công hồ sơ Mentor: " + name, "DataWithLy CMS", 5);
  } else {
    sheet.appendRow(rowData);
    ss.toast("🎉 Đã thêm mới hồ sơ Mentor: " + name, "DataWithLy CMS", 5);
  }

  return { success: true, id: id, name: name };
}
