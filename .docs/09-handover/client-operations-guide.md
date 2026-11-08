# Sổ Tay Vận Hành & Hướng Dẫn Sử Dụng Ứng Dụng (Client Operations Guide)

- **Dành riêng cho:** Founder Mentor Hứa Thảo Ly & Đội ngũ Vận hành / Tư vấn viên DataWithLy
- **Mục đích:** Hướng dẫn chi tiết từng bước (Step-by-step) cách quản lý nội dung khóa học, đề cương, bài viết và xử lý thông tin học viên đăng ký tư vấn một cách dễ dàng, nhanh chóng và an toàn nhất.
- **Trạng thái:** Chính thức bàn giao
- **Ngày phát hành:** 2026-11-04
- **Hệ thống áp dụng:** Website DataWithLy & File Google Sheets Quản trị

---

## 1. Tổng quan Quy trình Vận hành

Website **DataWithLy** được thiết kế theo mô hình **Zero-Code Content Delivery**. Chị Ly và đội ngũ hoàn toàn không cần chạm vào mã nguồn lập trình mà vẫn có thể cập nhật thông tin học phí, đề cương và bài viết trực tiếp thông qua **Google Sheets**.

```
[1. Chỉnh sửa trên Google Sheets] 
               │
               ▼
[2. Kiểm tra lỗi dữ liệu (Data Linter)]
               │
               ▼
[3. Bấm nút: "Đồng Bộ Lên Website"] 
               │ (Chỉ mất 1 giây)
               ▼
[4. Website cập nhật thông tin mới tức thì!]
```

---

## 2. Hai Phương Thức Thao Tác Nội Dung Song Song (BR-13)

Hệ thống hỗ trợ song song 2 cách để chị Ly và biên tập viên làm việc thuận tiện:

### Cách 1: Sử dụng Menu Tùy Biến `[🚀 DataWithLy CMS]` (Khuyến nghị cao)
- **Khi nào nên dùng:** Khi muốn thêm một khóa học mới, thêm một buổi học đề cương mới, hoặc kiểm tra toàn diện lỗi dữ liệu.
- **Cách thực hiện:** Trên thanh công cụ của file Google Sheets, chị bấm vào menu **`[🚀 DataWithLy CMS]`**, chọn chức năng tương ứng. Một bảng biểu popup sẽ mở ra với các ô nhập liệu rõ ràng, tự động kiểm tra định dạng và báo lỗi ngay nếu chị gõ thiếu hoặc gõ sai.

### Cách 2: Chỉnh sửa trực tiếp trên ô (Direct Cell Edit)
- **Khi nào nên dùng:** Khi chị muốn sửa nhanh một lỗi chính tả, thay đổi số điện thoại hotline, đổi ngày khai giảng hoặc cập nhật nhanh mức học phí ưu đãi.
- **Cách thực hiện:** Bấm đúp vào ô cần sửa và gõ nội dung mới. Sau khi gõ xong, chị chỉ cần chạy công cụ **"Kiểm Tra Lỗi Dữ Liệu"** để đảm bảo không bị sai lệch cấu trúc trước khi đưa lên web.

---

## 3. Hướng dẫn Chi tiết từng Nghiệp vụ

### 3.1. Thêm một Khóa học Mới
1. Trên file Google Sheets, chọn menu **`[🚀 DataWithLy CMS] > ➕ Thêm Khóa Học Mới`**.
2. Điền các trường thông tin:
   - **Tên khóa học:** Tên chính thức (vd: `SQL for Data Analytics`).
   - **Mã Slug (URL):** Viết thường, không dấu, phân cách bởi dấu gạch ngang (vd: `sql-for-data-analytics`). Hệ thống sẽ tự động báo nếu mã này bị trùng.
   - **Học phí gốc & Học phí ưu đãi:** Nhập số nguyên không dấu chấm (vd: `3500000` và `2990000`).
   - **Thời lượng:** Số buổi (vd: `12 buổi`) và số tuần (vd: `6 tuần`).
   - **Lịch học:** Khung giờ (vd: `Thứ 3 - Thứ 5: 20:00 - 22:00`).
3. Bấm **[Lưu Khóa Học]**. Dòng mới sẽ tự động được thêm vào tab `courses` một cách chuẩn xác.

---

