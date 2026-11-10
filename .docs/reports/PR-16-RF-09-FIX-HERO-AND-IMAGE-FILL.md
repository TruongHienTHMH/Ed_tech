# Báo Cáo Triển Khai PR-16 (Milestone RF-09): Chuẩn Hóa Hero Section, Ẩn Trên Mobile & Khắc Phục Triệt Để Cảnh Báo Image Fill Height 0

- **Người thực hiện:** Tech Lead / Main Agent
- **Mã PR:** PR-16
- **Milestone:** RF-09 (Hero Layout Alignment, Responsive Mobile, Image Fill Fix & Course Resize)
- **Kế hoạch tham chiếu:** `plan_rf09_fix_hero_layout_image_fill_and_codebase_inventory.md`
- **Thời gian hoàn thành:** 10/11/2026
- **Trạng thái:** ✅ Sẵn sàng merge / Quality Gates đạt 100%

---

## 1. TỔNG HỢP CÁC SỬA ĐỔI ĐÃ TRIỂN KHAI

### 1.1. Khắc Phục Triệt Để Lệch & Ép Hero Section (Figma Node 12:701)
- **Trích xuất lại 2 khối đồ họa từ nguồn gốc `.docs/references/hero-design.png` (3368 x 1300):**
  - **Khối bên trái (`hero-left-artwork.png`):** Cắt chuẩn tọa độ `x = 0..980, y = 80..1200` (chiều rộng 980px, chiều cao 1120px). Hoàn toàn không chạm vào chữ "Học".
  - **Khối bên phải (`hero-right-artwork.png`):** Cắt chuẩn tọa độ `x = 2565..3368, y = 80..1200` (chiều rộng 803px, chiều cao 1120px). Loại bỏ hoàn toàn 165px lẹm chữ cũ, sạch 100% các chữ "tư, duy, h." bóng ma, giữ trọn tác phẩm 3D laptop, biểu đồ và khối tím nguyên bản từ Figma.
- **Tối ưu hiển thị Responsive theo đúng phản hồi từ User:**
  - **Trên Mobile & Tablet (< 1280px):** Ẩn hoàn toàn 2 khối đồ họa (`hidden xl:block`). Toàn bộ không gian Hero trên điện thoại trở nên cực kỳ thoáng đãng, tiêu đề căn giữa hoàn hảo, form email và nút CTA rộng rãi, không bị bất kỳ khối đồ họa nào chèn ép.
  - **Trên Desktop lớn (≥ 1280px / 1440px / 1920px):** 2 khối đồ họa đặt sát mép hai bên (`xl:-left-8 2xl:left-0` và `xl:-right-8 2xl:right-0`), độ rộng tối ưu (`w-[300px..420px]`), nhường trọn khoảng thở trung tâm `max-w-[860px]` cho tiêu đề và form.
  - **Typography responsive:** Tiêu đề `text-3xl sm:text-4xl md:text-5xl xl:text-[56px] 2xl:text-[62px]` ngắt dòng tự nhiên, cân bằng thị giác hoàn hảo.

### 1.2. Khắc Phục Triệt Để Cảnh Báo "Image with src ... has fill and a height value of 0"
- **Nguyên nhân:** Thẻ `<div>` bao bọc trung gian trong `components/common/SafeImage.tsx` trước đó thiếu class `w-full h-full` khi truyền `fill`.
- **Khắc phục:**
  - Cập nhật `SafeImage.tsx`: Khi `fill === true`, tự động gán `${fill ? "w-full h-full" : ""}` cho container wrapper.
  - Xử lý đồng bộ `prevSrc` theo chuẩn React 19 / Next.js 15 không gây re-render hay lỗi ESLint `react-hooks/set-state-in-effect`.
  - Khắc phục đồng loạt cho 14 vị trí ảnh (9 thẻ Projects, slider CoursesSection, testimonials avatars, blog cards).

### 1.3. Resize Ảnh Khóa Học Tại HomePage (Figma Node 12:791)
- Trong `components/home/CoursesSection.tsx`: Thiết lập chiều cao responsive rõ ràng cho khung ảnh:
  `h-[260px] sm:h-[320px] lg:h-[380px] w-full rounded-[24px]` cùng `containerClassName="w-full h-full"`.
- Ảnh khóa học hiển thị sắc nét, tỷ lệ chuẩn đẹp, không bao giờ bị tính chiều cao 0px và không còn cảnh báo preload thừa.

---

## 2. KẾT QUẢ KIỂM THỬ QUALITY GATES

| Kiểm thử | Lệnh thực hiện | Kết quả | Chi tiết |
| :--- | :--- | :---: | :--- |
| **Type Check** | `npm run typecheck` | ✅ PASS | 0 lỗi TypeScript |
| **Linting** | `npm run lint` | ✅ PASS | 0 lỗi ESLint (1 warning font Google non-blocking) |
| **Unit / QA Tests** | `npm run test` | ✅ PASS | 80/80 GAS duplicate & QA + 10/10 Lead validation |
| **Production Build** | `npm run build` | ✅ PASS | 19/19 routes static & dynamic tối ưu thành công |

---

## 3. DANH SÁCH FILE THAY ĐỔI
- `components/common/SafeImage.tsx` (Sửa lỗi fill container height 0)
- `components/home/CoursesSection.tsx` (Resize khung ảnh Course theo Figma 12:791)
- `components/home/HeroSection.tsx` (Căn giữa layout, ẩn trên mobile/tablet, bám sát Figma)
- `public/assets/decorations/hero-left-artwork.png` (Cắt lại ảnh sạch 100%)
- `public/assets/decorations/hero-right-artwork.png` (Cắt lại ảnh sạch 100%, 0 text)
