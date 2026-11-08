# Thiết kế API & Hợp đồng giao tiếp (API Design & Contracts)

- **Mục đích:** Đặc tả chi tiết các giao diện lập trình ứng dụng (API Endpoints), cấu trúc dữ liệu yêu cầu/phản hồi (Request/Response Payloads), mã lỗi chuẩn hóa và hợp đồng tích hợp giữa Next.js Backend và Google Apps Script Webhook.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch kiến trúc ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Security Design](security-design.md);
  - [Lead Protection and Errors](lead-protection-and-errors.md);
  - Mã nguồn thực tế: `app/api/leads/route.ts`, `lib/modules/leads/types.ts`.

---

## 1. Tổng quan các API Endpoints trong hệ thống

| Phương thức | Đường dẫn API | Mục đích & Chức năng | Cơ chế xác thực |
|:---:|---|---|:---:|
| `POST` | `/api/leads` | Tiếp nhận hồ sơ đăng ký tư vấn từ học viên, kiểm tra chống spam 3 lớp và chuyển tiếp an toàn sang Google Apps Script | Public (Bảo vệ qua Honeypot & Rate Limit) |
| `POST` | `/api/revalidate` | Tiếp nhận tín hiệu Webhook từ Google Apps Script khi người quản trị bấm *"Xuất bản lên Web"*, kích hoạt làm mới bộ nhớ đệm Next.js ISR tức thì | Secret Token (`Bearer <REVALIDATION_SECRET>`) |
| `GET` | `/api/health` | Kiểm tra tình trạng hoạt động tổng thể của dịch vụ Next.js | Public |
| `GET` | `/api/health/sheets` | Đo lường độ trễ (latency ms), trạng thái hoạt động và hạn ngạch quota của cả 2 file Google Sheets | Public / Dev & Monitor |
| `GET` | `/api-docs` | Giao diện Swagger / OpenAPI 3.0 UI phục vụ kiểm thử tương tác trực quan | Public |

---

## 2. Đặc tả chi tiết API `POST /api/leads`

Tiếp nhận form đăng ký tư vấn từ Modal Form trên giao diện người dùng.

### 2.1. Request Headers
```http
POST /api/leads HTTP/1.1
Host: datawithly.edu.vn
Content-Type: application/json
Accept: application/json
X-Forwarded-For: 113.161.xx.xx
```

### 2.2. Request Payload (Body JSON)
Toàn bộ dữ liệu được thẩm định nghiêm ngặt theo `LeadSubmissionSchema`:

```json
{
  "full_name": "Nguyễn Thu Hà",
  "phone_number": "0912345678",
  "email": "thuha.data@gmail.com",
  "course_of_interest": "sql-for-data-analytics",
  "package_chosen": "single",
  "current_background": "Chưa biết gì, muốn chuyển ngành từ Kế toán",
  "preferred_time": "Tối: 19h30 - 21h30",
  "student_notes": "Em muốn hỏi về lịch học qua Zoom và bài tập thực hành ạ",
  "utm_source": "facebook_ads",
  "utm_medium": "cpc",
  "utm_campaign": "campaign_tuyensinh_thang11",
  "submission_id": "sub_8f7b2a1c-9e3d-4c5b-a1b2-c3d4e5f6a7b8",
  "honeypot": ""
}
```

### 2.3. Bảng đặc tả các trường dữ liệu (Data Dictionary)

| Tên trường | Kiểu dữ liệu | Bắt buộc | Ràng buộc & Quy tắc xác thực | Ví dụ |
|:---|:---:|:---:|:---|:---|
| `full_name` | String | Có | Độ dài 2 - 50 ký tự, tự động cắt khoảng trắng thừa (`trim`) | `"Nguyễn Thu Hà"` |
| `phone_number` | String | Có | Regex chuẩn 10 chữ số di động VN: `^(0\|\+84)[3\|5\|7\|8\|9][0-9]{8}$` | `"0912345678"` |
| `email` | String | Có | Định dạng email chuẩn RFC 5322, tự động chuyển về chữ thường | `"thuha.data@gmail.com"` |
| `course_of_interest` | String | Có | Mã khóa học hợp lệ (`sql-for-data-analytics`, `analytical-thinking-dashboard-design`, `end-to-end-analytics-sql-dashboard`) | `"sql-for-data-analytics"` |
| `package_chosen` | String | Không | Gói học phí (`single` hoặc `combo`) | `"single"` |
| `current_background` | String | Không | Nền tảng học vấn hiện tại của học viên | `"Đang làm kế toán"` |
| `preferred_time` | String | Không | Khung giờ hẹn tư vấn (`Sáng`, `Chiều`, `Tối`) | `"Tối: 19h30 - 21h30"` |
| `student_notes` | String | Không | Ghi chú hoặc câu hỏi riêng, tối đa 500 ký tự | `"Tư vấn lộ trình học"` |
| `utm_source` | String | Không | Kênh nguồn marketing | `"facebook_ads"` |
| `utm_medium` | String | Không | Kênh truyền thông | `"cpc"` |
| `utm_campaign` | String | Không | Tên chiến dịch quảng cáo | `"tuyensinh_k11"` |
| `submission_id` | String | Có | Mã định danh UUIDv4 duy nhất cho mỗi lượt form để chống ghi trùng | `"sub_8f7b2a1c..."` |
| `honeypot` | String | Không | Trường mồi bẫy bot, **bắt buộc phải rỗng** đối với người dùng thật | `""` |

