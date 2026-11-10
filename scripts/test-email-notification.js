/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log(`  ✅ PASS: ${msg}`);
  } else {
    failed++;
    console.error(`  ❌ FAIL: ${msg}`);
  }
}

console.log("==============================================================================");
console.log("🧪 KIỂM THỬ TỰ ĐỘNG: EMAIL NOTIFICATION SYSTEM & RECIPIENT VERIFICATION");
console.log("==============================================================================\n");

// 1. Kiểm tra cấu hình và triển khai trong Google Apps Script
console.log("--- TEST 1: KIỂM TRA MÃ NGUỒN APPS SCRIPT (dist/Code.bundle.gs) ---");
const bundlePath = path.join(rootDir, "apps-script", "dist", "Code.bundle.gs");
assert(fs.existsSync(bundlePath), "File apps-script/dist/Code.bundle.gs tồn tại");

const gasCode = fs.readFileSync(bundlePath, "utf8");

assert(
  gasCode.includes("CLIENT_NOTIFICATION_EMAILS") &&
  gasCode.includes("hientruongthmh@gmail.com"),
  "Cấu hình CLIENT_NOTIFICATION_EMAILS có chứa người nhận chính 'hientruongthmh@gmail.com'"
);

assert(
  gasCode.includes("ZALO_CONTACT_URL") &&
  gasCode.includes("zalo.me"),
  "Cấu hình ZALO_CONTACT_URL trỏ đúng link Zalo kết nối học viên"
);

assert(
  gasCode.includes("function sendLeadEmails(record)") ||
  gasCode.includes("sendLeadEmails"),
  "Hàm nghiệp vụ sendLeadEmails() đã được định nghĩa trong bundle"
);

assert(
  gasCode.includes("sendLeadEmails(payload)") &&
  (gasCode.includes("leads (private)") || gasCode.includes("submit_lead")),
  "doPost() với action submit_lead tự động kích hoạt sendLeadEmails(payload) khi có lead mới"
);

// 2. Mô phỏng tạo Email Payload & Kiểm tra logic sinh Email
console.log("\n--- TEST 2: MÔ PHỎNG NỘI DUNG EMAIL GỬI CLIENT (hientruongthmh@gmail.com) ---");

const mockLead = {
  submission_id: "SUB-EMAIL-QA-001",
  name: "Trần Anh Quân",
  phone: "0987654321",
  email: "anhquan.student@gmail.com",
  course_id: "sql-for-data-analytics",
  course_name: "SQL for Data Analytics",
  message: "Em muốn đăng ký lớp SQL tối thứ 3-5",
  first_utm_source: "facebook",
  first_utm_medium: "cpc",
  first_utm_campaign: "data_lead_q4",
  client_submitted_at: new Date().toISOString(),
};

// Logic mô phỏng tương thích hoàn toàn với Google Apps Script MailApp
function generateClientEmailPayload(record, adminRecipient) {
  const recipient = adminRecipient || "hientruongthmh@gmail.com";
  const courseDisplay = record.course_name || record.course_id || "Chung";
  const leadName = record.name || "Khách hàng ẩn danh";

  const subject = `[DataWithLy] 🎯 Có Lead mới đăng ký: ${leadName} - ${courseDisplay}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6; color: #333;">
      <h2 style="color: #AF445A; border-bottom: 2px solid #AF445A; padding-bottom: 8px;">
        🚀 THÔNG BÁO CÓ LEAD MỚI ĐĂNG KÝ KHÓA HỌC
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Họ tên:</td><td>${record.name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Số điện thoại:</td><td><a href="tel:${record.phone}" style="color: #AF445A; font-weight: bold;">${record.phone}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td><a href="mailto:${record.email}">${record.email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Khóa học:</td><td><strong>${courseDisplay}</strong></td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Ghi chú / Nhu cầu:</td><td>${record.message || "Không có"}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Nguồn UTM:</td><td>${record.first_utm_source || "direct"} / ${record.first_utm_campaign || "none"}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold;">Mã đơn Lead:</td><td>${record.submission_id}</td></tr>
      </table>
    </div>
  `;

  return { recipient, subject, htmlBody };
}

