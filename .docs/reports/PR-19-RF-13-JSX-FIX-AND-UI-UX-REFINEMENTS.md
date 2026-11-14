# BÁO CÁO TỔNG KẾT MILESTONE RF-13: KHẮC PHỤC LỖI JSX INTRINSICTYPES, TINH CHỈNH 4 ĐIỂM UX TRỌNG YẾU & TỐI ƯU LAYOUT COURSE FAQ

**Mã định danh:** PR-19-RF-13  
**Nhánh Git:** `feature/rf-13-jsx-fix-and-ui-ux-refinements`  
**Trạng thái:** ✅ SẴN SÀNG TRIỂN KHAI PRODUCTION (100% Quality Gates Passed)  
**Thời gian cập nhật:** 12/11/2026  

---

## 1. TỔNG HỢP CÁC TASK ĐÃ HOÀN THÀNH TRONG BRANCH

### Task 1: Khắc Phục Triệt Để Lỗi TypeScript `JSX.IntrinsicElements`
* **Nguyên nhân cốt lõi:** Thư mục `node_modules/@types/react` và `@types/react-dom` trước đó bị rỗng / thiếu tệp định nghĩa, khiến TypeScript Language Server không thể tìm thấy interface `JSX.IntrinsicElements` cho các thẻ HTML gốc (`<div>`, `<span>`, `<h1>`...).
* **Giải pháp triển khai:**
  - Khôi phục bộ thư viện kiểu dữ liệu chính thức `@types/react@^19` và `@types/react-dom@^19`.
  - Cập nhật chuẩn hóa [`tsconfig.json`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/tsconfig.json) (`jsx: "preserve"`, `moduleResolution: "bundler"`).
* **Kết quả:** Lệnh `npm run typecheck` (`tsc --noEmit`) đạt **0 lỗi tuyệt đối**.

---

### Task 2: UX 1 - Mở Rộng Phạm Vi Nhận Chuột Cho Header Dropdown (Hitbox Extension)
* **File thay đổi:** [`components/layout/Navbar.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/layout/Navbar.tsx)
* **Vấn đề trước đây:** Menu "Khóa học" xuất hiện khoảng trống 4px (`mt-1`) giữa nút bấm và dropdown menu, khiến con trỏ chuột khi di chuyển qua điểm mù này bị mất trạng thái hover và đóng dropdown tức thì.
* **Giải pháp triển khai:**
  - Loại bỏ hoàn toàn khoảng hở vật lý, bọc dropdown trong container liên tục `absolute top-full left-0 pt-1.5 z-50`. Toàn bộ hành trình di chuyển chuột từ text xuống menu luôn nằm 100% trong vùng nhận sự kiện `onMouseEnter`/`onMouseLeave`.
  - Bổ sung xử lý click toggle trên nút "Khóa học", giúp người dùng trên iPad, màn hình cảm ứng hoặc trackpad có thể ghim mở / đóng menu thuận tiện.
  - **Bảo toàn 100% Mobile Responsive:** Navbar di động sử dụng hệ thống Drawer độc lập (`md:hidden`), hoàn toàn không bị ảnh hưởng bởi logic desktop.

---

### Task 3: UX 2 - Cập Nhật Lời Kêu Gọi Nhập Email Thân Thiện Tại Hero Section
* **File thay đổi:** [`components/home/HeroSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/HeroSection.tsx)
* **Vấn đề trước đây:** Dòng ghi chú bằng tiếng Anh pháp lý (*"By continuing, you accept our Terms of Use and our Privacy Policy"*) gây cảm giác xa lạ và khô cứng đối với học viên Việt Nam.
* **Giải pháp triển khai:**
  - Thay thế bằng thông điệp kêu gọi hành động tự nhiên, ấm áp và nêu bật giá trị nhận được:
    > *✨ Nhập email để nhận ngay trọn bộ lộ trình chi tiết & tư vấn 1:1 miễn phí từ Mentor Hứa Thảo Ly*

---

### Task 4: UX 3 - Quản Trị Badge Khóa Học Trực Tiếp Bằng Cell Trên Google Sheets
* **Files thay đổi:**
  - [`lib/cms/types.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/types.ts)
  - [`lib/cms/sheets-client.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/sheets-client.ts)
  - [`components/home/CoursesSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/CoursesSection.tsx)
  - [`database/seeders/CourseSeeder.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/database/seeders/CourseSeeder.ts)