---

### 2.4. Phản hồi API (Response Contracts)

#### Trường hợp 1: Gửi thành công (HTTP 200 OK)
Trả về khi dữ liệu hợp lệ và đã được Google Apps Script ghi nhận thành công:
```json
{
  "success": true,
  "message": "Đăng ký tư vấn thành công! Đội ngũ DataWithLy sẽ liên hệ với bạn trong vòng 15 phút.",
  "data": {
    "lead_id": "LEAD-20261103-8941",
    "submission_id": "sub_8f7b2a1c-9e3d-4c5b-a1b2-c3d4e5f6a7b8",
    "timestamp": "2026-11-03T21:45:00+07:00"
  }
}
```

#### Trường hợp 2: Bẫy Bot Honeypot thành công (HTTP 200 OK - Silently Dropped)
Nếu bot điền dữ liệu vào `honeypot`, hệ thống trả về HTTP 200 giả mạo để bot rút lui nhưng **không ghi vào Sheets**:
```json
{
  "success": true,
  "message": "Đăng ký tư vấn thành công!",
  "data": {
    "submission_id": "sub_8f7b2a1c-9e3d-4c5b-a1b2-c3d4e5f6a7b8"
  }
}
```

#### Trường hợp 3: Dữ liệu không hợp lệ (HTTP 400 Bad Request)
Trả về khi kiểm tra Zod Schema thất bại:
```json
{
  "success": false,
  "error_code": "VALIDATION_ERROR",
  "message": "Dữ liệu đăng ký không hợp lệ, vui lòng kiểm tra lại.",
  "errors": {
    "phone_number": "Số điện thoại di động không đúng định dạng (10 số)",
    "email": "Địa chỉ email không hợp lệ"
  }
}
```

#### Trường hợp 4: Vượt giới hạn tần suất gửi (HTTP 429 Too Many Requests)
Trả về khi 1 IP gửi quá 3 lần/phút:
```json
{
  "success": false,
  "error_code": "RATE_LIMITED",
  "message": "Bạn đang gửi thông tin quá nhanh. Vui lòng chờ 1 phút hoặc nhắn tin qua Zalo Hotline.",
  "retry_after_seconds": 60
}
```

#### Trường hợp 5: Lỗi kết nối Google Sheets (HTTP 503 Service Unavailable)
Trả về khi Google Apps Script bị timeout hoặc quá tải:
```json
{
  "success": false,
  "error_code": "SHEETS_UNAVAILABLE",
  "message": "Kết nối máy chủ bảng tính đang bận. Vui lòng bấm thử lại, thông tin của bạn vẫn được giữ nguyên.",
  "can_retry": true
}
```

---

## 3. Đặc tả API `POST /api/revalidate` (On-demand ISR Webhook)

Được kích hoạt tự động từ thanh menu Google Sheets khi Chị Hứa Thảo Ly hoặc người quản trị bấm nút *"Xuất bản thay đổi lên Web"*.

### 3.1. Request Headers & Body
```http
POST /api/revalidate HTTP/1.1
Host: datawithly.edu.vn
Content-Type: application/json
Authorization: Bearer <REVALIDATION_SECRET_TOKEN>
```
```json
{
  "tag": "cms-content",
  "paths": ["/", "/courses", "/blog"]
}
```

### 3.2. Response
```json
{
  "revalidated": true,
  "timestamp": "2026-11-03T21:45:10+07:00",
  "message": "Bộ nhớ đệm website đã được làm mới thành công!"
}
```

---

## 4. Hợp đồng giao tiếp giữa Next.js và Google Apps Script Webhook

Google Apps Script tiếp nhận request từ máy chủ Next.js thông qua hàm `doPost(e)`:

