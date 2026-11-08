/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - MULTI-SHEET DATA INGESTION WEB APP
 * =========================================================================
 * Features:
 * - Thread-safe concurrency handling with LockService
 * - Multi-sheet support (dynamically dispatches to target sheet, e.g. "Leads", "Subscribers")
 * - Deduplication by submission_id (Column 1)
 * - Server-side ISO timestamp
 * - Shared secret authorization verification
 * - Formula injection prevention
 * - JSON responses with standard status codes
 */

var DEFAULT_SHEET_NAME = "Leads";
var SCRIPT_PROP_SECRET_KEY = "APPS_SCRIPT_SECRET";

// Standard column schema for Leads sheet
var LEADS_HEADERS = [
  "submission_id",
  "server_received_at",
  "client_submitted_at",
  "name",
  "phone",
  "email",
  "course_id",
  "course_name",
  "message",
  "first_utm_source",
  "first_utm_medium",
  "first_utm_campaign",
  "first_utm_content",
  "first_utm_term",
  "first_referrer",
  "first_landing_page",
  "first_seen_at",
  "last_utm_source",
  "last_utm_medium",
  "last_utm_campaign",
  "last_utm_content",
  "last_utm_term",
  "last_referrer",
  "last_landing_page",
  "last_seen_at",
  "gclid",
  "fbclid",
  "form_id",
  "cta_id",
  "page_url",
  "status"
];

/**
 * Handle POST request from Next.js API Route
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // Try to acquire lock for 10 seconds to ensure atomic write operations
  try {
    lock.waitLock(10000);
  } catch (lockErr) {
    return createJsonResponse({
      ok: false,
      error: {
        code: "LOCK_TIMEOUT",
        message: "Hệ thống đang bận ghi dữ liệu, vui lòng thử lại sau giây lát."
      }
    }, 429);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        ok: false,
        error: {
          code: "EMPTY_PAYLOAD",
          message: "Dữ liệu gửi lên rỗng."
        }
      }, 400);
    }

    var payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (jsonErr) {
      return createJsonResponse({
        ok: false,
        error: {
          code: "INVALID_JSON",
          message: "Dữ liệu không đúng định dạng JSON."
        }
      }, 400);
    }

    // 1. Verify Shared Secret if configured
    var configuredSecret = PropertiesService.getScriptProperties().getProperty(SCRIPT_PROP_SECRET_KEY);
    if (configuredSecret && configuredSecret.trim() !== "") {
      if ((payload.secret || "") !== configuredSecret) {
        return createJsonResponse({
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Mã bảo mật secret không chính xác."
          }
        }, 401);
      }
    }

    // 2. Validate Submission ID
    var submissionId = String(payload.submission_id || "").trim();
    if (!submissionId) {
      return createJsonResponse({
        ok: false,
        error: {
          code: "MISSING_SUBMISSION_ID",
          message: "Thiếu submission_id."
        }
      }, 400);
    }

    // 3. Determine Target Sheet
    var targetSheetName = String(payload.sheet_name || payload.target_sheet || DEFAULT_SHEET_NAME).trim();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(targetSheetName);

    // Auto-create sheet if not existing
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      var headers = targetSheetName === "Leads" ? LEADS_HEADERS : Object.keys(payload).filter(function(k) { return k !== "secret"; });
      sheet.appendRow(headers);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EDE9FE");
    }

    // 4. Deduplication Check on Column 1 (submission_id)
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingIds.length; i++) {
        if (existingIds[i][0] && String(existingIds[i][0]).trim() === submissionId) {
          return createJsonResponse({
            ok: true,
            submissionId: submissionId,
            status: "duplicate"
          });
        }
      }
    }

    // 5. Append Row Data
    var serverTimestamp = new Date().toISOString();
    var rowData;

    if (targetSheetName === "Leads") {
      rowData = [
        escapeFormula(submissionId),
        serverTimestamp,
        escapeFormula(payload.client_submitted_at || serverTimestamp),
        escapeFormula(payload.name || ""),
        escapeFormula(payload.phone || ""),
        escapeFormula(payload.email || ""),
        escapeFormula(payload.course_id || "general"),
        escapeFormula(payload.course_name || ""),
        escapeFormula(payload.message || ""),
        escapeFormula(payload.first_utm_source || ""),
        escapeFormula(payload.first_utm_medium || ""),
        escapeFormula(payload.first_utm_campaign || ""),
        escapeFormula(payload.first_utm_content || ""),
        escapeFormula(payload.first_utm_term || ""),
        escapeFormula(payload.first_referrer || ""),
        escapeFormula(payload.first_landing_page || ""),
        escapeFormula(payload.first_seen_at || ""),
        escapeFormula(payload.last_utm_source || ""),
        escapeFormula(payload.last_utm_medium || ""),
        escapeFormula(payload.last_utm_campaign || ""),
        escapeFormula(payload.last_utm_content || ""),
        escapeFormula(payload.last_utm_term || ""),
        escapeFormula(payload.last_referrer || ""),
        escapeFormula(payload.last_landing_page || ""),
        escapeFormula(payload.last_seen_at || ""),
        escapeFormula(payload.gclid || ""),
        escapeFormula(payload.fbclid || ""),
        escapeFormula(payload.form_id || ""),
        escapeFormula(payload.cta_id || ""),
        escapeFormula(payload.page_url || ""),
        escapeFormula(payload.status || "NEW")
      ];
    } else {
      // Dynamic row mapping for generic sheets
      var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      rowData = currentHeaders.map(function(h) {
        if (h === "server_received_at") return serverTimestamp;
        return escapeFormula(payload[h] || "");
      });
    }

    sheet.appendRow(rowData);

    return createJsonResponse({
      ok: true,
      submissionId: submissionId,
      status: "stored"
    });

  } catch (err) {
    return createJsonResponse({
      ok: false,
      error: {
        code: "INTERNAL_ERROR",
        message: err.toString()
      }
    }, 500);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return createJsonResponse({
    ok: true,
    status: "HEALTHY",
    service: "Ly Data Multi-Sheet Ingestion Webhook",
    timestamp: new Date().toISOString()
  });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function escapeFormula(value) {
  if (value === null || value === undefined) return "";
  var str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}
