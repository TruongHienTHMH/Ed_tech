#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DataWithLy - Google Sheets CMS Diagnostic & Latency CLI
 * Chẩn đoán kết nối 5 bước với Apps Script và đo lường thời gian phản hồi thực tế.
 */

const fs = require("fs");
const path = require("path");

// 1. Đọc biến môi trường từ .env.local hoặc .env
function loadEnv() {
  const rootDir = path.resolve(__dirname, "..");
  const envLocalPath = path.join(rootDir, ".env.local");
  const envPath = path.join(rootDir, ".env");
  const targetFile = fs.existsSync(envLocalPath) ? envLocalPath : (fs.existsSync(envPath) ? envPath : null);

  const env = { ...process.env };
  if (targetFile) {
    const content = fs.readFileSync(targetFile, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        env[key] = val;
      }
    });
  }
  return { env, sourceFile: targetFile };
}

async function runDiagnostic() {
  console.log("\n=======================================================");
  console.log("🔍 DATAWITHLY CMS - KIỂM TRA KẾT NỐI GOOGLE APPS SCRIPT");
  console.log("=======================================================\n");

  const { env, sourceFile } = loadEnv();
  console.log(`📁 File cấu hình: ${sourceFile ? path.basename(sourceFile) : "Không tìm thấy file .env.local"}`);

  const appsScriptUrl = env.GOOGLE_APPS_SCRIPT_CMS_URL || env.GOOGLE_APPS_SCRIPT_URL;
  const secret = env.GOOGLE_APPS_SCRIPT_CMS_SECRET || env.GOOGLE_APPS_SCRIPT_SECRET;

  // Bước 1: Kiểm tra cấu hình biến môi trường
  console.log("\n[1/4] ⚙️ Kiểm tra biến môi trường:");
  if (appsScriptUrl) {
    console.log(`  ✅ GOOGLE_APPS_SCRIPT_CMS_URL: ${appsScriptUrl.substring(0, 55)}...`);
  } else {
    console.log("  ❌ GOOGLE_APPS_SCRIPT_CMS_URL: CHƯA CẤU HÌNH!");
  }

  if (secret) {
    console.log(`  ✅ GOOGLE_APPS_SCRIPT_CMS_SECRET: ${secret.substring(0, 8)}******** (Đã cài đặt)`);
  } else {
    console.log("  ❌ GOOGLE_APPS_SCRIPT_CMS_SECRET: CHƯA CẤU HÌNH!");
  }

  if (!appsScriptUrl) {
    console.log("\n❌ Dừng kiểm tra vì thiếu URL. Vui lòng cập nhật .env.local.\n");
    process.exit(1);
  }

  // Bước 2: Test Ping (Đo latency mạng)
  console.log("\n[2/4] 📡 Test Ping (Đo độ trễ mạng thuần túy):");
  const pingStart = Date.now();
  try {
    const pingRes = await fetch(`${appsScriptUrl}?action=ping`, { redirect: "follow" });
    const pingLatency = Date.now() - pingStart;
    const pingJson = await pingRes.json();
    if (pingRes.ok && pingJson.ok) {
      console.log(`  ✅ Ping thành công (${pingLatency}ms) - Trạng thái: ${pingJson.status || "healthy"}`);
    } else {
      console.log(`  ⚠️ Ping trả về mã HTTP ${pingRes.status}:`, pingJson);
    }
  } catch (err) {
    const pingLatency = Date.now() - pingStart;
    console.log(`  ❌ Ping thất bại sau ${pingLatency}ms: ${err.message}`);
    if (err.cause) {
      console.log(`     Chi tiết mã lỗi: ${err.cause.code || err.cause}`);
    }
    if (pingLatency >= 10000) {
      console.log("     👉 Gợi ý: Google Apps Script đang Cold Start hoặc URL Web App bị chặn quyền (Cần quyền Anyone).");
    }
  }

  // Bước 3: Test Auth Handshake
  console.log("\n[3/4] 🔐 Test Xác thực Bảo mật (Auth Handshake):");
  const authStart = Date.now();
  try {
    const authUrl = `${appsScriptUrl}?action=ping&secret=${encodeURIComponent(secret || "")}`;
    const authRes = await fetch(authUrl, { redirect: "follow" });
    const authLatency = Date.now() - authStart;
    const authJson = await authRes.json();

    if (authJson.ok) {
      console.log(`  ✅ Secret xác thực chính xác (${authLatency}ms)`);
    } else if (authJson.error?.code === "UNAUTHORIZED") {
      console.log(`  ❌ Sai mã Secret: ${authJson.error?.message}`);
      console.log("     👉 Gợi ý: Hãy kiểm tra SHARED_SECRET trong Script Properties của Google Apps Script có khớp với GOOGLE_APPS_SCRIPT_CMS_SECRET không.");
    } else {
      console.log(`  ⚠️ Phản hồi khác:`, authJson);
    }
  } catch (err) {
    console.log(`  ❌ Lỗi xác thực: ${err.message}`);
  }

  // Bước 4: Test Tải Toàn Bộ Dữ Liệu (Get All Tabs)
  console.log("\n[4/4] 📊 Test Tải Toàn Bộ Dữ Liệu (action=get_all):");
  const dataStart = Date.now();
  try {
    const dataUrl = `${appsScriptUrl}?action=get_all&secret=${encodeURIComponent(secret || "")}`;
    const dataRes = await fetch(dataUrl, { redirect: "follow" });
    const dataLatency = Date.now() - dataStart;
    const dataJson = await dataRes.json();

    if (dataJson.ok && dataJson.tabs) {
      const tabs = dataJson.tabs;
      const fromCache = dataJson.fromCache ? " (⚡ Lấy từ CacheService)" : " (Đọc trực tiếp từ Sheet)";
      console.log(`  ✅ Tải dữ liệu thành công (${dataLatency}ms)${fromCache}`);
      console.log("\n  📋 Thống kê số lượng bản ghi:");
      console.log(`     - Khóa học (courses):          ${(tabs.courses || []).length} mục`);
      console.log(`     - Gói học phí (packages):       ${(tabs.packages_pricing || []).length} mục`);
      console.log(`     - Dự án học viên (projects):    ${(tabs.student_projects || []).length} mục`);
      console.log(`     - Đánh giá học viên:           ${(tabs.testimonials || []).length} mục`);
      console.log(`     - Bài viết Blog:               ${(tabs.blog_posts || []).length} mục`);
      console.log(`     - Lộ trình (curriculum):       ${(tabs.curriculum || []).length} buổi`);
      console.log(`     - Mentor profiles:             ${(tabs.mentor_profiles || []).length} người`);
      console.log(`     - Câu hỏi FAQ:                 ${(tabs.faqs || []).length} câu`);
    } else {
      console.log(`  ❌ Không tải được dữ liệu:`, dataJson.error || dataJson);
    }
  } catch (err) {
    const dataLatency = Date.now() - dataStart;
    console.log(`  ❌ Lỗi tải dữ liệu sau ${dataLatency}ms: ${err.message}`);
    if (err.cause) {
      console.log(`     Chi tiết mã lỗi: ${err.cause.code || err.cause}`);
    }
  }

  console.log("\n=======================================================");
  console.log("🏁 Hoàn tất chẩn đoán.");
  console.log("Bạn cũng có thể xem báo cáo JSON trực tiếp trên trình duyệt tại:");
  console.log("👉 http://localhost:3000/api/cms/debug");
  console.log("=======================================================\n");
}

runDiagnostic();
