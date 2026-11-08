# M01 — HomePage (Trang Chủ)

- **Mục đích:** Xác định ranh giới, kiến trúc thành phần, phụ thuộc và điều kiện sẵn sàng triển khai cho Module Trang Chủ (`/`).
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Frontend Agent
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [PRD M01](prd.md)
  - [Phạm vi sản phẩm (Product Scope)](../../01-product/product-scope.md)
  - [Workflow Khám phá khóa học (WF-01)](../../04-workflows/WF-01-explore-courses.md)
  - [Quy tắc Design System & 4-Point Spacing](../../07-architecture/design-system-rules.md)
  - [Figma Design Canvas (node 0:1)](https://www.figma.com/design/epfQwa5s3iMO6toM4Fmmpu/Hien-Ed_TECH?node-id=0-1&m=dev)

---

## 1. Ranh giới module (Module Boundaries)

Module Trang Chủ chịu trách nhiệm dựng toàn bộ trang đích (`/`) tại tầng Server Component (Next.js App Router) kết hợp Client Islands cho các tương tác người dùng, hoạt động theo mô hình đọc nội dung độc lập với độ sẵn sàng cao (**AP theo CAP Theorem**).

### Trong phạm vi (In-Scope)
1. **Header & Navigation Bar:**
   - Logo thương hiệu **DataWithLy** (chuyển hướng về `/`).
   - Menu điều hướng máy tính (Desktop): *Khóa học, Về Mentor, Dự án học viên, Góc chia sẻ*.
   - Menu trượt di động (Mobile Drawer): Bao gồm các liên kết điều hướng và 2 nút hành động trực tiếp: **[Gọi Hotline]** (`tel:0934752432`) và **[Chat Zalo]** (mở Zalo OA).
   - Nút hành động chính (Primary CTA): `[Nhận tư vấn lộ trình]` mở Modal Lead Form (M04).
2. **Hero Section:**
   - Tagline badge: `"ONLINE DATA ANALYTICS COURSE"`.
   - Tiêu đề chính (H1): `"Học Data Analytics từ tư duy đến thực hành."`.
   - Mô tả giá trị: Lộ trình bài bản từ cơ bản đến nâng cao, dự án thực tế, hỗ trợ tận tâm cùng Mentor Hứa Thảo Ly.
   - Dual CTAs: `[Tư vấn lộ trình]` (kích hoạt M04) và `[Khám phá khóa học]` (cuộn mượt xuống khối khóa học).
3. **Giá trị cốt lõi (3 USP Cards):**
   - 01. Thực chiến giải quyết bài toán kinh doanh thực tế.
   - 02. Hỗ trợ 1-on-1, giải đáp & review code hàng tuần.
   - 03. Xây dựng Portfolio cá nhân chuẩn chỉnh phỏng vấn tuyển dụng.
4. **Khối Khóa học nổi bật (Featured Courses):**
   - Hiển thị danh mục 3 khóa học thực tế:
     - *SQL for Data Analytics* (12 buổi | 2.990.000 VNĐ).
     - *Analytical Thinking & Dashboard Design* (16 buổi | 3.790.000 VNĐ).
     - *End-to-End Analytics with SQL & Dashboard Design* (25 buổi | 5.690.000 VNĐ).
   - Mỗi card có 2 nút CTA: `[Xem chi tiết]` (chuyển hướng `/courses/[slug]`) và `[Tư vấn ngay]` (mở Lead Modal M04 điền sẵn `course_id`).
5. **Khối Dự án học viên tiêu biểu (Student Projects Showcase):**
   - Bố cục lưới 2x2 trên Desktop và vuốt ngang mượt mà trên Mobile (thay thế khối Free Resources cũ theo chỉ thị sheet Main).
   - Hiển thị 4 dự án thực tế: *Phim ảnh (Film Industry Analytics), Doanh thu xe đạp & phụ kiện (AdventureWorks), Nền tảng EdTech, Hiệu quả sàn TMĐT*.
6. **Khối Giới thiệu Giảng viên (Mentor Section):**
   - Chân dung Mentor Hứa Thảo Ly (Ex Senior DA tại MoMo, Tiki, ACB).
   - 3 trụ cột phương pháp đào tạo: *Business Context - Clean Code - Visual Impact*.
7. **Khối Đánh giá học viên (Testimonials):**
   - Danh sách đánh giá thật từ học viên các khóa K1 đến K10.
8. **Khối Bài viết mới nhất (Latest Blog Preview):**
   - 3 bài viết chuyên môn mới nhất dẫn link về `/blog/[slug]`.
9. **Chân trang (Footer):**
   - Thông tin bản quyền, liên kết điều hướng, thông tin liên hệ và mạng xã hội `@datawithly`.

### Ngoài phạm vi (Out-of-Scope)
- Chi tiết đề cương môn học từng buổi (thuộc [M02 Course Details](../M02-course-details/README.md)).
- Trình đọc bài viết blog chi tiết (thuộc [M03 Blog](../M03-blog/README.md)).
- Cơ chế ghi dữ liệu Lead Form và gửi email (thuộc [M04 Lead Capture](../M04-lead-capture/README.md)).
- Đăng nhập, thanh toán học phí trực tuyến, hệ thống LMS nộp bài (thuộc Non-goals Giai đoạn 1).

---

## 2. Kiến trúc Component & Luồng dữ liệu

```
[Page: app/page.tsx (Server Component)]
  ├── <HeaderNavigation /> (Client Component: Drawer, Sticky, Active Link)
  ├── <HeroSection /> (Server Component + Client CTA Button)
  ├── <ValuePropsSection /> (Server Component: 3 USP Cards)
  ├── <FeaturedCoursesSection /> (Server Component)
  │     └── 3x <CourseCard /> (Client Action: View Course, Open Modal)
  ├── <StudentProjectsSection /> (Server Component: 2x2 Grid / Mobile Carousel)
  │     └── 4x <ProjectCard /> (Client Modal: Preview Dashboard)
  ├── <MentorProfileSection /> (Server Component: Profile & Credentials)
  ├── <TestimonialsSection /> (Server Component: Grid / Carousel)
  ├── <LatestBlogSection /> (Server Component: 3 Posts)
  ├── <Footer /> (Server Component)
  └── <LeadCaptureModal /> (Client Island - Lazy loaded khi người dùng nhấn CTA)
```

- **Nguồn dữ liệu:** Đọc từ Google Sheets Staging thông qua Service Layer `lib/cms/content-fetcher.ts` kết hợp Next.js ISR Cache (`revalidate = 3600`).
- **Khả năng chịu lỗi (Fallback):** Khi Google Sheets gặp sự cố hoặc timeout > 3.0s, tự động trả về Cached Stale Content hoặc Static Fallback Data định nghĩa tại `lib/cms/fallbacks/homepage.json` (không làm trắng trang người dùng).

---

## 3. Điều kiện sẵn sàng triển khai (Definition of Ready - DoR)

1. [x] PRD M01 được duyệt đầy đủ tiêu chí nghiệm thu (Given/When/Then).
2. [x] Bản vẽ thiết kế Figma được đối soát và định vị token (node `0:1`).
3. [x] Hệ màu Crimson Primary (`#8B1D2C`) và hệ Spacing 4-point được đồng bộ vào `tailwind.config.ts`.
4. [x] Module Lead Capture (M04) có sẵn API trigger để mở Modal từ các CTA button trên HomePage.
5. [x] Cấu hình SafeImage Fallback xử lý toàn bộ avatar và ảnh dự án học viên.

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M01](prd.md)
