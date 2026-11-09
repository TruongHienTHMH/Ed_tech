# Báo Cáo Kỹ Thuật (Pull Request) #10: Header Unification, AnnouncementBar Fix & Homepage Pixel-Perfect Refactor (RF-03)

- **Mã báo cáo:** `PR-10-RF-03-HEADER-AND-HOMEPAGE-REFACTOR`
- **Tên nhánh đề xuất:** `feature/rf-03-header-and-homepage-refactor`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & SubAgent Coder
- **Ngày lập:** 2026-11-09

---

## 1. Tóm tắt nội dung (Summary)

Đợt bàn giao này hoàn thành trọn vẹn **Milestone RF-03** trong lộ trình refactor dự án **DataWithLy**:
1. **Khắc phục lỗi thanh ưu đãi AnnouncementBar (`components/layout/AnnouncementBar.tsx`):**
   - Đổi container từ `max-w-[1440px]` sang `max-w-[1200px] mx-auto px-4 sm:px-6`, đồng bộ pixel-perfect với Navbar và các Section chính.
   - Căn lề Star Badge (75% OFF) và thông điệp ưu đãi bên trái thẳng hàng theo trục dọc với Logo DataWithLy.
   - Căn lề Countdown Timer và nút đóng `✕` bên phải thẳng hàng với nút CTA của Header.
   - Tinh chỉnh padding `py-2.5 sm:py-3` và màu sắc chuẩn theo Figma Node `12:684`.
   - Áp dụng đồng bộ cho tất cả các trang: Home (`/`), Course Details (`/courses/[slug]`), và Blog (`/blog`, `/blog/[slug]`).

2. **Hợp nhất Header (`components/layout/Navbar.tsx`):**
   - Hỗ trợ prop `variant?: "dark" | "light"` (mặc định "dark"):
     + `variant="dark"` (Figma `12:1174`): Background `#2E2E2E`, viền dưới `border-white/10`, text `text-white/90`, dropdown `#252525`. Dùng cho Homepage (`/`).
     + `variant="light"` (Figma `12:1769`): Background `#FFFFFF`, viền dưới `border-neutral-200/80`, text `text-[#252525]`, dropdown `#FFFFFF` shadow-xl border `border-neutral-200`. Dùng cho Course Detail (`/courses/[slug]`) và Blog (`/blog`, `/blog/[slug]`).
   - Tích hợp unit component `Button` từ `components/common/Button.tsx` cho nút "Đăng kí ngay".

3. **Hoàn thiện HeroSection (`components/home/HeroSection.tsx` - Figma Node `12:701`):**
   - Bổ sung 2 card đồ họa minh họa Figma còn thiếu:
     + Card đồ họa phân tích số liệu / dashboard tương tác (`12:702`) ở bên trái (sử dụng asset `cf9dcd253d74531ef55b272e2e080b01e9bbd6bb.png`).
     + Card thống kê tăng trưởng KPI / performance cockpit (`12:708`) ở bên phải (sử dụng asset `c0aae3c5c5404ee626ce858087d79649de2e3dc1.png`).
   - Tối ưu hóa responsive: Ẩn trên mobile/tablet (`hidden xl:block`), đảm bảo tuyệt đối không đè chữ trên mọi kích thước màn hình.
   - Tích hợp `Button` từ `components/common/Button.tsx` cho nút "Khám phá các khóa học & Tư vấn 1:1".

4. **CoursesSection (`components/home/CoursesSection.tsx` - Figma Node `12:778`, `12:779`, `12:781`):**
   - Tích hợp Upper Badge (`12:779`) chuyển tiếp từ Hero sang Courses: Huy hiệu "KHÓA HỌC TẠI LYDATA" và tiêu đề chọn lộ trình.
   - Căn chỉnh card khóa học theo đúng thiết kế Figma Node `12:778`.
   - Tích hợp Lower Badge (`12:781`) ở chân section với 3 cam kết đào tạo (12-15 buổi, Mentor 1:1, Review CV trọn đời).
   - Tích hợp unit components `Badge` và `Button`.

5. **AlumniCompaniesSection (`components/home/AlumniCompaniesSection.tsx` - Figma Node `12:782`):**
   - Chuyển đổi khối logo tĩnh thành **Infinite Horizontal Auto-Marquee Slider** trượt ngang mượt mà, liên tục.
   - Tích hợp đầy đủ 8 logo đối tác tuyển dụng từ Figma Node `12:813`.
   - Sử dụng cấu trúc duplicate track 2x và CSS `@keyframes marquee` trong `globals.css`.
   - Hỗ trợ dừng trượt khi hover chuột (`hover:[animation-play-state:paused]`).
   - Thêm hiệu ứng fade mờ 2 bên mép bằng `mask-image` gradient (`mask-marquee-edges`).

6. **ComboPricingSection (`components/home/ComboPricingSection.tsx` - Figma Node `12:1175`):**
   - Căn chỉnh tỷ lệ 2 cột theo Figma Node `12:1175` (5 cột cho đăng ký riêng lẻ vs 7 cột cho gói Combo nổi bật).
   - Tích hợp unit component `Badge` cho nhãn giảm giá và `Button` cho nút đăng ký.

7. **StudentProjectsSection (`components/home/StudentProjectsSection.tsx` - Figma Node `12:873`) & TestimonialsSection (`components/home/TestimonialsSection.tsx` - Figma Node `12:892`):**
   - Chuẩn hóa typography, khoảng cách, icon, badge theo Figma.
   - Tích hợp `Button` và `Badge`.

---

## 2. Kết quả kiểm tra Quality Gates

| Quy trình kiểm định | Lệnh chạy | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **ESLint** | `npm run lint` | **PASSED** | 0 errors |
| **TypeScript Typecheck** | `npm run typecheck` | **PASSED** | 0 errors (`tsc --noEmit` hoàn tất trơn tru) |
| **Google Apps Script & Modals Tests** | `npm run test:gas` | **PASSED** | 80/80 test cases đạt 100% |
| **Lead Form & Validation Tests** | `npm run test:lead` | **PASSED** | 10/10 test cases đạt 100% |
| **Rate Limiter Tests** | `npm run test:rate` | **PASSED** | Đạt 100% |
| **Production Build** | `npm run build` | **PASSED** | Sinh 19/19 routes SSG/ISR thành công |

