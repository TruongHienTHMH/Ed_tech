# Báo Cáo Kỹ Thuật Pull Request: PR-23 (RF-31)
# Nâng Cấp Toàn Diện Giao Diện & Trải Nghiệm (UI/UX) Homepage DataWithLy Theo Mô Hình Waterfall 5 Stage

---

## 1. Tóm tắt nội dung (Summary)
Đợt cập nhật này thực hiện tối ưu hóa, chuẩn hóa và nâng cấp toàn diện 5 thành phần giao diện chủ chốt trên trang chủ **DataWithLy (ed_da_tech)**. Toàn bộ quy trình được triển khai theo mô hình **Waterfall (5 Stage độc lập)**, kiểm thử nghiêm ngặt từng giai đoạn, đảm bảo trải nghiệm người dùng liền mạch, tinh tế và đồng bộ với nhận diện thương hiệu của Mentor:
1. **Header / Navbar**: Chuyển sang kiến trúc `NAV_ITEMS` tập trung, nhận diện trang hiện tại (`usePathname`), đổi đồng bộ màu Hover & Active sang sắc hồng thương hiệu `#AF445A`, chống giật khung hình (Zero CLS) và kết nối trực tiếp dữ liệu 3 khóa học từ Database.
2. **HeroSection RoadmapCard**: Thiết kế lại toàn bộ thẻ giai đoạn thành dạng **Component Con nhộng (Capsule/Pill) hẹp - dài, căn giữa toàn bộ nội dung**.
3. **CoursesSection**: Tích hợp đường ray trượt CSS Flex Slider mượt mà từ phải sang trái, cơ chế chuyển bài tự động (**Autoplay 4.5s**) cùng tính năng dừng thông minh khi rê chuột (**Pause on Hover**).
4. **AlumniCompaniesSection**: Giữ logo thuần túy (không dùng background container), tăng sáng trực tiếp bằng bộ lọc quang học, crop chuẩn khít ảnh IRTech, cân bằng quang học cả 5 thương hiệu và tạo vòng lặp **nối đuôi nhau liên tục (Seamless Infinite Stream)**.
5. **WhyChooseUsSection & BlogSection**: Chuẩn hóa cơ chế tương tác: mặc định hiển thị thẻ trắng trang nhã, chỉ kích hoạt gradient nổi bật khi người dùng rê chuột vào.

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
* **Mã phân hệ / Đợt cập nhật**: `RF-31` (Homepage UI/UX WaterFall Upgrades).
* **Quy tắc thiết kế thương hiệu (Brand Design Rules)**:
  * Mã màu chủ đạo: Hồng đậm thương hiệu `#AF445A` (thay thế triệt để màu vàng gold `#FFC934` ở Navbar).
  * Hiệu ứng chuyển động (Motion & Animation): Mượt mà, tự nhiên, tôn trọng thói quen đọc của người dùng.
* **Yêu cầu phi chức năng (NFR)**:
  * **Zero Cumulative Layout Shift (CLS = 0)**: Cố định độ dày đường viền đáy bằng `border-transparent` giúp Navbar không nảy khi active.
  * **Tránh rò rỉ bộ nhớ (Zero Memory Leak)**: Toàn bộ timer bất đồng bộ được quản lý trong `useEffect` với hàm cleanup `clearInterval`.
  * **Performance & SEO**: 100% các trang đạt SSR và SSG tĩnh tối ưu của Next.js 16 (Turbopack/Webpack).

---

## 3. Danh mục các thay đổi chi tiết (Changes Made)

### 🔹 Stage 1: [components/layout/Navbar.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/layout/Navbar.tsx)
* Khai báo danh mục điều hướng dạng mảng cấu trúc `NAV_ITEMS`:
  * Hỗ trợ cờ `{ exact: true }` cho trang chủ `/` và `{ hasDropdown: true }` cho mục Khóa học.
* Tích hợp hàm `getLinkClass(href, exact)` với `border-b-2 pb-1 border-transparent` ở trạng thái thường và `border-[#AF445A]` khi kích hoạt -> Ngăn ngừa giật layout khi đổi route.
* Sửa lỗi hover mờ nhạt trên giao diện tối (Dark mode): Đổi `hover:text-white` thành `hover:text-[#AF445A] hover:border-[#AF445A]/40`.
* Kết nối menu con Dropdown với **3 khóa học từ Database** (`seedCourses` / CMS):
  * *Khóa SQL for Data Analytics* (12 buổi)
  * *Khóa Data Analytical Thinking* (16 buổi)
  * *Combo End-to-End Analytics with SQL & Dashboard Design* (25 buổi) với phong cách combo nổi bật.
