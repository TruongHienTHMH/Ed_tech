# Checklist Bàn Giao Kỹ Thuật (Technical Handover Checklist)

- **Mục đích:** Đặc tả danh mục tài nguyên kỹ thuật, cấu hình biến môi trường, phân quyền tài khoản đám mây và quy trình chuyển đổi giữa môi trường Staging và Production khi bàn giao hệ thống **DataWithLy**.
- **Đối tượng sử dụng:** TechLead, DevOps Engineer, Backend Developer tiếp quản
- **Trạng thái:** Sẵn sàng nghiệm thu kỹ thuật
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Thiết kế API & Hợp đồng giao tiếp](../07-architecture/api-design.md)
  - [Module Thiết lập kết nối (M00)](../03-modules/M00-setup-and-connectivity/README.md)
  - [Sổ tay vận hành cho Khách hàng](client-operations-guide.md)

---

## 1. Danh mục Tài nguyên Đám mây & Quyền hạn (Cloud Accounts & IAM)

| Nền tảng | Tài nguyên / Dịch vụ | Quyền hạn yêu cầu | Ghi chú & Tài khoản quản trị |
|---|---|---|---|
| **Google Cloud Platform (GCP)** | Google Sheets API v4, Google Drive API | Service Account: `Editor` | Dùng để kết nối API đọc/ghi từ Next.js Server |
| **Google Workspace** | File Google Sheets Quản trị & File Private Leads | Owner / Editor | Tài khoản Google của Founder Hứa Thảo Ly |
| **Google Apps Script** | Webhook Gateway (`Code.gs`) | Web App: "Execute as Me", "Who has access: Anyone" | Nhận POST từ Next.js và chạy kịch bản gửi mail MailApp |
| **Vercel / Cloudflare** | Next.js 15+ Hosting | Project Admin | Triển khai mã nguồn Frontend và Edge CDN |
| **Domain Registrar** | Tên miền `datawithly.edu.vn` (hoặc `.vn` / `.com`) | DNS Management | Trỏ bản ghi A / CNAME về máy chủ Vercel |

---

## 2. Bảng Đối chiếu Biến Môi Trường (Environment Variables Matrix)

| Tên biến môi trường | Môi trường Staging (Thử nghiệm) | Môi trường Production (Chính thức) | Ghi chú bảo mật |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://staging.datawithly.edu.vn` | `https://datawithly.edu.vn` | URL công khai của website |
| `GOOGLE_SHEETS_CONTENT_ID` | ID file Sheets Staging (Nội dung mẫu) | ID file Sheets Production (Chính thức) | Chỉ đọc công khai qua CSV/API |
| `GOOGLE_SHEETS_LEADS_ID` | ID file Sheets Test Leads | ID file Sheets Private Leads thật | **Bảo mật tuyệt đối — Không lộ ra Client** |
| `APPS_SCRIPT_LEADS_WEBHOOK_URL`| Webhook Staging Deployment URL | Webhook Production Deployment URL | Endpoint tiếp nhận lead |
| `REVALIDATION_SECRET` | `staging_revalidate_secret_key_123` | Chuỗi ngẫu nhiên 64 ký tự an toàn | Xác thực Webhook làm mới ISR Cache |
| `DATA_SOURCE_MODE` | `google_sheets` | `google_sheets` | Chế độ nguồn dữ liệu |
| `ADMIN_ALERT_EMAILS` | `hien0934752432@gmail.com, hien.truong230214@vnuk.edu.vn` | Email tư vấn viên chính thức của Chị Ly | Nhận email cảnh báo lead mới |

---

## 3. Quy trình Triển khai Google Apps Script Webhook

Để đảm bảo webhook ghi nhận lead và menu `[DataWithLy CMS]` hoạt động chính xác:

1. **Gắn mã nguồn vào file Sheets:**
   - Mở file Google Sheets Quản trị.
   - Vào menu **`Tiện ích mở rộng (Extensions) > Apps Script`**.
   - Dán toàn bộ mã nguồn `Code.gs` và các file HTML Dialog từ thư mục `scripts/apps-script/`.
2. **Cấu hình Quyền hạn (Permissions):**
   - Bấm **Chạy (Run)** hàm `setupTriggers` lần đầu.
   - Google sẽ hiển thị hộp thoại cấp quyền truy cập: Chọn tài khoản và chấp thuận các quyền: `Google Sheets`, `Gmail / MailApp`.
3. **Triển khai Web App (Deploy as Web App):**
   - Bấm nút **Triển khai (Deploy) > Tùy chọn triển khai mới (New Deployment)**.
   - Chọn loại: **Ứng dụng web (Web App)**.
   - Cấu hình bắt buộc:
     - *Thực thi dưới dạng (Execute as):* **Tôi (Địa chỉ email của bạn - Me)**.
     - *Người có quyền truy cập (Who has access):* **Bất kỳ ai (Anyone)**.
   - Copy đường dẫn Web App URL thu được và gán vào biến môi trường `APPS_SCRIPT_LEADS_WEBHOOK_URL` trên Vercel.

---

## 4. Checklist Chuyển Đổi Môi Trường (Staging ➔ Production Promotion)

Trước khi kích hoạt chính thức website phục vụ chiến dịch tuyển sinh:

- [ ] **1. Kiểm tra File Sheets:** File Google Sheets Production đã có đủ 9 tab nội dung và 1 tab Private Leads theo đúng `references/database-schema.sql`.
- [ ] **2. Kiểm tra Health Check:** Gọi `GET https://datawithly.edu.vn/api/health/sheets` qua Swagger UI `/api-docs` và nhận phản hồi `status: "healthy"` với độ trễ < 800ms.
- [ ] **3. Thử nghiệm Form Tư Vấn End-to-End:**
  - Điền một hồ sơ thử nghiệm trên Form trang chủ.
  - Xác nhận hồ sơ xuất hiện ngay lập tức trong tab `leads` của Sheets Production.
  - Xác nhận email cảm ơn được gửi đến hòm thư người đăng ký và email cảnh báo được gửi đến đội ngũ tư vấn.
- [ ] **4. Thử nghiệm Chống Spam (Anti-Spam Verification):**
  - Kiểm tra Honeypot: Giả lập điền trường `website_hp` -> Form phản hồi Silent Reject (không ghi dòng vào Sheets).
  - Kiểm tra Rate Limit: Gửi 4 lần liên tiếp từ 1 IP -> Lần thứ 4 nhận mã lỗi 429.
  - Kiểm tra Formula Sanitization: Điền thử chuỗi `=1+1` vào ô Họ tên -> Ghi nhận thành `'=1+1` an toàn.
- [ ] **5. Thử nghiệm 1-Click Revalidate:**
  - Chỉnh sửa một tiêu đề trên Sheets.
  - Chọn menu `[DataWithLy CMS] > Đồng Bộ Lên Website`.
  - Mở website xác nhận nội dung mới hiển thị ngay lập tức sau 1-2 giây.
- [ ] **6. Bàn giao Tài khoản & Xóa bỏ Token Test:** Đổi biến môi trường `REVALIDATION_SECRET` sang chuỗi bí mật chính thức và lưu trữ vào trình quản lý mật khẩu của Founder.

---

[Quay lại Mục lục Bàn giao](README.md) | [Đến Sổ tay Khách hàng](client-operations-guide.md)
