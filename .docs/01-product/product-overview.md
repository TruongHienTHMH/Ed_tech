# Tổng quan sản phẩm — DataWithLy

- **Mục đích:** Mô tả sản phẩm, người dùng và kết quả mong muốn trước khi đặc tả từng màn hình và triển khai mã nguồn.
- **Trạng thái:** Approved — chốt định hướng sản phẩm và chuẩn hóa dữ liệu thực tế để chuyển sang đặc tả phạm vi và PRD.
- **Người duyệt:** Chủ dự án (xác nhận trong trao đổi và phê duyệt kế hoạch ngày 2026-11-03).
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - Slide bài giảng chính thức: `[LYDATA] Data Analytics Courses.pptx.pdf`;
  - Bảng yêu cầu nội dung chi tiết: `Website LY DATA - content to fill.xlsx`;
  - Các trao đổi kỹ thuật: [Q&A dự án](../references/project-qa.md), [yêu cầu bổ sung](../references/additional-requirements.md), [ghi nhận yêu cầu khách hàng](../08-project/customer-requirements-notes.md);
  - Hướng dẫn biên soạn: [Writing Guide](WRITING-GUIDE.md).
- **Câu hỏi còn mở cho bước tiếp theo:** Danh sách email nhận thông báo trong production và thời điểm chuyển từ Sheets Staging sang Sheets chính thức. Xem [danh sách câu hỏi](../08-project/open-questions.md).

---

## 1. Sản phẩm và mục đích

**DataWithLy** là nền tảng website giới thiệu thương hiệu đào tạo, giảng viên và các khóa học phân tích dữ liệu thực chiến do **Mentor Hứa Thảo Ly** (Ex Senior Data Analyst tại MoMo, cựu DA tại Tiki, ACB) sáng lập và trực tiếp giảng dạy.

Với thông điệp cốt lõi **"Học Data Analytics từ tư duy đến thực hành"**, DataWithLy giải quyết khoảng cách giữa lý thuyết công cụ hàn lâm và nhu cầu tuyển dụng thực tế của doanh nghiệp. Website giúp người học tiếp cận lộ trình đào tạo bài bản, minh bạch về giáo trình và học phí, khám phá các sản phẩm dự án thực tế của học viên và để lại thông tin khi muốn được tư vấn lộ trình 1-1 hoặc đăng ký tham gia lớp học.

Đội ngũ DataWithLy sử dụng hệ thống để thu thập lead an toàn, tự động đối soát nguồn chiến dịch marketing (UTM Parameters) và quản trị toàn bộ nội dung hiển thị (khóa học, học phí, lịch học, bài viết blog, feedback học viên) một cách độc lập thông qua **Google Sheets Headless CMS**.

---

## 2. Nhận diện thương hiệu & Phong cách thiết kế

- **Tên thương hiệu chính thức:** **DataWithLy** (đồng bộ nhận diện tìm kiếm tự nhiên trên Google và các kênh mạng xã hội chính thức: TikTok `@datawithly`, Instagram `@datawithly`, Threads `@datawithly`, Facebook `datawithly`, LinkedIn `in/thao-ly-hua`).
- **Tone màu chủ đạo (Primary Color Palette):** **Màu Đỏ Mận / Crimson / Wine Red** (đồng bộ chuẩn xác với nhận diện slide bài giảng và Figma design tokens qua kết nối Figma MCP).
- **Nguyên tắc truyền thông trung thực:** Loại bỏ 100% các tuyên bố hoặc số liệu không có thật (không dùng các claim ảo như học viên nhận offer tại Harvard, Stanford, Google...). Toàn bộ đánh giá và thành tích đều dựa trên dữ liệu học viên thực tế.

---

## 3. Danh mục khóa học thực tế tại DataWithLy

Website giới thiệu và mở tuyển sinh cho 3 khóa học cốt lõi:

| STT | Tên khóa học | Thời lượng & Hình thức | Học phí niêm yết | Đối tượng phù hợp & Đầu vào |
|:---:|:---|:---|:---:|:---|
| 1 | **SQL for Data Analytics** | 12 buổi (2 buổi/tuần)<br/>*Live Online qua Zoom* | **2.990.000 VNĐ** | Người mới bắt đầu với Data Analytics, sinh viên, người dùng Excel muốn nâng cao kỹ năng xử lý dữ liệu với SQL. Không yêu cầu kiến thức đầu vào. |
| 2 | **Analytical Thinking & Dashboard Design** | 16 buổi + bonus CV & Portfolio<br/>*Live Online qua Zoom* | **3.790.000 VNĐ** | Đã có kiến thức SQL cơ bản, muốn phát triển tư duy giải quyết vấn đề kinh doanh, xác định metrics, data modeling và thiết kế dashboard ra quyết định. |
| 3 | **End-to-End Analytics with SQL & Dashboard Design** | 25 buổi + bonus CV & Career<br/>*Live Online qua Zoom* | **5.690.000 VNĐ** | Lộ trình toàn diện từ số 0 đến tự tin ứng tuyển vị trí Data Analyst: từ truy vấn dữ liệu SQL đến tư duy phân tích, trực quan hóa và thiết kế dashboard. |

---

## 4. Người dùng và giá trị mang lại

