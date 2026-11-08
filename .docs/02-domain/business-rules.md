# Danh mục Quy tắc nghiệp vụ — DataWithLy (Business Rules Catalog)

- **Mục đích:** Tập trung toàn bộ các quy tắc nghiệp vụ bất biến (Business Rules - BR) điều phối hành vi của hệ thống website DataWithLy. Tài liệu này là căn cứ tối cao để thẩm định logic mã nguồn, viết Unit/Integration Tests và nghiệm thu sản phẩm.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch nghiệp vụ ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview](../01-product/product-overview.md);
  - [Goals and Non-goals](../01-product/goals-and-non-goals.md);
  - [Security Design](../07-architecture/security-design.md);
  - [Lead Protection and Errors](../07-architecture/lead-protection-and-errors.md);
  - [Additional Requirements](../references/additional-requirements.md).

---

## 1. Bảng danh mục 13 Quy tắc nghiệp vụ cốt lõi (BR-01 đến BR-13)

| Mã BR | Tên quy tắc | Phân hệ áp dụng | Điều kiện kích hoạt | Hành vi bắt buộc của hệ thống | Ngoại lệ |
|:---:|:---|:---:|---|---|---|
| **BR-01** | **Định dạng số điện thoại di động Việt Nam** | Lead Capture | Học viên nhập số điện thoại trên Modal Form | Số điện thoại bắt buộc phải có đúng **10 chữ số**, bắt đầu bằng đầu số di động hợp lệ tại Việt Nam (`03`, `05`, `07`, `08`, `09` hoặc tiền tố quốc tế `+84`). Nếu sai, hệ thống báo lỗi đỏ và chặn nút gửi. | Không có ngoại lệ. |
| **BR-02** | **Chống gửi trùng lặp Lead (Idempotency)** | Lead Capture & Apps Script | Người dùng bấm nút gửi form nhiều lần liên tiếp | Mỗi phiên mở form được cấp mã `submission_id` UUIDv4 duy nhất. Trong cùng một `submission_id`, hệ thống chỉ ghi nhận đúng **1 dòng duy nhất** vào Google Sheets; các request gửi đè được trả về kết quả thành công trước đó mà không chèn thêm dòng mới. | Nếu người dùng chủ động đóng modal và mở lại form mới, hệ thống sẽ cấp `submission_id` mới. |
| **BR-03** | **Khử trùng công thức Google Sheets (Formula Sanitization)** | Security & Backend | Dữ liệu form chuẩn bị đẩy sang Google Apps Script | Mọi trường văn bản bắt đầu bằng một trong các ký tự `=`, `+`, `-`, `@`, `\t`, `\r` bắt buộc phải được tự động chèn thêm dấu nháy đơn `'` ở đầu chuỗi để ngăn chặn tấn công Formula/CSV Injection. | Các chuỗi văn bản thông thường không bắt đầu bằng các ký tự trên được giữ nguyên. |
| **BR-04** | **Ẩn / Hiện khóa học linh hoạt** | CMS & Khóa học | Người quản trị đổi cột `is_active` trên tab `Courses` | - Nếu `is_active = FALSE`: Khóa học tự động biến mất khỏi Slider Trang chủ, Menu điều hướng và các danh sách tuyển sinh.<br/>- Trang chi tiết `/courses/[slug]` của khóa học này vẫn hiển thị với thông báo *"Khóa học đã tạm dừng tuyển sinh đợt này"* để không làm gãy các link quảng cáo cũ. | Không có. |
| **BR-05** | **Quy tắc hiển thị giá bán & Khuyến mãi** | Khóa học & Bảng giá | Hiển thị giá tiền trên thẻ khóa học và bảng so sánh | - Học phí ưu đãi (`sale_price`) bắt buộc phải nhỏ hơn hoặc bằng học phí gốc (`original_price`).<br/>- Hệ thống tự động tính tỷ lệ % tiết kiệm: `discount_percent = round((1 - sale_price / original_price) * 100)`.<br/>- Hiển thị giá gạch ngang ở giá gốc và nổi bật giá ưu đãi. | Nếu `sale_price == original_price`, không hiển thị giá gạch ngang và không hiển thị nhãn % giảm giá. |
| **BR-06** | **Quy chuẩn lớp học & Khung giờ đào tạo** | Đào tạo & Khóa học | Thiết lập thông tin lịch học của 3 khóa cốt lõi | - Hình thức: **Live Online 100% qua Zoom Meeting** tương tác 2 chiều.<br/>- Khung giờ học chuẩn: **20:00 - 22:00 (hoặc 2.5 giờ/buổi), 2 buổi/tuần**.<br/>- Sĩ số tối đa: 15 - 20 học viên/lớp để đảm bảo chất lượng mentor sửa bài tập 1-1. | Lớp doanh nghiệp (B2B) hoặc kèm riêng 1-1 có thể thỏa thuận khung giờ riêng. |
| **BR-07** | **Lưu trữ tham số chiến dịch (UTM Persistence)** | Marketing & Tracking | Người dùng truy cập website qua đường link có gắn tham số UTM | Hệ thống tự động đọc và lưu trữ các giá trị `utm_source`, `utm_medium`, `utm_campaign` vào `sessionStorage`. Khi học viên nộp form ở bất kỳ trang nào trong phiên duyệt web, các tham số này tự động được gắn kèm vào hồ sơ Lead. | Nếu người dùng truy cập trực tiếp (Direct/Organic) không có UTM, các trường UTM được lưu dưới dạng chuỗi rỗng hoặc `direct`. |
| **BR-08** | **Chính sách bảo vệ thông tin định danh cá nhân (PII)** | An ninh & Marketing | Bắn các sự kiện đo lường (GA4, GTM, Meta Pixel) và hiển thị log | **Tuyệt đối không gửi** số điện thoại, địa chỉ email, hoặc họ tên học viên vào các sự kiện analytics hoặc thanh địa chỉ URL. Chỉ gửi các thông số phi định danh (`course_id`, `package_id`, `value`). | Không có ngoại lệ (Tuân thủ Nghị định 13/2023/NĐ-CP). |
| **BR-09** | **Giới hạn tần suất nộp form (Rate Limiting)** | An ninh & Phòng chống lạm dụng | Có nhiều request nộp form từ cùng một địa chỉ IP | Giới hạn tối đa **3 lần submit/phút/IP**. Nếu vượt quá, hệ thống từ chối xử lý, trả về mã HTTP `429 Too Many Requests` và yêu cầu người dùng chờ 60 giây. Dữ liệu học viên đã nhập trên form được giữ nguyên vẹn. | Không áp dụng giới hạn này cho môi trường phát triển cục bộ (`localhost`). |
| **BR-10** | **Đồng hồ đếm ngược Flash Sale Banner** | Cấu hình & Khuyến mãi | Cấu hình thanh banner trên cùng (`SiteConfig`) | - Nếu `top_banner_active = TRUE`: Hiển thị thanh banner ưu đãi kèm đồng hồ đếm ngược (Days : Hours : Minutes : Seconds) theo thời gian thực.<br/>- Khi thời gian chạm mốc `top_banner_deadline`: Banner tự động ẩn mà không cần lập trình viên gỡ code. | Người dùng bấm nút tắt banner: Banner ẩn trong phiên đó (lưu trạng thái `sessionStorage`). |
| **BR-11** | **Định dạng bài viết Blog chuẩn Markdown** | Nội dung & Blog | Hiển thị bài viết chi tiết tại `/blog/[slug]` | Nội dung trong cột `content_markdown` của tab `Blogs` được render bằng trình biên dịch Markdown: hỗ trợ thẻ heading H1-H3, trích dẫn blockquote, bảng biểu, và **khối code có tô màu cú pháp (Syntax Highlighting) cho SQL và Python** kèm nút `Copy Code` 1-click. | Các thẻ HTML độc hại (`<script>`, `<iframe>`) tự động bị làm sạch (Sanitized). |
| **BR-12** | **Cô lập lỗi giao diện (Zero White Screen Fallback)** | Giao diện & Trải nghiệm | Một component bị lỗi dữ liệu từ Google Sheets hoặc mất link ảnh | Component phát sinh lỗi tự động kích hoạt giao diện dự phòng (Fallback Gracefully) hoặc ẩn phần lỗi một cách mượt mà; **tuyệt đối không làm sập trắng toàn bộ trang web (Zero White Screen)**. Học viên vẫn tiếp tục xem được các phần còn lại và nộp form bình thường. | Lỗi phát sinh tại Root Layout khiến cả ứng dụng không thể render (sẽ hiển thị trang `error.tsx` tùy biến). |
| **BR-13** | **Quản lý nội dung đa kênh song song (Hybrid CMS Operations)** | CMS & Vận hành dữ liệu | Quản trị viên thêm, sửa, xóa khóa học, đề cương, cấu hình website | Hệ thống hỗ trợ song song 2 kênh:<br/>1. **Kênh Apps Script (Khuyến nghị):** Dùng Custom Menu `[DataWithLy CMS]` để mở form nhập liệu chuẩn, tự động validate slug, kiểm tra khóa ngoại trước khi ghi.<br/>2. **Kênh Chỉnh sửa trực tiếp (Direct Cell Edit):** Cho phép sửa nhanh trên ô; nhưng bắt buộc tuân thủ quy tắc định dạng và chạy công cụ **Data Linter** trước khi kích hoạt Webhook làm mới web.<br/>3. **Xóa mềm (Soft Delete):** Xóa khóa học luôn chuyển `is_active = FALSE` và `status = 'ARCHIVED'`, tuyệt đối không xóa dòng vật lý. | Chỉnh sửa trực tiếp chỉ áp dụng cho nội dung văn bản ngắn; các thao tác tạo mới cấu trúc lớn khuyến nghị 100% qua Custom Menu. |

