/**
 * ==============================================================================
 * MODULE 00: CẤU HÌNH HỆ THỐNG (SYSTEM CONFIGURATION)
 * ==============================================================================
 * Quản lý tập trung các khóa bí mật, URL webhook và thời gian chờ khóa ghi.
 * Áp dụng tiêu chuẩn bảo mật Google Enterprise: Sử dụng PropertiesService (Script Properties)
 * để lưu trữ biến môi trường an toàn, KHÔNG hardcode chuỗi nhạy cảm trong mã nguồn.
 * ==============================================================================
 */

/**
 * Đọc thuộc tính an toàn từ Script Properties với cơ chế Fallback sang tab settings
 * 1. Ưu tiên 1: PropertiesService.getScriptProperties() (Bảo mật tối đa, không lộ trên Git)
 * 2. Ưu tiên 2: Đọc từ tab 'settings' của Google Sheets nếu đã được người quản trị lưu
 * 3. Fallback: Giá trị mặc định an toàn
 */
function getScriptProperty(key, fallbackValue) {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty(key);
    if (prop && prop.trim()) {
      return prop.trim();
    }
  } catch (e) {}

  // Đọc từ tab settings nếu có
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("settings");
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      var normalizedKey = key.toLowerCase();
      for (var i = 1; i < data.length; i++) {
        var rowKey = (data[i][0] || "").toString().trim().toLowerCase();
        if (rowKey === normalizedKey && data[i][1]) {
          return data[i][1].toString().trim();
        }
      }
    }
  } catch (err) {}

  return fallbackValue !== undefined ? fallbackValue : "";
}

/**
 * Lấy mã bí mật xác thực hai chiều (Zero Hardcoded Secret)
 */
function getSharedSecret() {
  return getScriptProperty("SHARED_SECRET", "");
}

var CONFIG = {
  // Mã secret xác thực giữa Web Next.js và Google Apps Script
  get SHARED_SECRET() {
    return getSharedSecret();
  },

  // Địa chỉ Web Next.js đã deploy trên Vercel (ví dụ: https://ed-da-tech.vercel.app)
  get WEB_DEPLOY_URL() {
    return getScriptProperty("WEB_DEPLOY_URL", "");
  },

  // Token bảo mật cho On-Demand ISR Revalidation Webhook (/api/revalidate)
  get REVALIDATION_SECRET() {
    return getScriptProperty("REVALIDATION_SECRET", "");
  },

  // URL Webhook kích hoạt Revalidation trên Website Production
  get REVALIDATION_PROD_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_PROD_URL", "");
    if (explicitUrl) return explicitUrl;

    var deployUrl = this.WEB_DEPLOY_URL;
    if (deployUrl) {
      var base = deployUrl.replace(/\/+$/, "");
      var secret = this.REVALIDATION_SECRET;
      return base + "/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
    }
    return "";
  },

  // URL Webhook khi chạy Dev cục bộ (Localhost / Dev Tunnel)
  get REVALIDATION_LOCAL_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_LOCAL_URL", "");
    if (explicitUrl) return explicitUrl;

    var secret = this.REVALIDATION_SECRET;
    return "http://localhost:3000/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
  },

  // Môi trường revalidation đang kích hoạt: "PROD" hoặc "LOCAL"
  get ACTIVE_REVALIDATION_ENV() {
    return getScriptProperty("ACTIVE_REVALIDATION_ENV", "PROD");
  },

  // Getter dự phòng tương thích ngược
  get REVALIDATION_URL() {
    return this.REVALIDATION_PROD_URL;
  },

  // Danh sách Email nhận thông báo Lead mới (Client & Quản trị viên)
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

  // Đường dẫn kết nối Zalo tư vấn nhanh gửi cho học viên
  get ZALO_CONTACT_URL() {
    return getScriptProperty("ZALO_CONTACT_URL", "https://zalo.me/0934938431");
  },

  // Cấu hình Telegram Bot để nhận cảnh báo tức thì (< 2s)
  get TELEGRAM_BOT_TOKEN() {
    return getScriptProperty("TELEGRAM_BOT_TOKEN", "");
  },

  get TELEGRAM_CHAT_ID() {
    return getScriptProperty("TELEGRAM_CHAT_ID", "");
  },

  // Thời gian tối đa giữ Mutex Lock để chống xung đột race-condition (10 giây)
  LOCK_TIMEOUT_MS: 10000,

  // ID của Google Spreadsheet chứa Lead riêng biệt (Spreadsheet 2 - Private Leads CRM)
  get LEADS_SPREADSHEET_ID() {
    return getScriptProperty("LEADS_SPREADSHEET_ID", "");
  },

  // ID của Google Spreadsheet chứa Content CMS (Spreadsheet 1 - Content Master)
  get CMS_SPREADSHEET_ID() {
    return getScriptProperty("CMS_SPREADSHEET_ID", "");
  },
};

/**
 * Danh sách các giá trị Selection chuẩn hóa theo thiết kế Figma Node 12-3320
 */
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

/**
 * ==============================================================================
 * DESIGN PATTERN 1: SPREADSHEET FACTORY (DATABASE CONNECTION MANAGER)
 * ==============================================================================
 * Quản lý kết nối linh hoạt giữa 2 Spreadsheets:
 * 1. Content Spreadsheet (Spreadsheet 1 - Quản trị nội dung Website)
 * 2. Leads Spreadsheet (Spreadsheet 2 - Bảo mật thông tin PII học viên & CRM)
 * ==============================================================================
 */
var SpreadsheetFactory = {
  /**
   * Lấy Spreadsheet quản trị nội dung CMS (11 tabs)
   */
  getContentSpreadsheet: function() {
    var customId = CONFIG.CMS_SPREADSHEET_ID;
    if (customId && customId.trim()) {
      try {
        return SpreadsheetApp.openById(customId.trim());
      } catch (err) {
        console.warn("[SpreadsheetFactory] Không mở được CMS Spreadsheet theo ID: " + customId + ", fallback sang Active Spreadsheet.", err);
      }
    }
    return SpreadsheetApp.getActiveSpreadsheet();
  },

  /**
   * Lấy Spreadsheet quản trị Leads CRM riêng biệt (Bảo mật PII)
   */
  getLeadsSpreadsheet: function() {
    var leadsId = CONFIG.LEADS_SPREADSHEET_ID;
    if (leadsId && leadsId.trim()) {
      try {
        return SpreadsheetApp.openById(leadsId.trim());
      } catch (err) {
        console.warn("[SpreadsheetFactory] Không mở được Leads Spreadsheet theo ID: " + leadsId + ", fallback sang Active Spreadsheet.", err);
      }
    }
    // Fallback sang Active Spreadsheet nếu chưa cấu hình ID riêng
    return SpreadsheetApp.getActiveSpreadsheet();
  }
};

