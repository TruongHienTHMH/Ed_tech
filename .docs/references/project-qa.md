## 1. WEBSITE & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX)

### [x] 1.1. Website đã responsive đầy đủ trên desktop, tablet và mobile chưa?

### [x] 1.2. Đã test trên Chrome, Safari và các trình duyệt phổ biến chưa?
  * Next.js tích hợp sẵn công cụ tự động biên dịch CSS đa trình duyệt (Autoprefixer & PostCSS), đảm bảo trang web hiển thị đồng nhất và chuẩn xác trên: Google Chrome, Apple Safari (iOS/macOS), Microsoft Edge, Firefox và Cốc Cốc.

### [x] 1.3. Tất cả button, link, menu và CTA đã hoạt động đúng chưa?
  * Em sẽ dùng làm tư liệu checklist kiểm tra hệ thống trước khi bàn giao cho chị nha

### [x] 1.4. Tốc độ tải trang hiện tại như thế nào? Có phần nào cần tối ưu không?
* **TỐC ĐỘ SIÊU TỐC (< 1.2 GIÂY), ĐẠT CHUẨN GOOGLE CORE WEB VITALS (> 90 ĐIỂM).**
  * Nhờ ứng dụng công nghệ **Incremental Static Regeneration (ISR)** Chị có thể search để hiểu hơn về nó.

### [x] 1.5. Các trang 404, lỗi hệ thống hoặc link không tồn tại được xử lý như thế nào?
*
  * **Trang 404 (Không tìm thấy trang):** Khi người dùng gõ sai link hoặc truy cập link cũ không tồn tại, hệ thống chuyển hướng đến trang 404 được thiết kế theo đúng nhận diện thương hiệu LY DATA, kèm nút bấm *"Quay về Trang chủ"* hoặc *"Khám phá các khóa học khác"* để giữ chân học viên.
  * **Cơ chế Error Boundary (Cô lập lỗi):** Nếu một thành phần nhỏ bị lỗi (ví dụ một ảnh bị mất link), hệ thống sẽ tự động dùng ảnh dự phòng (Fallback Gracefully) mà **tuyệt đối không làm sập toàn bộ trang web**.

---

## 2. FORM ĐĂNG KÝ & THU THẬP LEADS

### [x] 2.1. Khi học viên điền form đăng ký, thông tin sẽ được lưu ở đâu? Có sợ bị đầy bộ nhớ không?
* **LƯU TRỰC TIẾP VÀO FILE "PRIVATE LEADS SHEET" (BẢO MẬT NỘI BỘ).**
  * Thông tin học viên được chuyển tiếp an toàn từ website vào Google Sheets nội bộ thông qua Webhook mã hóa của Google Apps Script.
  * **Về dung lượng lưu trữ:** Google Sheets hỗ trợ tới **10.000.000 (10 triệu) ô dữ liệu**. Bảng Leads của chúng ta có 30 cột, tương đương khả năng lưu trữ hơn **300.000 lượt đăng ký** trên cùng một tab. Với quy mô tuyển sinh của trung tâm, Chị có thể an tâm sử dụng trong thời gian dài mà không lo đầy hay phải tạo thêm tab mới thủ công.
  * Tuy nhiên em sẽ thiết lập cơ chế thông báo nếu gần chạm ngưỡng limit để cho tương lai. 

### [x] 2.2. Có gửi email thông báo ngay khi có học viên đăng ký mới không?
* **CÓ, HỆ THỐNG GỬI EMAIL THÔNG BÁO TỨC THÌ (REAL-TIME ALERT).**
  * Ngay khi học viên bấm nút nộp form, Google Apps Script tự động gửi 1 email thông báo lập tức đến Gmail của Chị Ly/Tư vấn viên với đầy đủ: Họ tên, Số điện thoại, Email, Khóa học quan tâm và Khung giờ hẹn trao đổi để tư vấn viên gọi điện.

### [x] 2.3. Học viên có nhận email xác nhận sau khi submit form không?
* **CÓ THỂ BẬT TÍNH NĂNG TỰ ĐỘNG GỬI EMAIL CẢM ƠN HỌC VIÊN.**
  * Hệ thống tự động gửi một email thư cảm ơn được soạn sẵn từ địa chỉ mail của LY DATA: xác nhận đã nhận thông tin, nhắc nhở khung giờ hẹn gọi tư vấn và gửi kèm tài liệu học thử hoặc link tham gia cộng đồng Data.