* Đồng bộ hoàn hảo cho cả Desktop Header và Drawer Mobile Menu.

### 🔹 Stage 2: [components/home/RoadmapCard.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/RoadmapCard.tsx)
* Chuyển đổi toàn bộ thiết kế thẻ lộ trình thành **Component Con nhộng (Capsule/Pill Shape)**:
  * Độ bo cong con nhộng: `rounded-[36px] sm:rounded-[42px]`.
  * Tỷ lệ thẻ hẹp - dài thanh thoát: `min-h-[300px] w-full px-5 py-7 sm:py-8`.
  * **Căn giữa toàn bộ nội dung (Centered Layout)**:
    * Badge pill giai đoạn `Giai đoạn 01/02/03/04` căn giữa.
    * Tiêu đề giai đoạn căn giữa `font-heading font-bold text-center`.
    * Đoạn mô tả căn giữa `max-w-[220px] text-center`.
    * Thẻ kỹ năng (Tags) xếp căn giữa trên đường kẻ mờ phân tách.
* Hiệu ứng Active: Viền `#AF445A`, hào quang đổ bóng `shadow-[0_12px_36px_rgba(175,68,90,0.22)]`, nền gradient sáng ấm và nhấc cao `-translate-y-2`.

### 🔹 Stage 3: [components/home/CoursesSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/CoursesSection.tsx)
* Thiết lập đường ray trượt CSS Flex Slider liên tục `flex transition-transform duration-700 ease-in-out` với `style={{ transform: 'translateX(-${currentIndex * 100}%)' }}`.
* Tự động chuyển bài (Autoplay): Tích hợp timer chu kỳ 4.5s tự động lướt khóa học từ phải sang trái.
* Tính năng thông minh `Pause on Hover`: Tự động hủy timer khi chuột rê vào vùng đọc và kích hoạt lại khi chuột rời đi, giúp học viên đọc kỹ thông tin mà không bị trôi khóa học.
* Đồng bộ hóa bộ điều khiển: Các nút Previous/Next và dải chấm tròn (Dots) phản hồi chuyển slide mượt mà.

### 🔹 Stage 4: [components/home/AlumniCompaniesSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/AlumniCompaniesSection.tsx)
* **Giữ logo thuần túy (Không dùng background container)**: Bỏ toàn bộ box trắng/pill nền, hiển thị logo trực tiếp trên dải chạy nền tối.
* **Tăng sáng trực tiếp**: Gỡ bỏ `opacity-75`, tăng cường độ sáng và tương phản bằng bộ lọc `filter brightness-125 contrast-105 hover:brightness-140`.
* **Xử lý triệt để file `irtech.webp`**: Dùng công cụ xử lý ảnh bóc tách khoảng trống trong suốt thừa (hơn 45% diện tích rỗng), đưa canvas về chuẩn khít `1430x1452`.
* **Cân bằng quang học (Visual Balance)** cho cả 5 thương hiệu:
  * MoMo, Shopee, GHN, IRTech hiển thị ở tỷ lệ `h-9 sm:h-10`.
  * ACB (dạng chữ ngang) tinh chỉnh ở `h-7 sm:h-8` để có trọng lượng thị giác cân đối hoàn hảo.
* **Vòng lặp nối đuôi nhau liên tục (Seamless Infinite Stream)**:
  * Mở rộng khoảng cách `gap-16 sm:gap-20 lg:gap-24`.
  * Nhân bản mảng logo để tổng chiều dài vượt 3000px, đảm bảo các logo nối đuôi nhau liên tục, không xuất hiện khoảng trống hở trên màn hình lớn.

### 🔹 Stage 5: [WhyChooseUsSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/WhyChooseUsSection.tsx) & [BlogSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/BlogSection.tsx)
* **`WhyChooseUsSection.tsx`**:
  * Đặt `hoveredIndex` mặc định là `null`, trả cả 3 thẻ về trạng thái thẻ trắng thanh lịch ban đầu.
  * Chỉ khi hover chuột vào thẻ nào thì thẻ đó mới đổi sang màu gradient tím hồng nổi bật.
