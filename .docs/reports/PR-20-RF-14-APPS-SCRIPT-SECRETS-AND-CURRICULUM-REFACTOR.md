# BÁO CÁO NGHIỆM THU MILESTONE RF-14: BẢO MẬT APPS SCRIPT VỚI SCRIPT PROPERTIES & CHUẨN HÓA SCHEMA LỘ TRÌNH (CURRICULUM)

**Mã định danh:** PR-20-RF-14  
**Nhánh Git:** `feature/rf-14-apps-script-secrets-and-curriculum-schema-refactor`  
**Trạng thái:** ✅ SẴN SÀNG TRIỂN KHAI PRODUCTION (100% Quality Gates Passed)  
**Thời gian cập nhật:** 13/11/2026  

---

## 1. MỤC TIÊU ĐÃ HOÀN THÀNH

### 1. Bảo Mật Hóa Toàn Diện Google Apps Script & Điều Hướng Revalidation Webhook
* **Khắc phục triệt để Hardcoded Secrets:**
  - Trong [`apps-script/00_Config.gs`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/00_Config.gs): Loại bỏ 100% các biến chuỗi tĩnh (URL webhook, mã token, email client, link Zalo).
  - Sử dụng `PropertiesService.getScriptProperties().getProperty(...)` với hàm helper `getScriptProperty(key, fallback)`.
* **Cơ chế Điều hướng Webhook Tự động (`WEB_DEPLOY_URL`):**
  - Bổ sung thuộc tính `WEB_DEPLOY_URL`. Khi quản trị viên nhập URL Vercel (ví dụ: `https://ed-da-tech.vercel.app`), Apps Script tự động kết hợp với `REVALIDATION_SECRET` để gửi lệnh POST tới `${WEB_DEPLOY_URL}/api/revalidate?secret=...` làm mới tức thì website production khi biên tập dữ liệu trên Sheets.
* **Tài liệu kiểm tra (Checklist):** Cập nhật đầy đủ file [`GOOGLE_SCRIPT_PROPERTIES.local.txt`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/.docs/deployment/GOOGLE_SCRIPT_PROPERTIES.local.txt) với 7 cặp thông số bảo mật chi tiết.

---

### 2. Chuẩn Hóa Schema Cột Tab Lộ Trình (`curriculum`) Cho Quản Trị Viên
* **File cập nhật:** [`apps-script/03_TablesSetup.gs`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/03_TablesSetup.gs) & [`apps-script/04_WebAppEndpoints.gs`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/04_WebAppEndpoints.gs)
* **Bảng 11 Cột Chuẩn Hóa:**
  1. `id`: Mã định danh buổi học (`cur-sql-01`).
  2. `course_id`: Khóa học áp dụng (`sql-for-data-analytics`).
  3. `course_name`: Tên khóa học (`SQL for Data Analytics: Từ Cơ Bản Đến Nâng Cao`).
  4. `week`: **Tuần** (Tuần học: `1`, `2` hoặc `Tuần 1`).
  5. `day`: **Buổi học** (Số thứ tự buổi: `1`, `2`, `3`...).
  6. `date`: **Ngày của buổi học** (Badge ngày: `TH10 03`, `TH10 05` hoặc `03/10`).
  7. `session_title`: **Nội dung của từng buổi** (Tiêu đề buổi học).
  8. `session_desc`: **Miêu tả nội dung buổi học** (Tóm tắt tổng quan mục tiêu).
  9. `sub_content`: **Sub Content (Chi tiết buổi học)** (Danh sách dot list xổ xuống khi bấm dropdown, xuống dòng bằng Enter).
  10. `duration`: **Thời lượng** (`3 giờ`).
  11. `sort_order`: **Thứ tự sắp xếp**.

---

### 3. Tái Thiết Kế Modal Nhập Liệu Lộ Trình (`CurriculumModal`)
* **Files cập nhật:** [`apps-script/CurriculumModal.html`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/CurriculumModal.html) & [`apps-script/07_CurriculumModal.gs`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/07_CurriculumModal.gs)
* **Tính năng:**
  - **Giữ mối quan hệ chặt chẽ với Khóa học:** Dropdown chọn khóa học từ danh sách `coursesList`, hiển thị số lượng buổi học hiện có.
  - **Card Repeater:** Mỗi card đại diện cho 1 buổi học với tiêu đề động: `📚 Buổi học #X (Tuần Y)`.
  - **Tự động tăng số buổi và tính tuần:** Khi thêm card mới, `day` tự động tăng (`base + i + 1`) và `week` tự động tính `Math.ceil(day / 2)`.
  - **Nhập Sub Content chuyên nghiệp:** Hỗ trợ nhập danh sách dot list đa dòng phân tách bằng phím Enter.
  - **Đóng gói mã nguồn:** Đã chạy `npm run bundle:gas` cập nhật thành công [`apps-script/dist/Code.bundle.gs`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/apps-script/dist/Code.bundle.gs) (3,913 dòng, 257KB).

