/**
 * MODULE 13: HỘP THOẠI CẤU HÌNH HỆ THỐNG (SETTINGS MODAL DIALOG)
 */
function showSettingsModal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("settings") || (setupSettingsTab(ss), ss.getSheetByName("settings"));

  var currentSettings = {
    hotline: "0901 234 567",
    zalo_url: "https://zalo.me/0901234567",
    contact_email: "tuyensinh@datawithly.edu.vn",
    announcement_bar: "Ưu đãi học phí 15% cho 10 học viên đăng ký sớm trong tuần này!",
    revalidation_url: CONFIG.REVALIDATION_URL
  };

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var rows = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    for (var i = 0; i < rows.length; i++) {
      var k = rows[i][0] ? rows[i][0].toString().trim() : "";
      if (k) currentSettings[k] = rows[i][1] !== undefined ? rows[i][1].toString() : "";
    }
  }

  var template = createModalTemplate("SettingsModal");
  template.currentSettings = currentSettings;
  var html = template.evaluate().setWidth(600).setHeight(640).setTitle("⚙️ Cấu Hình Hệ Thống - DataWithLy CMS");
  SpreadsheetApp.getUi().showModalDialog(html, "⚙️ Cấu Hình Hệ Thống");
}

function saveSettingsFromModal(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("settings") || (setupSettingsTab(ss), ss.getSheetByName("settings"));

  var descriptions = {
    hotline: "Số điện thoại hotline tư vấn tuyển sinh",
    zalo_url: "Đường dẫn chat Zalo tư vấn nhanh",
    contact_email: "Email nhận thư liên hệ",
    announcement_bar: "Thông báo trên thanh header",
    revalidation_url: "URL Webhook làm mới bộ nhớ cache của Website"
  };

  var lastRow = sheet.getLastRow();
  var existingMap = {};
  if (lastRow > 1) {
    var keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i][0]) existingMap[keys[i][0].toString().trim()] = i + 2;
    }
  }

  for (var key in data) {
    if (!data.hasOwnProperty(key)) continue;
    var val = sanitizeFormula(data[key]);
    var desc = descriptions[key] || "Cấu hình " + key;

    if (existingMap[key]) {
      sheet.getRange(existingMap[key], 2).setValue(val);
    } else {
      sheet.appendRow([sanitizeFormula(key), val, sanitizeFormula(desc)]);
    }
  }

  ss.toast("🎉 Đã lưu toàn bộ cấu hình hệ thống thành công!", "DataWithLy CMS", 5);
  return { success: true };
}

