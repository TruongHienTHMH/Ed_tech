# Hướng Dẫn Cấu Hình Google Apps Script & Google Sheets Cho Lead Capture

Tài liệu này hướng dẫn chi tiết từng bước thiết lập Google Sheets và Google Apps Script để nhận dữ liệu lead từ website **Lý Data**, kết hợp với hệ thống tracking Attribution (First-touch / Last-touch) và Google Tag Manager / GA4.

---

## 1. Tạo Google Spreadsheet & Cấu Hình Google Apps Script

### Bước 1: Tạo Google Spreadsheet mới
1. Truy cập [Google Sheets](https://sheets.new) và tạo một bảng tính mới.
2. Đặt tên bảng tính, ví dụ: `Ly Data - Danh Sách Học Viên Đăng Ký (Leads)`.
3. Đổi tên Sheet đầu tiên thành: `Leads`.
   *(Hoặc bạn có thể vào **Tệp (File)** > **Nhập (Import)** > **Tải lên (Upload)** và chọn file mẫu [Ly_Data_Leads_Template.xlsx](./Ly_Data_Leads_Template.xlsx) đã được thiết kế sẵn đầy đủ 31 cột chuẩn và định dạng đẹp).*

### Bước 2: Mở Trình chỉnh sửa Apps Script
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** > **Apps Script**.
2. Đổi tên project Apps Script thành: `Ly Data Lead Webhook`.
3. Xóa toàn bộ nội dung mặc định trong file `Code.gs` và dán toàn bộ code từ file [Code.gs](./Code.gs) vào.

### Bước 3: Cấu hình Secret Token (Tùy chọn tăng cường bảo mật)
1. Trong giao diện Apps Script, bấm vào biểu tượng bánh răng **Cài đặt dự án (Project Settings)** ở thanh bên trái.
2. Cuộn xuống phần **Thuộc tính tập lệnh (Script Properties)** > Bấm **Thêm thuộc tính tập lệnh (Add script property)**.
   - **Thuộc tính (Property):** `APPS_SCRIPT_SECRET`
   - **Giá trị (Value):** Đặt một chuỗi bí mật ngẫu nhiên.
3. Bấm **Lưu thuộc tính tập lệnh (Save script properties)**.

---

## 2. Triển Khai Apps Script Thành Web App

1. Ở góc trên bên phải giao diện Apps Script, bấm nút **Triển khai (Deploy)** > **Triển khai mới (New deployment)**.
2. Bấm vào biểu tượng bánh răng **Chọn loại (Select type)** > Chọn **Ứng dụng web (Web app)**.
3. Điền thông tin cấu hình:
   - **Mô tả (Description):** `V1 - Lead Webhook for Next.js`
   - **Thực thi dưới dạng (Execute as):** `Tôi (Your email / Me)` *(Rất quan trọng: Giúp script có quyền ghi vào sheet của bạn)*
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)` *(Rất quan trọng: Để server Vercel có thể gửi POST request)*
4. Bấm **Triển khai (Deploy)**.
5. Nếu Google hiển thị cửa sổ yêu cầu cấp quyền:
   - Bấm **Ủy quyền truy cập (Authorize access)** > Chọn tài khoản Google của bạn.
   - Bấm **Nâng cao (Advanced)** > Bấm **Đi tới Ly Data Lead Webhook (không an toàn) / Go to ... (unsafe)**.
   - Bấm **Cho phép (Allow)**.
6. Sao chép đường dẫn **URL ứng dụng web (Web app URL)**. Đường dẫn có dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`
   

> ⚠️ **LƯU Ý QUAN TRỌNG KHI CẬP NHẬT CODE.GS SAU NÀY:**
> Mỗi lần sửa code trong `Code.gs`, bạn **PHẢI** vào:
> **Triển khai (Deploy)** > **Quản lý các bản triển khai (Manage deployments)** > Bấm biểu tượng cây bút **Chỉnh sửa (Edit)** > Chọn **Phiên bản: Phiên bản mới (Version: New version)** > Bấm **Triển khai (Deploy)**. Nếu không chọn New version, Web App sẽ vẫn chạy code cũ!

---

## 3. Cấu Hình Biến Môi Trường (Environment Variables)

