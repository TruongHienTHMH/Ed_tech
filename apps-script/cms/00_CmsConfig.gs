/**
 * ==============================================================================
 * MODULE 00: CẤU HÌNH CMS CONTENT MASTER (CMS CONFIGURATION)
 * ==============================================================================
 * Quản lý tập trung các khóa bí mật, URL webhook làm mới website và khóa ghi lock.
 * Áp dụng tiêu chuẩn bảo mật Google Enterprise: Sử dụng PropertiesService (Script Properties).
 * ==============================================================================
 */

function getScriptProperty(key, fallbackValue) {
  try {
    var prop = PropertiesService.getScriptProperties().getProperty(key);
    if (prop && prop.trim()) {
      return prop.trim();
    }
  } catch (e) {}

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

function getSharedSecret() {
  return getScriptProperty("SHARED_SECRET", "");
}

var CONFIG = {
  get SHARED_SECRET() {
    return getSharedSecret();
  },

  get WEB_DEPLOY_URL() {
    var url = getScriptProperty("WEB_DEPLOY_URL", "");
    if (!url || url.indexOf("datawithly.edu.vn") !== -1) {
      return "https://ed-tech-mu-umber.vercel.app";
    }
    return url;
  },

  get REVALIDATION_SECRET() {
    return getScriptProperty("REVALIDATION_SECRET", "");
  },

  get REVALIDATION_PROD_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_PROD_URL", "");
    if (explicitUrl && explicitUrl.indexOf("datawithly.edu.vn") === -1) {
      return explicitUrl;
    }

    var deployUrl = this.WEB_DEPLOY_URL;
    if (deployUrl) {
      var base = deployUrl.replace(/\/+$/, "");
      var secret = this.REVALIDATION_SECRET;
      return base + "/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
    }
    return "https://ed-tech-mu-umber.vercel.app/api/revalidate";
  },

  get REVALIDATION_LOCAL_URL() {
    var explicitUrl = getScriptProperty("REVALIDATION_LOCAL_URL", "");
    if (explicitUrl) return explicitUrl;

    var secret = this.REVALIDATION_SECRET;
    return "http://localhost:3000/api/revalidate" + (secret ? ("?secret=" + encodeURIComponent(secret)) : "");
  },

  get ACTIVE_REVALIDATION_ENV() {
    return getScriptProperty("ACTIVE_REVALIDATION_ENV", "PROD");
  },

  get REVALIDATION_URL() {
    return this.REVALIDATION_PROD_URL;
  },

  LOCK_TIMEOUT_MS: 10000
};

var COURSE_KINDS_LIST = [
  "Khóa học nổi bật",
  "Khóa học mới",
  "Khóa học nền tảng",
  "Khóa học chuyên sâu",
  "Combo"
];