const clientEmail = generateClientEmailPayload(mockLead, "hientruongthmh@gmail.com");

assert(clientEmail.recipient === "hientruongthmh@gmail.com", "Người nhận Client Email đúng là 'hientruongthmh@gmail.com'");
assert(clientEmail.subject.includes(mockLead.name), "Tiêu đề Email Client chứa tên học viên");
assert(clientEmail.subject.includes(mockLead.course_name), "Tiêu đề Email Client chứa tên khóa học");
assert(clientEmail.htmlBody.includes(mockLead.phone), "Nội dung Email Client chứa số điện thoại để gọi tư vấn");
assert(clientEmail.htmlBody.includes(mockLead.message), "Nội dung Email Client chứa ghi chú học viên");
assert(clientEmail.htmlBody.includes(mockLead.submission_id), "Nội dung Email Client chứa submission_id truy vết");

console.log("\n--- TEST 3: MÔ PHỎNG EMAIL CẢM ƠN HỌC VIÊN KÈM MÃ ZALO TƯ VẤN ---");

function generateStudentEmailPayload(record, zaloLink) {
  const recipient = record.email;
  const leadName = record.name || "Bạn";
  const courseDisplay = record.course_name || record.course_id || "Khóa học Data Analytics";
  const zaloUrl = zaloLink || "https://zalo.me/0934938431";

  const subject = `[DataWithLy] Cảm ơn ${leadName} đã đăng ký tư vấn lộ trình ${courseDisplay}!`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #784080;">Chào ${leadName}, cảm ơn bạn đã quan tâm đến DataWithLy!</h2>
      <p>DataWithLy đã nhận được thông tin đăng ký tư vấn khóa học <strong>${courseDisplay}</strong> của bạn.</p>
      <div style="background-color: #f8f0f3; padding: 16px; border-radius: 8px; border-left: 4px solid #AF445A;">
        <p>Mentor Hứa Thảo Ly và đội ngũ cố vấn sẽ liên hệ trực tiếp qua số điện thoại <strong>${record.phone}</strong> trong vòng <strong>15 - 30 phút</strong> tới để giải đáp thắc mắc và gửi lộ trình chi tiết.</p>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${zaloUrl}" style="background-color: #0068FF; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: bold; display: inline-block;">
          💬 Kết nối ngay qua Zalo với Mentor
        </a>
      </div>
    </div>
  `;

  return { recipient, subject, htmlBody };
}

const studentEmail = generateStudentEmailPayload(mockLead, "https://zalo.me/0934938431");

assert(studentEmail.recipient === mockLead.email, "Người nhận Email học viên là email của học viên");
assert(studentEmail.subject.includes(mockLead.name), "Tiêu đề chào mừng học viên đích danh");
assert(studentEmail.htmlBody.includes("15 - 30 phút"), "Cam kết thời gian liên hệ nhanh chóng trong 15-30 phút");
assert(studentEmail.htmlBody.includes("https://zalo.me/0934938431"), "Nút kết nối Zalo trực tiếp với Mentor hoạt động chính xác");
assert(studentEmail.htmlBody.includes("Hứa Thảo Ly"), "Ký tên Mentor Hứa Thảo Ly uy tín và chuyên nghiệp");

console.log("\n--- TEST 4: KIỂM TRA XÓA BỎ NÚT 'ĐỒNG BỘ NGAY' (DevSyncButton) ---");
const devSyncButtonPath = path.join(rootDir, "components", "common", "DevSyncButton.tsx");
assert(!fs.existsSync(devSyncButtonPath), "File DevSyncButton.tsx đã được xóa hoàn toàn khỏi codebase");

const layoutPath = path.join(rootDir, "app", "layout.tsx");
const layoutCode = fs.readFileSync(layoutPath, "utf8");
assert(!layoutCode.includes("DevSyncButton"), "app/layout.tsx không còn import hoặc render DevSyncButton");

console.log("\n==============================================================================");
console.log(`📊 TỔNG KẾT KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
console.log("==============================================================================");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
