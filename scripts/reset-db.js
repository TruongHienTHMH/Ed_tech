/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * DataWithLy Database Reset CLI (Laravel-style)
 * Cleans up existing snapshot cache and resets database state to clean slate.
 */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const snapshotPath = path.join(rootDir, "database", "seeders", "snapshot.json");

console.log("=================================================");
console.log("🧹 [DatabaseReset] Đang tiến hành làm sạch môi trường cơ sở dữ liệu...");
console.log("=================================================");

try {
  if (fs.existsSync(snapshotPath)) {
    fs.unlinkSync(snapshotPath);
    console.log("🗑️  [DatabaseReset] Đã xóa snapshot cũ: database/seeders/snapshot.json");
  } else {
    console.log("ℹ️  [DatabaseReset] Không có snapshot cũ cần xóa.");
  }

  console.log("✨ [DatabaseReset] Môi trường database đã được reset về trạng thái sạch (Clean State)!");
  console.log("👉 Bạn có thể chạy 'npm run db:seed' để nạp lại dữ liệu chuẩn từ Figma.");
  console.log("=================================================");
} catch (err) {
  console.error("❌ [DatabaseReset] Lỗi khi reset database:", err.message);
  process.exit(1);
}
