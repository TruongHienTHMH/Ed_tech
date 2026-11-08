/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DataWithLy Apps Script Bundler
 * Node.js build tool: Đóng gói toàn bộ các file .gs và .html thành một file duy nhất: dist/Code.bundle.gs
 */
const fs = require("fs");
const path = require("path");

const appsScriptDir = path.join(__dirname, "..", "apps-script");
const distDir = path.join(appsScriptDir, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
const outputFile = path.join(distDir, "Code.bundle.gs");

// 1. Quét toàn bộ file .html và đưa vào object INLINED_HTML
const htmlFiles = fs.readdirSync(appsScriptDir)
  .filter((f) => f.endsWith(".html"))
  .sort();

const inlinedHtmlMap = {};
htmlFiles.forEach((file) => {
  const templateName = path.basename(file, ".html");
  const content = fs.readFileSync(path.join(appsScriptDir, file), "utf8");
  inlinedHtmlMap[templateName] = content;
});

// 2. Quét các file .gs theo thứ tự số (bỏ qua Code.gs)
const gsFiles = fs.readdirSync(appsScriptDir)
  .filter((f) => f.endsWith(".gs") && f !== "Code.gs")
  .sort((a, b) => {
    const numA = parseInt(a.split("_")[0], 10);
    const numB = parseInt(b.split("_")[0], 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

console.log(`📦 Đang đóng gói ${gsFiles.length} file .gs và ${htmlFiles.length} file .html...`);

// 3. Tạo phần Header và INLINED_HTML
let bundleContent = `/**
 * ==============================================================================
 * DATAWITHLY CMS - HỆ THỐNG GOOGLE APPS SCRIPT TRỌN GÓI (ALL-IN-ONE BUNDLE)
 * ==============================================================================
 * Phiên bản: 2.1.0 (DataWithLy Enterprise CMS)
 * Thời gian đóng gói: ${new Date().toISOString()}
 * Tự động tạo bởi: scripts/bundle-apps-script.js
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Mở Google Sheets -> Tiện ích mở rộng -> Apps Script.
 * 2. Dán toàn bộ nội dung file Code.gs này vào trình soạn thảo.
 * 3. File đã được inlined toàn bộ giao diện HTML Modals (chạy 100% không cần tạo file .html phụ).
 * 4. Bấm Lưu và chạy hàm onOpen() hoặc tải lại trang Google Sheets!
 * ==============================================================================
 */

// BẢN INLINED GIAO DIỆN HTML CHO TẤT CẢ CÁC MODALS (HỖ TRỢ CHẠY 1 FILE DUY NHẤT)
var INLINED_HTML = ${JSON.stringify(inlinedHtmlMap, null, 2)};

/**
 * Hàm nhúng giao diện HTML (Ví dụ: nhúng SharedStyles vào các Modal)
 * Tự động đọc từ object INLINED_HTML hoặc fallback từ file.
 */
function include(filename) {
  if (typeof INLINED_HTML !== "undefined" && INLINED_HTML[filename]) {
    return INLINED_HTML[filename];
  }
  try {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (e) {
    return "";
  }
}

/**
 * Nạp template HTML cho các cửa sổ Modal Dialog từ INLINED_HTML
 * Chạy độc lập 100% trong môi trường 1 file bundle duy nhất.
 */
function createModalTemplate(templateName) {
  if (typeof INLINED_HTML !== "undefined" && INLINED_HTML[templateName]) {
    return HtmlService.createTemplate(INLINED_HTML[templateName]);
  }
  return HtmlService.createTemplateFromFile(templateName);
}

/**
 * Lấy thông tin phiên bản DataWithLy CMS Bundle Engine
 */
function getDataWithLySystemInfo() {
  return {
    system: "DataWithLy CMS All-in-One Engine",
    brand: "DataWithLy (Mentor Hứa Thảo Ly)",
    version: "2.1.0",
    architecture: "Standalone Single-File Bundle with 10 Inlined Native Modals",
    status: "HEALTHY",
    timestamp: new Date().toISOString()
  };
}

`;

// 4. Ghép nội dung từng file .gs
gsFiles.forEach((file) => {
  const filePath = path.join(appsScriptDir, file);
  const code = fs.readFileSync(filePath, "utf8");
  bundleContent += `\n// ==============================================================================\n`;
  bundleContent += `// FILE NGUỒN: ${file}\n`;
  bundleContent += `// ==============================================================================\n\n`;
  bundleContent += code + "\n";
});

// 5. Ghi ra file Code.bundle.gs
fs.writeFileSync(outputFile, bundleContent, "utf8");
const totalLines = bundleContent.split("\n").length;
const sizeKb = (Buffer.byteLength(bundleContent, "utf8") / 1024).toFixed(1);

console.log(`🎉 Đóng gói thành công file Code.bundle.gs:`);
console.log(`   - Tổng số file .gs: ${gsFiles.length}`);
console.log(`   - Tổng số file .html: ${htmlFiles.length}`);
console.log(`   - Dung lượng: ${sizeKb} KB`);
console.log(`   - Số dòng: ${totalLines} dòng`);
console.log(`   - Đường dẫn: ${outputFile}`);