### 3.2. Soạn thảo Đề cương Buổi học (Quy tắc Vàng `Alt + Enter`)
Đề cương buổi học bao gồm các gạch đầu dòng chi tiết hiển thị trong phần Accordion trên website:

- **Nếu dùng Menu CMS:** Chọn **`[🚀 DataWithLy CMS] > 📚 Thêm Buổi Học Đề Cương`**, gõ từng gạch đầu dòng vào form.
- **Nếu gõ trực tiếp trên Tab `curriculum`:**
  > [!IMPORTANT]
  > **Quy tắc vàng:** Tại cột `bullets`, khi chị muốn xuống dòng để tạo một gạch đầu dòng mới trong cùng một ô, hãy nhấn tổ hợp phím **`Alt + Enter`** (trên Windows) hoặc **`Option + Enter`** (trên Mac).
  > 
  > *Ví dụ nội dung trong một ô:*
  > ```text
  > • Cài đặt môi trường DBeaver và kết nối cơ sở dữ liệu
  > • Cú pháp truy vấn cơ bản: SELECT, WHERE, ORDER BY
  > • Bài tập thực hành giải quyết bài toán kinh doanh tại lớp
  > ```
  > Khi hiển thị lên website, hệ thống sẽ tự động tách thành 3 dòng riêng biệt có icon tích xanh đẹp mắt.

---

### 3.3. Tạm dừng Tuyển sinh hoặc Xóa một Khóa học (Soft Delete an toàn)
Để bảo vệ uy tín website và không làm mất dữ liệu học viên cũ:
- **Tuyệt đối KHÔNG xóa hẳn dòng khóa học ra khỏi Sheets**.
- **Cách làm chuẩn:**
  1. Vào tab `courses`, tìm dòng khóa học muốn dừng tuyển sinh.
  2. Tại cột `is_active`, chuyển giá trị từ `TRUE` thành **`FALSE`**.
  3. Tại cột `status`, chuyển sang **`ARCHIVED`**.
- **Kết quả trên web:** Khóa học sẽ tự động biến mất khỏi Trang chủ và Menu điều hướng. Nếu học viên cũ còn lưu đường link cũ `/courses/[slug]`, trang web sẽ hiển thị thông báo lịch sự: *"Khóa học này hiện đã tạm dừng tuyển sinh đợt mới. Vui lòng bấm [Tư vấn] để nhận thông tin khai giảng đợt tiếp theo"*, không làm mất khách hàng tiềm năng.

---

### 3.4. Cập nhật Hình ảnh (Avatar, Dự án học viên, Thumbnail Blog)
- Khi dán đường dẫn ảnh vào các cột `avatar_url`, `image_url`, `thumbnail_url`:
  - Đảm bảo đường link bắt đầu bằng **`https://`**.
  - **Mẹo nhỏ:** Chị nên thử mở đường link ảnh đó trên một tab trình duyệt ẩn danh (Incognito). Nếu ảnh hiển thị bình thường tức là quyền truy cập đã mở công khai.
  - *Nếu lỡ link ảnh bị hỏng:* Hệ thống đã có sẵn công nghệ **SafeImage** tự động hiển thị logo DataWithLy hoặc ảnh thay thế chuẩn màu thương hiệu, bảo đảm website không bao giờ bị hiện icon ảnh vỡ.

---

## 4. Quy trình 1-Click Xuất Bản Lên Website

Mỗi khi chị Ly hoặc biên tập viên hoàn tất việc thêm bài hoặc sửa đổi dữ liệu:

1. **Bước 1 — Chạy Kiểm Tra Lỗi Dữ Liệu:**
   - Chọn menu **`[🚀 DataWithLy CMS] > 🔍 Kiểm Tra Lỗi Dữ Liệu (Data Linter)`**.
   - Hệ thống sẽ quét qua toàn bộ 9 tab trong 2 giây. Nếu có ô nào bị thiếu thông tin bắt buộc, link ảnh bị lỗi hoặc trùng lặp mã khóa học, script sẽ hiện thông báo cảnh báo để chị chỉnh sửa lại ngay.
2. **Bước 2 — Bấm Đồng Bộ Lên Website:**
   - Chọn menu **`[🚀 DataWithLy CMS] > 🌐 Đồng Bộ Lên Website (Revalidate)`**.
   - Một thông báo *"Đang gửi tín hiệu làm mới bộ nhớ đệm..."* xuất hiện.
   - Sau **1 đến 2 giây**, hệ thống báo *"Thành công! Website đã được cập nhật dữ liệu mới nhất"*.
