/**
 * ==============================================================================
 * DATAWITHLY LEADS CRM - GOOGLE APPS SCRIPT BUNDLE (LIGHTWEIGHT & SECURE)
 * ==============================================================================
 * Phiên bản: 2.2.0 (DataWithLy Leads CRM Engine)
 * Thời gian đóng gói: 2026-11-14T13:38:10.393Z
 * ==============================================================================
 */

function getLeadsSystemInfo() {
  return {
    system: "DataWithLy Leads CRM Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.2.0",
    architecture: "Standalone Leads CRM Bundle (Zero HTML Modals, Pure REST Backend)",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}


// ==============================================================================
// FILE NGUỒN: 00_LeadsConfig.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 00: CẤU HÌNH LEADS CRM (LEADS CONFIGURATION)
 * ==============================================================================
 * Quản lý khóa bí mật, email nhận thông báo và liên kết tư vấn Zalo/Telegram.
 * Tiêu chuẩn bảo mật Google Enterprise: Dùng PropertiesService (Script Properties).
 * ==============================================================================
 */

function getScriptProperty(key, fallbackValue) {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty(key);
    if (prop && prop.trim()) {
      return prop.trim();
    }
  } catch (e) {}

  return fallbackValue !== undefined ? fallbackValue : "";
}

var CONFIG = {
  get SHARED_SECRET() {
    return getScriptProperty("SHARED_SECRET", "");
  },

  get CLIENT_NOTIFICATION_EMAILS() {
    var defaultEmails = ["hientruongthmh@gmail.com"];
    var propEmail = getScriptProperty("CLIENT_NOTIFICATION_EMAILS", "");
    if (!propEmail) {
      propEmail = getScriptProperty("CLIENT_NOTIFICATION_EMAIL", "");
    }
    if (propEmail) {
      var parsed = propEmail.split(",").map(function(item) { return item.trim(); }).filter(Boolean);
      if (parsed.length > 0) return parsed;
    }
    return defaultEmails;
  },

  get ZALO_CONTACT_URL() {
    return getScriptProperty("ZALO_CONTACT_URL", "https://zalo.me/0934938431");
  },

  get TELEGRAM_BOT_TOKEN() {
    return getScriptProperty("TELEGRAM_BOT_TOKEN", "");
  },

  get TELEGRAM_CHAT_ID() {
    return getScriptProperty("TELEGRAM_CHAT_ID", "");
  },

  LOCK_TIMEOUT_MS: 10000
};

var COACHING_COURSES_LIST = [
  "SQL for Data Analytics",
  "Analytical Thinking & Data Analysis with Looker Studio",
  "Combo SQL & Looker Studio",
  "Tư vấn lộ trình 1-1"
];

var ATTENDANCE_COMMITMENTS_LIST = [
  "Tôi chắc chắn",
  "Tôi cam kết"
];

var LEAD_STATUSES_LIST = [
  "NEW",
  "CONTACTING",
  "CONSULTED",
  "ENROLLED",
  "DROPPED",
  "SPAM"
];


// ==============================================================================
// FILE NGUỒN: 01_LeadsMenu.gs
// ==============================================================================

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


// ==============================================================================
// FILE NGUỒN: 02_LeadsTableSetup.gs
// ==============================================================================

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


// ==============================================================================
// FILE NGUỒN: 03_LeadsEndpoints.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 03: BỘ ĐỊNH TUYẾN WEB APP LEADS CRM (LEADS REST ENDPOINTS)
 * ==============================================================================
 * 1. doGet(e): Ping kiểm tra sức khỏe hệ thống Leads Web App.
 * 2. doPost(e):
 *    - submit_lead: Tiếp nhận lượt đăng ký tư vấn từ Website (Chuẩn Figma 12-3320).
 *    - get_leads: Truy vấn danh sách học viên tiềm năng cho Dashboard CRM.
 *    - update_lead: Cập nhật trạng thái, ghi chú tư vấn, phân công nhân sự.
 *    - get_lead_stats: Thống kê số lượng lead theo trạng thái.
 * ==============================================================================
 */

