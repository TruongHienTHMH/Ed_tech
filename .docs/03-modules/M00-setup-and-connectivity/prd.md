# PRD M00 — Thiết lập Kết nối, Health Check & CRUD Scripts

- **Mục đích:** Đặc tả yêu cầu kỹ thuật cho module nền tảng M00: cơ chế kiểm tra sức khỏe kết nối (Health Check), tài liệu Swagger OpenAPI tương tác, và bộ kịch bản CRUD Khóa học & Lộ trình.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người duyệt:** TechLead & Client Review
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Nguồn chân lý dữ liệu (Database Schema SQL)](../../references/database-schema.sql)
  - [Thiết kế API & Hợp đồng giao tiếp](../../07-architecture/api-design.md)
  - [Quy tắc nghiệp vụ BR-13](../../02-domain/business-rules.md)
  - [Sổ tay vận hành cho Khách hàng](../../09-handover/client-operations-guide.md)

---

## 1. Người dùng và mục tiêu (Users & Goals)

| Tác nhân | Mục tiêu / Nhu cầu | Kết quả mong đợi |
|---|---|---|
| **Lập trình viên (Developer)** | Cần kiểm tra nhanh trạng thái kết nối Google Sheets, xem log độ trễ và test trực tiếp các API trên trình duyệt. | Mở `/api-docs` (Swagger UI), nhấn "Try it out" để kiểm tra ngay mà không cần cấu hình Postman phức tạp. |
| **Kỹ sư vận hành (DevOps / TechLead)** | Giám sát độ ổn định của 2 file Google Sheets, phát hiện kịp thời khi bị Google giới hạn quota hoặc lỗi mạng. | Endpoint `GET /api/health/sheets` trả về JSON rõ ràng về trạng thái `healthy`, `degraded`, hoặc `down` cùng độ trễ miligiây. |
| **Người sáng lập (Chị Ly / Admin)** | Thao tác quản lý khóa học, thêm buổi học mới mà không sợ làm hỏng định dạng file Google Sheets. | Menu tùy biến `[DataWithLy CMS]` cung cấp form nhập liệu trực quan, tự động kiểm tra lỗi trước khi lưu và có thể xóa mềm an toàn. |

---

## 2. Đặc tả Chi tiết Tính năng (Feature Specifications)

### 2.1. Connectivity Health Check Service (`GET /api/health/sheets`)

Hệ thống Next.js cung cấp một API chuyên biệt để ping kiểm tra tình trạng kết nối tới cả 2 file Google Sheets:

- **Đường dẫn:** `GET /api/health/sheets`
- **Quyền truy cập:** Public (hoặc giới hạn cho môi trường Staging/Dev & Uptime Monitor)
- **Cấu trúc JSON phản hồi thành công (HTTP 200 - Healthy):**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-11-04T12:00:00.000Z",
    "environment": "staging",
    "sheets": {
      "public_content": {
        "sheet_id": "1A2B3C...xyz",
        "status": "online",
        "latency_ms": 245,
        "accessible": true,
        "tab_count": 9,
        "last_synced_at": "2026-11-04T11:58:30.000Z"
      },
      "private_leads": {
        "sheet_id": "9Z8Y7X...abc",
        "status": "online",
        "latency_ms": 312,
        "write_permission": true,
        "remaining_daily_quota": 1450,
        "pending_leads_count": 0
      }
    },
    "memory": {
      "status": "healthy",
      "heap_used_mb": 68.4,
      "heap_total_mb": 95.2,
      "rss_mb": 142.1,
      "warning_threshold_mb": 250.0
    },
    "cache": {
      "lru_items_count": 12,
      "lru_hit_rate_percent": 96.2
    },
    "edge_cache": {
      "status": "active",
      "provider": "next_isr",
      "revalidate_seconds": 3600
    }
  }
  ```
- **Tiêu chuẩn SLA về Độ trễ (Latency Thresholds):**
  - **Healthy (Xanh):** Độ trễ đọc Public Content < 800ms; độ trễ ping Private Leads < 1.500ms.
  - **Degraded (Vàng):** Độ trễ từ 800ms - 3.000ms, hệ thống kích hoạt đọc từ ISR Stale Cache để đảm bảo trải nghiệm người dùng không bị chậm.
  - **Down (Đỏ):** Timeout > 3.000ms hoặc Google trả về lỗi 5xx; hệ thống tự động fallback sang bộ dữ liệu tĩnh cục bộ `lib/cms/fallbacks/`.

---

### 2.2. Tích hợp Swagger / OpenAPI 3.0 Interactive Testing (`/api-docs`)

Để kiểm tra tình trạng hoạt động của hệ thống một cách trực quan:
- Hệ thống tích hợp thư viện tài liệu OpenAPI (như `next-swagger-doc` kết hợp giao diện Swagger UI).
- Đường dẫn truy cập: `/api-docs` (hoặc `/swagger`).
- Cho phép kiểm tra trực tiếp 3 nhóm API cốt lõi:
  1. `GET /api/health/sheets`: Kiểm tra sức khỏe kết nối Google Sheets.
  2. `POST /api/leads`: Kiểm thử nộp hồ sơ Lead (có hỗ trợ kiểm tra validation lỗi và honeypot).
  3. `POST /api/revalidate`: Kiểm thử gọi Webhook làm mới bộ nhớ đệm Next.js Edge Cache với `REVALIDATION_SECRET`.

---

### 2.3. Bộ Kịch bản Thao tác CRUD Khóa học & Lộ trình (CRUD Engine)

Toàn bộ thao tác CRUD được định nghĩa dưới dạng các hàm độc lập có tính module hóa cao (Module Pattern & Repository Pattern):

```typescript
// lib/domain/repositories/course-repository.interface.ts
export interface ICourseRepository {
  // Read
  getById(id: string): Promise<CourseEntity | null>;
  getBySlug(slug: string): Promise<CourseEntity | null>;
  listAll(filter?: { isActiveOnly?: boolean }): Promise<CourseEntity[]>;
  getCurriculumByCourseId(courseId: string): Promise<CurriculumModuleEntity[]>;