3. **Bước 3 — Kiểm tra trên Website:**
   - Chị mở trình duyệt truy cập website `datawithly.edu.vn` để chiêm ngưỡng nội dung mới mà không cần nhờ đến bất kỳ lập trình viên nào can thiệp.

---

## 5. Quản lý Danh sách Học viên Đăng ký Tư vấn (Leads)

Tất cả thông tin học viên bấm đăng ký tư vấn trên website sẽ được bảo vệ tuyệt mật và tự động ghi vào file **Google Sheets Private (Tab `leads`)**:

### Các cột thông tin được ghi nhận tự động:
1. `created_at`: Ngày giờ học viên bấm nộp form chính xác đến từng giây.
2. `full_name`: Họ và tên học viên.
3. `phone`: Số điện thoại di động (đã được kiểm tra đúng định dạng 10 số của Việt Nam).
4. `email`: Địa chỉ email nhận thông tin.
5. `course_id`: Khóa học mà học viên đang quan tâm hoặc muốn được tư vấn lộ trình.
6. `learning_goal`: Mục tiêu học tập cá nhân của học viên.
7. `status`: Trạng thái xử lý của đội ngũ tư vấn (chị Ly có thể chọn menu thả xuống: `NEW` ➔ `CONTACTING` ➔ `CONSULTED` ➔ `ENROLLED` ➔ `DROPPED`).
8. `email_student_status` & `email_admin_status`: Trạng thái gửi email thông báo tự động (`SENT` = Đã gửi thành công).

### Thông báo Email thời gian thực:
- Ngay khi có học viên mới điền form, một email cảnh báo với tiêu đề `🔥 [LEAD MỚI] [DataWithLy] - [Tên học viên]` sẽ lập tức được gửi đến hòm thư của chị Ly và các tư vấn viên (`hien0934752432@gmail.com`, `hien.truong230214@vnuk.edu.vn`) để đội ngũ có thể liên hệ ngay trong vòng 15-30 phút.

---

## 6. Hướng Dẫn Xử Lý Sự Cố Thường Gặp (FAQs & Troubleshooting)

| Hiện tượng | Nguyên nhân có thể | Cách xử lý đơn giản |
|---|---|---|
| **Tôi đã sửa giá trên Sheets nhưng mở web vẫn thấy giá cũ?** | Do bộ nhớ đệm (Cache) trên Edge Server chưa được làm mới. | Chị chỉ cần vào menu Sheets chọn **`[DataWithLy CMS] > 🌐 Đồng Bộ Lên Website`**. Sau 2 giây mở lại web (hoặc bấm tổ hợp phím `Ctrl + F5` / `Cmd + Shift + R`) là sẽ thấy ngay giá mới. |
| **Ảnh đại diện học viên hoặc bài blog bị mất hình?** | Link ảnh gốc bị xóa hoặc đặt ở chế độ riêng tư (Private). | Chị kiểm tra lại link ảnh ở chế độ ẩn danh. Nếu ảnh hỏng, chị upload lại lên Imgur, Google Drive (chế độ Anyone with link can view) hoặc Cloudinary rồi dán lại link. |
| **Tôi lỡ tay xóa nhầm một cột tiêu đề trên Sheets?** | Thao tác nhầm trên Dòng 1. | Nhấn tổ hợp phím `Ctrl + Z` (hoặc `Cmd + Z`) để hoàn tác ngay. Hoặc vào menu `Tệp > Lịch sử phiên bản` (Version History) để khôi phục lại trạng thái vài phút trước đó. |
| **Form đăng ký trên web báo "Bạn đã gửi quá nhiều yêu cầu"?** | Cơ chế chống spam tự động (Rate Limit) kích hoạt khi 1 máy bấm gửi liên tục quá 3 lần/10 phút. | Đây là tính năng bảo vệ hệ thống khỏi bot phá hoại. Chị chỉ cần đợi sau 5 phút là có thể tiếp tục thử nghiệm bình thường. |

---

[Quay lại Mục lục Bàn giao](README.md) | [Đến Checklist Kỹ thuật](technical-handover-checklist.md)

