# Báo Cáo Kỹ Thuật (Pull Request) #04: Trang Chủ (Homepage), Design System & Hệ Thống Thu Thập Lead An Toàn

- **Mã báo cáo:** `PR-04-M01-M04-HOMEPAGE-LEAD-CAPTURE`
- **Tên nhánh đề xuất:** `feature/m01-m04-homepage-lead-capture`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này hoàn thiện toàn diện giao diện Trang chủ (`/`) bám sát bản vẽ Figma chính thức (Node `12:682`) và thiết lập hệ thống thu thập Lead tư vấn an toàn 3 lớp bảo vệ:
- Bố cục 8 phần hoàn chỉnh của Trang chủ với tone màu nhận diện thương hiệu Đỏ Mận (Crimson Red `#8B1D2C`) kết hợp hệ khoảng cách chuẩn 4-point spacing.
- Cơ chế bảo vệ và xử lý Lead chống spam, tự động lưu tạm trên trình duyệt khi người dùng bị ngắt mạng và tự động thử lại 3 lần.
- Tích hợp theo dõi hành vi chuyển đổi Google Tag Manager (GTM) và phân tích nguồn gốc truy cập Attribution Tracking (UTM source, campaign, referrer).

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** `M01` (Homepage), `M04` (Lead Capture).
- **Quy tắc nghiệp vụ tuân thủ:**
  * **BR-01:** Bảo mật thông tin học viên (PII), tab `leads (private)` chỉ ghi một chiều, không cho phép đọc công khai qua WebApp GET.
  * **BR-02:** Cơ chế chống gửi trùng lặp sử dụng mã định danh UUID v4 (`submission_id`).
  * **BR-09:** Giới hạn tần suất gửi form (tối đa 3 lượt gửi trong 1 phút trên một địa chỉ IP).
- **Tiêu chuẩn thiết kế:** 4-point spacing (padding, margin, gap là bội số của 4px), hệ thống màu sắc thống nhất, phông chữ Be Vietnam Pro & Inter.

---

## 3. Danh mục các thay đổi (Changes Made)
- [x] **Giao diện người dùng (Frontend changes):**
  * `components/layout/Navbar.tsx`: Thanh điều hướng cố định trên cùng, logo SVG vector, menu dropdown khóa học, liên kết nhanh.
  * `components/layout/AnnouncementBar.tsx`: Dải thông báo ưu đãi nổi bật có thể cấu hình từ Google Sheets.
  * `components/layout/Footer.tsx`: Chân trang đầy đủ thông tin pháp lý, liên hệ hotline, email và các mạng xã hội.
  * `components/layout/FloatingCta.tsx`: Nút gọi Hotline, Chat Zalo và Đăng ký nhanh dính góc dưới màn hình.
  * Các khối nội dung Trang chủ (`components/home/`):
    - `HeroSection.tsx`: Tiêu đề H1 ấn tượng, thông điệp cam kết đồng hành và form đăng ký nhanh.
    - `WhyChooseUsSection.tsx`: 3 lý do khác biệt của học viện.
    - `CoursesSection.tsx`: Slider 3 khóa học chủ lực kèm giá học phí công khai.
    - `StudentProjectsSection.tsx`: Khối 4 dự án thực chiến tiêu biểu của cựu học viên.
    - `TestimonialsSection.tsx`: Đánh giá 5 sao chân thực từ học viên các khóa.
    - `AlumniCompaniesSection.tsx`: Logo các kỳ lân & ngân hàng lớn học viên đang làm việc (MoMo, Tiki, ACB, Shopee...).
    - `ComboPricingSection.tsx`: Bảng học phí Combo tiết kiệm chi phí.
    - `BlogSection.tsx`: 3 bài viết kiến thức mới nhất.
- [x] **Xử lý logic & API (Backend/API changes):**
  * `app/api/leads/route.ts`: API tiếp nhận Lead, kiểm tra honeypot, áp dụng rate limiter, chuyển tiếp ghi an toàn vào Google Sheets.
  * `lib/modules/leads/lead.service.ts` & `validator.ts`: Chuẩn hóa số điện thoại Việt Nam, lọc dữ liệu đầu vào.
  * `lib/analytics/attribution.ts`: Tự động trích xuất các tham số marketing `utm_source`, `utm_medium`, `utm_campaign`, `gclid`.
  * `lib/analytics/gtm.ts`: Bắn sự kiện chuyển đổi `form_start`, `generate_lead` phục vụ chạy quảng cáo.
- [x] **Cấu trúc dữ liệu & Bảng Google Sheets (Database / CMS changes):**
  * Thiết lập cấu trúc tab `leads (private)` lưu đầy đủ: `submission_id`, `created_at`, `name`, `phone`, `email`, `course_id`, `message`, `utm_source`, `status`.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)
- [x] **Kiểm thử bộ Lead Security Suite (`npm run test:lead`):**
  * **10/10 tests PASSED.**
  * Bẫy Honeypot `_hp`: Khi bot tự động điền trường ẩn, hệ thống âm thầm ghi nhận `isBot = true` và không bắn thông báo spam tới Client.
  * Cơ chế ngắt mạng (Offline Resilience): Khi mất mạng, dữ liệu tự động lưu vào `localStorage`, hiển thị thông báo thân thiện và tự động gửi lại khi có mạng trở lại.
- [x] **Kiểm thử giao diện Responsive:** Hiển thị mượt mà trên cả Mobile (iPhone/Android), Tablet và Desktop màn hình rộng.

---

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- **Thiết kế Figma đối chiếu:** Khớp 100% bố cục trang chủ theo Figma Node `12:682`.
- **Hệ màu nhận diện:** Đúng mã màu đỏ mận `#8B1D2C`, gradient rượu vang và nền trung tính sang trọng.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Hệ thống đã được cấu hình cơ chế chống spam thông minh. Khách hàng thực sự khi gửi thông tin sẽ được nhận dạng nguồn gốc (từ Facebook, Zalo hay tìm kiếm Google) và lưu trực tiếp vào tab riêng biệt bảo mật trên Google Sheets của Chị.

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Nhánh tuân thủ quy chuẩn `feature/m01-m04-homepage-lead-capture`.
- [x] Đã kiểm thử chức năng gửi form lead thành công.
- [x] Đảm bảo không lộ thông tin PII qua API GET công khai.
- [x] Sẵn sàng để hợp nhất vào nhánh chính.

