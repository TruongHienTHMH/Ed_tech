# Báo Cáo Kỹ Thuật (Pull Request) #09: Nâng Cấp Apps Script Sheets CMS Batch Form (+) (RF-02)

- **Mã báo cáo:** `PR-09-RF-02-APPS-SCRIPT-BATCH-FORMS`
- **Tên nhánh đề xuất:** `feature/rf-02-apps-script-batch-forms`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này hoàn thành trọn vẹn **Milestone RF-02** trong lộ trình refactor dự án **DataWithLy**:
- **Chuyển đổi luồng nhập liệu sang cơ chế Form lặp động (Repeater Form Card với nút `+`):** Thay thế nút "Lưu và tạo thêm" từng mục đơn lẻ bằng nút **`+ Thêm mục`** trên cùng một màn hình Modal, cho phép người dùng nhập đồng thời nhiều bản ghi (Form 1, Form 2, Form 3...) và chỉ cần bấm 1 nút **`Lưu tất cả (X mục)`** để hệ thống tự động ghi hàng loạt (Batch Insertion) vào Google Sheets.
- **Áp dụng toàn diện cho 4 phân hệ dữ liệu nghiệp vụ:**
  1. **Khóa học (Courses):** `CourseModal.html` & `05_CourseModal.gs`
  2. **Lộ trình học (Curriculum):** `CurriculumModal.html` & `07_CurriculumModal.gs`
  3. **Bài viết (Blogs):** `BlogModal.html` & `14_BlogModal.gs`
  4. **Hồ sơ Giảng viên (Mentors):** `MentorModal.html` & `08_MentorModal.gs`
- **Tự động hóa thông minh (Automations & Business Rules):**
  * Tự động sinh mã định danh UUID v4 chuẩn RFC 4122 cho từng bản ghi mới (`crs-`, `cur-`, `blg-`, `mentor-`).
  * Tự động sinh Slug SEO chuẩn hóa tiếng Việt không dấu, kiểm tra trùng lặp thời gian thực với cơ sở dữ liệu hiện có và trong chính mảng đang thêm, tự động gắn suffix `-v1, -v2, -v3`.
  * Chuẩn hóa bóc tách các dòng đề cương học viên từ phím `Alt+Enter` / `Enter`.
  * Khử trùng dữ liệu chống chèn công thức độc hại (Formula Injection BR-03).
  * Định dạng tự động tiền tệ VNĐ (`#,##0 "đ"`).
- **Đóng gói mã nguồn & Nghiệm thu:** Đã rebuild `apps-script/dist/Code.bundle.gs` (3.448 dòng, 232.4 KB) và vượt qua 100% các bài kiểm thử tự động của hệ thống.

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** Quản trị nội dung Google Sheets CMS (Content Management System).
- **Quy tắc nghiệp vụ tuân thủ:**
  * **BR-01 (Slug & ID Immutability):** Slug SEO sinh ra là duy nhất, không trùng lặp và không chứa ký tự đặc biệt.
  * **BR-03 (Formula Sanitization):** Mọi trường dữ liệu văn bản bắt đầu bằng `=`, `+`, `-`, `@` đều được thêm dấu nháy đơn `'` để tránh lỗi công thức Google Sheets.
  * **BR-07 (Data Type & Currency Formatting):** Học phí được ghi đúng dạng số và gán format tiền tệ VNĐ.
  * **BR-10 (Foreign Key Integrity):** Đề cương môn học luôn gắn chặt với mã `course_id` hợp lệ.

---

## 3. Danh mục các thay đổi (Changes Made)

### 3.1. Giao diện người dùng trong Google Sheets (HTML Modals)
- [x] **`apps-script/SharedStyles.html`**:
  * Bổ sung styling cho hệ thống Repeater: `.repeater-container`, `.form-card`, `.form-card-header`, `.form-card-title`, `.btn-remove-card`, `.btn-add-repeater`, hiệu ứng chuyển động `.fade-in`.
- [x] **`apps-script/CourseModal.html`**:
  * Thêm nút `+ Thêm khóa học`.
  * Card 1 mặc định giữ cố định, card 2+ có nút `✕ Xóa`.
  * Live Preview Slug và Version Badge hoạt động độc lập cho từng card.
  * Nút hành động chính cập nhật nhãn động: `Lưu tất cả (X khóa học)`.
