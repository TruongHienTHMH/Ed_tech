# Báo Cáo Kỹ Thuật (Pull Request) #08: Tinh Gọn Mã Nguồn & Chuẩn Hóa Shared Design System (RF-01)

- **Mã báo cáo:** `PR-08-RF-01-CLEAN-CODE-AND-DESIGN-SYSTEM`
- **Tên nhánh đề xuất:** `feature/rf-01-clean-code-and-design-system`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này hoàn thành trọn vẹn **Milestone RF-01** trong lộ trình refactor dự án **DataWithLy**:
- **Dọn sạch mã nguồn rác (Dead Code Removal):** Xóa bỏ triệt để các component thử nghiệm ban đầu và các trang mock dữ liệu không còn sử dụng, giúp cấu trúc dự án tinh gọn và giảm dung lượng bundle.
- **Tinh chỉnh Kênh hỗ trợ nổi (`FloatingCta.tsx`):** Loại bỏ nút bấm nổi *"Đăng Ký Tư Vấn"* theo đúng yêu cầu tại mục 1.Design của checklist, giữ lại 3 nút liên hệ trực tiếp: Hotline, Messenger và Zalo.
- **Xây dựng bộ Shared Design System Unit Components:** Thiết lập các component nguyên tử dùng chung chuẩn hóa thiết kế Figma (`Button.tsx` và `Badge.tsx`) với đầy đủ biến thể, kích cỡ, trạng thái loading và khả năng tự động thích ứng thẻ liên kết (`next/link`).
- **Nghiệm thu độc lập:** Đã được kiểm thử và nghiệm thu bởi SubAgent QA độc lập, xác nhận vượt qua 100% các chốt kiểm định chất lượng (Quality Gates).

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** Kiến trúc nền tảng (Foundation Architecture) & Giao diện dùng chung (Design System).
- **Quy chuẩn kỹ thuật & Tiêu chuẩn Accessibility:**
  * **WCAG 2.1 AA:** Nút bấm và huy hiệu có trạng thái focus rõ nét (`focus:ring-2 focus:ring-[#AF445A]/40`), tỷ lệ tương phản màu đạt chuẩn.
  * **A11y Semantic:** Thẻ `<aside>` được gán `aria-label="Kênh liên hệ hỗ trợ trực tuyến"`, huy hiệu Live Class có hiệu ứng radar nhấp nháy (`animate-ping`) với `aria-hidden="true"`.
  * **0 Dead Code & 0 Dangling Imports:** Không còn bất kỳ file nào tham chiếu tới các mã nguồn cũ đã xóa.

---

## 3. Danh mục các thay đổi (Changes Made)

### 3.1. Dọn dẹp mã nguồn chết (Dead Code & Legacy Test Files)
- [x] **[DELETE]** `components/test-data/CardTest.tsx` & thư mục `components/test-data/`
- [x] **[DELETE]** `app/tests-data/page.tsx` & thư mục `app/tests-data/`
- [x] **[DELETE]** `components/common/FloatingActions.tsx` (đã được thay thế bởi `FloatingCta.tsx`)
- [x] **[DELETE]** `components/course/CourseAudience.tsx` (đã được thay thế bởi `CourseFigmaOverview.tsx`)
- [x] **[DELETE]** `components/course/CourseCurriculumAccordion.tsx` (đã được thay thế bởi `CourseFigmaWeekAccordion.tsx`)

### 3.2. Cập nhật `components/layout/FloatingCta.tsx`
- [x] Gỡ bỏ nút bấm nổi `Đăng Ký Tư Vấn` (`ctaLocation: "floating_pill_cta"`).
- [x] Dọn dẹp import thừa `openLeadModal`.
- [x] Giữ lại 3 nút liên hệ trực tiếp:
  * **Hotline:** `tel:0934938431`
  * **Messenger:** `https://m.me/datawithly`
  * **Zalo:** `https://zalo.me/0934938431`