| Nhóm người dùng | Nhu cầu chính | Giá trị website DataWithLy mang lại |
|---|---|---|
| **Người quan tâm khóa học** (Sinh viên, người chuyển ngành, Junior DA) | Tìm kiếm lộ trình học thực tế, xem chi tiết syllabus từng buổi học, học phí minh bạch và đánh giá của học viên cũ | Cung cấp thông tin trực quan dạng Accordion, xem dashboard dự án mẫu và dễ dàng đăng ký nhận tư vấn lộ trình 1-1 |
| **Độc giả & Người tìm hiểu kiến thức** | Đọc các bài viết chia sẻ mẹo SQL, tư duy phân tích số liệu, kỹ năng phỏng vấn | Tiếp cận bài viết định dạng Markdown chất lượng có cú pháp code rõ ràng, có đường dẫn tự nhiên đến khóa học liên quan |
| **Đội ngũ tư vấn & Tuyển sinh** | Nhận thông tin đăng ký nhanh chóng, đầy đủ ngữ cảnh để gọi điện hỗ trợ học viên | Dữ liệu lead được lưu tức thì vào Google Sheets, nhận email cảnh báo real-time, có ghi chú về nền tảng và khung giờ hẹn gọi |
| **Đội ngũ Marketing** | Đo lường hiệu quả các kênh truyền thông và chiến dịch quảng cáo | Hệ thống tự động bắt và lưu các tham số UTM (source, medium, campaign) đi kèm từng lượt submit form |
| **Người quản trị nội dung** (Mentor Hứa Thảo Ly & Cộng sự) | Tự chỉnh sửa học phí, lịch khai giảng, thêm review, viết bài blog mà không phụ thuộc vào lập trình viên | Quản trị 100% qua file Google Sheets quen thuộc; website tự động cập nhật nội dung qua cơ chế ISR Revalidation |

---

## 5. Bốn khu vực trải nghiệm sản phẩm

1. **Trang chủ (HomePage):**
   - Định vị thương hiệu DataWithLy và Mentor Hứa Thảo Ly.
   - Menu điều hướng đa tầng: `Trang chủ | Khóa học ▾ | Tài nguyên ▾ | Về DataWithLy | [Nhận tư vấn]`.
   - Khối 3 giá trị cốt lõi (USP Cards): *Lộ trình bài bản*, *Dự án thực tế*, *Mentor đồng hành & feedback*.
   - Khối danh sách 3 khóa học tại DataWithLy kèm học phí và thời lượng.
   - Khối thư viện sản phẩm và Dashboard dự án thực tế của học viên.
   - Khối đánh giá thực tế (Student Testimonials) và cụm 3 bài viết chia sẻ mới nhất.
2. **Trang chi tiết khóa học (Course Detail):**
   - 3 trang chi tiết độc lập dành cho 3 khóa học.
   - Trình bày trực quan chu trình phân tích: `Business Problem → Metrics → Analysis → Insight → Dashboard`.
   - Lộ trình giáo trình (Curriculum) dạng Accordion mở rộng chi tiết từng buổi học với nút *Expand/Collapse All*.
   - Hai nút hành động CTA nổi bật: `[Đăng ký ngay]` (mở modal khóa sẵn khóa học) và `[Nhận tư vấn]`.
3. **Trang Giới thiệu (About Us / Về DataWithLy):**
   - Câu chuyện sáng lập và triết lý đào tạo thực chiến từ Mentor Hứa Thảo Ly.
   - Dòng thời gian sự nghiệp và các thành tích nổi bật tại MoMo, Tiki, ACB và các cuộc thi quốc gia.
4. **Trang Blog & Tài nguyên (Blog & Resources):**
   - Danh sách bài viết chia sẻ kiến thức chuyên môn phân theo chủ đề (SQL Tips, Dashboard Design, Tư duy phân tích).
   - Trang đọc bài viết chi tiết hỗ trợ Markdown, Syntax Highlighting cho đoạn mã SQL/Python và thanh tiến trình đọc bài.

---

## 6. Năng lực kỹ thuật & Vận hành cốt lõi

- **Mô hình bảo mật 2 Sheets độc lập:**
  - *File 1 (Public Content Sheet):* Website chỉ có quyền đọc để hiển thị nội dung ra bên ngoài.
  - *File 2 (Private Leads Sheet):* Lưu trữ dữ liệu học viên đăng ký, website chỉ đẩy dữ liệu một chiều qua Webhook Apps Script bảo mật (`Write-Only`), ngăn chặn 100% rủi ro lộ số điện thoại hoặc email học viên.
- **Hệ thống phòng vệ Lead & Chống spam 3 lớp:**
  - *Honeypot field:* Bẫy bot spam tự động.
  - *Idempotency token (`submission_id`):* Chống ghi trùng khi người dùng bấm liên tục nhiều lần.
  - *Rate limiting theo IP:* Giới hạn số lần nộp form trong khoảng thời gian ngắn.
- **Bảo toàn dữ liệu & Auto-retry:** Giữ nguyên dữ liệu người dùng đã điền trên form nếu gặp sự cố mạng hoặc Google Sheets chậm; hiển thị nút thử lại thân thiện mà không bắt người dùng nhập lại từ đầu.
- **Hệ thống Email thông báo 2 chiều:**
  - Gửi email cảnh báo tức thì đến tư vấn viên khi có lượt đăng ký mới.
  - Gửi email xác nhận kèm tài liệu tự động đến học viên.
- **Hiệu năng & Tối ưu SEO:** Ứng dụng Next.js App Router với công nghệ Incremental Static Regeneration (ISR), đảm bảo tốc độ tải trang dưới 1.2s, hỗ trợ OpenGraph preview đẹp mắt khi chia sẻ link trên Zalo/Facebook và cấu trúc Schema.org chuẩn Google.

---

[Điểm bắt đầu của bộ docs](../README.md)
