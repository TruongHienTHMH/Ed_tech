# Báo Cáo Kỹ Thuật (Pull Request) #06: Phân Hệ Blog Kiến Thức (M03) & Modal Form Đăng Ký Chuẩn Figma 12:3320

- **Mã báo cáo:** `PR-06-M03-BLOG-SYSTEM-AND-LEAD-MODAL`
- **Tên nhánh đề xuất:** `feature/m03-blog-system-and-lead-modal`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này mang đến 2 tính năng trọng yếu cho trải nghiệm người dùng và tỷ lệ chuyển đổi của website:
1. **Modal Form Đăng Ký Tư Vấn Khớp 100% Figma Node `12:3320` & `12:2735`:** Hoàn thiện popup đăng ký tư vấn chuyên nghiệp, tích hợp checkbox chọn khóa coaching, radio cam kết tham gia đúng giờ, và kích hoạt đồng bộ từ tất cả các nút CTA trên toàn site.
2. **Phân Hệ Blog Kiến Thức M03 (`/blog` & `/blog/[slug]`):** Xây dựng trang danh sách bài viết có bộ lọc tức thì và trang chi tiết bài viết Markdown cao cấp, trang bị thanh tiến độ đọc (Reading Progress Bar), mục lục tự động (TOC Scrollspy), khung hiển thị Code Block có nút Sao chép mã 1-click, hộp thông tin tác giả Mentor Hứa Thảo Ly và banner đề xuất khóa học liên quan.

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** `M03` (Blog & Knowledge Sharing), `M04` (Lead Capture).
- **Quy tắc nghiệp vụ tuân thủ:**
  * **BR-08:** Phân hệ Blog phục vụ SEO tự nhiên (Organic Search), hỗ trợ tải nhanh dưới 1.2s và định dạng code chuẩn xác cho dân Data.
  * **BR-09:** Cơ chế giới hạn tần suất gửi form trên Modal popup.
  * **BR-12:** Đảm bảo toàn bộ bài viết đều có đầy đủ thẻ OpenGraph (ảnh bìa, tiêu đề, mô tả) khi chia sẻ lên mạng xã hội (Facebook, LinkedIn, Zalo).
- **Tiêu chuẩn thiết kế:** Bám sát Figma Node `12:3320` (Modal Form) và Node `12:3349` (Blog System).

---

## 3. Danh mục các thay đổi (Changes Made)
- [x] **Giao diện người dùng (Frontend changes):**
  * `components/forms/LeadModal.tsx` & `LeadForm.tsx`:
    - Header chuẩn Figma: Tiêu đề *"Đăng Kí Tư Vấn Ngay"*, phụ đề *"Chúng tôi sẽ ngưng nhận tư vấn khi đủ số lượng đăng ký!"*.
    - Họ và tên, Email, Số điện thoại / Zalo.
    - Checkbox Group chọn khóa coaching quan tâm (*SQL for Data Analytics*, *Analytical Thinking with Looker Studio*).
    - Input: Mục tiêu học tập hoặc vị trí công việc hiện tại.
    - Radio Group: *"Bạn nhớ xuất hiện đúng giờ hẹn nhé"* (`(•) Tôi chắc chắn`, `( ) Tôi cam kết`).
    - Nút bấm Submit gradient `#8B1D2C` ➔ `#AF445A` bo góc `rounded-2xl` có spinner khi đang xử lý.
  * `app/layout.tsx`: Gắn `<LeadModalManager />` tại root layout, đảm bảo bất kỳ nút nào trên website khi bấm cũng mở popup ngay lập tức.
  * Các thành phần Blog (`components/blog/`):
    - `BlogCategoryTabs.tsx`: Thanh chọn danh mục tức thì.
    - `BlogPostCard.tsx`: Thẻ bài viết chuẩn tỷ lệ `16:9`, category badge, thời lượng đọc, `line-clamp`, tác giả và ngày đăng.
    - `ReadingProgressBar.tsx`: Dải tiến độ đọc dính top màn hình.
    - `TableOfContents.tsx`: Mục lục tự động trích xuất H2/H3 và highlight theo vị trí cuộn trang.
    - `CodeBlockWithCopy.tsx`: Khung code dark theme `#1A1D24` với 3 chấm phong cách macOS và nút [Sao chép mã] đổi sang "Đã chép!" trong 2s.
    - `BlogAuthorBox.tsx`: Khối hồ sơ giảng viên Mentor Hứa Thảo Ly cuối bài viết.
    - `BlogRelatedCourseBanner.tsx`: Banner gợi ý khóa học liên quan có nút mở popup tư vấn.
  * Các routes Blog:
    - `app/blog/page.tsx` & `loading.tsx`: Danh sách bài viết có đầy đủ 5 trạng thái UI.
    - `app/blog/[slug]/page.tsx`, `loading.tsx`, `not-found.tsx`: Chi tiết bài viết với bố cục 2 cột.
- [x] **Xử lý dữ liệu & Seeder (Database / CMS changes):**
  * `database/seeders/BlogSeeder.ts`: Bổ sung nội dung Markdown thực tế cho 3 bài viết chuyên môn (Mẹo SQL doanh nghiệp, Thiết kế Dashboard 5 giây, Lộ trình chuyển ngành Data từ số 0) kèm các đoạn code SQL và Python phong phú.
  * `lib/cms/sheets-client.ts`: Đồng bộ trường `contentMarkdown` từ Google Sheets.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)
- [x] **Kiểm thử bộ Lead Security Suite (`npm run test:lead`):**
  * 10/10 tests PASSED (Honeypot bắt bot, Rate limiter chặn spam, chuẩn hóa số điện thoại).
- [x] **Kiểm thử biên dịch tĩnh (SSG):**
  * Biên dịch thành công 100% các bài viết:
    - `/blog` (Static ISR 5 phút)
    - `/blog/cac-meo-sql-can-biet` (SSG)
    - `/blog/thiet-ke-dashboard-truc-quan` (SSG)
    - `/blog/lo-trinh-chuyen-nganh-data-analyst` (SSG)
- [x] **Kiểm thử kiểu dữ liệu:** `npx tsc --noEmit` đạt 0 lỗi.

---

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- **Modal Form đối chiếu:** Khớp 100% Figma Node `12:3320` ("Frame 1000005322", width: 564px, padding 24px).
- **Trang Blog đối chiếu:** Bố cục thanh thoát theo Node `12:3349`, màu sắc đỏ mận nhận diện thương hiệu rõ nét.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Mục Blog giờ đây đã sẵn sàng trở thành phễu thu hút học viên tự nhiên từ Google. Chị có thể đăng bài viết trực tiếp từ tab `blog_posts` trên Google Sheets mà không cần thao tác mã nguồn; hệ thống sẽ tự động vẽ mục lục và tô màu cú pháp các câu lệnh SQL/Python rất đẹp mắt!

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Nhánh tuân thủ quy chuẩn `feature/m03-blog-system-and-lead-modal`.
- [x] Modal popup mở được từ tất cả các nút CTA trên trang.
- [x] Nút sao chép mã code hoạt động trơn tru trên mọi trình duyệt.
- [x] Sẵn sàng để hợp nhất vào nhánh chính.

