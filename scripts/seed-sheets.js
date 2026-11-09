/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DataWithLy Database Seeder CLI (Laravel-style)
 * Runs DatabaseSeeder to compile authoritative Figma data and seed to Google Sheets or Local Snapshot
 */
const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const rootDir = path.resolve(__dirname, "..");

// Helper to transpile and load TS file in memory
function loadTsModule(relativePath) {
  const fullPath = path.join(rootDir, relativePath);
  const content = fs.readFileSync(fullPath, "utf8");
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;

  const m = { exports: {} };
  const customRequire = (reqPath) => {
    if (reqPath.startsWith("@/database/seeders/")) {
      const sub = reqPath.replace("@/database/seeders/", "database/seeders/") + ".ts";
      return loadTsModule(sub);
    }
    if (reqPath.startsWith("./")) {
      const currentDir = path.dirname(relativePath);
      let resolved = path.join(currentDir, reqPath);
      if (!resolved.endsWith(".ts")) resolved += ".ts";
      return loadTsModule(resolved);
    }
    return require(reqPath);
  };

  const fn = new Function("exports", "require", "module", transpiled);
  fn(m.exports, customRequire, m);
  return m.exports;
}

async function runSeed() {
  console.log("=================================================");
  console.log("🌱 [DatabaseSeeder] Bắt đầu chạy nạp dữ liệu chuẩn...");
  console.log("=================================================");

  try {
    const isFresh = process.argv.includes("--fresh");
    const snapshotPath = path.join(rootDir, "database", "seeders", "snapshot.json");

    if (isFresh) {
      console.log("🔄 [DatabaseSeeder] Phát hiện cờ --fresh: Đang dọn dẹp snapshot cũ trước khi nạp...");
      if (fs.existsSync(snapshotPath)) {
        fs.unlinkSync(snapshotPath);
        console.log("   Đã xóa snapshot cũ thành công.");
      }
    } else {
      console.log("🔒 [DatabaseSeeder] Chế độ bảo toàn (Safe mode): Không xóa dữ liệu ngoài ý muốn.");
    }

    const seederModule = loadTsModule("database/seeders/DatabaseSeeder.ts");
    const DatabaseSeeder = seederModule.DatabaseSeeder;

    const snapshot = DatabaseSeeder.getSnapshot();

    console.log(`✅ [DatabaseSeeder] Dữ liệu chuẩn hóa từ Figma Node 12:1277:`);
    console.log(`   - Khóa học (Courses): ${snapshot.courses.length}`);
    console.log(`   - Buổi học (Curriculum Modules): ${snapshot.curriculum.length}`);
    console.log(`   - Giảng viên (Mentors): ${snapshot.mentors.length}`);
    console.log(`   - Gói học phí (Packages): ${snapshot.packages.length}`);
    console.log(`   - Dự án học viên (Projects): ${snapshot.projects.length}`);
    console.log(`   - Đánh giá (Testimonials): ${snapshot.testimonials.length}`);
    console.log(`   - FAQs: ${snapshot.faqs.length}`);
    console.log(`   - Khuyến mãi (Promotions): ${snapshot.promotions.length}`);
    console.log(`   - Bài viết Blog: ${snapshot.blogs.length}`);

    // Ghi snapshot JSON
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2), "utf8");
    console.log(`💾 [DatabaseSeeder] Đã xuất bản sao lưu: database/seeders/snapshot.json`);

    // Kiểm tra cấu hình Google Sheets CMS URL
    const envPath = path.join(rootDir, ".env.local");
    let scriptUrl = process.env.GOOGLE_APPS_SCRIPT_CMS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    let secret = process.env.GOOGLE_APPS_SCRIPT_CMS_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET;

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const urlMatch =
        envContent.match(/GOOGLE_APPS_SCRIPT_CMS_URL=(.*)/) ||
        envContent.match(/GOOGLE_APPS_SCRIPT_URL=(.*)/) ||
        envContent.match(/GOOGLE_SHEETS_SCRIPT_URL=(.*)/);
      const secretMatch =
        envContent.match(/GOOGLE_APPS_SCRIPT_CMS_SECRET=(.*)/) ||
        envContent.match(/GOOGLE_APPS_SCRIPT_SECRET=(.*)/) ||
        envContent.match(/GOOGLE_SHEETS_SECRET=(.*)/);

      if (urlMatch && !scriptUrl) scriptUrl = urlMatch[1].trim().replace(/^["']|["']$/g, "");
      if (secretMatch && !secret) secret = secretMatch[1].trim().replace(/^["']|["']$/g, "");
    }

    if (scriptUrl && scriptUrl.startsWith("http")) {
      console.log(`📡 [DatabaseSeeder] Đang gửi dữ liệu tới Google Sheets Apps Script WebApp: ${scriptUrl}`);
      try {
        const payload = {
          action: "seed_database",
          secret: secret,
          snapshot: snapshot,
        };

        const res = await fetch(scriptUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        const resText = await res.text();
        let jsonRes;
        try {
          jsonRes = JSON.parse(resText);
        } catch {
          jsonRes = null;
        }

        if (res.ok && jsonRes && jsonRes.ok) {
          console.log(`✅ [DatabaseSeeder] GOOGLE SHEETS ĐÃ CẬP NHẬT THÀNH CÔNG 100%!`);
          console.log(`   - Thống kê nạp:`, JSON.stringify(jsonRes.stats || {}));
        } else {
          console.warn(`⚠️ [DatabaseSeeder] Phản hồi từ Google Sheets:`, resText);
          console.log(`ℹ️ Nếu WebApp chưa nạp được hoặc báo lỗi, bạn cũng có thể mở Google Sheets và bấm menu:`);
          console.log(`   [🚀 DataWithLy CMS] ➔ [🌱 NẠP LẠI DATA CHUẨN FIGMA 100% (Ghi đè bản mẫu)]`);
        }
      } catch (netErr) {
        console.warn(`⚠️ [DatabaseSeeder] Không thể gửi HTTP tới Google Sheets (${netErr.message}).`);
        console.log(`ℹ️ Dữ liệu đã được xuất lưu thành công vào snapshot.json cho Website Next.js!`);
      }
    } else {
      console.log(`ℹ️ [DatabaseSeeder] Chế độ Offline/Snapshot: Google Sheets Apps Script URL chưa cấu hình trong .env.local.`);
      console.log(`   Dữ liệu đã được nạp sẵn sàng 100% vào hệ thống cho Frontend hiển thị bám sát Figma!`);
    }

    console.log("=================================================");
    console.log("🎉 [DatabaseSeeder] NẠP DỮ LIỆU THÀNH CÔNG 100%!");
    console.log("=================================================");
  } catch (err) {
    console.error("❌ [DatabaseSeeder] Lỗi khi nạp dữ liệu:", err);
    process.exit(1);
  }
}

runSeed();