### A. Chạy ở môi trường Local (.env.local)
Tạo file `.env.local` ở thư mục gốc của project:
```env
# Google Apps Script Web App URL (URL copy từ bước Deploy)
GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/AKfycb.../exec"

# Shared Secret Token (Trùng với APPS_SCRIPT_SECRET trong Script Properties)
GOOGLE_APPS_SCRIPT_SECRET="lydata_sec_987654321_secret_token"

# Google Tag Manager Container ID
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Hoặc Google Analytics 4 Measurement ID (nếu không dùng GTM)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### B. Cấu hình trên Vercel Deployment
1. Truy cập vào dashboard dự án trên [Vercel](https://vercel.com).
2. Vào **Settings** > **Environment Variables**.
3. Thêm 3 biến môi trường:
   - `GOOGLE_APPS_SCRIPT_URL`: URL Web App của Apps Script.
   - `GOOGLE_APPS_SCRIPT_SECRET`: Chuỗi secret đã cấu hình.
   - `NEXT_PUBLIC_GTM_ID`: Mã GTM container (Ví dụ: `GTM-XXXXXXX`).
4. Bấm **Save** và thực hiện **Redeploy** lại bản build mới nhất.

---

## 4. Kiểm Thử Endpoint Bằng cURL

Bạn có thể test gửi lead trực tiếp vào API route cục bộ:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "submission_id": "test-uuid-12345",
    "name": "Nguyễn Văn Test",
    "phone": "0912345678",
    "email": "test@gmail.com",
    "course_id": "sql-for-data-analytics",
    "course_name": "SQL for Data Analytics",
    "first_utm_source": "facebook",
    "first_utm_medium": "cpc",
    "first_utm_campaign": "launch_2026",
    "last_utm_source": "google",
    "last_utm_medium": "cpc"
  }'
```

Kết quả phản hồi mong đợi:
```json
{
  "ok": true,
  "submissionId": "test-uuid-12345",
  "status": "stored"
}
```

Nếu chạy lại cùng câu lệnh trên (cùng `submission_id`), kết quả sẽ là:
```json
{
  "ok": true,
  "submissionId": "test-uuid-12345",
  "status": "duplicate"
}
```
*(Đảm bảo không bị ghi đúp 2 dòng trong Google Sheets).*

---

## 5. Cấu Trúc Các Cột Trong Google Sheets (Leads)

Script sẽ tự động khởi tạo hàng tiêu đề bảng tính với đúng 31 cột chuẩn snake_case:

| STT | Tên cột (Header) | Mô tả |
| :--- | :--- | :--- |
| 1 | `submission_id` | Mã UUID duy nhất chống gửi trùng |
| 2 | `server_received_at` | Thời gian máy chủ Google nhận lead (ISO 8601) |
| 3 | `client_submitted_at` | Thời gian người dùng bấm gửi |
| 4 | `name` | Họ tên học viên |
| 5 | `phone` | Số điện thoại / Zalo |
| 6 | `email` | Địa chỉ email |
| 7 | `course_id` | Mã khóa học quan tâm |
| 8 | `course_name` | Tên khóa học |
| 9 | `message` | Ghi chú / Mục tiêu học viên |
| 10 | `first_utm_source` | Nguồn truy cập đầu tiên (First-touch) |
| 11 | `first_utm_medium` | Kênh truy cập đầu tiên |
| 12 | `first_utm_campaign` | Chiến dịch đầu tiên |
| 13 | `first_utm_content` | Nội dung quảng cáo đầu tiên |
| 14 | `first_utm_term` | Từ khóa tìm kiếm đầu tiên |
| 15 | `first_referrer` | URL trang giới thiệu đầu tiên |
| 16 | `first_landing_page` | Trang đích đầu tiên người dùng vào |
| 17 | `first_seen_at` | Thời điểm lần đầu vào website |
| 18 | `last_utm_source` | Nguồn truy cập gần nhất (Last-touch) |
| 19 | `last_utm_medium` | Kênh truy cập gần nhất |
| 20 | `last_utm_campaign` | Chiến dịch gần nhất |
| 21 | `last_utm_content` | Nội dung quảng cáo gần nhất |
| 22 | `last_utm_term` | Từ khóa tìm kiếm gần nhất |
| 23 | `last_referrer` | URL trang giới thiệu gần nhất |
| 24 | `last_landing_page` | Trang đích phiên gần nhất |
| 25 | `last_seen_at` | Thời điểm phiên gần nhất |
| 26 | `gclid` | Google Click ID (cho Google Ads) |
| 27 | `fbclid` | Facebook Click ID (cho Meta Ads) |
| 28 | `form_id` | ID form chuyển đổi |
| 29 | `cta_id` | ID nút bấm kích hoạt |
| 30 | `page_url` | URL trang phát sinh chuyển đổi |
| 31 | `status` | Trạng thái xử lý (Mặc định: `NEW`) |


## Script tạo mẫu và bản lưu

Xem [hướng dẫn tạo Excel](../scripts/README.md). Script chỉ xuất Ly_Data_Leads_Template.xlsx trong thư mục này, không tạo thêm bản ở thư mục gốc.

[Bản Excel trước đây ở thư mục gốc](archive/leads-template-from-root.xlsx) được giữ để đối chiếu vì worksheet khác bản hiện tại; chưa hợp nhất. Cả hai file được bảo toàn trong lần tổ chức lại. File .xlsx hiện bị Git bỏ qua theo .gitignore.
