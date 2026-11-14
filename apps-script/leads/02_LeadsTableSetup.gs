/**
 * ==============================================================================
 * MODULE 02: KHỞI TẠO BẢNG LEADS CRM (LEADS TABLE SETUP)
 * ==============================================================================
 * Bảng 'leads' 13 cột chuẩn Figma Node 12-3320 kèm Dropdown Selection.
 * ==============================================================================
 */

function setupLeadsCrmTable() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var headers = [
    "submission_id", "timestamp", "name", "phone", "email",
    "coaching_course", "target_or_goal", "attendance_commitment",
    "status", "notes", "assigned_to", "source", "updated_at"
  ];

  var sheet = ss.getSheetByName("leads");
  if (!sheet) {
    sheet = ss.insertSheet("leads");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground("#7F1D1D")
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setFontSize(10)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // Dropdown Selection 1: Khóa coaching bạn quan tâm (Figma 12-3320)
  var courseRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(COACHING_COURSES_LIST, true)
    .build();
  sheet.getRange("F2:F500").setDataValidation(courseRule);

  // Dropdown Selection 2: Cam kết xuất hiện đúng giờ (Figma 12-3320)
  var attendanceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(ATTENDANCE_COMMITMENTS_LIST, true)
    .build();
  sheet.getRange("H2:H500").setDataValidation(attendanceRule);

  // Dropdown Selection 3: Trạng thái Lead CRM
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LEAD_STATUSES_LIST, true)
    .build();
  sheet.getRange("I2:I500").setDataValidation(statusRule);

  // Định dạng Plain Text cho cột Số điện thoại để không mất số 0
  sheet.getRange("D2:D500").setNumberFormat("@");

  if (sheet.getLastRow() === 1) {
    sheet.appendRow([
      "sub_sample_figma_001",
      new Date().toISOString(),
      "Nguyễn Hoàng Nam",
      "'0912345678",
      "nam.hoang@gmail.com",
      "SQL for Data Analytics",
      "Chuyển ngành sang Data Analyst trong 3 tháng tới",
      "Tôi chắc chắn",
      "NEW",
      "Học viên mong muốn học ca tối thứ 3 - thứ 5",
      "Mentor Hứa Thảo Ly",
      "homepage_consultation_form",
      new Date().toISOString()
    ]);
  }

  // Xóa Sheet1 mặc định nếu có
  var sheet1 = ss.getSheetByName("Sheet1") || ss.getSheetByName("Trang tính1");
  if (sheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  SpreadsheetApp.getUi().alert(
    "🎉 Khởi Tạo Thành Công!",
    "Đã thiết lập bảng 'leads' 13 cột chuẩn Figma Node 12-3320 với các Dropdown Selection chuyên biệt cho Tuyển sinh!",
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  return sheet;
}