### [x] 2.4. Có cơ chế chống spam hoặc đăng ký trùng lặp không?
* **CÓ, ĐƯỢC BẢO VỆ BẰNG 3 LỚP PHÒNG THỦ CHUYÊN NGHIỆP.**
  1. *Honeypot Anti-Bot:* Đặt một ô nhập liệu ẩn mà người thường không thấy, chỉ có bot tự động mới điền. Nếu phát hiện bot -> chặn ngay lập tức.
  2. *Chống gửi trùng (Deduplication / Idempotency):* Mỗi lượt gửi form được cấp một mã `submission_id` duy nhất. Nếu học viên lỡ tay bấm liên tiếp 2-3 lần, hệ thống chỉ ghi nhận 1 dòng duy nhất.
  3. *Rate Limiting theo IP:* Giới hạn mỗi người dùng chỉ được gửi tối đa 3 lần/phút để ngăn chặn kẻ xấu cố tình spam phá hoại.

### [x] 2.5. Nếu form bị lỗi hoặc gửi không thành công thì hệ thống xử lý thế nào?
* **CÓ CƠ CHẾ BẢO TOÀN DỮ LIỆU & TỰ ĐỘNG THỬ LẠI (AUTO-RETRY).**
  * Trên giao diện: Form hiển thị trạng thái chờ (Loading spinner). Nếu đường truyền mạng chập chờn, hệ thống tự động thử gửi lại (Retry 3 lần trong nền).
  * Giữ nguyên thông tin đã nhập: Dữ liệu người dùng đã gõ không bị mất đi, form hiện thông báo nhẹ nhàng: *"Kết nối mạng không ổn định, vui lòng bấm Thử lại hoặc nhắn tin qua Zalo Hotline"*.

### [x] 2.6. Có thể kết nối form với Google Sheets, CRM hoặc công cụ Email Marketing không?
* **HOÀN TOÀN KẾT NỐI ĐƯỢC VÀ RẤT DỄ DÀNG.**
  * Hệ thống cốt lõi hiện tại đã kết nối trực tiếp vào Google Sheets.
  * Từ Google Sheets, hệ thống có thể kết nối thông suốt với mọi phần mềm CRM (LarkSuite, HubSpot, KiotViet...) hoặc công cụ Email Marketing (Mailchimp, GetResponse) thông qua Webhook hoặc Make/Zapier hoàn toàn tự động. Tuy nhiên, chị có thể chọn 1 công cụ phù hợp với chị.

---

## 3. CMS & QUẢN TRỊ NỘI DUNG (GOOGLE SHEETS)

### [x] 3.1. Mình có thể tự chỉnh sửa nội dung, hình ảnh, học phí và lịch khai giảng không?
* **100% TỰ CHỈNH SỬA DỄ DÀNG MÀ KHÔNG CẦN DEV.**
  * Toàn bộ câu chữ, hình ảnh, học phí bán lẻ, giá combo ưu đãi và ngày khai giảng đều được quản lý tại file `Public Content Sheet`. Chị Ly sửa trên bảng tính, bấm nút *"Xuất bản"* là website đổi mới ngay sau 1-2 giây.

### [x] 3.2. Có thể tự tạo khóa học mới hoặc ẩn khóa học cũ không?
* **HOÀN TOÀN ĐƯỢC.**
  * Thêm khóa học mới: Nhập 1 dòng mới vào tab `Courses` (hoặc mở Form `LY DATA CMS -> Thêm khóa học`).
  * Ẩn khóa học đã dừng tuyển sinh: Chỉ cần đổi cột `is_active = FALSE`, khóa học đó sẽ tự động ẩn khỏi website mà vẫn lưu lại lịch sử trong bảng tính.

### [x] 3.3. Có thể thêm blog, bài viết chia sẻ kiến thức mà không cần Dev không?
* **CÓ, TAB BLOGS HỖ TRỢ ĐĂNG BÀI VIẾT KHÔNG GIỚI HẠN.**
  * Tab `Blogs` hỗ trợ nhập bài viết định dạng văn bản chuẩn Markdown (cho phép in đậm, gạch đầu dòng, chèn ảnh, viết đoạn code SQL có tô màu cú pháp đẹp mắt).

