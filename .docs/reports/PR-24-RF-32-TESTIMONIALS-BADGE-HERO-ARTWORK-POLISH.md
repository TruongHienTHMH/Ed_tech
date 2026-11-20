# Báo Cáo Kỹ Thuật Pull Request: PR-24 (RF-32)
# Refactor TestimonialsSection Chuẩn Figma, Nâng Cấp Primary Badge, Tối Ưu Hero Artwork & Xuất Dữ Liệu CMS

---

## 1. Tóm Tắt Nội Dung (Summary)
Đợt cập nhật **PR-24 (RF-32)** hoàn thiện các hạng mục nâng cấp giao diện và tích hợp dữ liệu CMS quan trọng trên trang chủ **DataWithLy (ed_da_tech)** theo đúng thiết kế Figma:
1. **Refactor TestimonialsSection (`components/home/TestimonialsSection.tsx`)**: Tái cấu trúc chuẩn 100% **Figma Node `12:898`**, áp dụng cơ chế Default/Hover linh hoạt với 2 SVG avatar chuyên biệt (`icon-student-hover.svg` và `icon-student-white.svg`), bố cục lưới 3x3 responsive.
2. **Xuất Dữ Liệu CMS Tab Testimonials (`public/sheets/testimonials.csv`) & Đồng Bộ Seeder**: Tạo file dữ liệu CSV chuẩn 10 cột theo schema Google Sheets CMS để nạp vào hệ thống quản trị, đồng thời cập nhật `TestimonialSeeder.ts` phục vụ SSR / Static fallback.
3. **Refactor Badge Component (`components/common/Badge.tsx`)**: Bổ sung variant `primary` và đồng bộ `tag` chuẩn **Figma Node `12:894` (Button 6)** với dải màu gradient thương hiệu `#AF445A` → `#784080`, bo cong `rounded-[35px]` và typography in hoa nổi bật.
4. **Tối Ưu & Tinh Chỉnh Vị Trí Hero Artwork (`components/home/HeroSection.tsx`)**: Chuyển đổi sang tài nguyên vector SVG sắc nét (`hero-left.svg`, `hero-right.svg`), dịch chuyển 2 ảnh vào giữa thêm 30px và nâng độ cao ngang hàng với dòng phụ đề giới thiệu mentor.

---

## 2. Thông Tin Pull Request
* **Mã PR**: PR-24
* **Mã Refactor / Ticket**: `RF-32`
* **Nhánh làm việc (Branch)**: `refactor/homepage-update`
* **Nhánh đích (Target Branch)**: `main`
* **Các file chính liên quan**:
  * `components/home/TestimonialsSection.tsx`
  * `components/common/Badge.tsx`
  * `components/home/HeroSection.tsx`
  * `database/seeders/TestimonialSeeder.ts`
  * `public/sheets/testimonials.csv`
  * `public/assets/mentor/icon-student-hover.svg` (hoặc `icon-student-primary.svg`)
  * `public/assets/mentor/icon-student-white.svg`
  * `public/assets/decorations/hero-left.svg`
  * `public/assets/decorations/hero-right.svg`

---

## 3. Danh Mục Thay Đổi Chi Tiết (Detailed Changes)

### 🔹 1. [components/home/TestimonialsSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/TestimonialsSection.tsx)
* **Quy chuẩn kích thước & kiểu dáng theo Figma Node `12:898`**:
  * Chiều cao tối thiểu của thẻ: `min-h-[272px]`, bo góc `rounded-[16px]`, đệm trong `p-6` (24px).
  * 5 ngôi sao vàng rực rỡ: Sử dụng SVG path chuẩn màu `#FFC934` (size `20x20px`, khoảng cách `gap-[2px]`).
  * Nội dung trích dẫn (Review Quote): Font Medium `text-[16px] sm:text-[17px]`, độ cao dòng `leading-[26px]`, giới hạn 4 dòng (`line-clamp-4`) chống tràn layout.
  * Thông tin học viên: Avatar tròn `48x48px`, Tên học viên font Bold `text-[17px] sm:text-[18px]` `tracking-[-0.02em]`, Tên khóa học font Regular `text-[14px] sm:text-[15px]`.
* **Cơ chế tương tác Default & Hover mượt mà**:
  * **Trạng thái mặc định (Default State)**: Tất cả các thẻ hiển thị nền trắng thanh lịch `bg-white`, viền mảnh `border-neutral-200/90`, đổ bóng mềm `shadow-[0_4px_16px_rgba(0,0,0,0.06)]`. Toàn bộ chữ có màu xám đậm `#2E2E2E` và xám `#686868`. Avatar sử dụng hình ảnh vector gradient tím hồng nền tròn (`icon-student-hover.svg` / `icon-student-primary.svg`).
  * **Trạng thái rê chuột (Hover State)**: Kích hoạt thông qua React state `hoveredId` kết hợp Tailwind CSS. Thẻ chuyển sang nền dải màu thương hiệu `bg-gradient-to-r from-[#784080] to-[#AF445A]`, hiệu ứng đổ bóng hồng tỏa hào quang `drop-shadow-[0px_0px_20px_rgba(175,68,90,0.25)]`, nhấc nhẹ `-translate-y-1.5`. Toàn bộ text (Quote, Name, Course) chuyển sang màu trắng sáng `text-white`. Avatar tự động đổi sang vòng tròn trắng với icon xám đậm (`icon-student-white.svg`) giúp đạt độ tương phản tối ưu.
* **Bố cục lưới Responsive 3x3**:
  * Desktop (xl/lg): 3 cột (`grid-cols-3`).
  * Tablet (md): 2 cột (`grid-cols-2`).
  * Mobile (sm/xs): 1 cột (`grid-cols-1`).

