# Báo Cáo Kỹ Thuật (Pull Request) #11: Căn Chỉnh Chi Tiết Khóa Học & Khắc Phục Lỗi Responsive (RF-04)

- **Mã báo cáo:** `PR-11-RF-04-COURSE-DETAILS-AND-RESPONSIVE`
- **Tên nhánh đề xuất:** `feature/rf-04-course-detail-and-responsive`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-09

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này hoàn thành trọn vẹn **Milestone RF-04** — cột mốc cuối cùng trong kế hoạch refactor toàn diện dự án **DataWithLy**:
1. **Căn chỉnh `CourseHero.tsx` chuẩn thiết kế Figma Node `12:1427` & `12:1430`:**
   - **Xóa bỏ hoàn toàn khối Trust Proof Bullets** (3 gạch đầu dòng cam kết phía dưới nút bấm) theo đúng yêu cầu checklist.
   - **Cập nhật Badges:** Sử dụng Unit Component `Badge` chuẩn hệ thống:
     * `Badge variant="tag"`: Hiển thị chủ đề khóa học (`course.tag`).
     * `Badge variant="level"`: Hiển thị trình độ học viên (`course.level`).
     * `Badge variant="liveClass"`: Hiển thị "Live Class" với hiệu ứng radar pulsing xanh lá (`animate-ping`) chuẩn Figma.
     * **Gỡ bỏ hoàn toàn** badge "Mentor Hứa Thảo Ly trực tiếp kèm" trong danh sách badges đầu trang theo yêu cầu.
   - **Bổ sung đầy đủ 4 thông số khóa học theo Figma Node `12:1430`:**
     * Thời lượng: `{course.duration || "12 buổi học (24 giờ)"}` (icon `Clock`).
     * Lịch học: "Tối Thứ 3 & Thứ 5 (19:30 - 21:30)" (icon `Calendar`).
     * Khai giảng: "Khai giảng: 15 hàng tháng" (icon `Calendar`).
     * Hình thức học: "Live Class Zoom 100%" (icon `Video`).
   - Tích hợp Unit Component `Button` cho nút "Đăng ký tư vấn ngay" và "Xem đề cương chi tiết".

2. **Khắc phục triệt để lỗi Responsive của `CourseMethodologyFlow.tsx`:**
   - Loại bỏ các wrapper thừa `w-full py-14`, `max-w-[1200px]`, chuyển về `<section className="mb-12" id="methodology">` ăn khớp hoàn toàn với Cột Trái rộng **792px**.
   - Bố cục 5 bước: Chuyển đổi từ ép 5 cột (`grid-cols-5` bị co rúm 140px/card) sang lưới 2 cột cân đối `grid-cols-1 sm:grid-cols-2 gap-4`, card bước 5 span đều `sm:col-span-2` tạo điểm nhấn hoàn thiện quy trình.
   - Gỡ bỏ hoàn toàn nút tròn mũi tên absolute `-right-3.5` gây tràn card và đè chữ.

3. **Khắc phục triệt để lỗi Responsive của `CourseOutcomes.tsx`:**
   - Loại bỏ wrapper thừa `max-w-[1200px]`, chuyển thành `<section className="mb-12" id="outcomes">`.
   - 4 Trụ cột năng lực: Chuyển sang lưới 2x2 cân xứng (`grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5`), hiển thị thoáng đãng và dễ đọc.
   - Portfolio mẫu tốt nghiệp: Chuyển từ lưới 3 cột sang lưới 2 cột (`grid-cols-1 sm:grid-cols-2 gap-5`), kích thước ảnh dashboard tỷ lệ 16:10 sắc nét, badge danh mục rõ ràng.

4. **Căn chỉnh `CourseFigmaStickySidebar.tsx`:**
   - Tích hợp Unit Component `Button` cho nút "Đăng ký ngay" (`variant="primary"`) và "Nhận tư vấn 1:1" (`variant="outline"`).

5. **Bổ sung Icon `Calendar` trong `components/common/Icons.tsx`:**
   - Hỗ trợ render lịch học sắc nét chuẩn SVG.

---

## 2. Kết quả kiểm tra Quality Gates

| Quy trình kiểm định | Lệnh chạy | Kết quả | Ghi chú |
| :--- | :--- | :---: | :--- |
| **ESLint** | `npm run lint` | **PASSED** | 0 errors |
| **TypeScript Typecheck** | `npm run typecheck` | **PASSED** | 0 errors, `tsc --noEmit` hoàn tất sạch sẽ |
| **GAS & Modals QA Tests** | `npm run test:gas` | **PASSED** | 80/80 test cases đạt 100% |
| **Lead Form & Security Tests** | `npm run test:lead` | **PASSED** | 10/10 test cases đạt 100% |
| **Rate Limiter Tests** | `npm run test:rate` | **PASSED** | Vượt qua 100% |
| **Production Build** | `npm run build` | **PASSED** | Sinh thành công 19/19 routes SSG/ISR, bao gồm toàn bộ dynamic route `/courses/[slug]` |

---

## 3. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- Mở bất kỳ trang khóa học nào (như `/courses/sql-for-data-analytics`):
  + Hero hiển thị tinh tế với badge "Live Class" có chấm xanh phát sáng, đầy đủ lịch học và thời lượng, không còn các dòng cam kết thừa.
  + Cột trái 792px: Phương pháp học 5 bước và Chuẩn đầu ra hiển thị cân đối hoàn hảo, không còn tình trạng chữ bị đè hay thẻ bị bóp méo.
  + Cột phải 384px: Sticky sidebar chạy theo mượt mà khi cuộn trang, các nút bấm đồng bộ màu sắc và hiệu ứng chuẩn Design System.

---

## 4. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** Milestone này đã giải quyết toàn bộ các lỗi hiển thị trên trang Chi tiết Khóa học. Giao diện giờ đây rất thoáng đãng, các thông tin quan trọng như Lịch học, Khai giảng, Học phí và Lộ trình 5 bước được trình bày rõ ràng, dễ nhìn trên cả máy tính lẫn điện thoại, giúp học viên dễ dàng nắm bắt thông tin và bấm đăng ký ngay!

---

## 5. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Đã xóa khối Trust Proof Bullets trong `CourseHero.tsx`.
- [x] Đã cập nhật badge Live Class (pulsing green dot), tag, level.
- [x] Đã bỏ badge "Mentor nào kèm".
- [x] Đã bổ sung 4 trường thông số khóa học theo Figma Node 12:1430.
- [x] Đã sửa lỗi responsive co rúm của `CourseMethodologyFlow.tsx` trong cột 792px.
- [x] Đã sửa lỗi responsive co rúm của `CourseOutcomes.tsx` trong cột 792px.
- [x] Đã tích hợp `Button.tsx` cho `CourseFigmaStickySidebar.tsx` và `CourseHero.tsx`.
- [x] Đã nghiệm thu độc lập đạt chuẩn PASS 100%.
