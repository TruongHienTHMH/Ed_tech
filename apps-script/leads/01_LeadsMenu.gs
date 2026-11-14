/**
 * ==============================================================================
 * MODULE 01: THANH MENU VÀ THAO TÁC LEADS CRM (LEADS MENU & ACTIONS)
 * ==============================================================================
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🎯 DataWithLy Leads CRM")
    .addItem("🔒 Cài Đặt Bảng Leads CRM (Chuẩn Figma 12-3320)", "setupLeadsCrmTable")
    .addSeparator()
    .addItem("👥 Cập Nhật Trạng Thái & Ghi Chú Lead", "showUpdateLeadStatusPrompt")
    .addItem("📊 Báo Cáo Nhanh Tuyển Sinh", "showLeadStatsAlert")
    .addSeparator()
    .addItem("🔐 Cài Đặt Mã Secret (Script Properties)", "promptSetSharedSecret")
    .addToUi();
}

function showUpdateLeadStatusPrompt() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("leads") || ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads");

  if (!sheet || sheet.getLastRow() <= 1) {
    ui.alert("Thông Báo", "Chưa có danh sách Lead học viên trong bảng Leads.", ui.ButtonSet.OK);
    return;
  }

  var prompt1 = ui.prompt(
    "👥 Cập Nhật Trạng Thái Lead",
    "Nhập Mã Đăng Ký (Submission ID) hoặc Số Điện Thoại của học viên cần cập nhật:",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt1.getSelectedButton() !== ui.Button.OK) return;
  var query = prompt1.getResponseText().trim().toLowerCase().replace(/['\s-]/g, "");
  if (!query) return;

  var data = sheet.getDataRange().getValues();
  var foundRow = 0;
  var leadInfo = {};
  var headers = data[0].map(function(h) {
    return h.toString().toLowerCase().trim().replace(/[\s-]+/g, "_");
  });

  var statusColIdx = headers.indexOf("status");
  if (statusColIdx === -1) statusColIdx = 8;

  for (var i = 1; i < data.length; i++) {
    var subId = (data[i][0] || "").toString().toLowerCase().trim();
    var phone = (data[i][3] || "").toString().toLowerCase().replace(/['\s-]/g, "").trim();

    if (subId === query || phone === query || (query.length >= 8 && phone.indexOf(query) !== -1)) {
      foundRow = i + 1;
      leadInfo = {
        subId: data[i][0],
        name: data[i][2] || "N/A",
        phone: data[i][3] || "N/A",
        course: data[i][5] || data[i][6] || "N/A",
        currentStatus: data[i][statusColIdx] || "NEW"
      };
      break;
    }
  }

  if (foundRow === 0) {
    ui.alert("Không Tìm Thấy Lead", "Không tìm thấy học viên nào khớp với mã hoặc SĐT: " + query, ui.ButtonSet.OK);
    return;
  }

  var prompt2 = ui.prompt(
    "Tìm thấy: " + leadInfo.name + " (" + leadInfo.phone + ")",
    "Khóa học: " + leadInfo.course + "\n" +
    "Trạng thái hiện tại: [" + leadInfo.currentStatus + "]\n\n" +
    "Chọn trạng thái mới (Gõ số 1-6 hoặc tên trạng thái):\n" +
    "1. NEW (Mới tiếp nhận)\n" +
    "2. CONTACTING (Đang liên hệ tư vấn)\n" +
    "3. CONSULTED (Đã tư vấn xong)\n" +
    "4. ENROLLED (Đã thanh toán & Vào lớp)\n" +
    "5. DROPPED (Không có nhu cầu / Hủy)\n" +
    "6. SPAM (Đăng ký rác / Sai số)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt2.getSelectedButton() !== ui.Button.OK) return;
  var choice = prompt2.getResponseText().trim().toUpperCase();

  var statusMap = {
    "1": "NEW", "2": "CONTACTING", "3": "CONSULTED",
    "4": "ENROLLED", "5": "DROPPED", "6": "SPAM"
  };

  var newStatus = statusMap[choice] || choice;
  if (LEAD_STATUSES_LIST.indexOf(newStatus) === -1) {
    ui.alert("Trạng Thái Không Hợp Lệ", "Vui lòng nhập số từ 1-6 hoặc một trong các trạng thái: " + LEAD_STATUSES_LIST.join(", "), ui.ButtonSet.OK);
    return;
  }

  sheet.getRange(foundRow, statusColIdx + 1).setValue(sanitizeFormula(newStatus));

  var updateIdx = headers.indexOf("updated_at");
  if (updateIdx !== -1) {
    sheet.getRange(foundRow, updateIdx + 1).setValue(new Date().toISOString());
  }

  ss.toast("🎉 Đã cập nhật trạng thái Lead " + leadInfo.name + " -> " + newStatus, "DataWithLy CRM", 5);
  ui.alert("✅ Cập Nhật Thành Công", "Học viên: " + leadInfo.name + "\nTrạng thái mới: " + newStatus, ui.ButtonSet.OK);
}

function showLeadStatsAlert() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("leads") || ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads");

  if (!sheet || sheet.getLastRow() <= 1) {
    ui.alert("Báo Cáo Tuyển Sinh", "Chưa có dữ liệu học viên trong bảng Leads.", ui.ButtonSet.OK);
    return;
  }

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) {
    return h.toString().toLowerCase().trim().replace(/[\s-]+/g, "_");
  });
  var sIdx = headers.indexOf("status");
  if (sIdx === -1) sIdx = 8;

  var stats = { total: data.length - 1, NEW: 0, CONTACTING: 0, CONSULTED: 0, ENROLLED: 0, DROPPED: 0, SPAM: 0 };
  for (var i = 1; i < data.length; i++) {
    var st = (data[i][sIdx] || "NEW").toString().toUpperCase().trim();
    if (stats[st] !== undefined) stats[st]++;
  }

  var msg = "📊 THỐNG KÊ TOÀN DIỆN TUYỂN SINH:\n" +
    "-----------------------------------------\n" +
    "• Tổng số đăng ký: " + stats.total + "\n" +
    "• Mới tiếp nhận (NEW): " + stats.NEW + "\n" +
    "• Đang tư vấn (CONTACTING): " + stats.CONTACTING + "\n" +
    "• Đã tư vấn (CONSULTED): " + stats.CONSULTED + "\n" +
    "• Đã nhập học (ENROLLED): " + stats.ENROLLED + "\n" +
    "• Tạm dừng / Hủy (DROPPED): " + stats.DROPPED + "\n" +
    "• Sai số / Spam: " + stats.SPAM;

  ui.alert("🎯 Báo Cáo Tuyển Sinh DataWithLy", msg, ui.ButtonSet.OK);
}

function promptSetSharedSecret() {
  var ui = SpreadsheetApp.getUi();
  var current = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || "";
  var displayStatus = current ? "●●●●●●●● (Đã lưu an toàn)" : "(Chưa thiết lập)";

  var prompt = ui.prompt(
    "🔐 Cấu Hình Mã Secret Bảo Mật (Script Properties)",
    "Trạng thái hiện tại: " + displayStatus + "\n\n" +
    "Nhập mã Secret xác thực giữa Website và Google Sheets Leads:\n" +
    "(Khớp với biến GOOGLE_APPS_SCRIPT_LEADS_SECRET trong file .env.local)",
    ui.ButtonSet.OK_CANCEL
  );

  if (prompt.getSelectedButton() === ui.Button.OK) {
    var val = prompt.getResponseText().trim();
    if (val) {
      PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", val);
      ui.alert("✅ Thành Công", "Đã lưu mã SHARED_SECRET vào Script Properties của file Leads!", ui.ButtonSet.OK);
    }
  }
}
