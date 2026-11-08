# M00 — Thiết lập Kết nối, Health Check & CRUD Scripts

- **Mục đích:** Thiết lập nền tảng hạ tầng kết nối giữa Next.js và Google Sheets (môi trường Staging và Production), xây dựng hệ thống Health Check & Swagger OpenAPI Docs, và định nghĩa bộ kịch bản CRUD chuẩn hóa cho Khóa học & Lộ trình.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Fullstack / Backend Agent
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [PRD M00](prd.md)
  - [Nguồn chân lý dữ liệu (Database Schema SQL)](../../references/database-schema.sql)
  - [Thiết kế API & Hợp đồng giao tiếp](../../07-architecture/api-design.md)
  - [Hệ thống bối cảnh & C4 Diagram](../../07-architecture/system-context.md)
  - [Quy tắc nghiệp vụ BR-13](../../02-domain/business-rules.md)

---

## 1. Ranh giới module (Module Boundaries)

Module M00 đóng vai trò là "lớp nền móng kỹ thuật" (Infrastructure Foundation) cung cấp khả năng tích hợp, kết nối dữ liệu và quan sát hệ thống (Observability) cho tất cả các module giao diện người dùng (M01 - M05).

```
                    ┌────────────────────────────────────────┐
                    │      Next.js 15+ Core Application      │
                    └───────────────────┬────────────────────┘
                                        │
           ┌────────────────────────────┼───────────────────────────┐
           ▼                            ▼                           ▼
[Swagger UI: /api-docs]    [Health API: /api/health/sheets]    [CRUD Engine / Adapter]
           │                            │                           │
           └────────────────────────────┼───────────────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
[Public Content Sheet: 9 Tabs]               [Private Leads Sheet: Ingestion Tab]
(Courses, Curriculum, Pricing...)            (Leads, Notification Status...)
```

### Trong phạm vi (In-Scope)
1. **Thiết lập Kết nối Đa Môi trường (Environment Setup):**
   - Quản lý và xác thực cấu hình biến môi trường kết nối tới Google Sheets cho cả 2 môi trường: **Staging** (kiểm thử dữ liệu mẫu) và **Production** (dữ liệu thật).
   - Tách biệt hoàn toàn quyền truy cập giữa file **Public Content Sheet** (chỉ đọc công khai qua CSV/API) và file **Private Leads Sheet** (ghi bảo mật qua Apps Script Webhook).
2. **Kiểm tra Tình trạng Hoạt động (Connectivity Health Check Service):**
   - Endpoint `GET /api/health/sheets` đo lường và phản hồi tình trạng kết nối thời gian thực:
     - Trạng thái hoạt động (`online` / `degraded` / `down`).
     - Độ trễ phản hồi (`latency_ms`).
     - Quyền hạn truy cập (`read_accessible`, `write_permission`).
     - Hạn ngạch email hàng ngày còn lại (`remaining_daily_quota` của Google Workspace).
3. **Tài liệu & Thử nghiệm API Tương tác (Swagger / OpenAPI UI):**
   - Tích hợp chuẩn **OpenAPI 3.0** tại route `/api-docs` (hoặc `/swagger`), cung cấp giao diện trực quan để lập trình viên và người vận hành có thể gửi request kiểm tra trực tiếp các endpoint: `/api/health/sheets`, `/api/leads`, `/api/revalidate`.
4. **Bộ Thao tác CRUD Khóa học & Lộ trình (Courses & Curriculum CRUD Engine):**
   - Cung cấp các kịch bản chuẩn cho thao tác dữ liệu:
     - Tạo mới khóa học / thêm buổi học có kiểm tra tính duy nhất của `slug` và toàn vẹn khóa ngoại.
     - Cập nhật thông tin có khóa ghi `LockService.waitLock(10000)`.
     - Xóa an toàn / Lưu trữ (**Soft Delete**): Đổi cờ `is_active = FALSE`, chuyển trạng thái `ARCHIVED` (không xóa vật lý).
5. **Khung Menu Tùy biến `[DataWithLy CMS]` trên Google Sheets:**
   - Kịch bản Google Apps Script nhúng trực tiếp vào file Sheets Quản trị, tạo menu tùy biến giúp Chị Ly và Biên tập viên mở form popup nhập liệu chuẩn.

### Ngoài phạm vi (Out-of-Scope)
- Giao diện người dùng công khai phía ngoài (thuộc [M01](../M01-homepage/README.md), [M02](../M02-course-details/README.md), [M03](../M03-blog/README.md)).
- Trình quản trị cơ sở dữ liệu SQL chuyên dụng (dự án hiện dùng Google Sheets làm Data Source, schema SQL tại `references/` đóng vai trò tài liệu đối chiếu).

---

## 2. Danh mục Biến môi trường Cấu hình (Environment Variables)

| Tên biến môi trường | Bắt buộc | Môi trường áp dụng | Mục đích sử dụng |
|---|:---:|:---:|---|
| `NEXT_PUBLIC_APP_URL` | Có | Dev, Staging, Prod | URL gốc của website (vd: `https://datawithly.edu.vn`) |
| `GOOGLE_SHEETS_CONTENT_ID` | Có | Dev, Staging, Prod | ID của file Google Sheets Quản trị nội dung công khai |
| `GOOGLE_SHEETS_LEADS_ID` | Có | Dev, Staging, Prod | ID của file Google Sheets Lưu trữ Lead riêng tư |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Không | Staging, Prod | Email tài khoản Service Account (nếu dùng Google API v4) |
| `GOOGLE_PRIVATE_KEY` | Không | Staging, Prod | Khóa riêng tư xác thực Service Account |
| `APPS_SCRIPT_LEADS_WEBHOOK_URL`| Có | Staging, Prod | URL triển khai Webhook của Apps Script để ghi Lead |
| `REVALIDATION_SECRET` | Có | Dev, Staging, Prod | Khóa bí mật dùng để xác thực Webhook làm mới ISR Cache |
| `DATA_SOURCE_MODE` | Có | Dev, Staging, Prod | Chế độ nguồn dữ liệu: `google_sheets` \| `mock` \| `local_fallback` |

---

## 3. Điều kiện sẵn sàng triển khai (Definition of Ready - DoR)

1. [x] PRD M00 được phê duyệt với đầy đủ tiêu chí nghiệm thu (Given/When/Then).
2. [x] Bản Database Schema chuẩn `references/database-schema.sql` đã được khởi tạo.
3. [x] Quy tắc nghiệp vụ BR-13 (vận hành song song Apps Script + Direct Edit) đã thống nhất.
4. [x] Có sẵn mẫu file Google Sheets Staging với 9 tab chuẩn để thực hiện kết nối.

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M00](prd.md)

