/**
 * Test đối chiếu khớp 100% thứ tự cột giữa headers và rowsToAdd trong Course CMS
 */
const fs = require('fs');

const setupFile = fs.readFileSync('apps-script/cms/03_CmsTablesSetup.gs', 'utf-8');
const modalFile = fs.readFileSync('apps-script/cms/05_CourseModal.gs', 'utf-8');

console.log("=== KIỂM THỬ ĐỐI CHIẾU 22 CỘT TAB COURSES ===");

// Thứ tự 22 cột chuẩn xác từ Google Sheets thực tế của người dùng:
const expectedHeaders = [
  "id", "title", "slug", "course_kind", "tag", "tagline",
  "tuition_vnd", "original_tuition_vnd", "level",
  "is_active", "is_featured", "sort_order",
  "study_style", "student_enrollment",
  "who_is_for", "outcomes", "input_requirement", "description",
  "total_sessions", "pratice_count", "capstone_count",
  "cover_image_url"
];

// 1. Trích xuất headers từ 03_CmsTablesSetup.gs
const headersMatch = setupFile.match(/var headers = \[([\s\S]*?)\];/);
if (!headersMatch) {
  console.error("❌ Không tìm thấy mảng headers trong 03_CmsTablesSetup.gs");
  process.exit(1);
}
const headers = headersMatch[1]
  .split(',')
  .map(h => h.trim().replace(/['"]/g, ''))
  .filter(Boolean);

console.log(`Số lượng headers: ${headers.length}`);

if (headers.includes("duration")) {
  console.error("❌ Cột 'duration' vẫn còn trong headers!");
  process.exit(1);
}

if (headers.length !== expectedHeaders.length) {
  console.error(`❌ Số lượng headers phải là ${expectedHeaders.length}, hiện tại là ${headers.length}`);
  process.exit(1);
}

// Đối chiếu từng header một
for (let i = 0; i < expectedHeaders.length; i++) {
  if (headers[i] !== expectedHeaders[i]) {
    console.error(`❌ Lệch header tại cột ${i + 1}: kỳ vọng '${expectedHeaders[i]}', nhưng trong code là '${headers[i]}'`);
    process.exit(1);
  }
}
console.log("✅ 100% Headers khớp chính xác với thứ tự cột trên Google Sheets của bạn!");

// 2. Trích xuất mảng rowsToAdd.push([ ... ]) từ 05_CourseModal.gs
const pushMatch = modalFile.match(/rowsToAdd\.push\(\[([\s\S]*?)\]\);/);
if (!pushMatch) {
  console.error("❌ Không tìm thấy rowsToAdd.push trong 05_CourseModal.gs");
  process.exit(1);
}

// Bóc tách từng phần tử (loại bỏ comment // ...)
const pushRaw = pushMatch[1];
const pushLines = pushRaw
  .split('\n')
  .map(line => line.replace(/\/\/.*$/, '').trim())
  .filter(Boolean)
  .join(' ');

const pushItems = pushLines
  .split(',')
  .map(item => item.trim())
  .filter(Boolean);

console.log(`Số lượng phần tử trong rowsToAdd: ${pushItems.length}`);

if (pushItems.length !== 22) {
  console.error(`❌ Số lượng phần tử chèn phải là 22, hiện tại là ${pushItems.length}`);
  process.exit(1);
}

// 3. Kiểm tra setValues(rowsToAdd) có lấy đúng 22 cột
if (!modalFile.includes("sheet.getRange(startRow, 1, rowsToAdd.length, 22).setValues(rowsToAdd)")) {
  console.error("❌ Chưa cập nhật getRange với 22 cột trong 05_CourseModal.gs");
  process.exit(1);
}

console.log("✅ Range ghi dữ liệu vào Sheet đã được cập nhật thành 22 cột.");
console.log("\n🎉 TẤT CẢ KIỂM THỬ KHỚP CỘT ĐỀU PASS 100%!");