* **`BlogSection.tsx`**:
  * Bỏ gán cứng thẻ đầu tiên (`isFeatured = idx === 0`).
  * Đồng bộ cơ chế `hoveredIndex`: Mặc định cả 3 thẻ bài viết là thẻ trắng. Khi rê chuột vào thẻ nào, thẻ đó mới chuyển sang style nổi bật `bg-card-gradient text-white shadow-2xl` và nhấc cao `-translate-y-2`.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing & Quality Gates)

Toàn bộ các tiêu chuẩn kiểm định tự động (Quality Gates) của dự án đều đạt kết quả tuyệt đối:

| STT | Công cụ kiểm tra | Lệnh thực thi | Tiêu chí đạt | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :--- | :--- | :---: |
| 1 | **TypeScript Engine** | `npm run typecheck` | 0 syntax errors, 0 type mismatches | 0 errors | ✅ **PASSED** |
| 2 | **ESLint Linter** | `npm run lint` | Tuân thủ quy chuẩn Next.js & React Hooks | 0 errors | ✅ **PASSED** |
| 3 | **Production Compiler** | `npm run build` | Biên dịch 100% các trang SSG/SSR | 19/19 routes OK | ✅ **PASSED** |
| 4 | **Marquee Continuity** | Kiểm thử trực quan | Chạy vô tận, không giật, không hở khoảng trống | Hoàn hảo | ✅ **PASSED** |
| 5 | **Slider Touch & Hover** | Kiểm thử tương tác | Pause on hover, chuyển động êm từ phải sang trái | Hoàn hảo | ✅ **PASSED** |

---

## 5. Danh mục các file tác động (Impacted Files)

```
components/
├── layout/
│   └── Navbar.tsx                         # Stage 1: NAV_ITEMS, Hover/Active #AF445A, DB courses
└── home/
    ├── RoadmapCard.tsx                    # Stage 2: Thiết kế thẻ con nhộng hẹp - dài, căn giữa
    ├── HeroSection.tsx                    # Stage 2: Căn chỉnh container grid cân đối
    ├── CoursesSection.tsx                 # Stage 3: Autoplay slider trượt mượt phải sang trái
    ├── AlumniCompaniesSection.tsx         # Stage 4: Logo không nền, cân bằng, marquee nối đuôi
    ├── WhyChooseUsSection.tsx             # Stage 5: Mặc định thẻ trắng, hover đổi màu
    └── BlogSection.tsx                    # Stage 5: Mặc định thẻ trắng, hover nổi bật
public/
└── assets/
    └── companies/
        └── irtech.webp                    # Stage 4: Crop khoảng trống thừa, khít logo chuẩn
```

---

## 6. Hướng dẫn nghiệm thu dành cho Reviewer (Verification Guide)

1. Mở trang chủ ứng dụng tại `http://localhost:3000`.
2. **Kiểm tra Header (Navbar)**:
   - Ở trang chủ, chữ "Trang chủ" có gạch chân và màu hồng `#AF445A`.
   - Rê chuột vào các mục menu: Hiệu ứng đổi màu `#AF445A` rõ nét, khung header không bị nảy/giật.
   - Rê chuột vào "Khóa học": Menu con hiển thị đầy đủ 3 khóa học từ Database.
3. **Kiểm tra HeroSection Roadmap**:
   - 4 thẻ giai đoạn có dáng con nhộng bo tròn lớn, nội dung căn giữa gọn gàng.
4. **Kiểm tra CoursesSection**:
   - Khóa học tự động trượt mượt mà sang trái sau mỗi 4.5s; rê chuột vào đọc bài sẽ tự động dừng lại.
5. **Kiểm tra AlumniCompaniesSection**:
   - 5 logo đối tác không có nền hộp, sáng rõ nét, kích thước cân bằng và chạy nối đuôi nhau liên tục không đứt đoạn.
6. **Kiểm tra WhyChooseUs & Blog**:
   - Cả 2 section đều hiển thị 3 thẻ trắng đồng đều ban đầu; khi rê chuột vào thẻ nào thì thẻ đó mới đổi màu gradient nổi bật.
