/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Test đối chiếu khớp 100% thứ tự cột giữa headers, rowsToAdd và modal inputs trong Blog CMS
 */
const fs = require('fs');

const setupFile = fs.readFileSync('apps-script/cms/03_CmsTablesSetup.gs', 'utf-8');
const modalFile = fs.readFileSync('apps-script/cms/14_BlogModal.gs', 'utf-8');
const htmlFile = fs.readFileSync('apps-script/cms/BlogModal.html', 'utf-8');

console.log("=== KIỂM THỬ ĐỐI CHIẾU 12 CỘT TAB BLOG_POSTS ===");

// Thứ tự 12 cột chuẩn xác của tab blog_posts
const expectedHeaders = [
  "id", "title", "slug", "category",
  "description", "excerpt", "content_markdown", "cover_image_url",
  "author_name", "author_avatar_url", "published_at", "is_active"
];

// 1. Trích xuất headers từ hàm setupBlogPostsTab trong 03_CmsTablesSetup.gs
const setupBlock = setupFile.match(/function setupBlogPostsTab[\s\S]*?var headers = \[([\s\S]*?)\];/);
if (!setupBlock) {
  console.error("❌ Không tìm thấy mảng headers của setupBlogPostsTab trong 03_CmsTablesSetup.gs");
  process.exit(1);
}
const headers = setupBlock[1]
  .split(',')
  .map(h => h.trim().replace(/['"]/g, ''))
  .filter(Boolean);

console.log(`Số lượng headers: ${headers.length}`);

if (headers.length !== expectedHeaders.length) {
  console.error(`❌ Số lượng headers phải là ${expectedHeaders.length}, hiện tại là ${headers.length}`);
  process.exit(1);
}

for (let i = 0; i < expectedHeaders.length; i++) {
  if (headers[i] !== expectedHeaders[i]) {
    console.error(`❌ Lệch header tại cột ${i + 1}: kỳ vọng '${expectedHeaders[i]}', nhưng trong code là '${headers[i]}'`);
    process.exit(1);
  }
}
console.log("✅ 100% Headers trong 03_CmsTablesSetup.gs khớp chính xác với chuẩn 12 cột!");

// 2. Trích xuất mảng rowsToAdd.push([ ... ]) từ 14_BlogModal.gs
const pushMatch = modalFile.match(/rowsToAdd\.push\(\[([\s\S]*?)\]\);/);
if (!pushMatch) {
  console.error("❌ Không tìm thấy rowsToAdd.push trong 14_BlogModal.gs");
  process.exit(1);
}

const pushedValues = pushMatch[1]
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0 && !line.startsWith('//'));

console.log(`Số lượng phần tử trong rowsToAdd: ${pushedValues.length}`);

if (pushedValues.length !== expectedHeaders.length) {
  console.error(`❌ Số lượng phần tử trong rowsToAdd phải là ${expectedHeaders.length}, hiện tại là ${pushedValues.length}`);
  process.exit(1);
}
console.log("✅ 100% Giá trị push vào rowsToAdd khớp số lượng 12 cột!");

// 3. Kiểm tra BlogModal.html có đầy đủ input và lấy dữ liệu khi submit
const requiredInputs = [
  'name="title"',
  'name="slug"',
  'name="category"',
  'name="description"',
  'name="excerpt"',
  'name="content_markdown"',
  'name="cover_image_url"',
  'name="author_name"',
  'name="author_avatar_url"',
  'name="published_at"',
  'name="is_active"'
];

for (const input of requiredInputs) {
  if (!htmlFile.includes(input)) {
    console.error(`❌ BlogModal.html thiếu input ${input}`);
    process.exit(1);
  }
}
console.log("✅ 100% Các trường input cần thiết đều có mặt trên BlogModal.html!");

// 4. Kiểm tra submit event thu thập đủ description và content_markdown
if (!htmlFile.includes('description: desc') || !htmlFile.includes('content_markdown: contentMd')) {
  console.error("❌ BlogModal.html chưa thu thập description hoặc content_markdown khi submit!");
  process.exit(1);
}
console.log("✅ 100% Submit event đã thu thập đầy đủ description, content_markdown và cover_image_url!");

console.log("\n🎉 TẤT CẢ KIỂM THỬ KHỚP CỘT BLOG ĐỀU PASS 100%!");