---

### 4. Đọc Dữ Liệu Trực Tiếp Từ Google Sheets (Single Source of Truth)
* **Files cập nhật:** [`lib/cms/types.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/types.ts), [`lib/cms/sheets-client.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/cms/sheets-client.ts), [`lib/services/course.service.ts`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/lib/services/course.service.ts)
* **Xử lý:**
  - Loại bỏ hoàn toàn sự phụ thuộc vào seeder cứng đối với lộ trình học khi Google Sheets có dữ liệu.
  - Bóc tách đa dòng từ `sub_content` thành mảng `string[]`.
  - Tự động phân tích date badge linh hoạt từ các định dạng `"TH10 03"`, `"03/10"` hoặc `"03"`.
  - Hỗ trợ đầy đủ alias tương thích ngược.

---

### 5. Nâng Cấp Giao Diện `CourseFigmaWeekAccordion.tsx`
* **File cập nhật:** [`components/course/CourseFigmaWeekAccordion.tsx`](file:///Users/hientruongthmh/Documents/Web_Jobs/ed_da_tech/components/course/CourseFigmaWeekAccordion.tsx)
* **Trải nghiệm người dùng mới:**
  - **Nhóm Tuần:** Nhóm các buổi học theo `week`, tiêu đề tuần rõ ràng `Tuần X` kèm tổng số buổi học.
  - **Figma Date Badge:** Hình vuông bo góc hiển thị tháng (`TH10`) và ngày (`03`) sắc nét từ trường `date`.
  - **Hàng buổi học:** Hiển thị `Buổi {day}: {sessionTitle}` cùng thời lượng (`3 giờ`).
  - **Khối mở rộng khi click dropdown:**
    - Khối tóm tắt: `sessionDesc` trong card bo góc `rounded-xl bg-[#FAF9FA] border border-gray-100 p-3.5`.
    - Khối chi tiết: Danh sách dot list `subContent` với dấu chấm đỏ vang (`text-[#AF445A] font-bold •`), phân tách mạch lạc.

---

## 2. KẾT QUẢ KIỂM THỬ VÀ QUALITY GATES

| Kiểm thử | Lệnh thực hiện | Kết quả | Ghi chú chi tiết |
| :--- | :--- | :--- | :--- |
| **Đóng gói Apps Script** | `npm run bundle:gas` | ✅ **PASS** | Đóng gói thành công `Code.bundle.gs` (3,913 dòng) |
| **GAS QA Test Suite** | `npm run test:gas` | ✅ **80/80 PASS** | 100% assertions về ID, Form, Function, Repeater đạt chuẩn |
| **Lead & Email Tests** | `npm run test:lead && npm run test:email` | ✅ **28/28 PASS** | Rate limit, honeypot, validation, email notifications |
| **TypeScript Typecheck** | `npm run typecheck` | ✅ **0 Lỗi** | Toàn bộ type definitions & props khớp 100% |
| **ESLint Static Analysis**| `npm run lint` | ✅ **0 Lỗi** | Không còn biến unused hoặc cú pháp sai lệch |
| **Production Build (SSG)** | `npm run build` | ✅ **19/19 Routes** | Biên dịch tĩnh thành công toàn bộ các trang |

---

## 3. CHECKLIST SCRIPT PROPERTIES CHO QUẢN TRỊ VIÊN

Quản trị viên vào **Google Apps Script -> Project Settings -> Script Properties** và nhập các thông số sau:

| Property (Key) | Giá trị mẫu (Value) | Mô tả |
| :--- | :--- | :--- |
| `SHARED_SECRET` | `96e77022e0f8c18c7da95b88b2be38810aa205e2c452e70cad121272bc3d03dd` | Khóa xác thực hai chiều |
| `WEB_DEPLOY_URL` | `https://your-domain.vercel.app` | URL Web đã deploy trên Vercel để nhận Webhook ISR |
| `REVALIDATION_SECRET` | `datawithly_secure_reval_token_2026` | Token bí mật cho webhook `/api/revalidate` |
| `CLIENT_NOTIFICATION_EMAILS` | `hientruongthmh@gmail.com` | Email nhận thông báo học viên đăng ký |
| `ZALO_CONTACT_URL` | `https://zalo.me/0934938431` | Link Zalo tư vấn kèm trong email học viên |
| `TELEGRAM_BOT_TOKEN` | *(Để trống nếu chưa dùng)* | Token bot Telegram |
| `TELEGRAM_CHAT_ID` | *(Để trống nếu chưa dùng)* | Chat ID Telegram |