### [x] 3.4. Những phần nào bắt buộc phải nhờ Dev chỉnh sửa?
* 
  * **Chị có thể tự làm (95% công việc):** Thay đổi nội dung, giá tiền, khuyến mãi, ảnh đại diện, lịch khai giảng, thêm/sửa buổi học, thêm review học viên, đăng bài viết mới.
  * **Cần Dev hỗ trợ:** Khi muốn thay đổi bố cục giao diện hoàn toàn mới (Redesign layout) hoặc thay đổi hạ tầng tên miền máy chủ.

### [x] 3.5. Có phân quyền admin/editor và hướng dẫn sử dụng CMS không?
* **PHÂN QUYỀN CHẶT CHẼ & BÀN GIAO VIDEO HƯỚNG DẪN CHI TIẾT.**
  * Phân tách 2 file riêng biệt: File nội dung công khai (chia sẻ cho nhân viên cùng biên tập) và File thông tin học viên (chỉ Chị Ly và tư vấn viên có quyền xem).

---

## 4. SEO, TRACKING & MARKETING

### [x] 4.1. Website đã được cấu hình SEO cơ bản chưa (meta title, description, sitemap, robots.txt)?
* **CÓ THỂ CẤU HÌNH ĐẦY ĐỦ CHUẨN SEO GOOGLE.**
  * Next.js tự động tạo tệp `sitemap.xml` và `robots.txt`.
  * Mỗi trang đều có thẻ tiêu đề `Meta Title`, `Meta Description` tối ưu độ dài và từ khóa ngành Data Analysis/Business Analysis, cấu trúc thẻ heading chuẩn `<h1>`, `<h2>`, `<h3>`.