  // Write & Mutation (Thực thi qua Apps Script RPC hoặc Server Service)
  createCourse(course: CreateCourseDTO): Promise<CourseEntity>;
  updateCourse(id: string, patch: UpdateCourseDTO): Promise<CourseEntity>;
  softDeleteCourse(id: string): Promise<boolean>; // is_active = false, status = ARCHIVED
  
  // Curriculum Mutation
  addCurriculumModule(courseId: string, module: CreateCurriculumDTO): Promise<CurriculumModuleEntity>;
  updateCurriculumModule(moduleId: number, patch: UpdateCurriculumDTO): Promise<CurriculumModuleEntity>;
  reorderCurriculum(courseId: string, orderedModuleIds: number[]): Promise<boolean>;
}
```

#### Quy tắc nghiệp vụ trong các thao tác CRUD:
1. **Tạo mới Khóa học (`createCourse`):**
   - Bắt buộc kiểm tra tính duy nhất của `slug` và `id`.
   - Kiểm tra ràng buộc học phí: `price_discounted <= price_original`.
   - Trạng thái ban đầu: `status = 'PUBLISHED'` (hoặc `'DRAFT'`).
2. **Cập nhật Khóa học (`updateCourse`):**
   - Áp dụng `LockService.waitLock(10000)` phía Apps Script để bảo vệ toàn vẹn dữ liệu khi có nhiều người cùng chỉnh sửa.
   - Tự động cập nhật trường `updated_at`.
3. **Xóa mềm Khóa học (`softDeleteCourse`):**
   - **Tuyệt đối không xóa dòng vật lý khỏi Sheets**.
   - Cập nhật cờ `is_active = FALSE` và trạng thái `status = 'ARCHIVED'`.
   - Các buổi học thuộc đề cương của khóa học này vẫn được bảo toàn nguyên vẹn trong tab `curriculum` để đối soát lịch sử.
4. **Thêm / Cập nhật Buổi học (`addCurriculumModule`, `updateCurriculumModule`):**
   - Tự động kiểm tra khóa ngoại: `courseId` bắt buộc phải tồn tại trong tab `courses`.
   - Chuẩn hóa ký tự xuống dòng: Các dòng phân cách trong ô `bullets` tự động được định dạng chuẩn `\n` (tương đương thao tác `Alt+Enter` trên bàn phím).

---

### 2.4. Khung Menu Tùy biến `[DataWithLy CMS]` trên Google Sheets

Kịch bản Google Apps Script gắn kèm file Google Sheets Quản trị tạo thanh menu tùy biến:

```javascript
// Google Apps Script: Code.gs
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 DataWithLy CMS')
    .addItem('➕ Thêm Khóa Học Mới', 'openCreateCourseDialog')
    .addItem('✏️ Chỉnh Sửa Khóa Học', 'openEditCourseDialog')
    .addSeparator()
    .addItem('📚 Thêm Buổi Học Đề Cương', 'openAddCurriculumDialog')
    .addSeparator()
    .addItem('🔍 Kiểm Tra Lỗi Dữ Liệu (Data Linter)', 'runDataLinting')
    .addItem('🌐 Đồng Bộ Lên Website (Revalidate)', 'triggerWebsiteSync')
    .addToUi();
}
```

- Khi Chị Ly bấm vào các lệnh trên, một hộp thoại HTML Sidebar / Modal popup mở ra với các trường nhập liệu chuẩn hóa.
- Script tự động validate dữ liệu trước khi chèn hoặc sửa dòng trong bảng.

---

## 3. Quản lý trạng thái giao diện (5 UI States)

| Trạng thái | Điều kiện kích hoạt | Giao diện hiển thị | Hành vi hệ thống |
|---|---|---|---|
| **1. Khỏe mạnh (Healthy)** | Độ trễ Sheets < 800ms, đọc/ghi bình thường, quota > 100. | Badge xanh lá cây: *"Google Sheets Connected (Latency: 245ms)"*. | Toàn bộ hệ thống hoạt động với hiệu năng tối đa. |
| **2. Giảm hiệu năng (Degraded)** | Độ trễ từ 800ms đến 3.000ms do mạng Google chậm. | Badge vàng hổ phách: *"Sheets Latency High (1200ms) - Serving Edge Cache"*. | Hệ thống ưu tiên phục vụ từ Next.js ISR Cache để người dùng không phải chờ đợi. |
| **3. Gián đoạn (Down)** | Timeout > 3.000ms hoặc lỗi xác thực Service Account / 403 Forbidden. | Badge đỏ: *"Google Sheets Disconnected"*. | Hệ thống tự động kích hoạt bộ dữ liệu dự phòng cục bộ `lib/cms/fallbacks/`. Web không bị sập (Zero White Screen). |
| **4. Hết hạn ngạch (Quota Exceeded)** | Google Workspace MailApp chạm mốc 1.500 emails/ngày (hoặc Sheets API 429). | Cảnh báo cam: *"Daily Email Quota Exceeded (0 remaining)"*. | Lead vẫn được ghi nhận vào Sheets, cột `email_status` chuyển thành `PENDING_RETRY`. |
| **5. Đang đồng bộ (Syncing)** | Người dùng vừa nhấn nút *"Đồng Bộ Lên Website"* trên Google Sheets. | Trạng thái hiển thị spinner quay nhẹ: *"Revalidating Edge Cache..."*. | Gửi request `POST /api/revalidate` đến Next.js Server và thông báo kết quả thành công sau 1 giây. |

---

## 4. Tiêu chí nghiệm thu (Acceptance Criteria)

| Mã AC | Yêu cầu tương ứng | Given | When | Then |
|---|---|---|---|---|
| **AC-M00-01** | Health Check Endpoint | Hệ thống Next.js đang chạy ở môi trường Staging/Dev. | Gửi request `GET /api/health/sheets`. | Nhận về mã HTTP 200 với JSON cấu trúc chuẩn, hiển thị rõ độ trễ (latency_ms) và trạng thái online của cả 2 file Sheets. |
| **AC-M00-02** | Swagger UI Testing | Developer truy cập route `/api-docs` trên trình duyệt. | Nhấn nút "Try it out" tại endpoint `/api/health/sheets` và bấm "Execute". | Giao diện hiển thị kết quả JSON trả về trực tiếp trên màn hình, không phát sinh lỗi CORS hoặc crash giao diện. |
| **AC-M00-03** | Khóa ngoại Đề cương | Biên tập viên thêm một buổi học mới với `course_id = "khoa-hoc-khong-ton-tai"`. | Bấm lưu trên form hoặc chạy CRUD script. | Script báo lỗi: *"Khóa ngoại không hợp lệ: Khóa học không tồn tại"*, từ chối ghi dòng vào tab `curriculum`. |
| **AC-M00-04** | Trùng lặp Slug | Người dùng tạo khóa học mới có `slug = "sql-for-data-analytics"` (đã tồn tại). | Bấm lưu khóa học. | Script từ chối và thông báo: *"Slug này đã được sử dụng, vui lòng chọn slug khác"*. |
| **AC-M00-05** | Soft Delete Khóa học | Người quản trị thực hiện xóa khóa học SQL for Data Analytics. | Kích hoạt thao tác Soft Delete qua Apps Script. | Khóa học không bị xóa mất dòng; cột `is_active` đổi thành `FALSE`, `status` đổi thành `ARCHIVED`. Toàn bộ đề cương của khóa học này vẫn còn nguyên. |
| **AC-M00-06** | Chuẩn hóa `Alt+Enter` | Soạn thảo nội dung buổi học có 3 gạch đầu dòng cách nhau bằng xuống dòng. | Lưu qua script CRUD. | Các dòng được lưu trữ với ký tự `\n` chuẩn, hiển thị trên website thành 3 thẻ `<li>` tách biệt đẹp mắt. |
| **AC-M00-07** | Custom Menu trên Sheets | Mở file Google Sheets Quản trị nội dung. | Trang tính tải xong (`onOpen`). | Xuất hiện menu tùy biến **`[🚀 DataWithLy CMS]`** trên thanh công cụ với đầy đủ 5 lệnh chức năng. |
| **AC-M00-08** | Khả năng Chịu lỗi khi Sheets Down | Giả lập ngắt kết nối mạng đến Google Sheets. | Người dùng tải trang chủ website. | Website vẫn tải bình thường dưới 1.2 giây nhờ bộ nhớ đệm ISR Cache và file dự phòng cục bộ `lib/cms/fallbacks/homepage.json`. |
| **AC-M00-09** | Giám sát RAM & Chống Leak | Bơm tải 1.000 requests liên tiếp trong 2 phút vào các endpoint đọc. | Kiểm tra chỉ số `heap_used_mb` trên `/api/health/sheets`. | `heap_used_mb` duy trì ổn định dưới ngưỡng 250MB, các phần tử trong LRU cache và Rate limiter tự động dọn dẹp (Self-Evict), không phát sinh lỗi tràn bộ nhớ (Out of Memory). |

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Quay lại README M00](README.md)