### 4.1. Cấu trúc Payload gửi sang Apps Script
```json
{
  "action": "CREATE_LEAD",
  "secret_token": "env_secret_token_value",
  "payload": {
    "submission_id": "sub_8f7b2a1c-9e3d-4c5b-a1b2-c3d4e5f6a7b8",
    "timestamp": "2026-11-03 21:45:00",
    "full_name": "Nguyễn Thu Hà",
    "phone_number": "0912345678",
    "email": "thuha.data@gmail.com",
    "course_of_interest": "Khóa Học SQL for Data Analytics Thực Chiến",
    "package_chosen": "Gói Tiêu Chuẩn",
    "current_background": "Chưa biết gì, muốn chuyển ngành",
    "preferred_time": "Tối: 19h30 - 21h30",
    "student_notes": "Hỏi về lịch học qua Zoom",
    "utm_source": "facebook_ads",
    "utm_medium": "cpc",
    "utm_campaign": "campaign_tuyensinh_thang11",
    "ip_address": "113.161.xx.xx"
  }
}
```

### 4.2. Cơ chế khóa hàng đợi (LockService Concurrency)
Trong file `Code.gs` của Google Apps Script, mọi yêu cầu ghi dữ liệu đều được bao bọc bởi:
```javascript
var lock = LockService.getScriptLock();
try {
  // Chờ tối đa 10 giây để giành quyền ghi độc quyền
  lock.waitLock(10000);
  
  // 1. Kiểm tra chống trùng qua submission_id
  if (isDuplicateSubmission(sheet, payload.submission_id)) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      duplicate: true,
      message: "Lead already recorded"
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Chèn dòng mới an toàn (Sanitized)
  appendLeadRow(sheet, payload);
  
  // 3. Gửi email bất đồng bộ
  sendNotificationEmails(payload);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "SUCCESS",
    lead_id: generatedLeadId
  })).setMimeType(ContentService.MimeType.JSON);
  
} catch (e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ERROR",
    message: e.toString()
  })).setMimeType(ContentService.MimeType.JSON);
} finally {
  lock.releaseLock();
}
```

---

## 5. Đặc tả API `GET /api/health/sheets` & Swagger OpenAPI UI

### 5.1. Mục đích
Cung cấp endpoint giám sát sức khỏe kết nối giữa Next.js và 2 file Google Sheets thời gian thực, đo lường độ trễ mạng (latency ms), quyền đọc/ghi và số lượng email quota còn lại trong ngày.

### 5.2. Request
```http
GET /api/health/sheets HTTP/1.1
Host: datawithly.edu.vn
Accept: application/json
```

### 5.3. Response Payload (HTTP 200 OK)
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
  "edge_cache": {
    "status": "active",
    "provider": "next_isr",
    "revalidate_seconds": 3600
  }
}
```

### 5.4. Swagger UI Interactive Documentation (`/api-docs`)
- **Đường dẫn:** `GET /api-docs` (hoặc `/swagger`)
- **Chuẩn tài liệu:** OpenAPI 3.0 JSON spec sinh tự động qua `next-swagger-doc`.
- **Chức năng:** Cung cấp giao diện Swagger UI cho phép tester và developer bấm nút **"Try it out"** và **"Execute"** để test trực tiếp các API:
  - `GET /api/health/sheets`
  - `POST /api/leads`
  - `POST /api/revalidate`

---

## 6. Hợp đồng Google Apps Script RPC CRUD Khóa học & Lộ trình

Phục vụ cho kịch bản Custom Menu `[DataWithLy CMS]` và Module M00, Apps Script cung cấp các hàm RPC chuẩn hóa:

| Tên Hàm RPC | Tham số đầu vào | Xử lý nghiệp vụ | Kết quả phản hồi |
|---|---|---|---|
| `rpcCreateCourse(data)` | `CourseInputDTO` | Validate schema, kiểm tra trùng lặp `slug` và `id`, gán `status = 'PUBLISHED'`. | `{ success: true, course_id: "..." }` |
| `rpcUpdateCourse(id, patch)` | `id: string, patch: PartialCourseDTO` | Dùng `LockService`, cập nhật thông tin và cập nhật `updated_at`. | `{ success: true, updated_at: "..." }` |
| `rpcSoftDeleteCourse(id)` | `id: string` | Chuyển `is_active = FALSE`, đổi `status = 'ARCHIVED'`. Không xóa dòng vật lý. | `{ success: true, archived: true }` |
| `rpcAddCurriculum(courseId, data)` | `courseId: string, module: ModuleDTO` | Kiểm tra khóa ngoại `courseId`, chuẩn hóa ký tự `\n` trong bullets. | `{ success: true, module_number: 1 }` |
| `rpcRunDataLinter()` | Không | Quét 9 tab tìm lỗi slug trùng, thiếu trường bắt buộc, link ảnh hỏng. | `{ issues_count: 0, issues: [] }` |
| `rpcTriggerRevalidate()` | Không | Gửi request `POST /api/revalidate` kèm `REVALIDATION_SECRET` sang Next.js. | `{ revalidated: true, timestamp: ... }` |

---

[Điểm bắt đầu của bộ docs](../README.md)