* **Giải pháp triển khai:**
  - Sử dụng danh từ chuẩn nghiệp vụ: **`course_kind`** (CMS Parser đồng thời hỗ trợ đọc linh hoạt các alias: `course_kind`, `kind`, `type`, `course_type`, `badge`).
  - Cho phép người dùng thêm cột `course_kind` trên tab `courses` của Google Sheets và tùy chọn 3 giá trị:
    1. 🌟 **`Khóa học nổi bật`**: Tự động áp dụng `variant="gold"` của Global Badge (màu vàng kim sang trọng, ánh kim đặc trưng). Chỉ định mặc định cho khóa trọn gói: *End-to-End Analytics with SQL & Dashboard Design*.
    2. 🎯 **`Khóa học nền tảng`**: Tự động áp dụng `variant="level"` của Global Badge (màu xám xanh Slate nền nã, chuẩn mực). Áp dụng cho khóa: *SQL for Data Analytics*.
    3. 🚀 **`Khóa học chuyên sâu`**: Tự động áp dụng `variant="level"` của Global Badge. Áp dụng cho khóa: *Analytical Thinking & Dashboard Design*.
  - Tuân thủ 100% quy ước mã màu của hệ thống thiết kế ([`Badge.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/common/Badge.tsx)).

---

### Task 5: UX 4 - Tái Cấu Trúc Khối "BẢNG GIÁ & ƯU ĐÃI" (ComboPricingSection)
* **File thay đổi:** [`components/home/ComboPricingSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/ComboPricingSection.tsx)
* **Vấn đề trước đây:** Giao diện cũ sử dụng 4 dấu X màu đỏ ở card khóa lẻ tạo cảm giác tiêu cực và ép buộc người dùng phải chọn mua gói Combo.
* **Giải pháp triển khai:**
  - Giữ tiêu đề trang trọng: *"Đầu tư thông minh cho sự nghiệp"*.
  - Cập nhật phụ đề sâu sắc và thuyết phục:
    > *"Kết hợp SQL và Analytical Thinking & Dashboard trong một lộ trình xuyên suốt, giúp bạn xây dựng nền tảng Data Analytics có hệ thống và tiết kiệm hơn so với đăng ký từng khóa riêng lẻ."*
  - **Card bên trái (Khóa học riêng lẻ):** Loại bỏ 4 dấu X đỏ, thay bằng 2 bullet định vị nhu cầu tích cực:
    - 🎯 *Phù hợp nếu bạn muốn tập trung vào một nhóm kỹ năng hoặc đã có nền tảng trước đó.*
    - 💰 *Chi phí cao hơn (Tổng 6.780.000VNĐ)*.
    - Điểm nhấn bullet tròn trang nhã (`w-2 h-2 rounded-full bg-[#AF445A]/70`).
  - **Card bên phải (Combo nổi bật):** Lược bỏ 2 dòng *"Community với hơn 1200+ members"* và *"Update nội dung kiến thức trọn đời"*, chỉ giữ lại những cam kết học tập và hỗ trợ thực chiến thực chất nhất.

---

### Task 6: Tối Ưu Bố Cục Layout & Responsive Khối "CourseFaq"
* **Files thay đổi:**
  - [`app/courses/[slug]/page.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/app/courses/[slug]/page.tsx)
  - [`components/course/CourseFaq.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/course/CourseFaq.tsx)
* **Vấn đề trước đây:**
  - Khối `CourseFaq` bị đặt nằm bên trong Cột Trái 792px, bên cạnh Cột Phải Sticky Sidebar (384px).
  - Bản thân component `CourseFaq` lại tự chia lưới 12 cột (FAQ chiếm 7/12 ~420px, Form tư vấn chiếm 5/12 ~300px), khiến trên Desktop bị ép thành 3 cột chật chội, chữ gãy vụn, không cân xứng.
  - Trên Mobile, xảy ra hiện tượng đệm lề kép (`padding`) không cần thiết.
* **Giải pháp triển khai:**
  - **Bố cục tổng thể trong `page.tsx`:** Đưa `<CourseFaq />` ra ngoài khung 2 cột sau khi kết thúc phần Dự án học viên, trở thành một Section độc lập với container 1200px chuẩn mực (nằm ngay phía trên khối Combo Upsell Banner). Khi người dùng cuộn đến FAQ, Sticky Sidebar đã kết thúc, nhường trọn không gian cho khối Hỏi đáp & Form đăng ký.
  - **Desktop (≥ 1024px):**
    - Cột trái FAQ (7 cột ~680px): Accordion rộng rãi, dễ đọc, icon mũi tên đảo hướng và đổi nền sang đỏ vang (`#8B1D2C`) nổi bật khi mở. Bổ sung ghi chú trợ giúp nhanh từ Mentor bên dưới danh sách.
    - Cột phải Form tư vấn (5 cột ~460px): Đặt trong card `rounded-3xl` gradient nhẹ `from-[#FAF7F8] to-white`, bổ sung hàng cam kết giá trị (*⚡ Tư vấn trong 15p • 🎯 Đúng năng lực • 🔒 Bảo mật 100%*), kèm `lg:sticky lg:top-24` giúp form luôn giữ trong tầm mắt người dùng.
  - **Mobile & Tablet (< 1024px):** Tự động dàn xếp thành 1 cột mượt mà (Hỏi đáp trước, Form tư vấn sau), full-width, không vỡ lề, không tràn viền.
  - **Điều hướng:** Thêm định danh `id="faq"` để các nút bấm hay liên kết có thể cuộn trực tiếp tới khối này.

---

### Task 7: Gia Cố Độ Bền Kết Nối CMS Google Apps Script
* **File thay đổi:** [`lib/cms/sheets-client.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/sheets-client.ts)
* **Chi tiết:** Nâng thời gian timeout của bộ fetch Apps Script từ `6000ms` (6 giây) lên `15000ms` (15 giây), ngăn chặn triệt để lỗi `This operation was aborted` trong các đợt Google Apps Script cold-start khởi động container.

---

## 2. KẾT QUẢ KIỂM THỬ VÀ QUALITY GATES

| Kiểm thử | Lệnh thực hiện | Kết quả | Ghi chú chi tiết |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `npm run typecheck` | ✅ **0 Lỗi** | Toàn bộ các component và type definitions hợp lệ 100% |
| **ESLint Static Analysis**| `npm run lint` | ✅ **0 Lỗi** | Đạt chuẩn Next.js 16 và React 19 |
| **Hệ thống Kiểm thử (Test Suites)** | `npm run test` | ✅ **108/108 PASS** | Bao gồm: GAS Modal (80), Lead Validator & Honeypot (10), Rate Limiter, Email Notification (18) |
| **Production Build (SSG)** | `npm run build` | ✅ **19/19 Routes** | Biên dịch thành công 100% các trang tĩnh & dynamic routes |

---

## 3. DANH SÁCH FILE THAY ĐỔI TRONG TOÀN BỘ NHÁNH

1. [`tsconfig.json`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/tsconfig.json): Cấu hình moduleResolution và JSX compiler.
2. [`lib/cms/types.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/types.ts): Bổ sung thuộc tính `courseKind` vào interface `Course`.
3. [`lib/cms/sheets-client.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/sheets-client.ts): Parser cột `course_kind`, tăng timeout kết nối Apps Script lên 15s.
4. [`database/seeders/CourseSeeder.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/database/seeders/CourseSeeder.ts): Khởi tạo giá trị `courseKind` mẫu cho 3 khóa học chuẩn hóa.
5. [`components/layout/Navbar.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/layout/Navbar.tsx): Mở rộng hitbox dropdown không điểm mù, hỗ trợ click toggle.
6. [`components/home/HeroSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/HeroSection.tsx): Lời kêu gọi nhập email tiếng Việt thân thiện.
7. [`components/home/CoursesSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/CoursesSection.tsx): Hiển thị Badge động dựa trên `courseKind` với style Global CSS.
8. [`components/home/ComboPricingSection.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/ComboPricingSection.tsx): Tái cấu trúc thông điệp bảng giá, thay dấu X bằng bullet nhu cầu tích cực.
9. [`app/courses/[slug]/page.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/app/courses/[slug]/page.tsx): Đưa CourseFaq thành section độc lập độ rộng 1200px.
10. [`components/course/CourseFaq.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/course/CourseFaq.tsx): Thiết kế lại layout 7/5 cân đối, bổ sung card tư vấn sticky và responsive mobile.
11. [`.docs/reports/PR-19-RF-13-JSX-FIX-AND-UI-UX-REFINEMENTS.md`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/.docs/reports/PR-19-RF-13-JSX-FIX-AND-UI-UX-REFINEMENTS.md): Báo cáo kỹ thuật và nghiệm thu chi tiết.