- [x] **`apps-script/CurriculumModal.html`**:
  * Thêm nút `+ Thêm chương / buổi học`.
  * Tự động tính toán số thứ tự chương (Module Number) và Sort Order tăng dần dựa theo khóa học đang chọn.
  * Nút submit động: `Lưu tất cả (X chương học)`.
- [x] **`apps-script/BlogModal.html`**:
  * Thêm nút `+ Thêm bài viết`.
  * Live Preview Slug độc lập cho từng bài blog.
  * Nút submit động: `Lưu tất cả (X bài viết)`.
- [x] **`apps-script/MentorModal.html`**:
  * Thêm nút `+ Thêm giảng viên`.
  * Xem trước Live Card Avatar & Thông tin mentor theo thời gian thực.
  * Nút submit động: `Lưu tất cả (X giảng viên)`.

### 3.2. Logic Backend trong Google Apps Script (`.gs`)
- [x] **`apps-script/05_CourseModal.gs`**: Viết hàm `addCoursesBatchFromModal(courseList)` ghi hàng loạt tab `courses`.
- [x] **`apps-script/07_CurriculumModal.gs`**: Viết hàm `addCurriculumBatchFromModal(curriculumList)` bóc tách bullet points và ghi hàng loạt tab `curriculum`.
- [x] **`apps-script/14_BlogModal.gs`**: Viết hàm `addBlogsBatchFromModal(blogList)` ghi hàng loạt tab `blog_posts`.
- [x] **`apps-script/08_MentorModal.gs`**: Viết hàm `addMentorsBatchFromModal(mentorList)` hỗ trợ cả cập nhật mentor cũ và thêm mentor mới.
- [x] **`apps-script/dist/Code.bundle.gs`**: Đóng gói lại toàn bộ 15 file `.gs` và 10 file `.html` thành 1 file bundle duy nhất sẵn sàng copy vào Apps Script Editor.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)

| Bộ kiểm thử | Lệnh chạy | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **GAS & Modals QA Tests** | `npm run test:gas` | **PASSED** | **80/80 test cases đạt 100%** (bổ sung test suite batch repeater & slug parser) |
| **Lead Form Security & Honeypot** | `npm run test:lead` | **PASSED** | 10/10 test cases đạt 100% |
| **Rate Limiter Tests** | `npm run test:rate` | **PASSED** | Đạt 100% |
| **ESLint Quality Check** | `npm run lint` | **PASSED** | 0 errors |
| **TypeScript Compilation** | `npm run typecheck` | **PASSED** | 0 errors |
| **Production Build** | `npm run build` | **PASSED** | Biên dịch thành công 19/19 routes |

---

## 5. Bằng chứng giao diện & Nghiệm thu (UI Evidence)
- Mở menu `🚀 DataWithLy CMS` trên Google Sheets: Form mở lên có sẵn nút `+ Thêm ...` cho phép quản trị viên thêm 2, 3 hoặc nhiều khóa học/chương học chỉ trong 1 lần mở form mà không cần phải mở lại form nhiều lần.
- Nút bấm `✕ Xóa` hoạt động mượt mà, tự động cập nhật số lượng trên nút Lưu.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Tính năng mới này sẽ giúp Chị và đội ngũ trợ giảng tiết kiệm rất nhiều thời gian khi soạn thảo chương trình học mới hoặc đăng nhiều bài viết. Chị chỉ cần mở form một lần, bấm nút dấu `+` để thêm bao nhiêu chương học hoặc bài viết tùy thích, sau đó bấm một nút **"Lưu tất cả"** là hệ thống sẽ tự động đưa toàn bộ lên Google Sheets một cách hoàn hảo và an toàn tuyệt đối!

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Đã nâng cấp 4 Modal HTML với nút `+` Repeater Card.
- [x] Đã cài đặt 4 hàm batch processing trong backend Apps Script.
- [x] Đã bảo đảm tính duy nhất của SEO Slug (`-v1, -v2`) trong mảng batch.
- [x] Đã bảo đảm kiểm tra kiểu dữ liệu, định dạng số tiền VNĐ và chống Formula Injection.
- [x] Đã re-bundle `apps-script/dist/Code.bundle.gs`.
- [x] Đã nghiệm thu độc lập đạt chuẩn PASS 100%.