### 3.3. Xây dựng Shared Design System Components (`components/common/`)
- [x] **[NEW] `components/common/Button.tsx`**:
  * **Variants:**
    - `primary`: Gradient đỏ-hồng (`#8B1D2C` -> `#AF445A`), hiệu ứng hover bóng đổ nhẹ.
    - `secondary`: Nền đen xám `#2E2E2E` phối viền mờ `border-white/10`.
    - `gold`: Nền vàng thương hiệu `#FFC934`, chữ đen đậm `#252525`.
    - `outline`: Viền mảnh `#AF445A`, chữ `#AF445A`, hover phủ nền nhẹ.
    - `ghost`: Nền trong suốt, hover sáng nhẹ.
  * **Sizes:** `sm` (h-8), `md` (h-10), `lg` (h-12).
  * **Tính năng nâng cao:** Hỗ trợ `isLoading` (spinner SVG tích hợp), `iconLeft`, `iconRight`, `fullWidth`.
  * **Tính đa hình (Polymorphism):** Tự động render thẻ `<Link>` của Next.js khi có prop `href` và thẻ `<button>` khi không có `href`.
- [x] **[NEW] `components/common/Badge.tsx`**:
  * **Variants:**
    - `tag`: Chủ đề khóa học (SQL, Power BI, Python...) với viền hồng đỏ và chữ vàng nổi bật.
    - `level`: Trình độ học viên (Cơ bản, Nâng cao...).
    - `liveClass`: Nhãn lớp học trực tiếp kèm hiệu ứng điểm xanh nhấp nháy (`animate-ping`).
    - `discount`: Nhãn ưu đãi giảm giá nổi bật.
    - `gold`: Nhãn accent vàng ánh kim.
  * **Sizes:** `sm`, `md`.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)

| Quy trình kiểm định | Lệnh chạy | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **ESLint** | `npm run lint` | **PASSED** | 0 errors |
| **TypeScript Typecheck** | `npm run typecheck` | **PASSED** | 0 errors, `tsc --noEmit` hoàn tất trơn tru |
| **Google Apps Script & Modals Tests** | `npm run test:gas` | **PASSED** | 70/70 test cases đạt 100% |
| **Lead Form & Validation Tests** | `npm run test:lead` | **PASSED** | 10/10 test cases đạt 100% |
| **Rate Limiter In-memory Tests** | `npm run test:rate` | **PASSED** | Vượt qua 100% |
| **Production Build** | `npm run build` | **PASSED** | Sinh 19/19 routes SSG/ISR sạch sẽ, không còn route `/tests-data` |

---

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- Nút CTA nổi đã được loại bỏ, giúp góc phải màn hình thoáng đãng, không che khuất nội dung bài đọc và bảng giá.
- Bộ đôi `Button` và `Badge` sẵn sàng phục vụ cho việc chuẩn hóa toàn bộ các Section trong Milestone RF-03 và RF-04.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Đợt này đội ngũ kỹ thuật đã dọn dẹp sạch sẽ toàn bộ các file rác và màn hình thử nghiệm trước đây, giúp website nhẹ hơn và tải nhanh hơn. Nút "Đăng ký tư vấn" dạng bong bóng bay ở góc phải màn hình đã được bỏ theo yêu cầu của Chị, chỉ giữ lại các nút kết nối trực tiếp qua Zalo, Messenger và Gọi điện để khách hàng dễ dàng liên hệ nhanh nhất!

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Đã xóa toàn bộ 5 file/thư mục mã nguồn chết không dùng.
- [x] Đã gỡ bỏ nút "Đăng Ký Tư Vấn" trong `FloatingCta.tsx`.
- [x] Đã tạo `Button.tsx` và `Badge.tsx` với đầy đủ 5 variants.
- [x] Kiểm tra 0 lỗi TypeScript, 0 lỗi ESLint.
- [x] Kiểm tra toàn bộ 80+ test cases pass 100%.
- [x] Kiểm tra `npm run build` thành công 19/19 routes.
