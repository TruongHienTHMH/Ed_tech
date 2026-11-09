/**
 * MODULE 08: HỘP THOẠI QUẢN TRỊ HỒ SƠ MENTOR (MENTOR PROFILE MODAL DIALOG)
 */
function showMentorModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || ss.getSheetByName("mentors") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

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
  var html = template.evaluate().setWidth(660).setHeight(720).setTitle("👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "👤 Quản Trị Hồ Sơ Giảng Viên Hàng Loạt");
}

function addMentorsBatchFromModal(mentorList) {
  if (!mentorList || !mentorList.length) {
    throw new Error("Danh sách giảng viên không được để trống.");
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("mentor_profiles") || ss.getSheetByName("mentors") || (setupMentorProfilesTab(ss), ss.getSheetByName("mentor_profiles"));

  var lastRow = sheet.getLastRow();
  var existingIds = [];
  if (lastRow > 1) {
    var vals = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < vals.length; i++) {
      if (vals[i][0]) existingIds.push(vals[i][0].toString().trim());
    }
  }

  var rowsToAdd = [];
  var addedMentors = [];

  for (var k = 0; k < mentorList.length; k++) {
    var item = mentorList[k];
    var name = (item.name || "").toString().trim();
    if (!name) {
      throw new Error("Giảng viên #" + (k + 1) + ": Họ và tên Mentor không được để trống.");
    }

    // Sinh UUID v4 chuẩn RFC 4122 (hoặc giữ ID hợp lệ có sẵn)
    var uniqueId = item.id && (isValidUUID(item.id, "mentor-") || item.id === "mentor-ly-hua")
      ? item.id.toString().trim()
      : generateUUID("mentor-");

    var title = (item.title || "").toString().trim() || "Lead Mentor & Founder DataWithLy";
    var bio = (item.bio || "").toString().trim();
    var companies = (item.companies_worked || "").toString().trim();
    var avatarUrl = (item.avatar_url || "").toString().trim() || "/uploads/mentors/ly-hua.jpg";
    var linkedinUrl = (item.linkedin_url || "").toString().trim();
    var isActive = item.is_active === true || item.is_active === "true";

    var foundIndex = -1;
    for (var r = 0; r < existingIds.length; r++) {
      if (existingIds[r] === uniqueId) {
        foundIndex = r + 2;
        break;
      }
    }

    var rowData = [
      sanitizeFormula(uniqueId),
      sanitizeFormula(name),
      sanitizeFormula(title),
      sanitizeFormula(bio),
      sanitizeFormula(companies),
      sanitizeFormula(avatarUrl),
      sanitizeFormula(linkedinUrl),
      isActive
    ];

    if (foundIndex > 0) {
      sheet.getRange(foundIndex, 1, 1, 8).setValues([rowData]);
    } else {
      rowsToAdd.push(rowData);
      existingIds.push(uniqueId);
    }

    addedMentors.push({ id: uniqueId, name: name });
  }

  if (rowsToAdd.length > 0) {
    var startRow = sheet.getLastRow() + 1;
    sheet.getRange(startRow, 1, rowsToAdd.length, 8).setValues(rowsToAdd);
  }

  var msg = "🎉 Đã lưu thành công " + mentorList.length + " hồ sơ giảng viên vào bảng mentor_profiles!";
  ss.toast(msg, "DataWithLy CMS", 5);

  return { success: true, count: mentorList.length, mentors: addedMentors };
}

function saveMentorProfileFromModal(data) {
  var res = addMentorsBatchFromModal([data]);
  return {
    success: true,
    id: res.mentors[0].id,
    name: res.mentors[0].name
  };
}
