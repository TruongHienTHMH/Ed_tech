# HƯỚNG DẪN TRIỂN KHAI DỰ ÁN LÊN VERCEL (VERCEL DEPLOYMENT GUIDE)

Tài liệu này cung cấp toàn bộ quy trình đưa dự án **DataWithLy (ed_da_tech)** lên môi trường Production trên nền tảng **Vercel** một cách an toàn và tối ưu nhất.

---

## 1. BƯỚC 1: CẤU HÌNH SCRIPT PROPERTIES TRÊN GOOGLE APPS SCRIPT

Để đảm bảo toàn bộ mã bí mật không bị lộ trong mã nguồn Git, bạn cần cấu hình các thông số bảo mật vào **Script Properties** của Google Apps Script (kho lưu trữ an toàn cấp dự án của Google):

1. Truy cập [Google Apps Script Dashboard](https://script.google.com) và mở dự án của bạn.
2. Nhấn vào biểu tượng **⚙️ Project Settings** (Cài đặt dự án) ở thanh menu bên trái.
3. Cuộn xuống mục **Script Properties** (Thuộc tính tập lệnh) -> Nhấn **Add script property**.
4. Thêm các cặp Property và Value sau:

| Property (Khóa) | Value (Giá trị) | Ghi chú |
| :--- | :--- | :--- |
| `SHARED_SECRET` | `96e77022e0f8c18c7da95b88b2be38810aa205e2c452e70cad121272bc3d03dd` | Mã bí mật xác thực giữa Next.js và Apps Script |
| `CLIENT_NOTIFICATION_EMAILS` | `hientruongthmh@gmail.com` | Email nhận thông báo khi có Lead mới đăng ký |
| `ZALO_CONTACT_URL` | `https://zalo.me/0934938431` | Link nút Zalo trong email gửi học viên |

5. Nhấn **Save script properties**.

---

## 2. BƯỚC 2: CẤU HÌNH BIẾN MÔI TRƯỜNG TRÊN VERCEL DASHBOARD

Khi tạo Project trên Vercel (hoặc vào **Project Settings -> Environment Variables**), hãy copy các biến môi trường sau:

| Tên Biến Môi Trường | Giá Trị Thực Tế | Environment |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` *(hoặc domain riêng)* | Production, Preview |
| `GOOGLE_APPS_SCRIPT_CMS_URL` | `https://script.google.com/macros/s/AKfycby6Vm6PzDTYBx7yyiVceoIWywP0iunsD4B5rBSa51tFyZMcuJ1Rhv4GZZhASyXr5bgo/exec` | Production, Preview |
| `GOOGLE_APPS_SCRIPT_CMS_SECRET` | `96e77022e0f8c18c7da95b88b2be38810aa205e2c452e70cad121272bc3d03dd` | Production, Preview |
| `GOOGLE_APPS_SCRIPT_LEADS_URL` | `https://script.google.com/macros/s/AKfycby6Vm6PzDTYBx7yyiVceoIWywP0iunsD4B5rBSa51tFyZMcuJ1Rhv4GZZhASyXr5bgo/exec` | Production, Preview |
| `GOOGLE_APPS_SCRIPT_LEADS_SECRET` | `96e77022e0f8c18c7da95b88b2be38810aa205e2c452e70cad121272bc3d03dd` | Production, Preview |
| `LEADS_SPREADSHEET_ID` | `1_ed_da_tech_leads_private_spreadsheet_id` | Production, Preview |
| `GOOGLE_APPS_SCRIPT_URL` | `https://script.google.com/macros/s/AKfycby6Vm6PzDTYBx7yyiVceoIWywP0iunsD4B5rBSa51tFyZMcuJ1Rhv4GZZhASyXr5bgo/exec` | Production, Preview |
| `GOOGLE_APPS_SCRIPT_SECRET` | `96e77022e0f8c18c7da95b88b2be38810aa205e2c452e70cad121272bc3d03dd` | Production, Preview |
| `REVALIDATION_SECRET` | `datawithly_secure_reval_token_2026` | Production, Preview |
| `STORAGE_PROVIDER` | `local` | Production, Preview |
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Production, Preview |

---

## 3. BƯỚC 3: TRIỂN KHAI DỰ ÁN (DEPLOYMENT OPTIONS)

### Cách 1: Triển khai tự động qua GitHub (Khuyên dùng)
1. Đẩy nhánh code lên kho lưu trữ GitHub của bạn:
   ```bash
   git push origin feature/rf-11-security-audit-and-vercel-deploy
   ```
2. Truy cập [vercel.com/new](https://vercel.com/new).
3. Chọn Repository `ed_da_tech` từ danh sách GitHub.
4. Mở mục **Environment Variables** và dán danh sách biến ở Bước 2.
5. Nhấn **Deploy**. Vercel sẽ tự động build và tạo đường dẫn Production (`https://ed-da-tech-....vercel.app`).

### Cách 2: Triển khai trực tiếp qua Vercel CLI từ Terminal
1. Đảm bảo bạn đã đăng nhập Vercel:
   ```bash
   vercel login
   ```
2. Triển khai bản xem trước (Preview):
   ```bash
   vercel
   ```
3. Triển khai bản chính thức (Production):
   ```bash
   vercel --prod
   ```

---

## 4. BƯỚC 4: THIẾT LẬP WEBHOOK ON-DEMAND REVALIDATE TỪ GOOGLE SHEETS

Để khi bạn chỉnh sửa dữ liệu khóa học hoặc viết blog trên Google Sheets, Website trên Vercel tự động cập nhật ngay lập tức:

1. Trong file Google Sheets CMS, vào tab `settings`.
2. Điền khóa `revalidation_url` với giá trị:
   ```
   https://<your-vercel-domain>/api/revalidate?secret=datawithly_secure_reval_token_2026
   ```
3. Giờ đây, mỗi khi chạy menu **DataWithLy CMS -> Xuất bản thay đổi**, toàn bộ cache của Vercel sẽ tự động được làm mới trong 1 giây mà không cần deploy lại code!

---

## 5. BƯỚC 5: NGHIỆM THU SAU KHI DEPLOY

- [ ] **Trang chủ (`/`)**: Khối Hero căn giữa chuẩn, responsive đẹp trên mobile, danh sách khóa học hiển thị đầy đủ hình ảnh.
- [ ] **Trang chi tiết (`/courses/sql-for-data-analytics`)**: Lộ trình 12 buổi hiển thị trọn vẹn, không bị lỗi thiếu chương.
- [ ] **Trang combo (`/courses/end-to-end-analytics`)**: Lộ trình 27 buổi kết hợp SQL & Dashboard hoạt động mượt mà.
- [ ] **Đăng ký Lead (`LeadModal`)**: Điền thông tin thử nghiệm -> Đơn lưu vào Google Sheets -> Email thông báo gửi về `hientruongthmh@gmail.com` -> Email cảm ơn kèm link Zalo gửi về hộp thư học viên.
