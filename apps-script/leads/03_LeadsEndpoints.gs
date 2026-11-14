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