---

### 🔹 2. [public/sheets/testimonials.csv](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/public/sheets/testimonials.csv) & [TestimonialSeeder.ts](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/database/seeders/TestimonialSeeder.ts)
* **Tạo file dữ liệu chuẩn `public/sheets/testimonials.csv`**:
  * Cấu trúc 10 cột tương thích 100% với Google Sheets CMS Content Master Tab `testimonials` (từ `apps-script/cms/03_CmsTablesSetup.gs`):
    ```csv
    id,student_name,role,company,avatar_url,course_id,rating,review_text,is_featured,is_active
    ```
  * Cung cấp 9 bản ghi đánh giá phong phú từ học viên mẫu Figma (*Nguyen Van Huy*) đến các học viên thực tế tại MoMo, MB Bank, Shopee Vietnam, GHN, VNDIRECT, Unilever Vietnam, Tiki, ACB Bank.
* **Đồng bộ hóa Seeder [TestimonialSeeder.ts](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/database/seeders/TestimonialSeeder.ts)**:
  * Cập nhật 9 bản ghi vào hệ thống Laravel-style DatabaseSeeder.
  * Giúp quá trình build tĩnh SSG và SSR hiển thị trọn vẹn 9 thẻ đánh giá ngay cả khi chưa kết nối Google Sheets Webhook.

---

### 🔹 3. [components/common/Badge.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/common/Badge.tsx)
* **Nâng cấp chuẩn Figma Node `12:894` (Button 6)**:
  * Thêm variant **`primary`** và thiết lập làm variant mặc định (`variant = "primary"`).
  * Đồng bộ variant **`tag`** sang cùng phong cách gradient nhận diện thương hiệu:
    * Nền: `bg-gradient-to-r from-[#AF445A] to-[#784080]` (chuẩn linear-gradient 92.5°).
    * Typography: `text-white font-bold tracking-[0.96px] uppercase`.
    * Bo góc dạng capsule: `rounded-[35px]`.
    * Kích thước chuẩn Size `md`: `px-5 py-2` (tương đương `px-[20px] py-[8px]` trên Figma).
* **Ứng dụng tại [TestimonialsSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/TestimonialsSection.tsx)**:
  * Header section badge `<Badge variant="primary" size="md">ĐÁNH GIÁ THỰC TẾ</Badge>` hiển thị nổi bật và nhất quán với Figma Node `12:892`.

---

### 🔹 4. [components/home/HeroSection.tsx](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/home/HeroSection.tsx)
* **Nâng cấp tài nguyên Vector SVG**:
  * Thay thế file hình ảnh bằng 2 vector SVG sắc nét: `/assets/decorations/hero-left.svg` và `/assets/decorations/hero-right.svg`, không bị vỡ hạt trên màn hình độ phân giải cao (Retina, 2K, 4K).
* **Tinh chỉnh vị trí thủ công (Manual Positioning)**:
  * **Dịch chuyển 30px vào giữa**:
    * Ảnh Trái: Đổi từ `xl:left-4 2xl:left-12` sang `xl:left-[46px] 2xl:left-[80px]` (đẩy sang phải vào gần nội dung).
    * Ảnh Phải: Đổi từ `xl:right-4 2xl:right-12` sang `xl:right-[46px] 2xl:right-[80px]` (đẩy sang trái vào gần nội dung).
  * **Nâng cao ngang hàng Subtitle**:
    * Đổi tọa độ `top` từ `top-[210px] - top-[220px]` sang `xl:top-[165px] 2xl:top-[170px]`.
    * Giúp tâm của 2 hình ảnh trang trí nằm ngang hàng với dòng phụ đề: *"Đồng hành cùng mentor có hơn 5 năm kinh nghiệm tại MoMo, Tiki..."*, tạo bố cục thị giác cân xứng và sang trọng.

---

## 4. Kết Quả Kiểm Thử Hệ Thống (Quality Gates & Verification)

Toàn bộ các bài kiểm tra tự động đã được thực hiện nghiêm ngặt và đạt kết quả hoàn hảo:

1. **TypeScript Typecheck (`npm run typecheck`)**:
   ```bash
   > ed_da_tech@0.1.0 typecheck
   > tsc --noEmit
   # => Passed (0 errors)
   ```
2. **ESLint (`npm run lint`)**:
   ```bash
   > ed_da_tech@0.1.0 lint
   > eslint
   # => Passed (0 errors, 1 warning font layout không ảnh hưởng)
   ```
3. **Next.js Production Build (`npm run build`)**:
   ```bash
   > ed_da_tech@0.1.0 build
   > next build --webpack
   ▲ Next.js 16.3.4 (webpack)
   ✓ Compiled successfully in 1586ms
   ✓ Generating static pages (19/19)
   # => Passed 100% (19/19 routes tĩnh & dynamic SSR)
   ```

---

## 5. Hướng Dẫn Nạp Dữ Liệu CMS (CMS Import Guide)

Dành cho quản trị viên nội dung khi muốn cập nhật đánh giá học viên lên Google Sheets:
1. Mở file bảng tính **DataWithLy CMS Content Master** trên Google Sheets.
2. Chọn Tab **`testimonials`**.
3. Vào menu **File (Tệp)** ➔ **Import (Nhập)** ➔ **Upload (Tải lên)**.
4. Chọn file [public/sheets/testimonials.csv](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/public/sheets/testimonials.csv) từ dự án.
5. Chọn tùy chọn **"Replace current sheet"** (Thay thế trang tính hiện tại) hoặc chèn tiếp các hàng dữ liệu từ hàng thứ 2.
6. Hệ thống Webhook sẽ tự động đồng bộ dữ liệu mới nhất về website thông qua cơ chế On-Demand Revalidation.
