# BÁO CÁO NGHIỆM THU MILESTONE RF-10: GIẢI QUYẾT LỘ TRÌNH COURSEDETAIL, EMAIL THÔNG BÁO 2 CHIỀU & KIẾN TRÚC STATE

**Mã định danh:** PR-17-RF-10  
**Nhánh Git:** `feature/rf-10-curriculum-email-and-state-polish`  
**Trạng thái:** ✅ SẴN SÀNG TRIỂN KHAI (100% Quality Gates Passed)

---

## 1. MỤC TIÊU VÀ YÊU CẦU ĐÃ ĐÁP ỨNG

1. **Fix Lộ trình khóa học (Curriculum) ở trang CourseDetail (`/courses/[slug]`):**
   - Đáp ứng nghiêm ngặt yêu cầu: *"Không thực hiện chỉnh sửa ở Sheets - gọi đúng tên id để nhận được lộ trình"*.
   - Khắc phục lỗi lệch cột của dữ liệu thô trên Google Sheets (`module_title` chứa số thứ tự, `duration_hours` chứa tiêu đề buổi học...).
   - Hỗ trợ gọi linh hoạt theo `(course.id, course.slug)` cùng alias resolution và cơ chế fallback tự động sang `seedCurriculum` cho các khóa chưa nhập đủ dòng trên Sheets.
   - Tổng hợp lộ trình 27 buổi đầy đủ cho khóa combo `end-to-end-analytics` (kết hợp SQL + Dashboard Thinking).

2. **Gỡ bỏ nút "Đồng bộ ngay" (DevSyncButton):**
   - Đã xóa hoàn toàn component `components/common/DevSyncButton.tsx` và dọn sạch import trong `app/layout.tsx`.
   - Hệ thống chuyển đổi trọn vẹn sang cơ chế TanStack Query / ISR On-demand Revalidation tự động.

3. **Hệ thống Email thông báo 2 chiều cho Lead:**
   - **Email 1 (Client / Admin):** Gửi đến `hientruongthmh@gmail.com` (có thể cấu hình thêm email khách hàng qua `CLIENT_NOTIFICATION_EMAILS` trong Apps Script), trình bày đầy đủ thông tin: Họ tên, Số điện thoại, Email, Khóa học quan tâm, Nhu cầu/ghi chú, Nguồn UTM, Mã đơn Lead.
   - **Email 2 (Học viên / Lead):** Gửi email cảm ơn cá nhân hóa từ Mentor Hứa Thảo Ly, cam kết liên hệ tư vấn trong vòng 15-30 phút, kèm nút bấm nổi bật liên kết trực tiếp đến Zalo Mentor (`https://zalo.me/...`).

4. **Kiến trúc SSR vs CSR, Server State vs Client State (TanStack Query + Zustand):**
   - Phân định rõ ràng ranh giới giữa Server Components (RSC) và Client Components (CSR).
   - Tối ưu hóa caching trên Next.js Data Cache và TanStack Query.
   - Khẳng định tính tương thích cao và đề xuất mô hình phân chia trách nhiệm: **TanStack Query** (quản lý Remote Server State) song hành cùng **Zustand** (quản lý Local UI State).

---

## 2. CHI TIẾT THAY ĐỔI THEO TỪNG TẬP TIN

### 2.1. Lộ trình khóa học & Caching
- `lib/cms/sheets-client.ts`: Thêm bộ lọc và phục hồi thông minh cho cấu trúc cột lệch trong tab `curriculum` của Google Sheets; tự động nạp `seedCurriculum` nếu khóa học chưa có dữ liệu trên Sheets.
- `lib/services/course.service.ts`: Cập nhật phương thức `getCurriculumByCourseId(courseId, secondaryIdentifier)` hỗ trợ tra cứu đa định danh (`id`, `slug`, `aliases`), tự động ghép 2 giai đoạn cho khóa combo.
- `app/courses/[slug]/page.tsx`: Cập nhật gọi `CourseService.getCurriculumByCourseId(course.id, course.slug)`.

### 2.2. Dọn dẹp nút Manual Sync
- `components/common/DevSyncButton.tsx`: Đã xóa bỏ.
- `app/layout.tsx`: Gỡ bỏ component `<DevSyncButton />`.

### 2.3. Google Apps Script Email Notification
- `apps-script/00_Config.gs`: Khai báo `CLIENT_NOTIFICATION_EMAILS: "hientruongthmh@gmail.com"` và `ZALO_CONTACT_URL`.
- `apps-script/04_WebAppEndpoints.gs`: Bổ sung hàm nghiệp vụ `sendLeadEmails(record)` gửi cả email Admin và email học viên kèm nút Zalo; kích hoạt trong action `submit_lead`.
- `apps-script/dist/Code.bundle.gs`: Đã build lại bundle hoàn chỉnh thông qua `npm run bundle:gas`.

### 2.4. Kiểm thử tự động Email
- `scripts/test-email-notification.js`: Bộ kiểm thử 18 assertions bao quát kiểm tra cú pháp Apps Script, bundle, payload email Admin, payload email học viên và việc xóa DevSyncButton.
- `package.json`: Tích hợp script `"test:email"` và gắn vào lệnh `"test"`.

---

## 3. KẾT QUẢ KIỂM THỬ VÀ QUALITY GATES

| Kiểm thử | Lệnh thực hiện | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| **ESLint** | `npm run lint` | ✅ 0 Lỗi | Đạt chuẩn Next.js 16 / React 19 |
| **TypeScript** | `npm run typecheck` | ✅ 0 Lỗi | Toàn vẹn kiểu dữ liệu |
| **Test Suites** | `npm run test` | ✅ 108/108 PASS | Bao gồm GAS (80), Lead (10), Rate Limiter, Email (18) |
| **Production Build** | `npm run build` | ✅ 19/19 routes | Tạo thành công SSG cho tất cả 4 khóa học |
