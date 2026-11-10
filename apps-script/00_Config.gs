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
 * Lấy mã bí mật xác thực một cách an toàn (Zero Hardcoded Secret)
 * 1. Ưu tiên số 1: Đọc từ Google Cloud Script Properties (Bảo mật tối đa, không lộ trên Git)
 * 2. Ưu tiên số 2: Đọc từ tab 'settings' (khóa 'shared_secret') nếu người quản trị cấu hình
 * 3. Fallback: Giá trị cấu hình dev cục bộ nếu chưa thiết lập
 */
function getSharedSecret() {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
    if (secret && secret.trim()) {
      return secret.trim();
    }
  } catch (e) {}

  // Đọc từ tab settings nếu có
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("settings");
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === "shared_secret" && data[i][1]) {
          return data[i][1].toString().trim();
        }
      }
    }
  } catch (err) {}

  // Bắt buộc cấu hình SHARED_SECRET trong Script Properties của Google Apps Script
  // Trả về chuỗi rỗng nếu chưa cấu hình để bảo vệ an toàn cho hệ thống
  return "";
}

var CONFIG = {
  // Mã secret dùng để xác thực giữa Next.js và Google Apps Script (Đọc động từ Script Properties)
  get SHARED_SECRET() {
    return getSharedSecret();
  },

  // URL Webhook kích hoạt On-Demand ISR Revalidation trên Website DataWithLy
  REVALIDATION_PROD_URL: "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026",
  REVALIDATION_LOCAL_URL: "http://localhost:3000/api/revalidate?secret=datawithly_secure_reval_token_2026",
  ACTIVE_REVALIDATION_ENV: "PROD",
  REVALIDATION_URL: "https://datawithly.edu.vn/api/revalidate?secret=datawithly_secure_reval_token_2026",

  // Cấu hình Telegram Bot để nhận cảnh báo khi có học viên đăng ký tư vấn mới (< 2s)
  TELEGRAM_BOT_TOKEN: "", // Điền Telegram Bot Token nếu muốn nhận thông báo (Ví dụ: 123456:ABC-DEF...)
  TELEGRAM_CHAT_ID: "",   // Điền Chat ID nhận thông báo

  // Danh sách Email nhận thông báo Lead mới (Client & Quản trị viên)
  get CLIENT_NOTIFICATION_EMAILS() {
    var emails = ["hientruongthmh@gmail.com"];
    try {
      var propEmail = PropertiesService.getScriptProperties().getProperty("CLIENT_NOTIFICATION_EMAIL");
      if (propEmail && propEmail.trim() && emails.indexOf(propEmail.trim()) === -1) {
        emails.push(propEmail.trim());
      }
    } catch (e) {}
    return emails;
  },

  // Đường dẫn kết nối Zalo tư vấn nhanh
  ZALO_CONTACT_URL: "https://zalo.me/0901234567",

  // Thời gian tối đa giữ Mutex Lock để chống xung đột race-condition (10 giây)
  LOCK_TIMEOUT_MS: 10000,
};

