/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * ==============================================================================
 * CLASP DEPLOYMENT MANAGER (MULTI-TARGET GOOGLE SHEETS PUSHER)
 * ==============================================================================
 * Cho phép điều phối việc push mã nguồn Apps Script và HTML lên 2 Sheets đích:
 * 1. Sheet 1: CMS Content Master (Sử dụng cấu hình .clasp.content.json)
 * 2. Sheet 2: Private Leads & CRM (Sử dụng cấu hình .clasp.leads.json)
 * ==============================================================================
 * Cách dùng:
 * - node scripts/push-gas.js content   (hoặc npm run push:content)
 * - node scripts/push-gas.js leads     (hoặc npm run push:leads)
 * - node scripts/push-gas.js all       (hoặc npm run push:all)
 * ==============================================================================
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const claspRoot = path.join(rootDir, ".clasp.json");
const contentClasp = path.join(rootDir, ".clasp.content.json");
const leadsClasp = path.join(rootDir, ".clasp.leads.json");

const target = (process.argv[2] || "").toLowerCase().trim();

if (!["content", "cms", "leads", "all"].includes(target)) {
  console.log(`
==============================================================================
⚠️ HƯỚNG DẪN SỬ DỤNG BỘ ĐIỀU PHỐI PUSH APPS SCRIPT
==============================================================================
Vui lòng chỉ định đích cần Push:
  1. npm run push:cms (hoặc npm run push:content) -> Push code lên Spreadsheet 1 (CMS Content Master)
  2. npm run push:leads                           -> Push code lên Spreadsheet 2 (Private Leads & CRM)
  3. npm run push:all                             -> Push code tuần tự lên cả 2 Spreadsheets
==============================================================================
`);
  process.exit(1);
}

function pushTarget(targetName, configFile) {
  console.log(`\n------------------------------------------------------------------------------`);
  console.log(`🚀 [CLASP] Đang chuẩn bị Push lên: ${targetName.toUpperCase()}`);
  console.log(`------------------------------------------------------------------------------`);

  if (!fs.existsSync(configFile)) {
    console.error(`❌ LỖI: Không tìm thấy file cấu hình: ${path.basename(configFile)}`);
    console.error(`👉 Hãy tạo file ${path.basename(configFile)} với cấu trúc:\n`);
    console.error(`{\n  "scriptId": "YOUR_APPS_SCRIPT_ID_FOR_${targetName.toUpperCase()}",\n  "rootDir": "apps-script"\n}\n`);
    return false;
  }

  try {
    const configData = JSON.parse(fs.readFileSync(configFile, "utf8"));
    if (!configData.scriptId || configData.scriptId.includes("YOUR_")) {
      console.error(`⚠️ CẢNH BÁO: Script ID trong ${path.basename(configFile)} chưa được thiết lập.`);
      console.error(`👉 Hãy mở file ${path.basename(configFile)} và dán Script ID thực tế của bạn vào.`);
      return false;
    }

    // 1. Đồng bộ file cấu hình đích sang .clasp.json
    fs.copyFileSync(configFile, claspRoot);
    console.log(`✅ Đã kích hoạt cấu hình: ${path.basename(configFile)} -> .clasp.json`);
    console.log(`🎯 Script ID đích: ${configData.scriptId}`);

    // 2. Chạy bundle trước khi push để đảm bảo dist/Code.bundle.gs luôn mới nhất
    console.log(`📦 Đang tự động đóng gói bundle: npm run bundle:gas...`);
    execSync("npm run bundle:gas", { cwd: rootDir, stdio: "inherit" });

    // 3. Thực thi lệnh clasp push
    console.log(`☁️ Đang đẩy file .gs và .html lên Google Apps Script...`);
    try {
      execSync("npx @google/clasp push --force", { cwd: rootDir, stdio: "inherit" });
      console.log(`🎉 PUSH THÀNH CÔNG LÊN ${targetName.toUpperCase()}!`);
      return true;
    } catch (pushErr) {
      console.error(`❌ Lỗi khi thực thi clasp push:`, pushErr.message);
      console.log(`💡 Lưu ý: Nếu bạn chưa đăng nhập Google Clasp, hãy chạy: npx @google/clasp login`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Lỗi xử lý file cấu hình:`, err.message);
    return false;
  }
}

if (target === "content" || target === "cms") {
  const ok = pushTarget("CMS Content Master", contentClasp);
  process.exit(ok ? 0 : 1);
} else if (target === "leads") {
  const ok = pushTarget("Private Leads & CRM", leadsClasp);
  process.exit(ok ? 0 : 1);
} else if (target === "all") {
  console.log(`\n==============================================================================`);
  console.log(`🌐 BẮT ĐẦU PUSH TUẦN TỰ LÊN CẢ 2 GOOGLE SPREADSHEETS`);
  console.log(`==============================================================================`);
  const okContent = pushTarget("CMS Content Master", contentClasp);
  const okLeads = pushTarget("Private Leads & CRM", leadsClasp);

  if (okContent && okLeads) {
    console.log(`\n🎉 TẤT CẢ 2 SPREADSHEETS ĐÃ ĐƯỢC PUSH CODE ĐỒNG BỘ 100%!`);
    process.exit(0);
  } else {
    console.error(`\n⚠️ Có ít nhất 1 đích push chưa hoàn tất.`);
    process.exit(1);
  }
}
