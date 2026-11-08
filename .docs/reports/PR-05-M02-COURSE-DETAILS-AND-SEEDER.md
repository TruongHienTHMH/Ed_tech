# Báo Cáo Kỹ Thuật (Pull Request) #05: Chi Tiết Khóa Học (Figma 12:1277) & Hệ Thống Database Seeder Chuẩn Laravel

- **Mã báo cáo:** `PR-05-M02-COURSE-DETAILS-AND-SEEDER`
- **Tên nhánh đề xuất:** `feature/m02-course-details-and-seeder`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này hoàn thiện 2 trọng tâm quan trọng của dự án:
1. **Trang Chi Tiết Khóa Học (`/courses/[slug]`):** Căn chỉnh khớp 100% bản vẽ Figma Node `12:1277` với bố cục 2 cột tiêu chuẩn (Cột trái 792px nội dung chi tiết & Cột phải 384px Sticky Sidebar chứa học phí và nút Đăng ký nổi bật).
2. **Hệ Thống Database Seeder (Phong cách Laravel):** Loại bỏ hoàn toàn hơn 1,000 dòng dữ liệu mẫu viết cứng rải rác trong code. Thay thế bằng kiến trúc hướng đối tượng độc lập (`database/seeders/`) và lệnh CLI `npm run db:seed` giúp nạp dữ liệu chuẩn xác vào Google Sheets và lưu bản sao lưu an toàn `snapshot.json`.

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** `M02` (Course Details), `M05` (Content Management).
- **Quy tắc nghiệp vụ tuân thủ:**
  * **BR-05:** Cấu trúc khóa học đồng bộ 100% với danh mục thực tế (Khóa SQL 12 buổi, Khóa Tư duy & Dashboard 15 buổi, Combo trọn gói 27 buổi).
  * **BR-06:** Cơ chế ánh xạ bí danh (Slug Alias Mapping): Cho phép học viên truy cập qua các đường dẫn thân thiện SEO cũ như `/courses/analytical-thinking-dashboard-design` vẫn tự động trỏ đến đúng khóa học.
  * **BR-07:** Tự động tích hợp hợp nhất đề cương cho khóa Combo End-to-End từ 2 khóa thành phần.
- **Tiêu chuẩn thiết kế:** Bố cục 2 cột chuẩn Figma Node `12:1277` (1200px max width).

---

## 3. Danh mục các thay đổi (Changes Made)
- [x] **Giao diện người dùng (Frontend changes):**
  * Tái cấu trúc trang [`app/courses/[slug]/page.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/app/courses/[slug]/page.tsx) thành bố cục 2 cột:
    - **Cột trái (792px):**
      * `CourseFigmaOverview.tsx`: Mô tả khóa học, "Khóa học này dành cho ai?", "Sau khóa học bạn có thể làm được gì?", và ghi chú không yêu cầu đầu vào.
      * `CourseFigmaHighlights.tsx`: 3 thẻ nổi bật bo góc với biểu tượng đặc trưng.
      * `CourseFigmaWeekAccordion.tsx`: Đề cương phân nhóm theo Tuần (Week 1 đến Week 6) có huy hiệu ngày tháng vuông (`TH10 03`, `TH10 26`), nút [Expand all lessons] và tag đánh dấu bài thực hành, đồ án.
      * `CourseFigmaInstructor.tsx`: Hồ sơ Mentor Hứa Thảo Ly với ảnh đại diện 180x180, cựu công ty MoMo/Tiki/ACB, nút liên hệ tư vấn và các liên kết mạng xã hội.
      * `CourseMethodologyFlow.tsx` & `CourseOutcomes.tsx`: Sơ đồ 5 bước tư duy và dự án học viên.
      * `CourseFaq.tsx`: Câu hỏi thường gặp theo từng khóa học.
    - **Cột phải Sticky (384px):**
      * `CourseFigmaStickySidebar.tsx`: Thẻ học phí dính nổi theo độ cuộn màn hình, hiển thị giá ưu đãi, sao đánh giá ⭐ 4.8 (143), ảnh đại diện, nút lớn gradient `[Đăng kí ngay]`, lịch khai giảng 26/10/2026, các quyền lợi khóa học bao gồm và hình thức Zoom Meeting.
  * Hỗ trợ đầy đủ trang tải [`loading.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/app/courses/[slug]/loading.tsx) và trang báo lỗi [`not-found.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/app/courses/[slug]/not-found.tsx).
- [x] **Xử lý logic & Seeder (Backend & Database changes):**
  * Xây dựng module `database/seeders/`:
    - `CourseSeeder.ts`, `CurriculumSeeder.ts`, `MentorSeeder.ts`, `PackageSeeder.ts`, `ProjectSeeder.ts`, `TestimonialSeeder.ts`, `FaqSeeder.ts`, `PromotionSeeder.ts`, `SettingSeeder.ts`.
    - `DatabaseSeeder.ts`: Điều phối tập trung, tương tự `DatabaseSeeder.php` trong Laravel.
  * Tệp lệnh CLI `scripts/seed-sheets.js` gắn vào lệnh `npm run db:seed`.
  * Thu gọn `data/seed-data.ts` từ hơn 1,000 dòng xuống còn 25 dòng làm cầu nối tương thích ngược.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)
- [x] **Kiểm thử Database Seeder (`npm run db:seed`):**
  * Chạy thành công 100%, nạp sạch sẽ 3 khóa học, 18 buổi học, 1 giảng viên, 3 gói học phí, 3 dự án, 3 đánh giá, 4 FAQs, 2 ưu đãi và xuất file `database/seeders/snapshot.json`.
- [x] **Kiểm thử biên dịch tĩnh (SSG):**
  * Pre-render thành công 4 đường dẫn khóa học:
    - `/courses/sql-for-data-analytics`
    - `/courses/data-analytical-thinking`
    - `/courses/analytical-thinking-dashboard-design`
    - `/courses/end-to-end-analytics`
- [x] **Kiểm thử kiểu dữ liệu:** `npx tsc --noEmit` đạt 0 lỗi.

---

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- **Figma Node đối chiếu:** `12:1277` (Course detail - Default, width: 1920, container 1200px).
- **So sánh trực quan:**
  * Cột trái rộng đúng 792px, chứa đầy đủ các huy hiệu ngày tháng hình vuông (`TH10 03`) và thông tin cựu công ty MoMo/Tiki/ACB của Chị Ly.
  * Cột phải rộng đúng 384px dính tự nhiên khi cuộn trang, nổi bật với giá `5.699.000 VND` và nút gradient cam kết.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Giờ đây toàn bộ nội dung khóa học và lịch học đã được chuẩn hóa. Bất cứ khi nào chị muốn cập nhật lại toàn bộ dữ liệu mẫu ban đầu, chị chỉ cần chạy một lệnh `npm run db:seed` là mọi dữ liệu sẽ được thiết lập ngay ngắn và lưu thành bản sao lưu an toàn.

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Nhánh tuân thủ quy chuẩn `feature/m02-course-details-and-seeder`.
- [x] Đã xóa bỏ triệt để hardcoded seed data rác trong mã nguồn frontend.
- [x] Bố cục 2 cột khớp 100% bản vẽ Figma Node `12:1277`.
- [x] Sẵn sàng để hợp nhất vào nhánh chính.
