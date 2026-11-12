# BÁO CÁO NGHIỆM THU MILESTONE RF-13: KHẮC PHỤC LỖI JSX INTRINSICTYPES & TINH CHỈNH 4 ĐIỂM UX TRỌNG YẾU

**Mã định danh:** PR-19-RF-13  
**Nhánh Git:** `feature/rf-13-jsx-fix-and-ui-ux-refinements`  
**Trạng thái:** ✅ SẴN SÀNG TRIỂN KHAI PRODUCTION (100% Quality Gates Passed)

---

## 1. MỤC TIÊU ĐÃ HOÀN THÀNH

1. **Khắc Phục Triệt Để Lỗi TypeScript `JSX.IntrinsicElements`:**
   - **Bản chất lỗi:** Thư mục `node_modules/@types/react` và `@types/react-dom` trước đó bị rỗng dẫn đến việc TypeScript Language Server không tìm thấy định nghĩa cho các thẻ HTML cơ bản (`<div>`, `<span>`, `<h1>`...).
   - **Xử lý:** Cài đặt và khôi phục hoàn chỉnh `@types/react@^19` và `@types/react-dom@^19`. Lệnh `npm run typecheck` (`tsc --noEmit`) đạt **0 lỗi tuyệt đối**.

2. **UX 1 - Mở Rộng Phạm Vi Nhận Chuột Cho Header Dropdown (Hitbox Extension):**
   - Loại bỏ khoảng trống vật lý 4px (`mt-1`) giữa nút bấm "Khóa học" và menu dropdown.
   - Bổ sung container đệm liền mạch `absolute top-full left-0 pt-1.5 z-50`. Chuột di chuyển từ chữ "Khóa học" xuống menu luôn nằm 100% trong phạm vi nhận chuột của container, không kích hoạt `onMouseLeave`, không còn hiện tượng chớp tắt.
   - Bổ sung hỗ trợ click toggle để trải nghiệm ghim mở mượt mà trên iPad / màn hình cảm ứng.
   - **Đảm bảo 100% không ảnh hưởng đến Mobile Responsive** vì Navbar Mobile sử dụng Mobile Drawer độc lập (`md:hidden`).

3. **UX 2 - Hero Section Email Call-To-Action Thân Thiện:**
   - Thay thế câu tiếng Anh pháp lý (*"By continuing, you accept our Terms of Use..."*) bằng thông điệp kêu gọi hành động trang nhã:
     > *✨ Nhập email để nhận ngay trọn bộ lộ trình chi tiết & tư vấn 1:1 miễn phí từ Mentor Hứa Thảo Ly*

4. **UX 3 - Cấu Hình Cột `course_kind` Trên Google Sheets Theo Chuẩn Global Badge:**
   - Sử dụng danh từ chuẩn nghiệp vụ: **`course_kind`** (hoặc `kind` / `type`).
   - Cập nhật domain model `Course` ([`lib/cms/types.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/types.ts)) và bộ đọc CMS ([`lib/cms/sheets-client.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/sheets-client.ts)).
   - Cho phép người dùng thêm cột `course_kind` trên tab `courses` của Google Sheets và chọn 1 trong 3 giá trị:
     - 🌟 **`Khóa học nổi bật`** -> Ánh xạ tự động sang `variant="gold"` của Global Badge.
     - 🎯 **`Khóa học nền tảng`** -> Ánh xạ tự động sang `variant="level"` của Global Badge.
     - 🚀 **`Khóa học chuyên sâu`** -> Ánh xạ tự động sang `variant="level"` của Global Badge.
   - Đảm bảo tuân thủ 100% quy ước màu sắc Global CSS và [`Badge.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/common/Badge.tsx).

5. **UX 4 - Tái Cấu Trúc Khối "BẢNG GIÁ & ƯU ĐÃI":**
   - Giữ tiêu đề: *"Đầu tư thông minh cho sự nghiệp"*.
   - Phụ đề mới:
     > *"Kết hợp SQL và Analytical Thinking & Dashboard trong một lộ trình xuyên suốt, giúp bạn xây dựng nền tảng Data Analytics có hệ thống và tiết kiệm hơn so với đăng ký từng khóa riêng lẻ."*
   - **Card bên trái (Đăng ký riêng lẻ):** Bỏ 4 dấu X đỏ tiêu cực, thay bằng 2 bullet định vị nhu cầu tích cực:
     - 🎯 *Phù hợp nếu bạn muốn tập trung vào một nhóm kỹ năng hoặc đã có nền tảng trước đó.*
     - 💰 *Chi phí cao hơn (Tổng 6.780.000VNĐ)*.
     - Dùng bullet tròn tinh tế (`w-2 h-2 rounded-full bg-[#AF445A]/70`) trang nhã.
   - **Card bên phải (Combo nổi bật):** Đã loại bỏ 2 dòng *"Community với hơn 1,200+ members"* và *"Update nội dung kiến thức trọn đời"*, chỉ giữ lại các cam kết thực chiến cốt lõi.

---

## 2. KẾT QUẢ KIỂM THỬ VÀ QUALITY GATES

| Kiểm thử | Lệnh thực hiện | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| **TypeScript** | `npm run typecheck` | ✅ 0 Lỗi | Đã hết 100% lỗi `JSX.IntrinsicElements` |
| **ESLint** | `npm run lint` | ✅ 0 Lỗi | Đạt chuẩn Next.js 16 / React 19 |
| **Test Suites** | `npm run test` | ✅ 108/108 PASS | Bao gồm GAS (80), Lead (10), Rate Limiter, Email (18) |
| **Production Build** | `npm run build` | ✅ 19/19 routes | Tạo thành công toàn bộ các trang SSG & dynamic |

