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
