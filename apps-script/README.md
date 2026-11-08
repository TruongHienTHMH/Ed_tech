# Hướng Dẫn Cài Đặt & Cấu Trúc Mã Nguồn Google Apps Script (CMS DataWithLy)

- **Dành cho:** Mentor Hứa Thảo Ly & Đội ngũ Kỹ thuật
- **Kiến trúc:** Modular Architecture (15 Scripts `.gs` + 10 Native HTML Modals `.html` + Entrypoint `Code.gs`)
- **Bảo mật:** Enterprise Security qua `PropertiesService` (Zero Hardcoded Secret).

---

## 1. Cấu Trúc Thư Mục `apps-script/`

Dự án được phân tách thành các module chuyên biệt theo chuẩn Single Responsibility Principle:

### Các Script Logic (`.gs`)
| Tên File | Chức Năng Chính | Lợi Ích Quản Trị & Debug |
| :--- | :--- | :--- |
| **`Code.gs`** | **Core Entrypoint & Bootstrap (50 dòng)** | Khởi tạo view engine (`include`, `createModalTemplate`), thông tin hệ thống. |
| **`00_Config.gs`** | Hằng số hệ thống, Secret Token qua `PropertiesService`, Mutex Lock Timeout | Zero Hardcoded Secret, bảo mật chuẩn Enterprise. |
| **`01_SlugUtils.gs`** | Bộ chuyển đổi tiếng Việt chuẩn SEO, Auto-Versioning (`-v1`, `-v2`, `-v3`), Test Suite | Thuật toán SEO Slug chống trùng lặp, tự động hóa toàn diện. |
| **`02_MenuAndTriggers.gs`** | Khởi tạo menu `🚀 DataWithLy CMS` (16 tính năng) & trigger `onEdit(e)` | Tự động hóa sinh ID/Slug và bắt sự kiện thời gian thực. |
| **`03_TablesSetup.gs`** | Khởi tạo 11 Tab chuẩn hóa kèm dữ liệu mẫu và Dropdown Data Validation | Quản lý schema database bảng tính tập trung (11 Tab). |
| **`04_WebAppEndpoints.gs`** | Endpoint `doGet` (xuất JSON) và `doPost` (nhận Leads, ghi 9 loại dữ liệu) | Định tuyến API Web App phục vụ website Next.js. |
| **`05_CourseModal.gs`** | Backend handler & hiển thị Modal Thêm Khóa học | Gọi `CourseModal.html` bản địa, xử lý lưu dữ liệu. |
| **`06_Maintenance.gs`** | Data Linter, Soft-delete, Revalidation, Telegram Bot, Set Secret Prompt | Bộ công cụ bảo trì và đối soát dữ liệu. |
| **`07_CurriculumModal.gs`** | Backend handler & hiển thị Modal Lộ trình học (Curriculum) | Gọi `CurriculumModal.html`, tự động tính số thứ tự chương. |
| **`08_MentorModal.gs`** | Backend handler & hiển thị Modal Mentor & AboutUs | Gọi `MentorModal.html`, cập nhật profile Chị Ly. |
| **`09_PromotionsModal.gs`** | Backend handler & hiển thị Modal Khuyến Mãi & Flash Sale | Gọi `PromotionsModal.html`, quản trị voucher. |
| **`10_PackageModal.gs`** | Backend handler & hiển thị Modal Gói Combo & Bảng Giá | Gọi `PackageModal.html`, quản trị học phí combo. |
| **`11_TestimonialModal.gs`** | Backend handler & hiển thị Modal Đánh Giá Học Viên | Gọi `TestimonialModal.html`, quản trị feedback 5 sao. |
| **`12_FaqModal.gs`** | Backend handler & hiển thị Modal Câu Hỏi Thường Gặp (FAQ) | Gọi `FaqModal.html`, quản trị accordion giải đáp thắc mắc. |
| **`13_SettingsModal.gs`** | Backend handler & hiển thị Modal Cấu Hình Hệ Thống | Gọi `SettingsModal.html`, cập nhật hotline/zalo/email. |
| **`14_BlogModal.gs`** | Backend handler & hiển thị Modal Bài Viết Blog | Gọi `BlogModal.html`, quản trị bài viết kiến thức. |

### Các Giao Diện HTML Bản Địa (`.html`)
| Tên File | Chức Năng |
| :--- | :--- |
| **`SharedStyles.html`** | Thiết kế Design Tokens chung (#8B1D2C, #1F242F, form controls, badges, buttons). |
| **`CourseModal.html`** | Giao diện thêm khóa học kèm xem trước Slug & Badge tự động. |
| **`BlogModal.html`** | Giao diện xuất bản bài viết Blog chuẩn SEO. |
| **`CurriculumModal.html`** | Giao diện thêm chương học gắn với từng khóa học. |
| **`MentorModal.html`** | Giao diện hồ sơ giảng viên kèm Live Card Preview. |
| **`PromotionsModal.html`** | Giao diện mã voucher / Flash Sale kèm badge giảm giá. |
| **`PackageModal.html`** | Giao diện quản trị bảng giá gói Combo. |
| **`TestimonialModal.html`** | Giao diện thêm cảm nhận học viên kèm xếp hạng sao. |
| **`FaqModal.html`** | Giao diện thêm câu hỏi thường gặp theo chủ đề. |
| **`SettingsModal.html`** | Giao diện chỉnh sửa toàn bộ cấu hình hệ thống. |

---

## 2. Cách Cài Đặt Vào Google Sheets (Chọn 1 Trong 2 Cách)

### Cách 1: Cài Đặt Dạng Modular Chuẩn (Khuyên Dùng Cho Dự Án Lớn)
Trong Google Apps Script Editor, bạn có thể tạo các file `.gs` và `.html` tương ứng:
- Google Apps Script tự động gộp các file `.gs` trong cùng namespace toàn cục.
- Các hàm `createModalTemplate("CourseModal")` và `include("SharedStyles")` sẽ gọi trực tiếp đến các file `.html` tương ứng.
- Khi cần chỉnh sửa giao diện của một modal, bạn chỉ cần sửa file `.html` đó mà không làm ảnh hưởng đến mã logic.

### Cách 2: Sử Dụng File Bundle Đóng Gói Sẵn (`dist/Code.bundle.gs`)
Nếu bạn muốn triển khai nhanh chỉ bằng 1 thao tác copy-paste duy nhất:
1. Chạy lệnh đóng gói: `node apps-script/bundle.js`
2. Mở file **`apps-script/dist/Code.bundle.gs`** vừa tạo.
3. Dán toàn bộ nội dung vào file `Code.gs` trên trình soạn thảo Google Apps Script. File bundle này đã được inlined toàn bộ mã nguồn của 15 file `.gs` và 10 file `.html`.

---

## 3. Cấu Hình Bảo Mật Mã Secret (Zero Hardcoded Secret)
1. Trên Google Sheets, bấm menu: **`🚀 DataWithLy CMS`** ➔ **`🔐 Cài Đặt Mã Secret (Script Properties)`**.
2. Nhập mã secret xác thực (khớp với `GOOGLE_APPS_SCRIPT_SECRET` trong `.env.local` của Next.js).
3. Hệ thống sẽ lưu trữ an toàn trong Google Cloud Script Properties.