---

## 2. Quy trình kiểm tra & Xác thực sự tuân thủ các quy tắc

1. **Kiểm tra tự động bằng Unit Tests (CI Pipeline):**
   - Bộ kiểm thử tự động của dự án phải có test cases xác nhận cho từng quy tắc:
     + Test `BR-01`: Thử nghiệm các đầu số SĐT không hợp lệ (9 chữ số, 11 chữ số, chữ cái) -> Kiểm tra hàm validate ném lỗi chính xác.
     + Test `BR-02`: Gửi 2 request có cùng `submission_id` -> Kiểm tra Google Sheets chỉ tăng 1 dòng.
     + Test `BR-03`: Thử nghiệm payload có tên `=cmd|' /C calc'!A0` -> Kiểm tra hàm sanitizer thêm dấu nháy đơn `'=cmd...`.
     + Test `BR-09`: Gửi liên tiếp 4 request từ 1 IP trong 10 giây -> Request thứ 4 phải nhận mã lỗi 429.
     + Test `BR-13`: Kiểm tra logic Soft Delete không làm mất dữ liệu đề cương liên kết.
2. **Kiểm tra định kỳ bởi Người quản trị:**
   - Trước khi xuất bản nội dung lên website, người quản trị chạy công cụ **Data Linting** trên menu Google Sheets để đối soát tự động các quy tắc `BR-04`, `BR-05`, `BR-10`, `BR-11` và `BR-13`. Chi tiết xem tại [Sổ tay Vận hành](../09-handover/client-operations-guide.md).

---

[Điểm bắt đầu của bộ docs](../README.md)