function sanitizeFormula(val) {
  if (val === null || val === undefined) return "";
  var str = val.toString().trim();
  if (str.length > 0 && (str.charAt(0) === "=" || str.charAt(0) === "+" || str.charAt(0) === "-" || str.charAt(0) === "@" || str.charAt(0) === "\t" || str.charAt(0) === "\r")) {
    return "'" + str;
  }
  return str;
}

function getSheetRowsAsObjects(sheet) {
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return [];

  var headers = data[0].map(function(h) {
    return h.toString().trim().toLowerCase().replace(/[\s-]+/g, "_");
  });

  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var isEmpty = row.every(function(cell) { return cell === "" || cell === null; });
    if (isEmpty) continue;

    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var header = headers[j];
      if (header) {
        obj[header] = row[j];
      }
    }
    rows.push(obj);
  }
  return rows;
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var action = params.action || "ping";

    if (action === "ping") {
      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        status: "healthy",
        service: "DataWithLy Leads CRM Engine",
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "FORBIDDEN", message: "Yêu cầu POST có xác thực để truy xuất dữ liệu Leads." }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "GET_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  var hasLock = lock.tryLock(CONFIG.LOCK_TIMEOUT_MS);

  if (!hasLock) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "LOCK_TIMEOUT", message: "Hệ thống đang bận ghi dữ liệu, vui lòng thử lại sau vài giây." }
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var rawData = e.postData.contents;
    var payload = JSON.parse(rawData);

    var configuredSecret = CONFIG.SHARED_SECRET;
    if (configuredSecret && configuredSecret.trim() !== "" && payload.secret !== configuredSecret) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: { code: "UNAUTHORIZED", message: "Yêu cầu mã secret xác thực hợp lệ." }
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = payload.action || "submit_lead";
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("leads") || ss.getSheetByName("leads (private)") || ss.getSheetByName("Leads");

    // 1. TIẾP NHẬN LEAD MỚI (submit_lead)
    if (action === "submit_lead") {
      if (!sheet) {
        sheet = setupLeadsCrmTable();
      }

      var timestamp = payload.client_submitted_at || new Date().toISOString();
      var safePhone = payload.phone ? ("'" + payload.phone.toString().trim().replace(/^[=+\-@\t\r]+/, "")) : "";
      var coachingCourse = sanitizeFormula(payload.course_name || payload.interested_courses || payload.course_id || "SQL for Data Analytics");
      var targetOrGoal = sanitizeFormula(payload.message || payload.target_or_goal || "");
      var attendanceCommit = sanitizeFormula(payload.attendance_commitment || "Tôi chắc chắn");
      var statusVal = sanitizeFormula(payload.status || "NEW");
      var notesVal = sanitizeFormula(payload.notes || "");
      var assignedToVal = sanitizeFormula(payload.assigned_to || "");
      var sourceVal = sanitizeFormula(payload.source || payload.form_id || "website");
      var updatedAt = new Date().toISOString();

      sheet.appendRow([
        sanitizeFormula(payload.submission_id || Utilities.getUuid()),
        timestamp,
        sanitizeFormula(payload.name || ""),
        safePhone,
        sanitizeFormula(payload.email || ""),
        coachingCourse,
        targetOrGoal,
        attendanceCommit,
        statusVal,
        notesVal,
        assignedToVal,
        sourceVal,
        updatedAt
      ]);

      if (CONFIG.TELEGRAM_BOT_TOKEN && CONFIG.TELEGRAM_CHAT_ID) {
        sendTelegramNotification(payload);
      }

      try {
        sendLeadEmails(payload);
      } catch (mailErr) {
        console.warn("Lỗi gửi email lead:", mailErr);
      }

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        submissionId: payload.submission_id,
        status: "stored"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. TRUY VẤN DANH SÁCH LEADS (get_leads)
    if (action === "get_leads") {
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: true, action: "get_leads", total: 0, data: []
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var leadRows = getSheetRowsAsObjects(sheet);
      var filterStatus = (payload.status || "ALL").toUpperCase();
      var searchTerm = (payload.search || "").toLowerCase().trim();

      if (filterStatus !== "ALL") {
        leadRows = leadRows.filter(function(r) { return (r.status || "").toUpperCase() === filterStatus; });
      }

      if (searchTerm) {
        leadRows = leadRows.filter(function(r) {
          return (r.name || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.phone || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.email || "").toLowerCase().indexOf(searchTerm) !== -1 ||
                 (r.coaching_course || r.course_name || "").toLowerCase().indexOf(searchTerm) !== -1;
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        ok: true,
        action: "get_leads",
        total: leadRows.length,
        data: leadRows
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 3. CẬP NHẬT TRẠNG THÁI LEAD (update_lead)
    if (action === "update_lead") {
      if (!sheet || sheet.getLastRow() <= 1) {
        return ContentService.createTextOutput(JSON.stringify({
          ok: false, error: { code: "NOT_FOUND", message: "Bảng Leads chưa có dữ liệu." }
        })).setMimeType(ContentService.MimeType.JSON);
      }

      var targetSubId = (payload.submission_id || "").toString().trim();
      var sheetData = sheet.getDataRange().getValues();
      var isUpdated = false;
      var rawHeaders = sheetData[0].map(function(h) {
        return h.toString().toLowerCase().trim().replace(/[\s-]+/g, "_");
      });

      for (var r = 1; r < sheetData.length; r++) {
        if ((sheetData[r][0] || "").toString().trim() === targetSubId) {
          var targetRow = r + 1;
          if (payload.status) {
            var sIdx = rawHeaders.indexOf("status");
            if (sIdx !== -1) sheet.getRange(targetRow, sIdx + 1).setValue(sanitizeFormula(payload.status));
          }
          if (payload.notes !== undefined) {
            var nIdx = rawHeaders.indexOf("notes");
            if (nIdx !== -1) sheet.getRange(targetRow, nIdx + 1).setValue(sanitizeFormula(payload.notes));
          }
          if (payload.assigned_to !== undefined) {
            var aIdx = rawHeaders.indexOf("assigned_to");
            if (aIdx !== -1) sheet.getRange(targetRow, aIdx + 1).setValue(sanitizeFormula(payload.assigned_to));
          }
          var uIdx = rawHeaders.indexOf("updated_at");
          if (uIdx !== -1) {
            sheet.getRange(targetRow, uIdx + 1).setValue(new Date().toISOString());
          }
          isUpdated = true;
          break;
        }
      }

      return ContentService.createTextOutput(JSON.stringify({
        ok: isUpdated,
        action: "update_lead",
        message: isUpdated ? "Cập nhật Lead thành công!" : "Không tìm thấy submission_id: " + targetSubId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. THỐNG KÊ DASHBOARD LEADS (get_lead_stats)
    if (action === "get_lead_stats") {
      var stats = { total: 0, new: 0, contacting: 0, consulted: 0, enrolled: 0, dropped: 0, spam: 0 };
      if (sheet && sheet.getLastRow() > 1) {
        var allLeads = getSheetRowsAsObjects(sheet);
        stats.total = allLeads.length;
        allLeads.forEach(function(l) {
          var st = (l.status || "NEW").toUpperCase();
          if (st === "NEW") stats.new++;
          else if (st === "CONTACTING") stats.contacting++;
          else if (st === "CONSULTED") stats.consulted++;
          else if (st === "ENROLLED") stats.enrolled++;
          else if (st === "DROPPED") stats.dropped++;
          else if (st === "SPAM") stats.spam++;
        });
      }

      return ContentService.createTextOutput(JSON.stringify({
        ok: true, action: "get_lead_stats", stats: stats
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: false, error: { code: "UNKNOWN_ACTION", message: "Hành động không xác định: " + action }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: { code: "SERVER_ERROR", message: err.toString() }
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}


// ==============================================================================
// FILE NGUỒN: 04_LeadsNotifications.gs
// ==============================================================================

/**
 * ==============================================================================
 * MODULE 04: HỆ THỐNG THÔNG BÁO TỰ ĐỘNG LEADS CRM (LEADS NOTIFICATIONS)
 * ==============================================================================
 * 1. sendLeadEmails(payload): Gửi email 2 chiều:
 *    - Email 1: Thông báo tức thì tới ban tuyển sinh / Founder Ly Hứa (hientruongthmh@gmail.com).
 *    - Email 2: Gửi thư cảm ơn học viên kèm mã liên kết Zalo tư vấn 1-1.
 * 2. sendTelegramNotification(payload): Bắn cảnh báo tức thì qua Telegram Bot (< 2s).
 * ==============================================================================
 */

function sendLeadEmails(payload) {
  if (!payload) return;

  var leadName = payload.name || "Học viên";
  var leadPhone = payload.phone || "Chưa cung cấp";
  var leadEmail = payload.email || "";
  var courseName = payload.course_name || payload.interested_courses || "Data Analytics";
  var courseId = payload.course_id || "general";
  var message = payload.message || payload.target_or_goal || "Không có";
  var timeStr = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
  var zaloUrl = CONFIG.ZALO_CONTACT_URL || "https://zalo.me/0934938431";

  // --- 1. EMAIL GỬI CHO CLIENT (ADMIN / TUYỂN SINH) ---
  var clientRecipients = CONFIG.CLIENT_NOTIFICATION_EMAILS;
  if (clientRecipients && clientRecipients.length > 0) {
    var clientSubject = "🔥 [DataWithLy - Lead Mới] " + leadName + " vừa đăng ký tư vấn khóa " + courseName;
    var clientHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;'>",
      "<div style='background: #8B1D2C; color: #FFFFFF; padding: 15px 20px; border-radius: 6px 6px 0 0;'>",
      "<h2 style='margin: 0; font-size: 18px;'>🔥 THÔNG BÁO HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI</h2>",
      "</div>",
      "<div style='padding: 20px; background: #FFFFFF;'>",
      "<p style='font-size: 14px; color: #374151;'>Hệ thống vừa tiếp nhận một lượt đăng ký tư vấn mới từ website DataWithLy:</p>",
      "<table style='width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;'>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; width: 35%;'>Họ và tên:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #111827;'>" + leadName + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Số điện thoại:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='tel:" + leadPhone + "' style='color: #8B1D2C; font-weight: bold; text-decoration: none;'>" + leadPhone + "</a> (Bấm để gọi)</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Email:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'><a href='mailto:" + leadEmail + "' style='color: #2563EB; text-decoration: none;'>" + leadEmail + "</a></td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Khóa học quan tâm:</td><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold; color: #784080;'>" + courseName + " (" + courseId + ")</td></tr>",
      "<tr style='background: #F9FAFB;'><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Lời nhắn / Ghi chú:</td><td style='padding: 10px; border: 1px solid #E5E7EB;'>" + message + "</td></tr>",
      "<tr><td style='padding: 10px; border: 1px solid #E5E7EB; font-weight: bold;'>Thời gian đăng ký:</td><td style='padding: 10px; border: 1px solid #E5E7EB; color: #6B7280;'>" + timeStr + "</td></tr>",
      "</table>",
      "<div style='margin-top: 20px; padding: 12px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px; font-size: 13px; color: #92400E;'>",
      "⚡ <strong>Hành động nhanh:</strong> Vui lòng liên hệ học viên trong vòng 15-30 phút để đạt tỷ lệ chuyển đổi cao nhất.",
      "</div>",
      "</div>",
      "</div>"
    ].join("");

    for (var i = 0; i < clientRecipients.length; i++) {
      var emailTo = clientRecipients[i];
      try {
        MailApp.sendEmail({
          to: emailTo,
          subject: clientSubject,
          htmlBody: clientHtml
        });
      } catch (err) {
        console.error("Lỗi khi gửi email thông báo cho Client (" + emailTo + "):", err);
      }
    }
  }

  // --- 2. EMAIL CẢM ƠN HỌC VIÊN KÈM MÃ ZALO TƯ VẤN ---
  if (leadEmail && leadEmail.indexOf("@") !== -1) {
    var studentSubject = "🎯 Xác nhận đăng ký tư vấn lộ trình Data Analytics - Mentor Hứa Thảo Ly";
    var studentHtml = [
      "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;'>",
      "<div style='background: #8B1D2C; color: #FFFFFF; padding: 20px; border-radius: 6px 6px 0 0; text-align: center;'>",
      "<h1 style='margin: 0; font-size: 20px;'>Chào mừng bạn đến với DataWithLy!</h1>",
      "<p style='margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;'>Nền tảng đào tạo Data Analytics thực chiến cùng Mentor Hứa Thảo Ly</p>",
      "</div>",
      "<div style='padding: 24px; background: #FFFFFF; line-height: 1.6; color: #374151;'>",
      "<p>Chào <strong>" + leadName + "</strong>,</p>",
      "<p>Cảm ơn bạn đã quan tâm và đăng ký tư vấn khóa học <strong>" + courseName + "</strong> tại DataWithLy.</p>",
      "<p>Cô Ly và đội ngũ trợ giảng đã nhận được thông tin của bạn. Trong vòng <strong>15 - 30 phút tới</strong> (trong giờ làm việc), Mentor sẽ trực tiếp liên hệ qua số điện thoại/Zalo <strong>" + leadPhone + "</strong> để trao đổi chi tiết về định hướng và lộ trình học tập phù hợp nhất với bạn.</p>",
      "<div style='margin: 25px 0; text-align: center;'>",
      "<a href='" + zaloUrl + "' style='background: #0068FF; color: #FFFFFF; padding: 12px 24px; font-size: 15px; font-weight: bold; text-decoration: none; border-radius: 6px; display: inline-block;'>💬 Kết nối Zalo trực tiếp với Mentor ngay</a>",
      "</div>",
      "<p style='font-size: 13px; color: #6B7280;'>Nếu bạn có thắc mắc cần giải đáp gấp, bạn có thể chủ động bấm vào nút Zalo bên trên để được hỗ trợ tức thì.</p>",
      "<hr style='border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;'>",
      "<p style='margin: 0; font-size: 13px; color: #9CA3AF;'>Trân trọng,<br><strong style='color: #4B5563;'>Hứa Thảo Ly & Đội ngũ DataWithLy</strong><br>Hotline/Zalo: 0934 938 431</p>",
      "</div>",
      "</div>"
    ].join("");

    try {
      MailApp.sendEmail({
        to: leadEmail,
        subject: studentSubject,
        htmlBody: studentHtml
      });
    } catch (err2) {
      console.error("Lỗi khi gửi email cảm ơn học viên (" + leadEmail + "):", err2);
    }
  }
}

function sendTelegramNotification(payload) {
  try {
    var text = "🔥 *CÓ HỌC VIÊN ĐĂNG KÝ TƯ VẤN MỚI!*\n\n" +
      "👤 *Họ tên:* " + (payload.name || "N/A") + "\n" +
      "📞 *Số điện thoại:* `" + (payload.phone || "N/A") + "`\n" +
      "📧 *Email:* " + (payload.email || "N/A") + "\n" +
      "📚 *Khóa học:* " + (payload.course_name || "Tư vấn chung") + "\n" +
      "💬 *Ghi chú:* " + (payload.message || "Không có");

    var url = "https://api.telegram.org/bot" + CONFIG.TELEGRAM_BOT_TOKEN + "/sendMessage";
    UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "Markdown"
      }),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log("Telegram alert error: " + e.toString());
  }
}