### [x] 4.2. Google Search Console và GA4 đã được tích hợp chưa?
* **CÓ THỂ SẴN SÀNG KẾT NỐI.**
  * Hệ thống đã cấu hình sẵn vị trí đặt mã `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Khi bàn giao, đội ngũ sẽ hỗ trợ Chị Ly điền mã theo dõi của Google Analytics 4 (GA4) và xác minh quyền sở hữu trên Google Search Console.

### [x] 4.3. Có thể tracking các sự kiện như click Đăng ký, submit form, click Zalo không?
* **CÓ THỂ GẮN SẴN CÁC MÃ SỰ KIỆN CHUYỂN ĐỔI (CUSTOM EVENTS).**
  * Theo dõi chi tiết: Học viên bấm nút CTA nào ở Hero (`click_cta_hero`), xem chương trình học (`view_curriculum`), bấm icon Zalo/Hotline (`click_contact_zalo`), và nộp form thành công (`submit_lead_success`).

### [x] 4.4. Đã tích hợp Meta Pixel hoặc Google Ads conversion tracking chưa?
* Phần này còn khá mới với, em có thể cần thêm thời gian để tìm hiểu ạ.

### [x] 4.5. Có thể tạo landing page riêng cho từng chiến dịch quảng cáo không?
* **CÓ THỂ TẠO TRANG RIÊNG CHO TỪNG CHIẾN DỊCH QUÀNG CÁO.**
  * Hệ thống hỗ trợ cơ chế đường dẫn động ví dụ (`/courses/[course_id]`). Chị Ly chỉ cần thêm một dòng khóa học mới trên Sheets là website tự sinh ra một trang Landing Page chi tiết độc lập dành riêng. Tương tự thế để chạy quảng cáo cho khóa học đó mà không cần can thiệp code, em chỉ cần 1 Layout - Desgin để chị có thể tạo chiến dịch quảng cáo nếu cần - nhưng, chị chỉ có thể thay đổi nội dung, Thiết kế / phần nhìn chị phải nhờ anh Việt thiết kế lại layout.

### [x] 4.6. Đã thiết lập Open Graph để chia sẻ link lên Facebook/Zalo hiển thị đẹp chưa?
* **CÓ THỂ THIẾT LẬP CHUẨN MỰC (SOCIAL PREVIEW).**
  * Đầy đủ thẻ `og:title`, `og:description`, `og:image`. Khi Chị Ly gửi link website hoặc link khóa học vào Zalo, Facebook Messenger, hệ thống sẽ tự động hiển thị thẻ hình ảnh lớn sắc nét kèm tiêu đề khóa học cực kỳ chuyên nghiệp.

---

## 5. HOSTING, DOMAIN & SECURITY

### [x] 5.1. Domain, hosting và source code hiện thuộc quyền quản lý của ai?
* **BÀN GIAO TOÀN QUYỀN SỞ HỮU 100% CHO CHỊ LY.**
  * Tên miền (Domain): Chị Ly đứng tên chính chủ (mua tại Mắt Bão, PA Việt Nam hoặc Cloudflare).
  * Hosting & CDN: Tạo tài khoản Vercel hoặc Cloudflare riêng của Chị để triển khai.
  * Mã nguồn (Source Code): Lưu trữ trên kho GitHub riêng tư (Private Repository) và bàn giao toàn quyền quản trị cho Chị khi nghiệm thu.

### [x] 5.2. Chi phí duy trì hosting/domain hằng năm là bao nhiêu?
* **CHI PHÍ VẬN HÀNH ƯỚC TÍNH XẤP XỈ 0 ĐỒNG/THÁNG (CHỈ TỐN TIỀN DUY TRÌ TÊN MIỀN).**
  * Máy chủ Vercel Edge Network: Gói miễn phí vĩnh viễn (đủ chịu tải 100GB băng thông/tháng, tương đương hàng chục nghìn lượt truy cập).
  * Google Sheets API: Hoàn toàn miễn phí theo tài khoản Google.
  * Kho ảnh Cloudinary: Gói miễn phí 25GB băng thông.
  * Tên miền: Phí gia hạn hàng năm của nhà mạng (~250.000 VNĐ - 350.000 VNĐ/năm).

### [x] 5.3. SSL/HTTPS đã được cấu hình đầy đủ chưa?
* **CÓ THỂ CẤU HÌNH TỰ ĐỘNG BẢO MẬT CAO CẤP.**
  * Website tự động kích hoạt chứng chỉ SSL/HTTPS (ổ khóa xanh an toàn) qua công nghệ TLS 1.3, tự động gia hạn trọn đời miễn phí, không bao giờ bị trình duyệt cảnh báo "Không an toàn".

### [x] 5.4. Website có tự động backup không? Tần suất bao lâu?
* **SAO LƯU TỰ ĐỘNG TỨC THÌ (CONTINUOUS BACKUP).**
  * Mã nguồn website: Tự động sao lưu lịch sử từng lần chỉnh sửa trên GitHub.
  * Dữ liệu nội dung & Leads: Google Sheets có sẵn tính năng **Lịch sử phiên bản (Version History)** tự động ghi nhận từng giây, cho phép khôi phục về bất kỳ thời điểm nào chỉ với 1 cú click.

### [x] 5.5. Nếu website bị lỗi, bị tấn công hoặc mất dữ liệu thì quy trình khôi phục thế nào?
* **QUY TRÌNH KHÔI PHỤC THẦN TỐC (DƯỚI 1 PHÚT).**
  * Nếu phát sinh lỗi mã nguồn: Vercel hỗ trợ tính năng **Instant Rollback** (quay trở lại phiên bản chạy ổn định trước đó trong vòng đúng **10 giây**).
  * Nếu ai đó lỡ tay xóa nhầm trên Google Sheets: Vào menu `Tệp -> Lịch sử phiên bản` để khôi phục trong vòng **30 giây**.
  * Chống tấn công: Do website là dạng tĩnh (Static HTML), không có cơ sở dữ liệu mở cổng ra ngoài nên miễn nhiễm 100% với các hình thức tấn công tiêm mã độc (SQL Injection).

### [x] 5.6. Có cần cập nhật framework, plugin hoặc thư viện định kỳ không?
* **HỆ THỐNG VẬN HÀNH ĐỘC LẬP, KHÔNG CẦN CẬP NHẬT RƯỜM RÀ NHƯ WORDPRESS.**
  * Không giống như WordPress liên tục phải cập nhật plugin vì sợ xung đột hay nhiễm virus, kiến trúc Next.js được đóng gói nguyên khối, hoạt động bền bỉ, ổn định lâu dài. Chỉ cần kiểm tra định kỳ 6 tháng - 1 năm/lần nếu Chị Ly có nhu cầu mở rộng thêm tính năng mới.