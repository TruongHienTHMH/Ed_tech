## HỆ THỐNG WEBSITE KHÓA HỌC

* **Mục tiêu báo cáo:** Làm rõ phạm vi tính năng, giải thích cơ chế vận hành CMS bằng Google Sheets (Ưu \- Nhược điểm & Giải pháp kỹ thuật), hướng dẫn thao tác thực tế và thống nhất yêu cầu (Requirements Sign-off) .

---

![][image1]

---

## 1\. ĐẶC TẢ TỔNG QUÁT DỰ ÁN (PROJECT OVERVIEW & VISION)

### 1.1. Mục tiêu sản phẩm

Website là cổng thông tin giới thiệu các khóa đào tạo trong lĩnh vực **Data Analysis (DA)**. Gồm các trang sau:

1. **Trang chủ (Homepage):** Giới thiệu thương hiệu giảng viên Hứa Thảo Ly (Ex Senior DA tại MoMo, Tiki, ACB), cung cấp các số liệu thực tế, giải thưởng, dải logo đối tác (Google, Microsoft, Samsung...) và thư viện Dashboard dự án thực tế của học viên.  
2. **Trang chi tiết khóa học (Course Detail):** Cung cấp giáo trình trực quan dạng Accordion (Syllabus chi tiết đến từng buổi học), bảng học phí minh bạch, chính sách học tập qua Zoom Meeting và các cam kết đầu ra rõ ràng.  
3. **Trang Giới thiệu (About Us / About Me):** Phương pháp đào tạo thực chiến "học đúng \- làm được" từ người trong ngành.  
4. **Trang Bài viết chia sẻ (Blog Detail):** Chia sẻ mẹo SQL, tư duy phân tích và giữ chân học viên tiềm năng.

### 1.2. Định hướng công nghệ & Chi phí vận hành tối ưu (\~\$0/tháng)

* **Frontend:** Framework **Next.js (App Router)** kết hợp **Tailwind CSS**, thiết kế chuẩn responsive cho cả máy tính (Desktop) và điện thoại di động (Mobile).  
* **Hiệu năng vượt trội:** Áp dụng kỹ thuật **Incremental Static Regeneration (ISR)** giúp trang web được sinh sẵn dưới dạng HTML tĩnh trên CDN toàn cầu. Tốc độ tải trang đạt chuẩn Google PageSpeed (\> 90 điểm, thời gian mở trang \< 1.2 giây).  
* **Chi phí hạ tầng:** Tận dụng gói miễn phí của Vercel / Cloudflare Pages \+ Google Sheets API \+ Cloudinary CDN. Doanh nghiệp chỉ chi trả chi phí duy nhất là tên miền hàng năm (\~250.000 VNĐ \- 300.000 VNĐ/năm).

---

## 

## 2\. PHẠM VI DỰ ÁN: CÁC CHỨC NĂNG QUẢN TRỊ NỘI DUNG (CRUD QUA GOOGLE SHEETS)

Thay vì phải đầu tư xây dựng một trang quản trị (Admin Dashboard) tốn kém hàng chục triệu đồng và mất thời gian đào tạo nhân sự sử dụng, toàn bộ thao tác quản lý nội dung (CRUD: **Thêm \- Xem \- Sửa \- Xóa**) được thực hiện 100% trên giao diện Google Sheets quen thuộc mà Chị Ly và cộng sự đã sử dụng hàng ngày:

### 2.1. Danh mục tính năng quản trị phía Client

| Phân hệ tính năng | Thao tác tương đương trên Google Sheets | Hiển thị thực tế trên Website |
| :---- | :---- | :---- |
| **1\. Quản lý Khóa học (Courses)** | Thêm dòng mới hoặc chỉnh sửa tên khóa, mô tả ngắn, mô tả chi tiết, hình ảnh minh họa, thời lượng, số lượng học viên, link học thử. | Cập nhật tức thì trên Slider/Carousel trang chủ và Trang chi tiết khóa học. |
| **2\. Quản lý Lộ trình (Curriculum)** | Nhập danh sách các tuần học (Week 1 \-\> Week 6), số thứ tự buổi, thẻ ngày tháng khai giảng (`TH10 03`, `TH10 26`), tiêu đề module và các gạch đầu dòng nội dung chi tiết. | Hiển thị dạng **Accordion đóng/mở mượt mà** với nút *"Expand all lessons"*. |
| **3\. Quản lý Giảng viên (Mentors)** | Chỉnh sửa ảnh chân dung, chức danh Founder, triết lý đào tạo, danh sách cột mốc làm việc tại MoMo, Tiki, ACB và các giải thưởng đạt được. | Hiển thị tại khối Giảng viên ở Course Detail và toàn bộ trang About Us. |
| **4\. Quản lý Giá & Combo (Packages\_Pricing)** | Cập nhật giá bán lẻ, giá gốc gạch ngang, giá COMBO ưu đãi tiết kiệm, danh sách gạch đầu dòng ưu/nhược điểm (tick xanh/gạch chéo đỏ). | Hiển thị bảng so sánh giá thông minh *"Đầu tư thông minh cho sự nghiệp"*. |
| **5\. Quản lý Đánh giá học viên (Testimonials)** | Thêm lời nhận xét mới, tên học viên, vị trí công tác, tag khóa học, link ảnh avatar và số sao đánh giá (1 \- 5 sao). Đánh dấu `TRUE/FALSE` để chọn review xuất hiện trên trang chủ. | Hiển thị trên lưới 9 đánh giá uy tín (3x3) tại trang chủ. |
| **6\. Quản lý Dự án học viên (StudentProjects)** | Nhập tên dự án (Cohort Analysis, Ecommerce Retention...), link ảnh chụp Dashboard thực tế, link tương tác trực tiếp. | Hiển thị tại khối thư viện *"Dự án của học viên qua các khóa học tại Lydata"*. |
| **7\. Quản lý Bài viết chia sẻ (Blogs)** | Đăng bài viết mới, chọn chuyên mục (`Series học SQL`), tiêu đề, ngày đăng, lượt xem, ảnh bìa và nội dung bài viết hỗ trợ định dạng **Markdown** (in đậm, danh sách, đoạn code SQL). | Hiển thị tại cụm 3 bài viết trang chủ và toàn bộ trang đọc bài viết chi tiết. |
| **8\. Quản lý Đối tác (Partners)** | Thêm tên công ty/trường đại học, link logo SVG/WebP (Google, Tokopedia, Microsoft, Samsung...). | Hiển thị thanh chạy logo học viên trúng tuyển (Trust Bar). |
| **9\. Cấu hình chung & Khuyến mãi (SiteConfig)** | Bật/tắt thanh banner flash sale trên cùng (`75% OFF`, `4 days only!`), thiết lập đồng hồ đếm ngược, thay đổi số hotline, email liên hệ và các link mạng xã hội (TikTok, Facebook, LinkedIn, Zalo). | Cập nhật toàn bộ Header, Top Bar và Footer của tất cả các trang. |

---

## 

## 3\. NGUYÊN TẮC BẢO MẬT: PHÂN TÁCH 2 TỆP DỮ LIỆU ĐỘC LẬP

Để đảm bảo tuyệt đối an toàn thông tin theo quy định pháp lý (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân) và phòng tránh rò rỉ thông tin khách hàng, hệ thống tách biệt thành **2 file Google Sheets hoàn toàn độc lập**:  
![][image2]

> **Lợi ích chiến lược của việc phân tách 2 file:**  
> 

> 1. Website chỉ có quyền **đọc file Public Content**, hoàn toàn **không có bất kỳ liên kết trực tiếp nào để đọc file Private Leads**. Ngay cả khi hacker cố gắng kiểm tra mã nguồn trang web, họ cũng không bao giờ có thể thấy danh sách số điện thoại hay email của học viên đã đăng ký.  
> 2. Chị Ly có thể thoải mái chia sẻ file Content cho cộng tác viên viết bài/chỉnh sửa lộ trình mà không sợ họ xem được dữ liệu khách hàng nhạy cảm.

---

## 

## 4\. PHÂN TÍCH CHUYÊN SÂU: NHỮNG BẤT CẬP KHI DÙNG SHEETS LÀM CMS & GIẢI PHÁP KỸ THUẬT CỦA TECH TEAM

Việc sử dụng Google Sheets làm CMS mang lại sự tiện lợi vượt trội cho Client, nhưng về mặt kỹ thuật, Google Sheets vốn là phần mềm bảng tính chứ không phải một hệ quản trị cơ sở dữ liệu chuyên nghiệp (Database). Dưới đây là 4 bất cập cốt lõi và cách đội ngũ kỹ thuật giải quyết triệt để:

### 4.1. Bất cập 1: Không lưu trữ trực tiếp file Media (Ảnh/Video) & Bẫy "Google Drive Link"

* **Nguyên nhân & Rủi ro:** Rất nhiều người có thói quen tải ảnh lên Google Drive, lấy link chia sẻ rồi dán vào trang web. Tuy nhiên, Google Drive sinh ra để lưu trữ tệp cá nhân, **không phải mạng phân phối nội dung**. Khi có từ vài chục người cùng xem trang web, cơ chế bảo vệ của Google Drive sẽ ngay lập tức kích hoạt tính năng **Bandwidth Throttling (bóp nghẹt băng thông)**. Hậu quả là toàn bộ ảnh đại diện, avatar và hình ảnh khóa học trên web sẽ bị lỗi dấu `X` đỏ (Broken images), website tải chậm như rùa và đánh mất sự tin tưởng của học viên.  
* **Giải pháp kỹ thuật của Tech Team:**  
  * Thiết lập một kho lưu trữ media miễn phí trên nền tảng **Cloudinary** hoặc **Cloudflare R2**.  
  * Chị Ly chỉ cần tải ảnh lên kho lưu trữ (thao tác kéo thả đơn giản), hệ thống sẽ tự động chuyển đổi ảnh sang định dạng chuẩn web thế hệ mới (**WebP / AVIF** \- giảm 70% dung lượng nhưng giữ nguyên độ nét chuẩn Retina).  
  * Chị Ly copy đường dẫn ảnh siêu nhẹ này dán vào Google Sheets. Website cam kết hiển thị ảnh sắc nét, tải tức thì dưới 0.3 giây và không bao giờ bị Google chặn băng thông.

### 4.2. Bất cập 2: Thiếu Data Validation (Kiểm duyệt dữ liệu) & Giải Pháp Nhập Liệu Chuẩn Hóa Qua Google Apps Script

* **Nguyên nhân & Rủi ro:** Trên Google Sheets, bất kỳ ai có quyền sửa đều có thể vô tình xóa nhầm một cột tiêu đề, gõ nhầm chữ vào ô giá tiền (ví dụ: gõ `năm triệu` thay vì `5000000`), hoặc để trống một trường thông tin quan trọng. Dẫn đến việc lỗi hệ thống.  
* **Giải pháp kỹ thuật:**  
  1. *Lớp phòng thủ 1 (Ngay trên Google Sheets):* Thiết lập sẵn các bộ lọc **Data Validation**: Cột số chỉ cho nhập số, cột trạng thái chỉ cho chọn Dropdown (`TRUE/FALSE`), cột định dạng ngày bắt buộc theo lịch.  
  2. *Lớp phòng thủ 2:* Lớp kiểm duyệt dữ liệu ở tầng Giao diện, nếu có lỗi thì tách biệt lỗi, để lỗi chạy ngầm, thông báo các chỉ dẫn như: “Đang có lỗi quay lại sau,...” Để cả hệ thống vẫn chạy, để các user vẫn xem được các thông tin chưa bị dính lỗi.  
  3. Google Apps Script cho phép xây dựng một **Thanh biểu mẫu nhập liệu chuyên dụng (Custom Sidebar / Modal Dialog)** chạy trực tiếp ngay bên trong màn hình Google Sheets. Chị Ly và nhân sự không cần nhìn vào ma trận hàng chục cột phức tạp, mà sẽ nhập liệu qua các form chuẩn có kiểm soát tự động.  
  4. Quan trọng nhất là việc quản lý nhân sự, ai nắm file này, những ai có quyền Editor và những ai chỉ nên có quyền Viewer.

### 4.3. Bất cập 3: Ràng buộc quan hệ dữ liệu (Relational Data 1-Nhiều)

* **Nguyên nhân & Rủi ro:** Một khóa học bao gồm 12 buổi học nằm trong 6 tuần khác nhau; một giảng viên có thể phụ trách nhiều khóa học. Trong database chuẩn (SQL), các bảng được nối với nhau bằng khóa chính và khóa ngoại tự động. Trên Google Sheets, nếu nhét chung toàn bộ nội dung 12 buổi học vào một ô khóa học thì ô đó sẽ dài hàng nghìn ký tự, cực kỳ khó đọc và không thể format đẹp mắt.  
* **Giải pháp kỹ thuật của Tech Team:**  
  * Thiết kế tách biệt thành tab `Courses` (Khóa học tổng quan) và tab `Curriculum` (Chi tiết lộ trình từng buổi).  
  * Thiết lập cột định danh liên kết dạng chuỗi không dấu (Slug ID) chuẩn mực: Ví dụ cột `course_id = "sql-for-data-analytics"`.  
  * Trên tab `Curriculum`, mỗi buổi học chỉ cần điền mã `course_id` tương ứng. Khi website nạp dữ liệu, thuật toán của Next.js sẽ tự động thực hiện phép ghép (Mapping & Grouping) theo từng Tuần (Week 1 \-\> Week 6\) và từng Buổi để vẽ nên giao diện Accordion chuẩn xác 100% như trên Figma.

### 4.4. Bất cập 4: Giới hạn Rate Limit của Google Sheets API (300 requests/phút)

* **Nguyên nhân & Rủi ro:** Google Sheets API giới hạn tối đa 300 lượt yêu cầu/phút trên toàn dự án. Nếu chạy một chiến dịch quảng cáo Facebook/TikTok thu hút hàng nghìn người truy cập đồng thời, nếu mỗi lượt truy cập đều gửi yêu cầu vào Google Sheets để lấy dữ liệu, API sẽ lập tức báo lỗi `429 Too Many Requests` và làm tê liệt website.  
* **Giải pháp kỹ thuật của Tech Team (Công nghệ ISR):**  
  * Áp dụng cơ chế **Incremental Static Regeneration (ISR)** của Next.js.  
  * Hàng nghìn hay hàng triệu học viên truy cập vào website thực chất chỉ đang đọc bản sao tĩnh (Static HTML) siêu tốc được lưu đệm trên máy chủ Vercel Edge CDN.  
  * Google Sheets chỉ bị gọi duy nhất 1 lần khi hết hạn bộ nhớ đệm (chu kỳ 1 giờ) hoặc khi Chị Ly chủ động bấm nút "Xuất bản". Do đó, lượng request thực tế chỉ tốn chưa tới 1% hạn ngạch của Google\!

---

## 5\. CẨM NANG HƯỚNG DẪN THAO TÁC DÀNH CHO CLIENT QUA GOOGLE APPS SCRIPT

Để Chị Ly và đội ngũ có thể làm chủ hoàn toàn hệ thống CMS, đội ngũ phát triển tích hợp thanh menu tùy chỉnh mang tên **`LY DATA CMS`** nằm ngay trên thanh công cụ của Google Sheets.  
![][image3]

### 5.1. Hướng dẫn từng bước cách nhập liệu qua Biểu mẫu Apps Script Form

1. **Bước 1 (Mở Form):** Trên thanh menu Google Sheets, bấm vào **`LY DATA CMS`** \-\> Chọn mục cần nhập (ví dụ: **`Thêm Khóa học mới`** hoặc **`Thêm Buổi học vào Lộ trình`**).  
2. **Bước 2 (Điền thông tin trên Form):**  
   * Một thanh Sidebar tiện dụng sẽ hiện ra ở cạnh phải màn hình.  
   * Giao diện Form được thiết kế thân thiện với đầy đủ các trường: Ô nhập tên, ô nhập tiền (tự định dạng dấu phẩy), ô chọn ngày tháng (Calendar Picker), ô chọn dropdown môn học liên kết.  
   * *Tính năng tự động hóa:* Khi Chị Ly gõ tiêu đề khóa học *"SQL for Data Analytics"*, Form sẽ tự động sinh mã `course_id = "sql-for-data-analytics"`, loại bỏ hoàn toàn nguy cơ gõ sai chính tả hay gõ tiếng Việt có dấu.  
3. **Bước 3 (Kiểm duyệt trước khi lưu):**  
   * Nếu Chị Ly quên nhập một trường bắt buộc, hoặc nhập chữ vào ô học phí, form sẽ **báo đỏ ngay lập tức** và không cho phép bấm Lưu.  
   * Nếu hợp lệ, bấm **`LƯU VÀO BẢNG TÍNH`**. Google Apps Script sẽ tự động chèn dữ liệu vào đúng dòng, đúng cột với đầy đủ định dạng font chữ chuẩn.  
4. **Bước 4 (Rà soát lỗi với tính năng Data Linting 1-Click):**  
   * Trước khi xuất bản lên website, Chị Ly chỉ cần bấm: **`LY DATA CMS` \-\> `Kiểm tra toàn bộ dữ liệu (Data Linting)`**.  
   * Script sẽ tự động duyệt qua tất cả các tab. Nếu phát hiện ô nào bị thiếu dữ liệu hoặc sai định dạng, ô đó sẽ được **tô đỏ nổi bật** kèm lời nhắc cụ thể: *"Tab Courses \- Dòng 3: Cột sale\_price không được để trống"*.  
5. **Bước 5 (Xuất bản lên Web):**  
   * Sau khi dữ liệu hoàn toàn sạch, Chị Ly bấm: **`LY DATA CMS` \-\> `Xuất bản thay đổi lên Web`**.  
   * Script sẽ kích hoạt Webhook làm mới bộ nhớ đệm Next.js ISR. Chỉ sau 1-2 giây, mở trang web là toàn bộ nội dung mới đã xuất hiện rực rỡ trước mắt học viên\!

### 5.2. Tại sao nhất thiết phải sử dụng Google Apps Script trong dự án này?

Google Apps Script không chỉ là công cụ hỗ trợ giao diện, mà đóng vai trò là **Bộ điều phối trung tâm (Central Controller)** của toàn bộ giải pháp:

1. **Cầu nối kích hoạt Webhook (On-demand Revalidation):** Giúp Website biết chính xác khi nào Chị Ly vừa sửa nội dung để làm mới bộ nhớ đệm tức thì mà không cần quản trị viên phải vào máy chủ Vercel thao tác.  
2. **Cánh cổng bảo mật cho tệp Leads:** Tab lưu trữ học viên đăng ký cần bảo mật tuyệt đối. Nhờ Apps Script đóng vai trò máy chủ tiếp nhận (Webhook Receiver), học viên điền form từ website sẽ được đẩy thẳng vào Google Sheets mà không cần cấp quyền truy cập mở tệp ra bên ngoài.  
3. **Cơ chế khóa an toàn (LockService Concurrency):** Khi có nhiều học viên cùng bấm nút đăng ký tư vấn trong cùng 1 giây, Apps Script sử dụng thuật toán khóa luồng hàng đợi (`LockService.getScriptLock()`) để ghi dữ liệu tuần tự, đảm bảo **không bao giờ bị mất dữ liệu hay ghi đè trùng lặp**.

### 5.3. Bộ quy tắc vàng khi làm việc với Google Sheets CMS: "3 NÊN" & "3 KHÔNG"

> \[\!TIP\] **3 NÊN:**  
> 

> 1. **NÊN ưu tiên thêm mới bằng Form `LY DATA CMS`:** Giúp dữ liệu chuẩn chỉnh 100%, không lo thiếu sót các mã ID liên kết.  
> 2. **NÊN bấm phím Alt \+ Enter để xuống dòng trong một ô:** Khi viết các gạch đầu dòng (mục tiêu khóa học, nội dung chi tiết buổi học), phím `Alt + Enter` sẽ tạo dòng mới. Website sẽ tự động chuyển các dòng này thành từng bullet point đẹp mắt trên Accordion.  
> 3. **NÊN chạy tính năng "Kiểm tra dữ liệu" trước khi bấm "Xuất bản":** Giúp Chị Ly hoàn toàn an tâm rằng website của mình luôn hiển thị hoàn hảo nhất.

>   
> \[\!CAUTION\] **3 KHÔNG:**  
> 

> 1. **KHÔNG đổi tên hoặc xóa dòng tiêu đề số 1 của bất kỳ Tab nào:** Dòng 1 chứa tên trường kỹ thuật (ví dụ: `course_id`, `sale_price`...). Đổi tên sẽ khiến hệ thống không tìm thấy dữ liệu.  
> 2. **KHÔNG lấy link ảnh trực tiếp từ Google Drive:** Hãy tải ảnh lên kho Cloudinary/R2 và dán đường link chuẩn CDN để tránh bị Google chặn hiển thị ảnh.  
> 3. **KHÔNG gộp ô (Merge Cells):** Tính năng gộp ô làm sai lệch chỉ số dòng và cột của API đọc dữ liệu.

---

## 6. ĐẶC TẢ YÊU CẦU CHỨC NĂNG & GIAO DIỆN CHI TIẾT THEO FIGMA (FUNCTIONAL & UI/UX SPECIFICATIONS)

Toàn bộ giao diện người dùng (Frontend) được bám sát 100% theo bản thiết kế Figma (File ID: `fboaorgcrmMFzdy4O7c0WJ`), đảm bảo tính thẩm mỹ hiện đại, chuẩn nhận diện thương hiệu LY DATA, tương thích tối đa trên Desktop (1440px), Tablet (768px) và Mobile (375px - 414px).

```mermaid
flowchart TD
    subgraph ClientBrowsing["HỌC VIÊN TRUY CẬP WEBSITE"]
        HP["Trang chủ (Homepage)"]
        CD["Trang chi tiết khóa học (/courses/[id])"]
        AB["Trang giới thiệu (/about)"]
        BL["Trang tin tức & bài viết (/blog)"]
    end

    subgraph ConversionFlow["LUỒNG TƯ VẤN & CHUYỂN ĐỔI"]
        CTA["Nút CTA (Hero, Menu, Card, Syllabus)"]
        Modal["Popup Form Đăng ký tư vấn (Modal)"]
        AntiSpam["Honeypot + Validation + Rate Limiter"]
    end

    subgraph DataPlatform["HẠ TẦNG DỮ LIỆU & CMS"]
        PublicSheet[("Google Sheets: PUBLIC CONTENT\n(9 Tabs: Khóa học, Lộ trình, Blog...)")]
        PrivateSheet[("Google Sheets: PRIVATE LEADS\n(1 Tab: Thông tin học viên đăng ký)")]
        GAS["Google Apps Script Webhook (LockService)"]
        Cloudinary["Cloudinary / R2 CDN (Media WebP/AVIF)"]
        Alert["Gmail Alert & Auto-responder"]
    end

    HP --> CTA
    CD --> CTA
    AB --> CTA
    BL --> CTA
    CTA --> Modal
    Modal --> AntiSpam
    AntiSpam --> GAS
    GAS --> PrivateSheet
    GAS --> Alert

    PublicSheet -.->|ISR Revalidate 1h / On-demand| HP
    PublicSheet -.->|ISR Revalidate 1h / On-demand| CD
    PublicSheet -.->|ISR Revalidate 1h / On-demand| BL
    Cloudinary -.->|Fast CDN Delivery| HP
    Cloudinary -.->|Fast CDN Delivery| CD
```

---

### 6.1. Top Banner & Thanh Điều Hướng Toàn Cục (Header Navigation)
* **Top Promo Banner:**
  * Nội dung: Thông báo ưu đãi đặc biệt (Ví dụ: `🔥 Ưu đãi học phí 75% OFF - Chỉ còn 4 ngày duy nhất!`).
  * Thành phần: Đồng hồ đếm ngược Flash Sale (Days : Hours : Minutes : Seconds) chạy theo thời gian thực (Client-side hydrated); nút bấm tắt/ẩn banner (lưu trạng thái `sessionStorage` để không làm phiền người dùng); Hotline tư vấn nhanh dạng clickable `tel:`.
  * Cấu hình CMS: Bật/tắt (`is_active = TRUE/FALSE`), nội dung chữ và thời hạn kết thúc được điều khiển 100% từ tab `SiteConfig`.
* **Thanh Header Navigation:**
  * Logo thương hiệu: `LY DATA` (SVG vector chuẩn nét Retina, click chuyển về Trang chủ).
  * Danh mục điều hướng (Nav Links): *Trang chủ*, *Khóa học*, *Lộ trình đào tạo*, *Giảng viên*, *Blog chia sẻ*, *Về chúng tôi*.
  * Hiệu ứng cuộn: Hỗ trợ Smooth Scroll cuộn mượt đến các section nội dung trên Homepage khi bấm vào menu tương ứng (`#courses`, `#about`, `#testimonials`).
  * Nút CTA Header: Nút bấm viền nổi bật (Primary Gradient Button) *"Đăng ký tư vấn"* -> Kích hoạt mở ngay Modal đăng ký tư vấn.
  * Responsive Mobile: Menu Hamburger (Drawer animation) mở mượt mà từ cạnh phải, chứa đầy đủ các liên kết điều hướng và nút gọi điện/Zalo nhanh.

---

### 6.2. Trang Chủ (Homepage - Figma Node `1602:6924`)
* **Khối Hero Section:**
  * Tagline / Badge: `⭐ Top 1 Khóa học Data Analysis thực chiến chuẩn doanh nghiệp`.
  * Headline H1: Nêu bật định vị thương hiệu đào tạo thực chiến từ Mentor Hứa Thảo Ly (Ex Senior DA tại MoMo, Tiki, ACB).
  * Lời dẫn (Subheadline): Đào tạo tư duy phân tích sắc bén, làm chủ SQL, Power BI, Python từ các bài toán thực tế của doanh nghiệp.
  * Cụm CTA kép:
    * Nút chính: *"Nhận tư vấn lộ trình 1-1"* (Mở Modal tư vấn).
    * Nút phụ: *"Khám phá các khóa học"* (Cuộn mượt xuống khối Courses).
  * Khối Số liệu bảo chứng (Social Proof Stats):
    * `+1,500` Học viên đã tốt nghiệp.
    * `98%` Học viên đánh giá hài lòng và áp dụng được ngay vào công việc.
    * `4.9 / 5.0 ⭐` Điểm đánh giá trung bình.
  * Hình ảnh Hero: Ảnh chân dung Mentor Hứa Thảo Ly kèm các badge chứng chỉ chuyên môn và logo cựu doanh nghiệp công tác (MoMo, Tiki, ACB).
* **Dải Logo Đối tác & Nơi học viên công tác (Trust Bar / Partners):**
  * Danh sách logo: Google, Tokopedia, Microsoft, Samsung, Shopee, VPBank, Tiki, MoMo...
  * Hiệu ứng: Infinite Horizontal Marquee (băng chuyền logo tự động cuộn ngang vô tận mượt mà). Tự động nạp logo từ tab `Partners`.
* **Khối Giá trị Cốt lõi & Phương pháp đào tạo:**
  * 4 khối thẻ trực quan (Feature Cards):
    1. *Case Study Thực chiến 100%:* Dữ liệu ẩn danh thực tế từ hệ thống thương mại điện tử và tài chính.
    2. *Kèm cặp tương tác trực tiếp:* Lớp học qua Zoom Meeting sĩ số giới hạn, sửa bài tập trực tiếp 1-1.
    3. *Hỗ trợ sửa CV & Phỏng vấn thử (Mock Interview):* Tối ưu hồ sơ LinkedIn/CV, cam kết đồng hành trước các vòng phỏng vấn.
    4. *Cộng đồng Alumni chất lượng:* Kết nối mạng lưới chuyên gia dữ liệu và nhận cơ hội tuyển dụng độc quyền.
* **Khối Khóa học Nổi bật (Featured Courses):**
  * Lưới thẻ khóa học (Course Cards):
    * Ảnh bìa khóa học tỉ lệ 16:9 sắc nét (nạp từ CDN).
    * Thẻ Badge trạng thái: `Bán chạy nhất` / `Sắp khai giảng`.
    * Tên khóa học, thời lượng (`6 tuần - 12 buổi`), hình thức (`Zoom Meeting`).
    * Học phí gốc (gạch ngang), Học phí ưu đãi nổi bật.
    * Tóm tắt 3 kết quả đầu ra chính (Bullet points có icon tick xanh).
    * Nút *"Xem chi tiết"* (Chuyển hướng đến `/courses/[course_id]`) và nút *"Đăng ký ngay"* (Mở Modal điền form chọn sẵn khóa học này).
* **Khối Thư viện Dự án Thực tế của Học viên (Student Projects):**
  * Trưng bày các sản phẩm phân tích dữ liệu thực tế do chính học viên hoàn thành: Cohort Retention Analysis, Ecommerce Funnel Optimization, RFM Customer Segmentation...
  * Thẻ dự án gồm: Ảnh chụp Dashboard Power BI/Tableau độ phân giải cao, tên học viên, công cụ sử dụng (Tags: `SQL`, `PowerBI`, `Python`), nút xem phóng to ảnh hoặc link tương tác trực tiếp. Nạp từ tab `StudentProjects`.
* **Khối Đánh giá của Học viên (Student Testimonials):**
  * Bố cục: Lưới 9 đánh giá thực tế (Lưới 3x3 trên Desktop, Slider trượt trên Mobile).
  * Nội dung mỗi thẻ: Ảnh đại diện học viên, họ và tên, chức danh/công ty hiện tại (Ví dụ: *Nguyễn Văn A - Data Analyst tại Shopee*), khóa học đã tham gia, xếp hạng 5 sao, đoạn nhận xét chi tiết về sự thay đổi tư duy và mức lương sau khóa học. Nạp từ tab `Testimonials`.
* **Khối Bài viết & Kiến thức Chuyên môn mới nhất (Latest Blog Posts):**
  * Cụm 3 bài viết được đánh dấu `is_featured = TRUE` từ tab `Blogs`.
  * Hiển thị: Thumbnail, chuyên mục (`SQL Tips`, `BA Career`), tiêu đề, ngày đăng, thời lượng đọc (`5 min read`).
* **Khối CTA Banner Cuối trang (Bottom Banner):**
  * Tiêu đề thúc đẩy hành động mạnh mẽ, đồng hồ đếm ngược và form nhận lộ trình miễn phí nhanh.

---

### 6.3. Trang Chi Tiết Khóa Học (Course Detail - Figma Node `1602:7686` & `1617:11871`)
* **Khối Hero Khóa học:**
  * Breadcrumb điều hướng: `Trang chủ > Khóa học > [Tên khóa học]`.
  * Tiêu đề khóa học (H1) và đoạn mô tả mục tiêu đầu ra toàn diện.
  * Thông tin tổng quan: Trình độ phù hợp (`Beginner -> Advanced`), Thời lượng (`6 tuần / 12 buổi học`), Khung giờ học (`20:00 - 22:00 Thứ 3 & Thứ 5 qua Zoom Meeting`), Sĩ số tối đa (`15 - 20 học viên/lớp`).
  * Lịch khai giảng gần nhất: Hiển thị các thẻ ngày khai giảng sắp tới (`TH10 03`, `TH10 26`).
* **Thanh Sticky Enrollment Card (Desktop Sidebar cố định khi cuộn / Mobile Bottom Bar):**
  * Giá bán ưu đãi hiện tại, giá gốc gạch ngang, % tiết kiệm.
  * Đồng hồ đếm ngược ưu đãi đợt tuyển sinh.
  * Nút CTA chính: *"Đăng ký tư vấn khóa học này"* -> Mở form với trường `Khóa học` đã được khóa cố định theo khóa học hiện tại.
  * Danh sách cam kết: Học thử buổi đầu tiên, hoàn tiền nếu không hài lòng, cấp chứng chỉ hoàn thành khóa học, quyền xem lại video bài giảng trọn đời.
* **Khối Lộ trình Giáo trình Chi tiết (Curriculum Accordion - Node `1617:11871`):**
  * Tính năng tương tác:
    * Danh sách chia theo Tuần (Week 1 -> Week 6) và từng Buổi học (Buổi 1 -> Buổi 12).
    * Nút bấm tiện ích: **`Mở rộng tất cả (Expand all)`** và **`Thu gọn tất cả (Collapse all)`**.
  * Cấu trúc mỗi buổi học:
    * Thẻ header: Số thứ tự buổi (`Buổi 01`), Tiêu đề buổi học (Ví dụ: `Nhập môn SQL & Khởi tạo Database PostgreSQL`), Thẻ ngày học (`TH10 03`), Thời lượng (`2.5 giờ`).
    * Nội dung mở rộng (Dropdown Body):
      * Danh sách các gạch đầu dòng chi tiết kiến thức lý thuyết (Select, Where, Group By, Having, Joins...).
      * Bài tập thực hành trực tiếp: Dataset doanh nghiệp, bài tập tình huống thực tế (Business Case).
      * Tài liệu và mã nguồn đính kèm.
* **Bảng So Sánh Giá & Gói COMBO Khuyến Mãi (Packages & Pricing Table):**
  * So sánh giữa việc mua lẻ khóa học hiện tại và mua trọn gói **COMBO Lộ Trình Toàn Diện (DA + BA)**.
  * Cột hiển thị: Tên gói, Subtitle, Mức giá, Danh sách quyền lợi có biểu tượng tick xanh (`✓`) và các quyền lợi không có biểu tượng gạch chéo đỏ (`✗`).
  * Huy hiệu `Gói Phổ Biến Nhất (Most Popular)` nổi bật ở gói Combo. Nạp từ tab `Packages_Pricing`.
* **Khối Thông tin Giảng viên Phụ trách (Mentor Section):**
  * Chân dung giảng viên Hứa Thảo Ly, trích dẫn triết lý đào tạo thực chiến, tóm tắt các dự án lớn đã trực tiếp vận hành tại MoMo, Tiki, ACB.
* **Khối Câu hỏi thường gặp (Course FAQ Accordion):**
  * Hệ thống câu hỏi - trả lời mở rộng mượt mà giải đáp: Chính sách học bù, bảo lưu khóa học, hỗ trợ sau giờ học và cam kết đầu ra.

---

### 6.4. Trang Giới Thiệu (About Me / About Us - Figma Node `857:2621`)
* **Câu chuyện Thương hiệu & Giảng viên Hứa Thảo Ly:**
  * Hành trình từ con số 0 đến Lead Data Analyst tại các tập đoàn công nghệ và ngân hàng lớn.
  * Lý do sáng lập LY DATA và sứ mệnh xóa bỏ khoảng cách giữa lý thuyết hàn lâm và yêu cầu tuyển dụng thực tế của doanh nghiệp.
* **Dòng thời gian Sự nghiệp (Career Milestones):**
  * Thước đo thời gian trực quan (Vertical Timeline) các cột mốc: 2018 (Khởi đầu tại ACB), 2020 (Data Analyst tại Tiki), 2023 (Senior DA tại MoMo), 2026 (Founder & Lead Mentor tại LY DATA).
* **Phương pháp Đào tạo Độc quyền:**
  * Trình bày chi tiết chu trình 4 bước: `Tư duy phân tích (Mindset) -> Công cụ kỹ thuật (Toolsets) -> Dữ liệu thực chiến (Datasets) -> Thuyết trình giá trị (Storytelling)`.

---

### 6.5. Trang Bài Viết Chia Sẻ (Blog Listing & Blog Detail - Figma Node `1614:10196`)
* **Trang Danh sách Bài viết (`/blog`):**
  * Thanh bộ lọc chuyên mục (Tabs): *Tất cả*, *SQL Tips*, *Power BI Dashboard*, *Python for Data*, *Tư duy Phân tích*, *Kỹ năng Phỏng vấn*.
  * Thẻ bài viết chuẩn SEO: Ảnh bìa đại diện, chuyên mục, tiêu đề, tóm tắt ngắn (excerpt), tác giả, ngày đăng, thời lượng đọc.
* **Trang Đọc Bài Viết Chi Tiết (`/blog/[slug]`):**
  * Cấu trúc Heading phân cấp chuẩn mực (`<h1>`, `<h2>`, `<h3>`).
  * Hỗ trợ định dạng văn bản **Markdown** toàn diện:
    * Khối code có tô màu cú pháp (Syntax Highlighting) cho SQL, Python kèm nút bấm **`Copy Code`** 1-click.
    * Hộp ghi chú / Chú ý (Alert Callouts: Note, Tip, Warning).
    * Bảng biểu đối chiếu dữ liệu.
    * Trích dẫn chuyên gia (Blockquote).
  * Thanh tiến trình đọc bài (Reading Progress Bar) chạy ở mép trên cùng màn hình.
  * Khối tác giả (Author Box): Chân dung Hứa Thảo Ly, chức danh và lời mời tham gia cộng đồng.
  * Khối Bài viết liên quan (Related Posts) và Khối CTA nhận tài liệu/tư vấn cuối bài viết.

---

### 6.6. Popup / Modal Biểu Mẫu Đăng Ký Tư Vấn (Lead Modal - Figma Node `1617:11022`)
* **Cơ chế Kích hoạt Modal:**
  * Kích hoạt khi học viên bấm vào bất kỳ nút CTA nào trên toàn trang web (*"Nhận tư vấn"*, *"Đăng ký ngay"*, *"Nhận lộ trình 1-1"*).
  * Tự động truyền tham số khóa học quan tâm (`course_id` / `package_id`) vào form tương ứng.
  * Kích hoạt tự động khi người dùng có hành vi rời trang (Exit-intent trigger - tùy chọn).
* **Các trường dữ liệu biểu mẫu (Form Fields):**
  1. **Họ và tên (Bắt buộc):** Text input, kiểm tra độ dài 2 - 50 ký tự.
  2. **Số điện thoại (Bắt buộc):** Tel input, kiểm tra chuẩn Regex số điện thoại di động Việt Nam (`^(0|\+84)[3|5|7|8|9][0-9]{8}$`).
  3. **Địa chỉ Email (Bắt buộc):** Email input, kiểm tra định dạng email hợp lệ.
  4. **Khóa học / Gói quan tâm (Bắt buộc):** Dropdown menu nạp động danh sách các khóa học đang mở tuyển sinh từ tab `Courses`.
  5. **Mục tiêu / Nền tảng hiện tại (Tùy chọn):** Radio group lựa chọn (*Chưa biết gì/Mới bắt đầu*, *Đã biết cơ bản muốn nâng cao*, *Đang làm việc muốn chuyển ngành Data*).
  6. **Khung giờ hẹn gọi tư vấn (Tùy chọn):** Dropdown chọn (*Sáng: 09h - 11h30*, *Chiều: 14h - 17h30*, *Tối: 19h30 - 21h30*).
  7. **Ghi chú thêm (Tùy chọn):** Textarea nhập câu hỏi hoặc yêu cầu riêng của học viên.
* **Cơ chế bảo vệ & Chống Spam:**
  * **Honeypot Field:** Trường ẩn mang tên kỹ thuật (ví dụ `website_url_check`), ẩn hoàn toàn bằng CSS. Người dùng thật không nhìn thấy, nhưng bot spam tự động điền vào -> Hệ thống lập tức hủy request mà không ghi vào Sheets.
  * **Rate Limiting:** Giới hạn tối đa 3 lần submit/IP trong vòng 1 phút.
  * **Idempotency Token:** Tạo mã `submission_id` duy nhất cho mỗi lượt mở form, ngăn chặn việc bấm đúp (double-click) gây trùng lặp dữ liệu trên Sheets.
* **Trạng thái Giao diện (Form UI States):**
  * *Trạng thái nhập liệu (Idle):* Hiển thị placeholder rõ ràng, báo lỗi đỏ ngay dưới từng ô nếu dữ liệu chưa hợp lệ (Inline Validation).
  * *Trạng thái đang gửi (Submitting):* Nút bấm chuyển sang Loading Spinner mượt mà, vô hiệu hóa (disabled) các ô nhập liệu để tránh người dùng thao tác đè.
  * *Trạng thái thành công (Success):* Ẩn form, hiển thị màn hình chúc mừng với icon tick xanh, thông báo: *"Đăng ký thành công! Mentor Hứa Thảo Ly và đội ngũ tư vấn sẽ liên hệ với bạn trong vòng 15 phút tới."*, kèm nút bấm tham gia Nhóm Zalo Hỗ trợ Học tập.
  * *Trạng thái lỗi kết nối (Error):* Thông báo nhẹ nhàng: *"Kết nối mạng không ổn định, vui lòng thử lại hoặc liên hệ Hotline/Zalo 09xx.xxx.xxx để được hỗ trợ tức thì"*.

---

### 6.7. Chân Trang Toàn Cục (Global Footer)
* Thông tin thương hiệu: Logo `LY DATA`, sứ mệnh đào tạo, thông tin pháp lý / giấy chứng nhận.
* Cột Khóa học: Danh sách link chuyển nhanh đến các khóa học Data Analyst, Business Analyst, SQL, Power BI.
* Cột Tài nguyên & Chính sách: Blog chia sẻ, Thư viện dự án, Chính sách bảo lưu & hoàn học phí, Điều khoản bảo vệ dữ liệu cá nhân.
* Cột Kênh liên hệ chính thức: Địa chỉ, Email liên hệ, Số Hotline, Link Zalo Official Account, Kênh TikTok, Kênh YouTube, Fanpage Facebook, Trang cá nhân LinkedIn của Mentor.
* Dòng chữ bản quyền: `© 2026 LY DATA. All rights reserved. Powered by Next.js & Google Sheets Headless CMS.`

---

## 7. ĐẶC TẢ MÔ HÌNH DỮ LIỆU GOOGLE SHEETS (10 TABS) & ZOD SCHEMA VALIDATION

Hệ thống sử dụng **2 file Google Sheets độc lập** với 10 tabs dữ liệu được chuẩn hóa tên cột bằng tiếng Anh viết thường kết nối dấu gạch dưới (`snake_case`), không dấu, không khoảng trắng:

```mermaid
erDiagram
    SiteConfig {
        string key PK
        string value
        string description
    }
    Courses ||--o{ Curriculum : "1 course có nhiều buổi học"
    Courses ||--o{ Packages_Pricing : "1 course có các gói giá"
    Courses ||--o{ Testimonials : "được review bởi"
    Courses ||--o{ StudentProjects : "sản phẩm thực hành"
    Courses ||--o{ Leads : "học viên quan tâm"
    Mentors ||--o{ Courses : "giảng dạy"
    Blogs }|--|| Mentors : "tác giả"

    Courses {
        string course_id PK
        string slug
        string title
        string summary
        number sale_price
        number original_price
        string next_cohort_date
        boolean is_active
    }
    Curriculum {
        string curriculum_id PK
        string course_id FK
        number week_number
        number session_number
        string session_title
        string session_summary
        string detailed_bullets
    }
    Packages_Pricing {
        string package_id PK
        string course_id FK
        string package_name
        number sale_price
        number original_price
        boolean is_popular
        string features_included
        string features_excluded
    }
    Mentors {
        string mentor_id PK
        string full_name
        string title_role
        string avatar_url
        string bio_summary
        string philosophy
    }
    Testimonials {
        string testimonial_id PK
        string student_name
        string student_role
        string avatar_url
        number rating_stars
        string content
        boolean is_featured
    }
    StudentProjects {
        string project_id PK
        string project_name
        string student_name
        string thumbnail_url
        string demo_url
        string tools_used
    }
    Blogs {
        string blog_id PK
        string slug
        string title
        string category
        string content_markdown
        boolean is_published
    }
    Partners {
        string partner_id PK
        string partner_name
        string logo_url
        number order_index
    }
    Leads {
        string lead_id PK
        string timestamp
        string full_name
        string phone_number
        string email
        string course_of_interest
        string status
    }
```

---

### 7.1. Cấu Trúc Chi Tiết 9 Tabs của File 1 (Public Content Sheet)

#### Tab 1: `SiteConfig` (Cấu hình chung toàn hệ thống)
*Mục đích:* Quản lý các thông số chung, top banner khuyến mãi, hotline, email và metadata SEO mặc định.

| Tên Cột (Column Name) | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ý Nghĩa | Dữ Liệu Mẫu (Sample Data) |
| :--- | :--- | :---: | :--- | :--- |
| `config_key` | String | Có | Khóa định danh thiết lập duy nhất | `top_banner_sale_text` |
| `config_value` | String | Có | Giá trị thiết lập | `🔥 Ưu đãi 75% OFF - Chỉ còn 4 ngày duy nhất!` |
| `description` | String | Không | Chú thích tiếng Việt cho Admin hiểu công dụng | `Nội dung chữ trên thanh banner khuyến mãi trên cùng` |

*Các key chuẩn cần có trong hệ thống:*
* `site_name`: `LY DATA - Đào Tạo Phân Tích Dữ Liệu Thực Chiến`
* `hotline_display`: `0909.123.456`
* `hotline_tel`: `+84909123456`
* `contact_email`: `contact@lydata.edu.vn`
* `zalo_oa_url`: `https://zalo.me/lydata_official`
* `facebook_url`: `https://facebook.com/lydata.official`
* `tiktok_url`: `https://tiktok.com/@lydata_analytics`
* `top_banner_active`: `TRUE`
* `top_banner_sale_text`: `🔥 Khai giảng khóa mới - Nhận học bổng 75% OFF hôm nay!`
* `top_banner_deadline`: `2026-10-31T23:59:59`
* `default_seo_title`: `Khóa Học Data Analysis & Business Analysis Thực Chiến | LY DATA`
* `default_seo_description`: `Khóa học phân tích dữ liệu thực chiến từ Mentor Hứa Thảo Ly (Ex Senior DA tại MoMo, Tiki, ACB). Làm chủ SQL, Power BI, Python qua case study thực tế.`

---

#### Tab 2: `Courses` (Danh mục Khóa học)
*Mục đích:* Lưu trữ thông tin tổng quan của các khóa học hiển thị trên Trang chủ và Trang chi tiết khóa học.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `course_id` | String | Có | Mã định danh duy nhất (Slug không dấu) | `sql-for-data-analytics` |
| `slug` | String | Có | Đường dẫn URL của khóa học | `sql-for-data-analytics` |
| `title` | String | Có | Tên khóa học hiển thị | `Khóa Học SQL for Data Analytics Thực Chiến` |
| `summary` | String | Có | Đoạn mô tả ngắn (1 - 2 câu) | `Làm chủ tư duy truy vấn và xử lý dữ liệu lớn với PostgreSQL qua bài toán kinh doanh thực tế.` |
| `description` | String | Không | Mô tả đầy đủ về mục tiêu và kết quả đầu ra | `Khóa học trang bị cho bạn toàn bộ kỹ năng viết truy vấn phức tạp, Window Functions, CTE...` |
| `thumbnail_url` | String (URL) | Có | Link ảnh bìa khóa học trên CDN Cloudinary | `https://res.cloudinary.com/lydata/image/upload/v1/courses/sql-hero.webp` |
| `badge_label` | String | Không | Huy hiệu gắn trên góc thẻ | `Bán Chạy Nhất` |
| `level` | String | Có | Cấp độ đào tạo | `Người Mới Bắt Đầu (Beginner)` |
| `duration_weeks` | Number | Có | Thời lượng tính theo tuần | `6` |
| `total_sessions` | Number | Có | Tổng số buổi học trực tiếp | `12` |
| `learning_format`| String | Có | Hình thức học tập | `Zoom Meeting trực tiếp 100%` |
| `min_students` | Number | Không | Sĩ số tối thiểu | `10` |
| `max_students` | Number | Có | Sĩ số tối đa đảm bảo chất lượng kèm cặp | `18` |
| `original_price` | Number | Có | Giá gốc chưa giảm (VNĐ, dạng số nguyên) | `8500000` |
| `sale_price` | Number | Có | Giá bán thực tế đang khuyến mãi (VNĐ) | `4990000` |
| `next_cohort_date`| String | Có | Ngày khai giảng đợt gần nhất | `2026-11-05` |
| `cohort_tags` | String | Không | Thẻ ngày khai giảng viết tắt hiển thị ở thẻ | `TH11 05, TH11 20` |
| `is_featured` | Boolean | Có | Đánh dấu hiển thị ưu tiên tại Trang chủ | `TRUE` |
| `is_active` | Boolean | Có | Bật/tắt hiển thị tuyển sinh | `TRUE` |
| `order_index` | Number | Có | Thứ tự sắp xếp hiển thị (số nhỏ xếp trước) | `1` |

---

#### Tab 3: `Curriculum` (Chi tiết Lộ trình Giáo trình từng Buổi học)
*Mục đích:* Quản lý từng tuần học và nội dung chi tiết của từng buổi để render khối Accordion.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `curriculum_id` | String | Có | Mã định danh buổi học duy nhất | `cur-sql-b01` |
| `course_id` | String | Có | Khóa ngoại nối với `course_id` của tab `Courses` | `sql-for-data-analytics` |
| `week_number` | Number | Có | Số thứ tự tuần học (1, 2, 3...) | `1` |
| `week_title` | String | Có | Tiêu đề của tuần học | `Tuần 1: Nền Tảng CSDL Quan Hệ & Nhập Môn SQL` |
| `session_number` | Number | Có | Số thứ tự buổi học (1 -> 12) | `1` |
| `session_title` | String | Có | Tên buổi học hiển thị trên Accordion Header | `Buổi 1: Kiến trúc CSDL & Cú pháp SELECT cơ bản` |
| `cohort_tag` | String | Không | Thẻ ngày học dự kiến | `TH10 03` |
| `session_duration`| String | Không | Thời lượng buổi học | `2.5 giờ` |
| `session_summary`| String | Có | Tóm tắt mục tiêu bài học | `Hiểu bản chất Relational Database và cài đặt PostgreSQL` |
| `detailed_bullets`| String (Multiline)| Có | Các gạch đầu dòng chi tiết (xuống dòng bằng `Alt+Enter`)| `- Bản chất bảng dữ liệu, Khóa chính, Khóa ngoại\n- Cú pháp SELECT, WHERE, ORDER BY, LIMIT\n- Thực hành: Truy vấn bảng đơn hàng E-commerce` |
| `order_index` | Number | Có | Thứ tự sắp xếp tuần tự | `1` |

---

#### Tab 4: `Packages_Pricing` (Gói Học Phí & Combo So Sánh)
*Mục đích:* Quản lý các gói học phí bán lẻ và gói Combo hiển thị tại bảng so sánh giá.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `package_id` | String | Có | Mã định danh gói giá duy nhất | `pkg-combo-fullstack-da` |
| `course_id` | String | Không | Nối với khóa học lẻ (để trống nếu là gói Combo) | `sql-for-data-analytics` |
| `package_name` | String | Có | Tên gói học phí | `Gói COMBO Lộ Trình Toàn Diện (DA + BA)` |
| `subtitle` | String | Không | Đoạn giải thích ngắn | `Phù hợp nhất cho người chuyển ngành muốn đi làm ngay` |
| `original_price` | Number | Có | Giá gốc gạch ngang (VNĐ) | `16000000` |
| `sale_price` | Number | Có | Giá bán thực tế ưu đãi (VNĐ) | `8990000` |
| `discount_badge` | String | Không | Huy hiệu giảm giá nổi bật | `Tiết kiệm 45%` |
| `is_popular` | Boolean | Có | Đánh dấu gói nổi bật nhất (viền gradient) | `TRUE` |
| `features_included`| String (Multiline)| Có | Danh sách quyền lợi có (`✓`) - mỗi dòng 1 ý | `Trọn gói 24 buổi học trực tiếp qua Zoom\nSửa CV 1-1 không giới hạn\nMock Interview với HR Tech\nBộ dataset độc quyền từ MoMo & Tiki` |
| `features_excluded`| String (Multiline)| Không | Danh sách quyền lợi không có (`✗`) | `Kèm cặp 1-1 riêng ngoài giờ học` |
| `cta_text` | String | Có | Chữ hiển thị trên nút bấm | `Đăng Ký Gói COMBO Ngay` |
| `order_index` | Number | Có | Thứ tự hiển thị cột trên bảng giá | `2` |

---

#### Tab 5: `Mentors` (Hồ Sơ Giảng Viên)
*Mục đích:* Quản lý thông tin profile của Founder Hứa Thảo Ly và đội ngũ trợ giảng.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `mentor_id` | String | Có | Mã định danh giảng viên | `hua-thao-ly` |
| `full_name` | String | Có | Họ và tên giảng viên | `Hứa Thảo Ly` |
| `title_role` | String | Có | Chức danh chuyên môn | `Founder & Lead Data Mentor` |
| `avatar_url` | String (URL) | Có | Ảnh chân dung độ nét cao trên CDN | `https://res.cloudinary.com/lydata/image/upload/v1/mentors/thao-ly-avatar.webp` |
| `bio_summary` | String | Có | Tóm tắt tiểu sử ngắn | `Ex Senior Data Analyst tại MoMo, Tiki, ACB với hơn 7 năm kinh nghiệm thực chiến.` |
| `philosophy` | String | Có | Triết lý đào tạo cốt lõi | `Dữ liệu chỉ thực sự có giá trị khi nó tạo ra tác động trực tiếp lên quyết định kinh doanh.` |
| `milestones` | String (Multiline)| Có | Các cột mốc công tác (xuống dòng bằng `Alt+Enter`)| `- 2023 - 2025: Senior Data Analyst tại Ví MoMo\n- 2020 - 2023: BI & Product Analyst tại Sàn Tiki\n- 2018 - 2020: Data Analyst tại Ngân hàng ACB` |
| `achievements` | String (Multiline)| Không | Các giải thưởng & chứng chỉ | `Chứng chỉ Microsoft Certified: Power BI Data Analyst Associate\nTop 1 Speaker tại Data Analytics Summit 2024` |
| `linkedin_url` | String (URL) | Không | Đường link trang cá nhân LinkedIn | `https://linkedin.com/in/huathaoly` |
| `order_index` | Number | Có | Thứ tự hiển thị | `1` |

---

#### Tab 6: `Testimonials` (Đánh Giá Của Học Viên)
*Mục đích:* Quản lý kho nhận xét thực tế hiển thị tại lưới đánh giá Trang chủ.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `testimonial_id` | String | Có | Mã đánh giá duy nhất | `rev-001` |
| `student_name` | String | Có | Họ tên học viên | `Trần Minh Hoàng` |
| `student_role` | String | Có | Vị trí công tác hiện tại | `Data Analyst tại Shopee Việt Nam` |
| `student_company`| String | Không | Tên doanh nghiệp đang làm việc | `Shopee` |
| `avatar_url` | String (URL) | Có | Ảnh chân dung học viên trên CDN | `https://res.cloudinary.com/lydata/image/upload/v1/reviews/hoang-tran.webp` |
| `course_id` | String | Có | Khóa ngoại nối với khóa học đã học | `sql-for-data-analytics` |
| `rating_stars` | Number | Có | Điểm đánh giá (1 -> 5 sao) | `5` |
| `content` | String | Có | Lời nhận xét chi tiết của học viên | `Khóa học rất thực chiến! Nhờ phần tối ưu truy vấn SQL và các bài tập sát với thực tế phỏng vấn, mình đã pass vòng technical của Shopee ngay tuần thứ 5!` |
| `is_featured` | Boolean | Có | Đánh dấu xuất hiện trên lưới Trang chủ | `TRUE` |
| `order_index` | Number | Có | Thứ tự hiển thị | `1` |

---

#### Tab 7: `StudentProjects` (Dự Án Học Viên Thực Hiện)
*Mục đích:* Lưu trữ các báo cáo, dashboard Power BI/Tableau thực tế để tăng uy tín đào tạo.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `project_id` | String | Có | Mã định danh dự án | `prj-cohort-retention` |
| `project_name` | String | Có | Tên sản phẩm dự án | `Cohort Retention & Churn Prediction Dashboard` |
| `student_name` | String | Có | Tác giả dự án | `Lê Phương Thảo` |
| `course_id` | String | Có | Khóa học đã tạo ra dự án | `sql-for-data-analytics` |
| `thumbnail_url` | String (URL) | Có | Ảnh chụp màn hình Dashboard sắc nét trên CDN | `https://res.cloudinary.com/lydata/image/upload/v1/projects/cohort-dashboard.webp` |
| `demo_url` | String (URL) | Không | Link xem tương tác trực tiếp (Power BI Web / Tableau Public)| `https://app.powerbi.com/view?r=sample_token` |
| `tools_used` | String | Có | Danh sách công cụ sử dụng (cách nhau bằng dấu phẩy)| `SQL, PostgreSQL, Power BI, DAX` |
| `summary` | String | Có | Tóm tắt bài toán kinh doanh dự án giải quyết | `Phân tích tỷ lệ giữ chân khách hàng định kỳ 30-60-90 ngày cho chuỗi bán lẻ thời trang.` |
| `order_index` | Number | Có | Thứ tự sắp xếp | `1` |

---

#### Tab 8: `Blogs` (Bài Viết & Kiến Thức Chuyên Môn)
*Mục đích:* Quản lý các bài viết chia sẻ kiến thức, mẹo kỹ thuật và tối ưu SEO Organic Traffic.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `blog_id` | String | Có | Mã định danh bài viết | `blog-sql-window-functions` |
| `slug` | String | Có | Đường dẫn thân thiện URL (`/blog/[slug]`) | `huong-dan-sql-window-functions-thuc-chien` |
| `title` | String | Có | Tiêu đề bài viết (H1) | `Bí Kíp Sử Dụng SQL Window Functions Trong Phân Tích Dữ Liệu Thực Tế` |
| `category` | String | Có | Chuyên mục bài viết | `SQL Tips` |
| `author_id` | String | Có | Mã tác giả nối với tab `Mentors` | `hua-thao-ly` |
| `published_date`| String (Date)| Có | Ngày xuất bản bài viết (`YYYY-MM-DD`) | `2026-10-15` |
| `read_time` | String | Có | Thời gian đọc ước tính | `6 phút đọc` |
| `thumbnail_url` | String (URL) | Có | Link ảnh bìa bài viết trên CDN | `https://res.cloudinary.com/lydata/image/upload/v1/blogs/sql-window-cover.webp` |
| `excerpt` | String | Có | Đoạn trích dẫn ngắn hiển thị ở trang danh sách | `Tìm hiểu cách ứng dụng ROW_NUMBER, RANK, DENSE_RANK và LEAD/LAG để giải quyết các bài toán xếp hạng doanh thu.` |
| `content_markdown`| String (LongText)| Có | Toàn bộ nội dung bài viết hỗ trợ cú pháp **Markdown** | `## 1. Giới thiệu Window Functions\nTrong phân tích dữ liệu...\n\`\`\`sql\nSELECT user_id, order_date, SUM(amount) OVER (PARTITION BY user_id) as total_spent FROM orders;\n\`\`\`` |
| `is_featured` | Boolean | Có | Đánh dấu hiển thị tại Trang chủ | `TRUE` |
| `is_published` | Boolean | Có | Trạng thái đăng bài (`TRUE` là công khai, `FALSE` là bản nháp) | `TRUE` |
| `view_count` | Number | Không | Lượt xem tích lũy | `1250` |

---

#### Tab 9: `Partners` (Logo Đối Tác & Nơi Học Viên Làm Việc)
*Mục đích:* Nạp danh sách logo chạy trên thanh Trust Bar (Marquee) tại Trang chủ.

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Ràng Buộc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `partner_id` | String | Có | Mã định danh đối tác | `ptn-google` |
| `partner_name` | String | Có | Tên công ty / tập đoàn | `Google` |
| `logo_url` | String (URL) | Có | Link ảnh logo dạng vector SVG hoặc WebP trong suốt | `https://res.cloudinary.com/lydata/image/upload/v1/partners/google-logo.svg` |
| `category` | String | Không | Nhóm đơn vị (`Tập đoàn Công nghệ`, `Ngân hàng`...) | `Tập đoàn Công nghệ` |
| `website_url` | String (URL) | Không | Đường link website chính thức của đối tác | `https://about.google` |
| `order_index` | Number | Có | Thứ tự sắp xếp trên dải chạy | `1` |

---

### 7.2. Cấu Trúc Chi Tiết File 2 (Private Leads Sheet - Bảo Mật Nội Bộ)

#### Tab Duy Nhất: `Leads` (Danh Sách Học Viên Đăng Ký Tư Vấn)
*Mục đích:* Lưu trữ toàn bộ dữ liệu khách hàng tiềm năng gửi về từ website. **Chỉ Chị Ly và nhân sự tuyển sinh được cấp quyền xem tệp này.**

| Tên Cột | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả Nguồn Gốc | Dữ Liệu Mẫu |
| :--- | :--- | :---: | :--- | :--- |
| `lead_id` | String | Có | Mã định danh hồ sơ duy nhất (Tự động sinh bởi Apps Script) | `LEAD-20261023-8941` |
| `timestamp` | String (Datetime)| Có | Thời gian học viên bấm gửi form (Giờ Việt Nam GMT+7) | `2026-10-23 16:30:15` |
| `full_name` | String | Có | Họ và tên học viên | `Nguyễn Thu Hà` |
| `phone_number` | String | Có | Số điện thoại liên hệ | `0912345678` |
| `email` | String | Có | Địa chỉ email nhận tài liệu | `thuha.data@gmail.com` |
| `course_of_interest`| String | Có | Tên khóa học hoặc mã khóa học quan tâm | `Khóa Học SQL for Data Analytics Thực Chiến` |
| `package_chosen`| String | Không | Gói giá học viên bấm đăng ký (Lẻ hoặc Combo) | `Gói COMBO Lộ Trình Toàn Diện (DA + BA)` |
| `current_background`| String | Không | Nền tảng học vấn hiện tại | `Đang làm kế toán muốn chuyển ngành Data` |
| `preferred_time`| String | Không | Khung giờ hẹn gọi điện tư vấn | `Tối: 19h30 - 21h30` |
| `student_notes`| String | Không | Lời nhắn hoặc câu hỏi riêng của học viên | `Em muốn hỏi về chính sách trả góp học phí ạ` |
| `status` | String (Dropdown)| Có | Trạng thái xử lý nội bộ (`Chưa xử lý`, `Đang gọi`, `Đã chốt`, `Hủy`) | `Chưa xử lý` |
| `utm_source` | String | Không | Nguồn chiến dịch quảng cáo (Facebook, TikTok, Google, Zalo)| `facebook_ads` |
| `utm_medium` | String | Không | Kênh truyền thông | `cpc` |
| `utm_campaign`| String | Không | Tên chiến dịch quảng cáo | `campaign_tuyensinh_thang11` |
| `ip_address` | String | Không | Địa chỉ IP người gửi (phục vụ đối soát chống spam) | `113.161.xx.xx` |
| `admin_notes` | String | Không | Ghi chú của tư vấn viên sau khi gọi điện thoại | `Đã hẹn học thử buổi 1 ngày 05/11` |

---

### 7.3. Bộ Zod Schema Chuẩn Hóa Kiểm Thử Dữ Liệu (TypeScript Implementation)

Dưới đây là mã nguồn Zod Schema được tích hợp trực tiếp vào tầng Model của Next.js, đảm bảo toàn bộ dữ liệu đọc từ Google Sheets và dữ liệu form học viên gửi lên đều được kiểm tra type-safety nghiêm ngặt:

```typescript
import { z } from "zod";

// 1. Schema kiểm tra dữ liệu từ Tab SiteConfig
export const SiteConfigSchema = z.object({
  config_key: z.string().min(1, "Key không được để trống"),
  config_value: z.string(),
  description: z.string().optional(),
});
export type SiteConfig = z.infer<typeof SiteConfigSchema>;

// 2. Schema kiểm tra dữ liệu từ Tab Courses
export const CourseSchema = z.object({
  course_id: z.string().min(1, "course_id bắt buộc"),
  slug: z.string().min(1, "slug bắt buộc"),
  title: z.string().min(1, "title bắt buộc"),
  summary: z.string().min(1, "summary bắt buộc"),
  description: z.string().optional(),
  thumbnail_url: z.string().url("thumbnail_url phải là URL hợp lệ"),
  badge_label: z.string().optional(),
  level: z.string().default("Mọi trình độ"),
  duration_weeks: z.coerce.number().int().positive(),
  total_sessions: z.coerce.number().int().positive(),
  learning_format: z.string().default("Zoom Meeting trực tiếp"),
  min_students: z.coerce.number().int().optional(),
  max_students: z.coerce.number().int().positive(),
  original_price: z.coerce.number().positive("original_price phải > 0"),
  sale_price: z.coerce.number().positive("sale_price phải > 0"),
  next_cohort_date: z.string(),
  cohort_tags: z.string().optional(),
  is_featured: z.coerce.boolean().default(false),
  is_active: z.coerce.boolean().default(true),
  order_index: z.coerce.number().default(0),
});
export type Course = z.infer<typeof CourseSchema>;

// 3. Schema kiểm tra dữ liệu từ Tab Curriculum
export const CurriculumSchema = z.object({
  curriculum_id: z.string().min(1),
  course_id: z.string().min(1, "Phải liên kết với course_id"),
  week_number: z.coerce.number().int().positive(),
  week_title: z.string().min(1),
  session_number: z.coerce.number().int().positive(),
  session_title: z.string().min(1),
  cohort_tag: z.string().optional(),
  session_duration: z.string().optional(),
  session_summary: z.string().min(1),
  detailed_bullets: z.string().min(1, "detailed_bullets không được để trống"),
  order_index: z.coerce.number().default(0),
});
export type Curriculum = z.infer<typeof CurriculumSchema>;

// 4. Schema kiểm tra dữ liệu từ Tab Packages_Pricing
export const PackagePricingSchema = z.object({
  package_id: z.string().min(1),
  course_id: z.string().optional(),
  package_name: z.string().min(1),
  subtitle: z.string().optional(),
  original_price: z.coerce.number().positive(),
  sale_price: z.coerce.number().positive(),
  discount_badge: z.string().optional(),
  is_popular: z.coerce.boolean().default(false),
  features_included: z.string().min(1),
  features_excluded: z.string().optional(),
  cta_text: z.string().default("Đăng Ký Ngay"),
  order_index: z.coerce.number().default(0),
});
export type PackagePricing = z.infer<typeof PackagePricingSchema>;

// 5. Schema kiểm tra dữ liệu Form Đăng Ký Học Viên (Lead Submission)
export const LeadSubmissionSchema = z.object({
  full_name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không quá 50 ký tự")
    .trim(),
  phone_number: z
    .string()
    .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại di động Việt Nam không đúng định dạng (10 số)"),
  email: z
    .string()
    .email("Địa chỉ email không hợp lệ")
    .trim()
    .toLowerCase(),
  course_of_interest: z.string().min(1, "Vui lòng chọn khóa học bạn quan tâm"),
  package_chosen: z.string().optional(),
  current_background: z.string().optional(),
  preferred_time: z.string().optional(),
  student_notes: z.string().max(500, "Ghi chú không quá 500 ký tự").optional(),
  // Các trường phục vụ Tracking Marketing
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  // Honeypot field chống bot tự động
  honeypot: z.string().max(0, "Spam detected").optional(),
});
export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;
```

---

## 8. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS - NFR) & KIẾN TRÚC KỸ THUẬT

### 8.1. Hiệu Năng & Tối Ưu Tải Trang (Core Web Vitals)
* **Chỉ số hiệu năng cam kết:**
  * **LCP (Largest Contentful Paint):** `< 1.2 giây` (Hiển thị phần tử nội dung lớn nhất siêu tốc).
  * **INP (Interaction to Next Paint):** `< 100 ms` (Độ trễ phản hồi tương tác cực nhạy).
  * **CLS (Cumulative Layout Shift):** `< 0.05` (Giao diện cố định, không bị giật khung hình khi đang tải).
  * **Điểm Google PageSpeed Insights:** Đạt `>= 92 điểm` trên cả Desktop và Mobile.
* **Chiến lược Bộ Nhớ Đệm Next.js ISR (Incremental Static Regeneration):**
  * `revalidate = 3600` (Tự động biên dịch lại trang nền tĩnh sau mỗi 1 giờ).
  * Tích hợp Webhook **On-Demand Revalidation (`/api/revalidate`)**: Khi Chị Ly bấm *"Xuất bản lên Web"* trên menu Google Sheets, script sẽ kích hoạt API làm mới ngay lập tức trang web mà không cần chờ hết chu kỳ 1 giờ.
* **Tối ưu hóa Tài nguyên Media:**
  * 100% hình ảnh phải sử dụng thẻ `next/image` có thuộc tính `sizes`, `priority` (cho ảnh Hero) và `loading="lazy"` (cho các ảnh bên dưới).
  * Tự động phục vụ ảnh định dạng thế hệ mới `image/webp` và `image/avif` từ Cloudinary CDN.

### 8.2. Tiêu Chuẩn SEO On-page & Cấu Trúc Dữ Liệu Schema.org
* **Thẻ Meta Toàn Cục:** Đầy đủ `title`, `description`, `canonical`, `viewport`, `robots`.
* **Social Graph Tags:** Đầy đủ `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card="summary_large_image"` để khi gửi link trên Zalo/Facebook sẽ hiển thị thẻ hình ảnh lớn chuyên nghiệp.
* **Dữ liệu có cấu trúc Schema.org (JSON-LD):**
  * *Trang chủ:* Schema `EducationalOrganization` và `Person` (Mentor Hứa Thảo Ly).
  * *Trang Khóa học:* Schema `Course` (bao gồm tên khóa, học phí, ngày khai giảng, đơn vị đào tạo).
  * *Trang Blog:* Schema `BlogPosting` (tiêu đề, tác giả, ngày đăng, ảnh đại diện).
* **Sitemap & Robots:** Tự động sinh `sitemap.xml` và `robots.txt` chuẩn chỉ cho Google Bot thu thập dữ liệu.

### 8.3. Bảo Mật Hệ Thống & Kiểm Soát Rủi Ro
* **Bảo vệ Dữ liệu Học viên (Data Isolation):**
  * Website hoàn toàn không có quyền đọc (No Read Access) đối với file `Private Leads Sheet`.
  * Giao tiếp giữa Website và file Leads được thực hiện qua kênh đẩy một chiều (One-way Push via HTTPS Webhook) kèm mã bí mật `X-Webhook-Secret`.
* **Cơ chế Chống Spam 3 Lớp:**
  1. *Lớp 1 - Honeypot:* Bẫy bot bằng trường ẩn `honeypot`.
  2. *Lớp 2 - Rate Limiting:* Giới hạn tần suất gọi API từ cùng một IP.
  3. *Lớp 3 - Idempotency Token:* Chặn gửi trùng nhiều lần khi người dùng bấm liên tục.
* **An toàn Đồng thời (Concurrency with LockService):**
  * Webhook Google Apps Script sử dụng `LockService.getScriptLock()` với thời gian chờ tối đa 30 giây để đảm bảo việc ghi hàng đợi tuần tự, không bao giờ xảy ra tình trạng mất mát dữ liệu khi có nhiều học viên đăng ký cùng một giây.

### 8.4. Cơ Chế Cô Lập Lỗi (Graceful Fallback & Error Boundaries)
* **Error Boundary:** Được bọc tại từng component lớn (Accordion, Testimonials, Projects). Nếu một tab trên Google Sheets bị ai đó vô tình xóa nhầm hoặc sai định dạng, phần lỗi sẽ được hiển thị fallback nhẹ nhàng hoặc ẩn đi, **tuyệt đối không làm crash trắng toàn bộ website**.
* **Trang 404 & Trang 500 Tùy Biến:** Được thiết kế đồng bộ nhận diện thương hiệu với nút bấm dẫn hướng người dùng quay lại Trang chủ.

### 8.5. Đo Lường & Tích Hợp Tiếp Thị (Analytics & Tracking)
* Cấu hình sẵn vị trí cắm mã `NEXT_PUBLIC_GTM_ID` (Google Tag Manager) hoặc `NEXT_PUBLIC_GA4_ID` (Google Analytics 4).
* Theo dõi các sự kiện chuyển đổi tùy biến (Custom Events):
  * `click_hero_cta`: Bấm nút tư vấn ở Hero.
  * `open_lead_modal`: Mở popup form tư vấn.
  * `expand_syllabus`: Bấm xem chi tiết buổi học trên Accordion.
  * `submit_lead_success`: Gửi form đăng ký thành công (Kèm theo thông số khóa học, gói combo).
  * `click_zalo_contact`: Bấm vào nút chat Zalo Official.

---

## 9. CHECKLIST TRIỂN KHAI DỰ ÁN CHI TIẾT (ACTIONABLE IMPLEMENTATION CHECKLIST)

Bảng checklist dưới đây là kim chỉ nam dành cho đội ngũ lập trình viên và AI Codegen Agent để triển khai dự án theo đúng trình tự khoa học và chuẩn mực:

```mermaid
gantt
    title KẾ HOẠCH TRIỂN KHAI DỰ ÁN WEBSITE LY DATA
    dateFormat  YYYY-MM-DD
    section Giai đoạn 1: Hạ tầng
    Thiết lập 2 Sheets CMS & Template      :p1_1, 2026-10-24, 2d
    Deploy Apps Script Webhook & Sidebar    :p1_2, after p1_1, 2d
    Cấu hình Cloudinary / R2 CDN Media     :p1_3, after p1_1, 1d
    section Giai đoạn 2: Frontend Core
    Khởi tạo Next.js App Router & Tailwind  :p2_1, after p1_2, 2d
    Design System & Typography Token        :p2_2, after p2_1, 2d
    Zod Schemas & Google Sheets Client Layer:p2_3, after p2_2, 2d
    section Giai đoạn 3: Component & Pages
    Xây dựng UI Components & Accordion      :p3_1, after p2_3, 3d
    Lắp ráp Homepage & Course Detail Page   :p3_2, after p3_1, 3d
    Lắp ráp About Us & Blog Listing/Detail  :p3_3, after p3_2, 2d
    section Giai đoạn 4: Leads & QA
    Tích hợp Modal Lead & Anti-spam         :p4_1, after p3_3, 2d
    Cấu hình SEO, Social Meta & Analytics   :p4_2, after p4_1, 2d
    Kiểm thử đa thiết bị & Tối ưu PageSpeed :p4_3, after p4_2, 2d
    Bàn giao Cẩm nang & Nghiệm thu          :p4_4, after p4_3, 1d
```

### [ ] Phase 1: Khởi Tạo Môi Trường & Hạ Tầng Dữ Liệu
* [ ] **1.1.** Tạo tệp Google Sheets 1: `LY_DATA_PUBLIC_CONTENT_CMS` với 9 tabs: `SiteConfig`, `Courses`, `Curriculum`, `Packages_Pricing`, `Mentors`, `Testimonials`, `StudentProjects`, `Blogs`, `Partners`.
* [ ] **1.2.** Tạo tệp Google Sheets 2: `LY_DATA_PRIVATE_LEADS_DATABASE` với 1 tab duy nhất: `Leads`.
* [ ] **1.3.** Thiết lập Data Validation định dạng cho từng cột trên 2 file Google Sheets (Dropdown, định dạng ngày tháng, số nguyên).
* [ ] **1.4.** Cài đặt Google Apps Script trên file Public Sheet:
  * [ ] Menu tùy chỉnh `LY DATA CMS` xuất hiện khi mở tệp (`onOpen()`).
  * [ ] Sidebar HTML Form nhập liệu chuẩn hóa có kiểm tra lỗi đầu vào tự động.
  * [ ] Tính năng Data Linting 1-Click rà soát toàn bộ các tab và tô màu cảnh báo ô lỗi.
  * [ ] Nút kích hoạt Webhook làm mới bộ nhớ đệm Next.js ISR (`Xuất bản lên Web`).
* [ ] **1.5.** Cài đặt Google Apps Script trên file Private Leads Sheet:
  * [ ] Webhook Receiver xử lý yêu cầu `doPost(e)` từ website.
  * [ ] Triển khai `LockService.getScriptLock()` đảm bảo an toàn ghi tuần tự.
  * [ ] Tự động gửi email thông báo Real-time đến Gmail của Chị Ly/Tư vấn viên khi có lead mới.
  * [ ] Xuất bản Web App dưới dạng `Execute as: Me` và `Who has access: Anyone`.
* [ ] **1.6.** Khởi tạo kho lưu trữ media trên Cloudinary/Cloudflare R2, cấu hình thư mục lưu trữ (`/courses`, `/mentors`, `/reviews`, `/projects`, `/blogs`).

### [ ] Phase 2: Khởi Tạo Dự Án Next.js & Xây Dựng Design System
* [ ] **2.1.** Khởi tạo dự án Next.js 15+ (App Router) với TypeScript và Tailwind CSS:
  ```bash
  npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  ```
* [ ] **2.2.** Cấu hình bảng màu chuẩn nhận diện thương hiệu LY DATA trong `tailwind.config.ts`:
  * Primary Brand Color (Deep Navy / Royal Blue).
  * Secondary Accent Color (Vibrant Cyan / Teal).
  * Warning / Discount Color (Amber / Coral Red).
  * Neutral Grayscale (Slate / Charcoal).
* [ ] **2.3.** Nhúng Google Fonts (Inter / Outfit / Be Vietnam Pro) hỗ trợ tiếng Việt toàn diện với đầy đủ dấu thanh qua `next/font/google`.
* [ ] **2.4.** Xây dựng bộ icon SVG đồng bộ (Lucide React hoặc custom SVG từ Figma).

### [ ] Phase 3: Xây Dựng Tầng Tích Hợp Dữ Liệu & API Client
* [ ] **3.1.** Cài đặt thư viện Zod: `npm install zod`.
* [ ] **3.2.** Định nghĩa toàn bộ TypeScript Types và Zod Schemas trong `@/types/cms.ts` theo đặc tả ở Phần 7.3.
* [ ] **3.3.** Viết Data Access Layer `@/lib/sheets.ts` để đọc dữ liệu từ Public Google Sheets API / CSV Export URL.
* [ ] **3.4.** Xây dựng cơ chế Parser an toàn:
  * [ ] Xử lý tách chuỗi multiline (`\n`) thành mảng array cho các bullet points.
  * [ ] Chuyển đổi an toàn các cột dạng số và boolean (`TRUE/FALSE`).
  * [ ] Bắt lỗi dữ liệu bằng `schema.safeParse()`, ghi log cảnh báo và fallback dữ liệu an toàn.
* [ ] **3.5.** Xây dựng API Route `@/app/api/revalidate/route.ts` để nhận Webhook xác thực token và gọi `revalidatePath()`.

### [ ] Phase 4: Phát Triển Thư Viện UI Components Dùng Chung
* [ ] **4.1.** Top Promo Banner Component (`@/components/layout/TopBanner.tsx`):
  * [ ] Đồng hồ đếm ngược thời gian thực.
  * [ ] Nút đóng banner và lưu trạng thái vào `sessionStorage`.
* [ ] **4.2.** Header & Mobile Navigation Component (`@/components/layout/Navbar.tsx`):
  * [ ] Menu desktop với hiệu ứng hover và indicator.
  * [ ] Mobile Drawer Menu trượt mượt mà.
  * [ ] Nút CTA kích hoạt Modal tư vấn.
* [ ] **4.3.** Footer Component (`@/components/layout/Footer.tsx`): Đầy đủ các cột thông tin, chính sách và kênh mạng xã hội.
* [ ] **4.4.** Course Card Component (`@/components/cards/CourseCard.tsx`): Hiển thị ảnh bìa, badge, giá tiền, thời lượng và CTA.
* [ ] **4.5.** Curriculum Accordion Component (`@/components/course/CurriculumAccordion.tsx`):
  * [ ] Đóng/mở từng buổi học có chuyển động êm ái (`transition-all`).
  * [ ] Nút *"Mở rộng tất cả (Expand all)"* và *"Thu gọn tất cả (Collapse all)"*.
* [ ] **4.6.** Packages & Pricing Table Component (`@/components/course/PricingTable.tsx`):
  * [ ] Bảng so sánh 2 - 3 gói với biểu tượng tick xanh / gạch chéo đỏ.
  * [ ] Hiệu ứng viền nổi bật cho gói phổ biến (`is_popular = TRUE`).
* [ ] **4.7.** Testimonial Card & Grid Component (`@/components/cards/TestimonialCard.tsx`).
* [ ] **4.8.** Student Project Showcase Component (`@/components/cards/ProjectCard.tsx`).
* [ ] **4.9.** Partners Infinite Marquee Component (`@/components/home/PartnersMarquee.tsx`).
* [ ] **4.10.** Lead Consultation Modal Component (`@/components/modal/LeadModal.tsx`):
  * [ ] Biểu mẫu với 7 trường nhập liệu chuẩn hóa.
  * [ ] Inline validation theo Zod schema.
  * [ ] Honeypot chống bot tự động.
  * [ ] Xử lý 4 trạng thái: Idle, Loading spinner, Success screen, Error notification.

### [ ] Phase 5: Lắp Ráp & Hoàn Thiện Các Trang Giao Diện (Pages)
* [ ] **5.1. Trang Chủ (`/app/page.tsx`):**
  * [ ] Hero Section + Stats counters.
  * [ ] Trust Bar (Partners logo).
  * [ ] Khối giá trị cốt lõi / phương pháp đào tạo.
  * [ ] Khối danh sách khóa học nổi bật.
  * [ ] Khối thư viện dự án thực tế của học viên.
  * [ ] Khối 9 đánh giá học viên (Testimonials grid).
  * [ ] Khối 3 bài viết blog mới nhất.
  * [ ] Bottom CTA banner.
* [ ] **5.2. Trang Chi Tiết Khóa Học (`/app/courses/[slug]/page.tsx`):**
  * [ ] Cấu hình hàm `generateStaticParams()` để sinh trước toàn bộ các trang tĩnh của từng khóa học tại thời điểm build.
  * [ ] Course Hero + Sticky Enrollment Card.
  * [ ] Curriculum Accordion chi tiết 12 buổi học.
  * [ ] Bảng học phí và combo ưu đãi.
  * [ ] Hồ sơ giảng viên phụ trách.
  * [ ] Khối FAQ câu hỏi thường gặp.
* [ ] **5.3. Trang Giới Thiệu (`/app/about/page.tsx`):**
  * [ ] Câu chuyện sáng lập & triết lý đào tạo thực chiến.
  * [ ] Timeline sự nghiệp của Mentor Hứa Thảo Ly.
  * [ ] Quy trình 4 bước đào tạo độc quyền.
* [ ] **5.4. Trang Danh Sách Blog (`/app/blog/page.tsx`):**
  * [ ] Bộ lọc chuyên mục.
  * [ ] Lưới danh sách bài viết phân trang.
* [ ] **5.5. Trang Đọc Bài Viết Chi Tiết (`/app/blog/[slug]/page.tsx`):**
  * [ ] Cấu hình hàm `generateStaticParams()`.
  * [ ] Trình render Markdown với Syntax Highlighting cho khối code SQL/Python.
  * [ ] Nút Copy Code 1-click.
  * [ ] Thanh Reading Progress Bar.
  * [ ] Khối bài viết liên quan & Author Box.
* [ ] **5.6. Trang 404 Not Found (`/app/not-found.tsx`):** Giao diện chuẩn thương hiệu LY DATA với nút quay về Trang chủ.

### [ ] Phase 6: Triển Khai Luồng Thu Thập Leads & API Xử Lý
* [ ] **6.1.** Xây dựng API Route Backend `@/app/api/leads/route.ts`:
  * [ ] Kiểm tra Honeypot (nếu có giá trị -> trả về HTTP 200 giả nhưng không lưu).
  * [ ] Kiểm tra Rate Limiting theo Client IP.
  * [ ] Validate dữ liệu đầu vào qua `LeadSubmissionSchema.safeParse()`.
  * [ ] Gửi request mã hóa kèm secret token sang Google Apps Script Webhook.
  * [ ] Bắt lỗi mạng, tự động thử lại (Auto-retry 3 lần) nếu Google Sheets phản hồi chậm.
* [ ] **6.2.** Kiểm thử luồng gửi dữ liệu:
  * [ ] Đăng ký thử từ website -> Kiểm tra dữ liệu ghi ngay lập tức vào file `Private Leads Sheet`.
  * [ ] Kiểm tra email thông báo gửi về Gmail tức thì.
  * [ ] Thử bấm liên tục 5 lần -> Kiểm tra hệ thống chỉ ghi nhận 1 dòng duy nhất (Anti-duplicate).

### [ ] Phase 7: Cấu Hình SEO, Social Preview & Đo Lường Marketing
* [ ] **7.1.** Cấu hình thẻ Meta Title & Description động theo từng trang bằng hàm `generateMetadata()`.
* [ ] **7.2.** Tạo ảnh OpenGraph chuẩn kích thước `1200x630px` lưu trên CDN.
* [ ] **7.3.** Tích hợp mã Schema.org JSON-LD cho `Course`, `EducationalOrganization`, `Person`, `BlogPosting`.
* [ ] **7.4.** Tự động sinh `sitemap.xml` và `robots.txt` qua file `@/app/sitemap.ts` và `@/app/robots.ts`.
* [ ] **7.5.** Tích hợp Google Tag Manager (GTM) / Google Analytics 4 (GA4) qua biến môi trường `NEXT_PUBLIC_GA_ID`.
* [ ] **7.6.** Bắn sự kiện chuyển đổi `submit_lead_success` phục vụ tối ưu hóa quảng cáo Facebook Ads / Google Ads.

### [ ] Phase 8: Kiểm Thử Toàn Diện, Tối Ưu Hóa & Nghiệm Thu Bàn Giao
* [ ] **8.1.** Kiểm thử Responsive trên toàn bộ các kích thước màn hình: Desktop (1440px, 1920px), Laptop (1280px), Tablet (768px, 1024px), Mobile (375px, 390px, 414px).
* [ ] **8.2.** Kiểm thử tương thích đa trình duyệt: Google Chrome, Apple Safari (iOS/macOS), Microsoft Edge, Mozilla Firefox, Cốc Cốc.
* [ ] **8.3.** Chạy công cụ kiểm toán **Google Lighthouse Audits**:
  * [ ] Performance: `>= 90 điểm`.
  * [ ] Accessibility: `>= 95 điểm`.
  * [ ] Best Practices: `>= 95 điểm`.
  * [ ] SEO: `100 điểm`.
* [ ] **8.4.** Kiểm thử chức năng quản trị Google Sheets của Client:
  * [ ] Chị Ly thử thêm 1 khóa học mới -> Bấm "Xuất bản" -> Kiểm tra website hiển thị đúng.
  * [ ] Chị Ly thử sửa giá tiền -> Bấm "Xuất bản" -> Kiểm tra website đổi giá sau 1-2 giây.
  * [ ] Chị Ly thử cố tình nhập sai định dạng -> Kiểm tra form Sidebar báo lỗi đỏ từ chối lưu.
* [ ] **8.5.** Bàn giao mã nguồn GitHub, tài khoản Vercel, tài liệu hướng dẫn và video đào tạo vận hành.

---

## 10. TIÊU CHÍ NGHIỆM THU DỰ ÁN (DEFINITION OF DONE - ACCEPTANCE CRITERIA)

Dự án được coi là hoàn thành xuất sắc và đủ điều kiện nghiệm thu thanh toán khi đáp ứng đầy đủ 7 tiêu chí cốt lõi sau:

1. **Khớp 100% Bản Thiết Kế Figma:** Toàn bộ màu sắc, typography, khoảng cách (spacing), hiệu ứng chuyển động và bố cục trên 4 trang (Homepage, Course Detail, About Me, Blog) đều chuẩn xác theo từng pixel so với Figma.
2. **Quản Trị Nội Dung Độc Lập Qua Google Sheets:** Client tự thao tác Thêm - Sửa - Xóa - Ẩn khóa học, lộ trình, giá combo, review, blog trên Google Sheets mà không cần lập trình viên can thiệp.
3. **Bảo Mật Tách Biệt 2 File:** File thông tin học viên (Leads) tuyệt đối độc lập, mã hóa đầu vào, không rò rỉ bất kỳ API công khai nào có thể đọc danh sách học viên.
4. **Tốc Độ Tải Trang Đạt Chuẩn Core Web Vitals:** Điểm số Google PageSpeed trên 90 điểm, thời gian mở trang thực tế dưới 1.2 giây trên mạng 4G/5G.
5. **Form Đăng Ký Tư Vấn Hoạt Động Hoàn Hảo:** Bắt lỗi chính xác số điện thoại và email, chống spam bot, tự động lưu vào Sheets và bắn email thông báo lập tức.
6. **SEO & Social Share Đạt Chuẩn:** Gửi link website lên Facebook/Zalo hiển thị ảnh preview lớn sắc nét, đầy đủ sitemap và cấu trúc dữ liệu Schema.org.
7. **Bàn Giao Toàn Quyền Sở Hữu:** Bàn giao toàn bộ mã nguồn trên kho GitHub cá nhân của Chị Ly, tên miền và quyền quản trị máy chủ lưu trữ.

---

[image1]: <data:image/png;base64,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FOWnpvOHAQAgCiDjLEBlDAAIm0J1ivJT46o6AEBUQMZZQLfQLC4u5mkAAMgayFgCd2IDAEQFZJwFuFEQANGzadMm54MPPkBYHDooZYyndwAQHyBj+0MHpYx1qaysxGlwAERMOhkPHXyvc8pJddwQuSVLlvraFLydSdzSb1ggxyOX5evGWWc09MZffumVwHQ55s17O5C7bcDwQK6myORz6aCUse53Nji1DYDoSSfjF55/2de+6cZB3nj9em2cv57eICBriocefMyXb92yhzuk9llnpqQncnLfVi26+5bX/KoS33w0vmLFisBrUvz5v+v6ljXwtru8afUvae17vX59hwTeBw2nPT7DG7+8YTt3+NZbC9zchAlT3DbJuKRzHze3cOEiN0cypvazM5/3LbP44ha+tvy+xbjqs/DQASYFIOakkzGP66+91RuvXesq5+KLmrnj6WTS45p+7pBk3P7q65R9+9881Ne+uLZ6mbK4Hpv6lDv+zIznfH1IxnJflYz58nhbFma6oVwZ82l8eHWbXq6w5dd7dMqTgdeqKXRQyli32kVlDED0ZCtjMc6FItp3DR/lDkVlrOory3j2rBedF1+c4+snhuecdXlg/hlPz/Yt69qeA3x9uIxJjHPnvBZYDsXDDz3uzHn5VS8vqnvRd9myZW5QWyVj8TUFf99Lly5zxo+b7Hs9+X3y95EudIBJAYg56WQsC4WGTz89y+nV8xbnogua1Cjj5cuXu8OpU6dXK2PxHbQQK5cZDcvLF7rDt98u983PZSy/LrUfeWSas+DEPCTjWuc1dl577U2faOU47+wrnCemPeMtq86FTb1xep+ioiUZt2x+jfPU9Ge95aSTsTwccc9Y57nZZb73y6vmdKGDUsa61S4qYwCiJ52M4xo6cotb6ACTAhBzkibjK6/oGMjFPXRQyli32kVlDED0JE3GSQwdYFIAYg5kbH/ooJSxbrWLyhiA6CkkGYsf4eIWOihNihsFARAf4irj0aMedIfi/GI5VD/iXdfrVuf9998P5OMQOihlrFvtojIGIHpsl7GQbreSm5z33nvP6X39QG8ajV/bq+q8XTlIxnSl3htvzPdy3Ur6uucTi/aA/qVO1y59AvPaGDooTYobBQEQH2yXsahyn3yi6hzgTh16B/rwUJ3ny6ela9sYOihlrFvtojIGIHriJuPOHXu7wzP+cql7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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnAAAAHtCAYAAACZA0OjAAB61UlEQVR4Xuydd7AV1Zb/X9W8mZqq38ybmar5Z6qmav6YGp8K5vTwieQkKIqgRAFBRckgJpQgIqCYyKiYxYwBVBBQwYCiGMggOWcuSdLF/p3V566+u1ev7nPuvae7z+3+fqp2nb3X2nt3n+51dn9Pp/0nCwAAAAAAVCv+JA0AAAAAAKC4gYADAAAAAKhmQMABAAAAAFQzIOAAAAAAAKoZEHAAAAAAANUMCDgAEspZZ9VGQpJhAQBICBBwACQUeSBHSmcCACQTCDgAEgoO4OkG+x+AZAMBB0BCwQE83fD+P3z4sJMAAMkBAg6AhAIBl254/5eUlDgJAJAcIOAASCgQcOkGAg6AZAMBB0BCgYBLNxBwACQbCDgAEgoEXLqBgAMg2UDAAZBQIODSDQQcAMkGAg6AhAIBl24g4ABINhBwACQUCLh0AwEHQLKBgAMgoUDApRsIOACSDQQcAAkFAi7dQMABkGwg4ABIKBBw6QYCDoBkAwEHQEKpbgLu0KHD1tQpr1qlpWekK3ZKS0utzZu2SnNRAwEHQLKBgAMgoRSLgDv7/2pbPe98wGXbumWHbe/XZ4jLTpA9FwcOlNj1zBQme/fsD30ZhQYCDoBkAwEHQEIpJgEnxQ/bpICj8h9//OGyaVDbkpLyydkvvqCx4S08EHAAgGIDAg6AhFJsAu6Zp56zyzt37rbLN7e+wyXgzLNpp0+fti+paqLpqitbWhfUbOiy3XnHva6y2dc1TTr6+upc1cqxnzp1yuXjRGgCTqtXTEDAAZBsIOAASCjFJODW/bbRETn02b/PUPuTBRzla195vZ1/951ZdvnMmTPW3y5r7vTDXHxhY6tVy27S7HDeufWtNq1us/OnT5e6xFWThu2sq2q1dMqmj/KHjLN6pk8KODpLKNueOHHCKRcDEHAAJBsIOAASSjEJOP4kUWaWTQFnQuVRj463jhw56rITtoC7PivgRo54xq7LiZB9NWvSwTp+PCuupK/LLX2tVat+U31BAu7mNj2sxYt/ccoLvlxkTRj3glMuBiDgAEg2EHAAJJRiE3AkcijfresAxx4k4Lp1HeiyMZdc2MRqeW1Xl+3KK6518rKvLp36WseO/a76Hn1knPXrLyvsfO+eD7rEYJCAo3Vo3qyTdW3zzk6aPPFlx18MQMABkGwg4ABIKMUm4LR8kICb+dFnLhvTtHF7T/0gAVfj7DrW6VOnVV/Nc+pZe3bvc8rk37Nnn3PGjpECbuCA4dYLz083ahQfEHAAJBsIOAASSjEKOBMp4CjRJVY6u+bXhiH/tOfesOhJ1I8+/MxVf8qUV+zyvLkLrSaN2rl878/41C7P/vRz6/rrvMuh8i8/L7fT1q07PL7Ot/R1lem9datW/mY9+cRUa926jeWViwAIOACSDQQcAAmlOgi4wfePdsrdbx1o2xrWu8mopUMv1mXRR2nO7C9d/jtvv9fxnTx5yuW75+4Rju/3skurxKaNW119Uhr96ATH/9XC71zfZc3q9a66xQYEHADJBgIOgIRSLAKuOvD7seOqCNNs1QUIOACSDQQcAAkFAq5ikFgbNvQJa/SoCXai8oiHn5LVqg0QcAAkGwg4ABIKBFzFoPvv6J62KZNfsVNJySFZpVoBAQdAsoGAAyChQMClGwg4AJINBBwACQUCLt1AwAGQbCDgAEgoEHDpBgIOgGQDAQdAQoGASzcQcAAkGwg4ABIKBFy6gYADINlAwAGQUMIScKWnS60Vy9dYJ064p5sq1nem0dOli75dYk+RlSYg4ABINhBwACSUMAScnKnAFG1hCLjrWnS2Lru4mTTnzfk1Gviub2WhPrp1HSDNlaYQ66QBAQdAsoGAAyChhCXg/Mqc/+OPP6wtm7c7dpOJE16SJgfy0dkykyABt3XLDuuzOQuk2WHM6ImB60vQ8ma896nLZkLzoS5busplCxJwC75cZH35xbfS7PDTT8ukybNOhQICDoBkAwEHQEKJQsCZkK/OVTc4Z7pqnlPP5aPEk8t//dVir69hW/vzjekf2Pb+fYc6Pk6yDadDhw47PqZxg7bWOWdd7bKZE9TLPujlvabv7v7DPcuWbdhu+mqcXcdlJ0Er2xw+dMTVhtOhEu/3qCwQcAAkGwg4ABJKWAKO0lW1WkqXbV+9ep2dX/z9zx5xw3y36CdfnyxrZ+BKDh7ytNGod/WN1oXnNZRmm9WrfnP1se63jZ51euuND11lMy/PwM39bKHVrEkHp0x1pr/+vp1nAWf6ut860FUOAwg4AJINBBwACSUMAUesWbPeFkYkPK6+6gbHbgqRrVu2e0TLhvWbnZSvTxNwBNWh9PGsedLlECTgRj7yjEc4yXUykT4p4Hr3HGz9+MOvru/Qt/dDtk8TcN26QsABAKoGBBwACSUsAWcihQmjCTg/gnwk4C65qIk0Oyxfvtpuf0PLbtJlNWvc3rfvRx8Z5/EFra/0derQ2/CSgHvQ2rNbf8oVAg4AEAYQcAAklLAFXGnpGY8wYXIJOPNhBekjwcNoDyJMnviyq3x+jfqeOsQvv6zw2E+fPm1/7t611+V76slnA9fXLDesd5PHv+THpR4bf498BNyGDZudcqGAgAMg2UDAAZBQwhBwJDbM1LFdT5ePkQKOHmiQbRkWYJqPkPb6dVp76peWlrraMLKe2be0b9lS/uSsWc+vnKu/t9/8yLbnEnADjYcl8BADACBfIOAASChhCDji2LHfrVWrfpPmvDhx4qR1+rQutsh38uQpafaF6voJNxM66zZv7kJ7vSUkriqyzFzQd6PvUQxAwAGQbCDgAEgoYQk4UD2AgAMg2UDAAZBQIODSDQQcAMkGAg6AhAIBl24g4ABINhBwACQUCLh0AwEHQLKBgAMgoUDApRsIOACSDQQcAAkFAi7dQMABkGwg4ABIKBBw6QYCDoBkAwEHQEKBgEs3EHAAJBsIOAASCgRcuoGAAyDZQMABkFAg4NINBBwAyQYCDoCEAgGXbiDgAEg2EHAAJBQIuHQDAQdAsoGAAyChQMClGwg4AJINBBwACYUP4NNffx8phQkCDoBkAwEHQELhAzhSuhMEHADJBAIOgJRgHsjTkP70pz/ZSdrTnAAAyQECDoCUIA/mSU8QcN4EAEgOEHAApAR5ME96goDzJgBAcoCAAyAlnDlzJlWJBZy0pzkBAJIDBBwAIJGwgAMAgCSC0Q0AkEgg4AAASQajGwAgkUDAAQCSDEY3AEAigYADACQZjG4AgEQCAQcASDIY3QAAiQQCDgCQZDC6AQASCQQcACDJYHQDACQSCDgAQJLB6AYASCQQcACAJIPRDQCQSCDgAABJBqMbACCRQMABAJIMRjcAQCKBgAMAJBmMbgCARAIBBwBIMhjdAACJBAIOAJBkMLoBABIJBBwAIMlgdAMAJBIIOABAksHoBgBIBAMHDnQlFnDSDgAASQACDgCQCFiw5UoAAJAEMJoBABLB0aNHPWJNpr1798pmAABQLYGAAwAkhnvvvdcj2jjdd999sjoAAFRbIOAAAIlCCjdOAACQJDCqAQASRWlpqUe8nTx5UlYDAIBqDQQcACBxSAEHAABJAyMbACCRQLwBAJIMRjcAQCKpW7eu1aRJE2kGAIBEAAEHAAAAAFDNgIADAAAAAKhmQMABAAAAAFQzIOAASChnnVUbCUmGBQAgIUDAAZBQ+ABe45y6SClMEHAAJBsIOAASCg7g6Qb7H4BkAwEHQELBATzd8P4vKSlxEgAgOUDAAZBQIODSDQQcAMkGAg6AhAIBl24g4ABINhBwACQUCLh0AwEHQLKBgAMgoUDApRsIOACSDQQcAAkFAi7dQMABkGwg4ABIKBBw6QYCDoBkAwEHQEKBgEs3EHAAJBsIOAASCgRcuoGAAyDZQMABkFAg4NINBBwAyQYCDoCEUiwC7ty/1rEOHjwkzSBkIOAASDYQcAAklGIRcA8Pf1Kaqj1PP/mcNBUdEHAAJBsIOAASStgCjs6snf1/tV1p5cq1rjp1a7ey7X/88YfLXhl4GRI/e5iYy2vaqL1n+VQePvQJl23Llu2eemECAQdAsoGAAyChhC3gCBIke/fud5WZkydPWevWbbTz/FkVWKht37bTZbvs4maRCiMil4AjyHbmzBlXed++A0aNcIGAAyDZQMABkFDiEnCnT5+28+OenuaILlt4bd9l279a+L1dbta4g+PbuWO3k/eDfCOGP+WqQ/k9u/e5bL3vGuxargmVO7Tr6fh63H6vy2ciyyamz0/ANajbxrE3anCzfcYySiDgAEg2EHAAJJSoBNyOjPg6deqUNWzIWI+4YkgocZkFXOeOfZx6Nc6uY+e7dR1gTZ70Cjdzwe358/57H7XzPy1Z5rvcK6+41uO7vdsgO79o0RKPz0SW/fATcATZ6fKxnz9MIOAASDYQcAAklKgEXP++Q20xdUHNBh6hcvz4CWvuZwttO/tYwDFm/sMP5lhPPD7FKZtwvZtb35ERfHWd8qyP5jr5t9/6yM6vXbPeTmsyyW9ZshzkCyJIwJGwJd+c2V9KV+hAwAGQbCDgAEgoUQk4eQn1229+cPKULjq/kbVzZ/YSKVFVAcd5Lr8x/QMn//abWQHXt/dDrmS2M5F9msiyH0ECjgjyhQkEHADJBgIOgIQSl4D7eOY865aOfaxzzrrasX/7zY8FF3CbN2+z86++8q7jW758daBgkj7ZJzNyxDOeun5IASfbyXJUQMABkGwg4ABIKFEJuGuvucW64bpb7TyLlamTX7XzR44ctc6cyd4Dxr5CCDgTU8ARlL+mSQfr7bdmWh3b9fL4TKTvuhZd7M9JE1721PWDBVyLZp3sJNvJclRAwAGQbCDgAEgoUQi4XNBrNArxDriKQsvkVBHM135UdyDgAEg2EHAAJJRiEHAgPiDgAEg2EHAAJBQIuHQDAQdAsoGAAyChQMClGwg4AJINBBwACQUCLt1AwAGQbCDgAEgoEHDpBgIOgGQDAQdAQoGASzcQcAAkGwg4ABIKBFy6gYADINlAwAGQUCDg0g0EHADJBgIOgIQCAafz4ANjrHlzv5LmvJn96RfWi9PelObYZlzwAwIOgGQDAQdAQikmAff778dtgaMlibTL+tLfu+dgj02jbu0b7To1z6nn1OeZF7T2GzZstm07tu9ybFzvgpoN7M9PPp7v8hUTEHAAJBsIOAASSjEJOKJPrwc9IkeWr/77DdbqVets+5CHHnf5SktLPfUJsh08eEj1mUg/lalPzmt+U8DRnK9Hjxxz+T+eOc9VLiYg4ABINhBwACSU6iDgzv1rHVeZ/XSZU9YNEnD8+cpL7whvll9+XuFpe/z3406efN9//7PVvGlHu0xn5qSA69KpnzX+mWlOG4nsP24g4ABINhBwACSU6iDgLjyvoavMfpqEXtbVBNy1zW9xbC2adfL4mSU/LvX1EaYIJGqcXdfq2rmfS8Cxn9KDg8c4tmIFAg6AZAMBB0BCqW4CrtblLWz/yEeesZOsqwk4KvfvO9S3DZOvgDvnrKutvr0fcgk6U8Ax9BAE+d5840PpKhog4ABINhBwACSU6iDgzDKf3TLT559/4/j9BJxMn8//2lWHOHzoiKetCftKS7OXTju27+XYNQFHXH5Js8A+4wYCDoBkAwEHQEIpdgG3bt0mV1mKIXkZVQq4fn2GeNpc16Kz5746huquzyzTZO+e/Y6Pue/ekU7eFHAtW3Rx7OxrWP8ml62YgIADINlAwAGQUIpVwJlp8sSXbd+YURM8YowIEnCUp3eymdCDCVo/BF1qlcs/VHLY9vm1MQXc+TWyrw4xUzEDAQdAsoGAAyChFJuAA9ECAQdAsoGAAyChQMClGwg4AJINBBwACQUCLt1AwAGQbCDgAEgoEHDpBgIOgGQDAQdAQoGASzcQcAAkGwg4ABIKBFy6gYADINlAwAGQUCDg0g0EHADJBgIOgIQCAZduIOAASDYQcAAkFAi4dAMBB0CygYADIKFAwKUbCDgAkg0EHAAJBQIu3UDAAZBsIOAASCgQcOkGAg6AZAMBB0BCgYBLNxBwACQbCDgAEgoEXLqBgAMg2UDAAZBQ+ACOlO4EAQdAMoGAAyChyAM5UjoTBBwAyQQCDoCUYB7Iw05/+tOfrH/913/12KuaqF9K0l7VFFa///Iv/xJKv5VNAIDkAAEHQEqQB/MwEwRcNkHAAQDCAgIOgJQgD+ZhJgi4bIKAAwCEBQQcAKDgkGj5y1/+Is1VhoVWoQmrXxKxYfQLAAAYWQAABQcCLgsEHAAgLDCyAAAKDgRcFgg4AEBYYGQBABQcCLgsEHAAgLDAyAIAKDgQcFkg4AAAYYGRBQBQcCDgskDAAQDCAiMLAKDgQMBlgYADAIQFRhYAQMEh0XLNNddIc5UJS2iF1S9tgzD6BQAAjCwAgIJDomXUqFHSXGXCElph9btw4cJQ+gUAAIwsAICCMm7cuNBES1hCK6x+Cep3/Pjx0gwAAFUinBELAJBawhZDYfQdVr9EmH0DANILRhUAQEHo379/6GIlrP7D6pfh/nv27CldAABQKcIbsRIED75ISEjB6b/+67/kz6eg8HIKTVj9mshthYSE5J9AbrCVAmjXrp0roP785z/bZxmQkJDK05tvvmlt3rxZ/nxCIazBPax+NbZu3WpvM7kdkZDSnv7hH/7Bdcxt3769/PkAg2hGrGrInj17Ih3UAQC5Ces3GVa/AIDKwb9JOhYDHYxYPnDwlJaWShcAICbCElph9QsAqBxnzpzB7zIH2DI+UNBceeWV0gwAiJGwBvSw+gUAVJ7/+Z//we8yAGwZhTlz5thBQ58AgOIhLKEVVr8AgMrDx+LPPvtMuoAFAacyaNAgO2joFC4AoHgIS2iF1S8AoPLwZdR77rlHuoAFAacycOBADOYAFCFhCa2w+gUAVA36Xd59993SDCwIOBUIOACKk7CEVlj9AgCqBgScPxixFCDgAChOwhJaYfULAKgaEHD+YMRSgIADoDgJS2iF1S8AoGpAwPmDEUsBAg6A4iQsoRVWvwCAqgEB5w9GLAUIOACKk7CEVlj9AgCqBgScPxixFCDgAChO6Hd51llnSXOVoT7xmweg+ICA8wcjlgIEHADFx6ZNm0L9XVLfmzdvlmYAQIxAwPkT3mhYjYGAA6C42LdvX+iXObn/tWvXShcAICYg4PwJbzSsxkDAAVAc9OvXzxFWUfwmzWU99dRT0g0AiBgIOH/CHxGrIRBwoJj4/vvvXcIirSkq5HLTmDZs2CA3CwCxQPEIAacT3ahYjYCAA8WCeVCdNm2adANQUKZMmeKKOQDiBgLOH/xCFSDgQDFw6NAhOw7vvPNO6QIgVHr06GHHHsUgAHECAecPVIoCBBwoBnAWBMQJ4g8UAxBw/uDXqQABB4oBisG9e/dKMwCRsHz5coyDIHYg4PzBrzPDxx9/7PzbDEr/+7//K5sCUBD+8pe/eOJNS+PHj5dNASgICxYs8MSblv77v/9bNgWgIPzXf/2XJ960NHbsWNk0lUDAlSEDREsAhImMNy0BECYy3rQEQJjIeNMSyIItUcall17qCRIzLVu2TDYBoKDMnDnTE3dm6tKli2wCQEGpVauWJ+7MtGTJEtkEgIIyf/58T9yZqW3btrJJaoGAM/jzn//sCRZKjRo1klUBCIUaNWp44o/S//t//09WBSAU/vEf/9ETf5Rq164tqwIQCldccYUn/ij98z//s6yaaiDgBDJgKAEQJTL+EIMgamT8IQZB1Mj4Qwx6wRYRNGnSBEEDYkXG39ChQ2UVAEKlRYsWnjgEIEpk/A0aNEhWST34VSpg0AJxw/GHS6cgLij2MA6COMGxOBhsFYWJEyfaAfPHH39IFwCRgUELxA3GQRA3FIOzZ8+WZmBBwPmCgyeIG8QgiBvEIIgbxKA/2DIAAAAAANUMCDgAAAAAgGqGr4CrV6c1UspT3Mj1QUpfihu5PkjpS3Ej1wcpfckPXwF31lm1kVKe4kauD1L6UtzI9UFKX4obuT5I6Ut+BAq4v/71amkGKSBX0EQFrcOOHbukGaSAYorBYlgPED3bt+8sin2PGEwvufY9BBzwkCtoogICLr0UUwwWw3qA6IGAA3GTa99DwAEPHDQlJSVOigMIuPSixeDhw4dltdDJNYCC5MICrhjGQcRgOtHGwUOHDjl+CDjgQQuaOICASy9aDELAgSiBgANxo42DEHAgEC1o4gACLr1oMQgBB6IEAg7EjTYOQsCBQLSgiQMIuPSixSAEHIgSCDgQN9o4CAEHAtGCJg4g4NKLFoMQcCBKIOBA3GjjIAQcCEQLmjiAgEsvWgxCwIEogYADcaONgxBwIBAtaOIAAi69aDEIAQeiBAIOxI02DkLAgUC0oIkDCLj0osUgBByIEgg4EDfaOAgBBwLRgiYOIODSixaDEHAgSiDgQNxo4yAEHAhEC5o4gIBLL1oMQsAlmzVr1ltn/19tq9bl10pXLEDAAYJi8uILGktzJGjjYLUTcLQBKYFo0IImDopJwDVu2BYxGCFaDKZJwFGsnfvXOtKcKHbt3GOdPHnKZaPvfX6NBi5bXKRdwH0+/5vUj3kHD5TEug20cbBoBNyvv6yw5s1d6EmSODcgcerUaeuuO+6T5pyY6z1/3lfqd5un2Js362S37XH7vS57VGhBEwdRCLhDJYc98Sf3R2npGXt//PHHHy57VOzff8Bq3rSjdUHNBtbUya9KdyBmDH7z9Q+e70Zo37lp4/Z225KD5YNFlGgxmAQBJ+NM2/b3DRoZ65g3oN8w6/JLrrEa1G1jnTmTf8zfmRkjzfWW3+uXn5e7bFT341nzjBqWVfOcetaxY7+7bHGRZAEn40+LQ9o/q1f95rLFgVyvXNB67961187PnbMgc/x2/0mg/jZu3OKy+dGkUTs7JiUVXafKoo2DRSPgWrfqbp1z1tV2oo3OeZNLL2rqKscBrVtlBlSzDffx05KlRg29bxIKZPt8/tcue1RoQRMHUQi4Tz6Zr8ZgaWmpU4dicN/eA0ar6Pjyi2/t9bro/EbWtdfcosZLEGbdSy5sYpevuLS5UUOPQbbHhRaDSRBwZqyZ8WYS55jH63TJRU2sC89raJe3bdspq6mMfWyKK2Yo7/yO/siWV61c6/glXD/OuDNJsoDTxjwzDn///bg1fOgTRot48BubgjDP4PKx1ESW/Vi5Yq1d98YbunvOhufbR1XRxsGiEXAmcoNs3LDFPuNA9ob1b3L5iE8+nm/7apxd13ManrimSUdpcmxrVq9zqfKvv1rs5CW8XnL9iNdefdda/P3P0uxgtqH8pk3bXLb6dVrbgSH7fvCBMdagu0fYPyLihutudfnDRguaOIhCwJnI/XD8+AlnAKFYPHPmjMv/zFPPOf4tm7e5fATF2969+z02gmJuy+btjp3Ku3dn/zXmwlxPisHXXn3P8Lox65KAu/ce99kd+qfa/ua7PN993DPTrLt63O+UKQa//+4no0a4aDGYBAHHdL91oGebL/nxVyeeOrS9y+UjGtW/2fbRftTOBssxb9euPa54M5FlP0jENWvcwc7TmTGKNz8+m/Ol6ztRngUc5T/8YI6dp37oDC8lk4MHD1mdOvS25s39ymXn70B9XHR+9l6kz+YscPUfBkkWcIyMQaLXXQ84cbjut40uH42JfMx6f8YnLh/xw+JfrOZNO7lstP9Wr1pn52XcUX0/7uh+j7p+n37yeWAcXlWrpavM34Xz9B0Y+Ztp0cy97mNGT7Ru7TrAdcaN2lA/9MkpLLRxsFoIOCrfeH03+xS7uQOIyy5uapcnTXw5s/E62GJO8tyzr1tXXlF+M6ypxAf2H+Y6oyKXbcIDpVaHbLd2HiDNDldceo2Tp7rffbfE/vyt7EdB+RMnTrr6pvyggQ9b48e9YOenPTddXXaYaEETB3ELuCmTXrb69nrQ+vTTL+zT6KZ/6pRX7fLrr82w+vUe4mlLNGnYzvWvdtmyVU49+pw4/kXHR+X3Z3zqlP2Qgp/y2rIZMwbpwN+pfS/Xv0lzfUxb7Suvt2Z+9Jmd37tnv/0Z5RlhLQaTLuCoPDkzpr379izPfuXy7MzB65ILG1tbt+4wWpbXmfFe+UHV7ENbVj5QvR9/+NXO78qI/aB2dFlKjnkksCaMf8EWggyNef36un8zg+8fZZcXLPhO/e7n1ahv/6mgfIN6N2ViuPwsZlikUcCRuCbb65k/ha1b3ebxU5n25cyP5np8jLTLfcnQsbXOVa2csoTqHj50RJqtNjfe7lmGyW2Z35YJ3wJDyHZBZco/MuJp65WX37HzCzOxSbRs0cUu0yensNDGwWoh4CRyw8qzIRpmm5tb32HflElURMAxWh3tX7Af1H766zOsYUPG2vnly1Z7guq2bne7lrNj+y67bA6KUaAFTRzELeAkMgbzQbbhsxmUr6iAOz9zEJPLpRjMNw5JwNFZD6rPMSVj8Oefl1vnnVt+z0fvnoNtnykMokCLwaQLOBMa32Ts5OKO29xnLCi/b192nJPtZdmEfJxkbMlyENQ+6JKoXFcSdmb5i8+z4zXl+cwN5el2AuLjWfN9+y4EaRRwEvLzfYqUz+fyPtUzj89yPzNBAo7ul+T9TMh2FYlDolGD7NnrpUtXuezy+3OZnoimEykMnR1ub5wVl+3CQhsHq4WAM+/34cTIun5QPTp7wHmmUAKuIlD7x8ZMcvKUeMDivunziccnO21MX5RoQRMHcQu411+dUZAYHDH8KSdv2vMVcHywf/7Z6dJVIUjA/e2y7P1v/H2Gld3nwuvW9qYeGaHk/teb73ctJFoMJl3A0cGxEPFGTH/9/cD2suwH1Rua+dNZGfg77M+ISPrzIZHrJ1Orlt3Uet0zf3QJupSW7/eoDGkUcEePHPPsh7fe/NCp++jIca76GnRLE/dLt57s2LHb8ZnL8xNwVblvzQ9qT2Od7CeofN652T/MnNq0ul2tFybaOFgtBFxQWfr8oMtXdLmVMNsMHDDcvj+Eyae/fOoEQe35QD70oexZONPHn3RpwKSqy60MWtDEQdwCLqgsfX7QfT9UlwY+2X70yPGusibgtm/bafvyOeOcCxJwlAjqU64PQU8gLl++2rHTE9j5ftdCosVg0gVcUFn6/KB6/Xo/ZH/27fWQy24iy34M7D8877oSatetS/YWE8r/+utKj1/LS2Q9CLjCIbcflfk4xWVTwN3efZDjC4L71fpnTp8uVQXckh+X2vVkoocJKgO357zf2UGzPGnCSy4fvU6ELikzsl1YaONgtRFw5g2wpp/y9eq0dspBT0lRXXrq7vrrujq256a+bnVo19NVJxdaHbIF3QNnQnXNH8Yh49o+9/3Lzytcy2ncIJ53j2lBEwfFJOBa3+C+H4TyDw1+zCl/9GH2Bm0Njt+ZH37m2PhsC3HkyFE7rwk4fhLQD+47H0wBR/9y9+7d5/jkdzPzl16UbRMlWgymScDJ/Ur5TZu2OmXtwS2CHoSRbQkqv/ZK9sbvUZk/DtLP0CuMTKgex0yue+AkVJfH8J533u9pK78fPUxjlvnMjawHAVc45PajMt1jRrzz9ky7PGbUBLt8bfPOdpkFED0h7wfVo1cQaf2beU3ASeQZuVz3wEnMuhs2bPasA/+WKM8+up1p1sy5rnrmQzdUpjN0YaONg9VGwHHiGyu5Dt9XwUl7iIEx22l2Si+9+LZ0O5j1ZF+Ur6yAMzH75Gv1cllRogVNHMQt4O4e8LCzH+geMPkgg19cSDQ/D0pm0gScrCP7kuUgTAEnMfugJ7u1ZUWJFoNpEHCc6P1r9Pn6a+/bPnqa2fRrDzEw2n6je8jYTvcWST9jLkP2UxUBx2WzvZnne/441bu6/A+6bAMBVzjk9qO44n1Qv24b6+myJ+3pbBnXN5Mf9A5T8jesf7PLTg8dclu6xyxsAXfheY2sO8RZQ2o7Z/aXTp6TeelX+vipZ4beYmH6w0IbB4tSwMUBbfidO8svpYIsWtDEQdQCLg7C/PFXZ7QYTJKAiwvEW/6kQcDFQdiiJ0lo4yAEXBkURHt2l19GAlm0oIkDCLj0osUgBFzVQbzlDwRcOEDA5Y82DkLAgUC0oImDNAg4oKPFIAQciBIIOBA32jgIAQcC0YImDiDg0osWgxBwIEog4EDcaOMgBBwIRAuaOICASy9aDELAgSiBgANxo42DEHAgEC1o4gACLr1oMQgBB6IEAg7EjTYOQsCBQLSgiQMIuPSixSAEHIgSCDgQN9o4CAFXzVizer00hYoWNHEAAZdetBiEgANRAgGXPo4cOWbtruD7DsNEGwch4MqgF0HO/WyhNEfCut82WrM+Kn/Tsx+fz/868mDSgiYOIOCsvGIkiWgxCAEXDjS+dOua3wvJ0wQEnJcHHxhjLf7+F2kuCMUy1tHvYeOGLS7bqpVrIz8OE9o4GJmA4/e9mKlpo/LpKMKG5kKlZZpvA+/X5yFnR+R6H8327btsf5db+kpXXlBbc2qawQ+MdpY3ftwLgctm8qlTaLSgiYMoBJyMz6i3Ny3v4gsbe2xaXoPXmSYMrwz59E8zM0SNFoNJEXAy3ijt2VP191HKPjnlgmd9qCw8Q0nQMtnuN6evbE+pcyf3uHvuX+vY9vff+0RdRqFJm4CT239g/2Gyig35vlu0RJpzIvvnZPrDRC5XW943X/+g+lat/M1jiwJtHIxMwBFxfGmGBJycNqYiAm7FijXO5759+4U3N9Q3C7jpr89wLStfARcHWtDEQRQCbuPGrbHuB45Bc25Lc32C1o3ikub243xlyNU/sTLz77Oy/VcWLQaTIuCYoG1fFbLxdFKaQ0V+F7NMom316nV2PiiOZB809+Q1TTu6bFGSNgF3+vRpq9X13Zwy7Y9ePQcbNazMb/CIPbVVVejd60HPviY0WyHR+pc2js/f1m6wTpyI9jekoY2DRSHgpj3/hnPwomT+M6PyoUOHHR/bli1d5dj6ZIKgScN2rjoSEnAPD3vS9k97frptG5D5V2H2SalNq+xE5bIftlF6aPAYl/348ROOjyad1yAfCzjK02lYhgXck2OnOv3Q/GqM35yo5nKlr1BoQRMHcQu4RvX1fUCX3TU75SeU7Ve2c/7o0d+deibkG/fMNE8/Zt6cd+/WLuWXum5qfYe6Hto8q34E+Wpfeb3T/tmpr0l3qGgxmAYBR7bpr7/v2m/57kuG6kgBZ7aXl0tN34PGOEfzP06c8JJ18QWNcy5b+szy0aPH8lp/zce2nj3uz8RA+f5nu9amUEDA1bZatXSXOVFMmHbpDyJIwNH8qFofZt+mj/J0OxJz5MhRT1tGs5Pthpa3usqc+E/10Ice9yw3KrRxsCgEHNn37z9o5/ftO+DZKZRI1LHaNzdgzzvvt/P33TPSmQRZgwQc1d2yeZtTZ9jQJ5w89znumRec8uNjJjn5SZnBizhUkhWTjLkuv/9+3Hf5ZCcBN2jgCE8dFnDXNu/s1CXBQPAkzeZ3/9vlLew82aTYLTRa0MRBnAJu6pRXPfu8xtl17DwLuAULvnP8XOfC8xo6eW7/XEb81CrbfxKuQ59ffrnIZeO8jAXTxwwbMtb+I0KwgFtTdtbjrszBj/4QaGjfneDLVQTdgkD5Rd/+KGqFhxaDaRFw55aNu/w7P3HihMt/S8c+TlmD6pgCbsXyNb5xIzF9PIE3HyApv3PHbsdvYrZ7+62PPMvj+KUDf/OmnRyfibZebPMTcJde1NSxFRoIOLr9KBuDV1zW3Fr66yqXz8yb+1jbjyZBAq5zWWzT+Fu3divHR38CGLpkz7FQJ1OHjvNMsyYd1L4Jzd7y2i6OnfqlE0OEpitkOQq0cTByAWcm024S5GMbD1xr1qzPWZ+gHdv2pjvtPNfhM39sk/3c1u1up8zwAZGRy6MyKX8J2UnA0WfJwfKNTshLqOa60Kd5/wefedQguxnchUALmjiIUsCZiSAB092Ihffe/djxsYCTyP3J+2Xr1h1qfYLtc2Z/6dr/0u9XZujPEPtkvBKyzATZzT8KHdv38q0bBloMpkXABXH1VTf4nvFnqA9TwMk+qXzpRU1cNsasy2fgTN/SX1c6ZRPymYnHQznOcV0Nzc42PwEn7x8tJGkUcOY+vHfQI7KKg7mv5H6TZUmQgDO58oprXWXm0UfG2Zc4Gbku69dvcsqm3UxMvz5DnLJcPpVfevFtVzlqtHEwcgGnIe1yJ0jIVhkBZz5EQPU2byo/Gyd3JuVZwLGP0tdfLfbUM6Gyn4CjRNfSZRs5sJnrQp8PD3/K8bGNuPrvN9j511+b4dxXZw5shUALmjiIUsBJyNa/71Cn/MvPy516YQg4zl92cTOPzUT6KLVt08PabJxlLpSAM9myZbvHFiZaDKZRwK1ft8m2TRz/ov17p/hoULeNq46E6ucScGzreks/+6zxKy+/YyezbkUFnFbWhL8sM5qdbZqAW7z4Z6ccBmkUcOYZOHMs6nH7vU7cvPjCW659JfebLEsqI+DI9+or79q/gU7te9sPFZg+LS/RfGTj5Ug/PbxF35uR/ijQxsFUCbhrmnRwylRv3979Tn36lP2YAs5E1jOhsnmZw7Q3L7sJ94KaDVztcgk409e96wCXj14twlAZAq7y+Ak42l9/r3WdU+5rPPwSloDjsuzHhMvdugyw3n/vU8duXiaTAk77A8FIO5fpk34rDB3k+RJyFGgxmEYBV+/q1i7bVbVaVkrA/WbcJ0TlkSOedvImZrkQAu6Tj+f7+iTSvmvnHsfWv+8Q+/1cjKwbBmkXcLSNeTvL7W2Wg3waFRVwMoboVSamgNuWGV/pOE+X5y+72P+SuuyfbceOZe9Pln4q+wnFqNDGwaIRcJRYzbcuu3+HfRKyVUbAmWfg3p/xqbNcwsxz2RRw774zy7cepa6d+2WW4faZkF2eAeS6QQKOAory9ATWU088a+d//PFXV70Xpr1pnXdufTt/fo36Tj+FQAuaOIhTwPE9EHQDK13OpjwJMSJMASefmpZ+Ln+18Hv7Mi/x/Xc/OXFBsIAj/5CyG3Dnzf2Ku3BBvls793cS90GXTzg/9rHJdv706fLX8YSNFoNpFHDPP/u6bXsx83unz79d1tz+XLpUF1IE+U0Bd/pU9tLY4PtHW3fekT2TwlC80cNgj44c58TQ7WVjYEUF3F097rMT92P6pr82wzpVth48rkrIR/cEU+I++ElAetqayrt27bHHaLP/sEijgCMBRPuw/c132dt45Yrsg3eU/+KLb+08CSu5f01kWVJRAcfxS5cz6Y813Scn63K87DX+dErI36FdTzvxA1p1riq/z+7JJ7IPFNL4SWe8tWVEjTYORirggqADwp7d+6r8WHJY0H1FNGBIeEfSzd0HDoT3oz506Ii1c6f3pmESeAcOZB8ACQMtaOIgCgGXi12Zf/0lJe77F4sFekqKbgmQvx/zDBwNaOYrSioKXTot9D2W+aDFYNIEXL7Q/tzh8/BARdidGWsPKuMVPURGD2OFCY2T9F7NqkB/qijeoyJtAi4X+/YeyMRQ+VnQqKE49SPoKkNF2ZoZ87RbouJAGweLRsBVB7Sg0GxJQguaOCgGAVfsaP8U5SXUqkD90B+JqNFiMK0CLglMmvhywWIyKiDgih8a6/gBrgtqZt8AkCS0cRACrgKY72ZjqttAVFG0oIkDCLjc0FkJGaOFFHCy76jQYhACrvpCMRlXLFUWCLjih14yTmNdoca7YkMbByHgQCBa0MQBBFx60WIQAg5ECQQciBttHISAA4FoQRMHEHDpRYtBCDgQJRBwIG60cRACDgSiBU0cQMClFy0GIeBAlEDAgbjRxkEIOBCIFjRxAAGXXrQYhIADUQIBB+JGGwch4EAgWtDEAQRcetFiEAIORAkEHIgbbRyEgAOBaEETB8Uk4OgppymTX5FmEBJaDELAgSiBgKs6x4+fSOwTolGgjYMQcCEw/fX3rZdeeEuaPY84U77W5S2MGsWHFjRxUEwCjqYiqshAlG9delGuOd9e3Dw39TVpshYv/sX1fejFxvl+v8qixWDaBNzt3Qd5tvOCLxep+6gi8EwvX5a9Wd+Pcc9M8yy/osjxrzJQ+xtv6C7NVe43FxBwVYf2Ufu22Vkd4oRmMGlU/2ZptqF1e/mld6S5KNDGwcQIOBkUhRgsmJYtuth90XRZJn7L0GwEvQXffBM+1WvSqJ1Ro/jQgiYOohBw9eu2sY7n+Rb6oQ+Ntadxywe/eJAUk4Dr12eIut70Di8zhumt/Vq9QqLFYBIF3JnS7JRtGqUZn5xFg8efyy+5xmWvCNS+W9eBrrIGvWNQLt+Pyy9pZl3XvLM0e8a/yuD3XkPNVkgg4HJD+2DYkCek2YZ8x49np0KjeUorM5ey3Mcc/9KWi1wCbu3aDdJcFGjjYKoEHE2FdGC/d9opmgCe5j6bNXOudNmQgBs4YLirP5or7vwa7knpCfpHu8OYJmbjhi322+vXrdtkJ9NHbdvdfKdTLka0oImDsAXc+sy+ufrvN9jz/VGeErFzx24n/9iYSdm667P7suRg+Y+H66xfv9l6cuwUx05wjGzfttMaM2qCy2diCjiaI5LmNZVQ/Bw54p3OiqZ8eXj4k9ZXC76XLhua/JvinBgzeqJj/+brxerUTLSteQoZinWKY5pTk+PYRP4GCo0Wg2kScNsycUPbfMvm7S47TWum/SYoPhmacuiUj2g6cvioZ3myTNC4ScvnGCc4T+PdsCFjHTvF4SUXNrGaNmrv+h1x3NAcqAR9so/mwNZincZjuprBifni82886ynLhQYCLje0D/wEHLF61Tp73m+adtKE42Du3IXWhx/McflMqH9zOkt5jH/n7VmuMon955+bbn23aIljI0wBR/NbHzTGcWpPl3qLEW0cTI2A47K0/7Z2o8t+Va2Wjo8hAdfq+m6e/uS/QbkM9r/6yruOralxxu2KS6+xJ6gvZrSgiYOwBZzcd7xf77jtHo+N8/TjN9vTgUvWZR9PmCx9JizgtHpnzmRjSfM9PPwpl/3N6R84Pubusj8gZjrv3Hqevh5/bJKrzt9rXWcLT8rP/vQLT31ClguNFoNpEnDtyiYTr1u7fLJtuS9NXPsz86fj119WGN5yaFxbuOA7l032RQwaOMKzHMqPenS8Zx1aXHOLum6cX7NmnV3eunWHp16zxh1sn/lGfbrFhD7p92PC/fqVCw0EXG5oH/gJON6fF1/Y2P6c+VH5yRIqX39tV6fOuX+tU97QgHznnJXVIRMyQpDOPNMYxtCE9+fXbGDnd+3c44otMz5IwNHVFtO3d0924nvK85+MYkMbBxMl4LREXHpRU9dE800bt8+o9ZlOu1zQQEfBQv82G5Ypd27Hn1LM0WliKtOlB7pniuuaAq46oAVNHIQt4AjtEioLOMnPPy/3CLhDh8pFhdmG8hvWb1Z9JiTgTN/IEc9Y77ylxykNcnw5Svo0WMAxlOd/s5RfunSlk6c4N+tRDMu2UaLFYJoEHMMCjs6I8oGM8ds/QQJOW5ZmY+Qynhw7VfX5XUKlOlLAMZMnlc+PSp939rjP8VH5rTc/dMpsixIIuNzQPtEEHI3b5v6iM8oylpYvX+0qawwdMtYVI3TW9u3M+Eh/MNk29rHJTv6B+0Y5bam8vezqFwk4cxnnnl3Hd5nFhDYOJkrAybK5syVBPgnfA0fQZ6MGN1sXnd/IKRN0k7Gc6Jt85uULKkPAVY7qIOBMzHKQz0TeAzf9tRm+Am7fvv1Wh7Y9VZ+GJuDMvCngTM6vUd8+U2wi64SNFoNpFnD3DnrEricTY+bDFHAmZrkyAm7mR585ZTqTwnn+Y0y3FJjI5YcNBFxuaJ9oAo7OtplxyomR+1KWTdintZc2mR4e9qTtk/fAPTpyXOAyiwVtHISAU3wSKeBkoBC9ew62fvjhV8fOl7xMqAwBVzmiEnDm2SeiWAUc3ddBB2fNp1FZAUflPr0e9NiiRIvBNAu4x0ZPct0TJjH7iEvANW/WyfBmoTr5CDii5jnll/cb1LvJsTNy+WEDAZcb2ieagPt41rzA/SV9smzCPhmLdF+dtB00rrqZSAE3PCPsgpZZLGjjYCoE3N//dp21auVax1e/Thtr3tyFTj26wTsIU8AdPnzE9eCBDBrmgpoN1XWCgKscUQi4e+4eYd3U+naXrZgEnDybe/p09mZgv/5MKiLg5E29Es0WJloMpkHAUf7jWfOdMgs4epjErOd3iZvPXvkJuBHDnnIuOTGyn8/mLPD1mZhlOvsm/QTZ8hVwWnuTXP5CAwGXG9onpoDjfaQ9qW5e6ZA+WTYh35tvfGi1bdPDZfts9pee+KE/5Bp8CZV+HwTlg5ZZLGjjYCoEnFmWdhJkpt3vIQbZP6Mtg+5PoU8aWE3IBgFXOaIQcISMkWIRcHwwlutHzJ/3lcse9BADI/Ms4OgdSFTmGG7WuL1Tj/Fb/7DQYjDJAs5MmoAjZD0T0x50Bk7et0vIfisj4Lgs143yFRFwZqLLxkzf3g9aPXvc75SjAAIuN3KfmfuT7wnXfGZeK5twW3r/JMMPj3Xu1Neo6V0ffqqeBBzdU2n6WMwVM9o4mBgBlw/TnnvdPtiB/NGCJg6iEnDFDsXwsaPuy7xJR4vBJAq4ikJ/ECkeqoI8mBYDtD7yVQ68jvTKmzjWFwIOxI02DqZKwNEPf0D/YdIMAtCCJg4g4LJQDO/Zs0+aE40WgxBw2adRCyFm6An7EcOfkubYoO/EtweYNoLW1XxiMSog4EDcaONgqgQcqDha0MQBBFx60WIQAi658AvSzUQPNcQJBByIG20chIADgWhBEwcQcOlFi0EIOBAlEHAgbrRxEAIOBKIFTRxAwKUXLQYh4ECUQMCBuNHGQQg4EIgWNHEAAZdetBiEgANRAgEH4kYbByHgQCBa0MQBBFx60WIQAg5ECQQciBttHISAA4FoQRMHEHDpRYtBCDgQJRBwIG60cRACDgSiBU0cQMClFy0GIeBAlEDAgbjRxkEIOBCIFjRxAAGXXrQYhIADUQIBB+JGGwch4EAgWtDEAQRcetFiEAIORAkEHIgbbRyEgAOBaEETBxBw6UWLQQg4ECUQcCButHEQAg4EogVNHEDApRctBiHgQJRAwIG40cZBCDgQiBY0cQABl160GISAA1ECAQfiRhsH8xZwSOlOxTJwIaU3FYuAQ0pvwjiIFHeCgEOqcMLAhRR3goBDijthHESKO1VYwJmYjdOQevXqZf3pT3/y2NOc4kauTxoSYtCd4hBwJrR8uU5JT4hBd4obuT5pSBSDvXv39tjTmiDgciQIOG+KG7k+aUiIQXeCgIs+IQbdKW7k+qQhQcC5EwRcjgQB501xI9cnDQkx6E4QcNEnxKA7xY1cnzQkCDh3qrCASxsDBw60gwaAOEEMgrhBDIK4oRi8++67pRlYEHAqEHCgGEAMgrhBDIK4gYDzB79OBQg4UAwgBkHcIAZB3EDA+YNfpwIEHCgGEIMgbhCDIG4g4PzBr1MBAg4UA4hBEDeIQRA3EHD+4NepAAEHigHEIIgbxCCIGwg4f/DrVICAA8UAYhDEDWIQxA0EnD/4dSpAwIFiADEI4gYxCOIGAs4f/DoVIOBAMYAYBHGDGARxAwHnD36dChBwoBhADIK4QQyCuIGA8we/TgUIOFAMIAZB3CAGQdxAwPmDX6cCBBwoBhCDIG4QgyBuIOD8wa9TAQIOFAOIQRA3iEEQNxBw/uDXqQABB4oBxCCIG8QgiBsIOH/w61SAgAPFAGIQxA1iEMQNBJw/+HUqQMCBYgAxCOIGMQjiBgLOH/w6FSDgQDGAGARxgxgEcQMB5w9+nRlq1qzpSv/5n/9pB420UwIgDGScUUIMgiiRcYYYBFEj44xjkI7J0g4g4BwoSHIlAMJExpuWAAgTGW9aAiBMZLxpCWTBlihDBohM//Ef/yGbAFBQ/u3f/s0TdzIBECYy3mT693//d9kEgIJCx1oZdzKBLNgSBjJIEDAgamTcIQZB1Mi4QwyCqJFxhxjUwdYwWLhwoSdYEDAgamT8UTpx4oSsBkAoLFq0yBN/GAdB1Mj4wzjoBb9KgQwYDFwgamT8IQZB1Mj4QwyCqJHxhxj0gi2igIABcYMYBHGDGARxgxgMBltF4Z/+6Z/sgOnSpYt0ARAJrVu3tmNw9erV0gVAJFDsUQy2adNGugCIhM6dO9sxSMdk4AUCzgcofhA3iEEQN4hBEDeIQX+wZQAAAAAAqhkQcAAAAAAA1QwIOAAAAACAaoavgDvrrNpIKU9xI9cHKX0pbuT6IKUvxY1cH6T0JT8CBdxf/3q1NIMUkCtoooLWYceOXdIMUkAxxWAxrAeInu3bdxbFvkcMppdc+x4CDnjIFTRRAQGXXoopBothPUD0QMCBuMm17yHggAcOmpKSEifFAQRcetFi8PDhw7Ja6OQaQEFyYQFXDOMgYjCdaOPgoUOHHD8EHPCgBU0cQMClFy0GIeBAlEDAgbjRxkEIOBCIFjRxAAGXXrQYhIADUQIBB+JGGwch4EAgWtDEAQRcetFiEAIORAkEHIgbbRyEgAOBaEETBxBw6UWLQQg4ECUQcCButHEQAg4EogVNHEDApRctBiHgQJRAwIG40cZBCDgQiBY0cQABl160GISAA1ECAQfiRhsHIeBAIFrQxAEEXHrRYhACDkQJBByIG20chIADgWhBEwcQcOlFi0EIOBAlEHAgbrRxsGgF3PXXdrUTcNO4YVtr2vNvSHNoaEETBxBw6UWLQQg4ECUQcNGD478bbRwsWgFHnP1/6QjUilBaWmpvl5Ur10pXKGhBEwcQcP5QPHz/3U/SnBi0GISAKy4uubBJosdrCLho+fCDOVbXW/pJcyjc1PoOa+xjk6W56NDGwaIRcPTjlwPAH3/84SonBfk9K8Kib5dIU6hoQRMHcQm4quyrfAjqP8jHzJo5L696Gk8+MbXSbaNEi8E0CzjaZ48+Mk6aY6UycUR/Rnvcfo80O2zbusPu9+q/3yBdkQMBVzjuuG1Qznj5/fffpalgyGVv2rjVYytGtHEwEgFHG+eaph3txEIt1wYb0G9YXvX8MJfD6c477pPVYqGy32nH9l3Od5k/9yvpDgUtaOIgTAHH2/TG67t7Yq6y+ypfgvoP8jETxr8oTXkz9vHJeS0jbrQYrG4CbuPGLU5stWzRxf688oprZbWC07VzP2vXrj3SXFC0GDx48FDO2Dp9+rTVresAaXZxV4/7cvYTBWkTcHKbU7lpo/auMp25os+g+CK/PBFza5f+nv5Nzjnraue3EgZav7SOF1/QWJqLCm0cjEzASchGO7IqLF+2WppcaMtlaIf9+stKaXaxfbtXMOzcudvJL1u6yvDonDlzxloq6vF6HT58JLMTyndAIZDLqipa0MRBWAJu27adnjgxy5w/fvyE9ceZip8RXrFijTS5kMs2YR/F0IYNm4XXskpPl2ZieIU02+zevTfTZos0uzAFHP0LrSiFjjU/tBisbgKOtvNlFzdzyrUub+ERcIcOHckcDPe6bMyqlb9Jkwc6Y7Vv3wGXLV8Bt23rTuv3349Lc16sXvWb5yBdUQFH8U1n5CqKdgygdaFxmtOJEydklQoDAecWcPlC7WRsmAKOxijpz4f16zZJk4253/fs2SfdNvK7EXt278scX8qP7ZIVy8vHcVrdkydOGt5o0MbB2ATc+HEvOHb6pLTgy0WOn22Uap5Tz2XfuXOPy++Hn++Tj+e72psHRypPmvCSq2/6NNucd279vJZv/pMw65k2SjTYmT6GArt927tcPq2/GmfXtXreeb/qqypa0MRBWAKO4pCSyWdzFjh52pbn/rWOs123bNnu8nEy/701btjO4/fD9FF+yIOPucqXX3qN00evuwY7vgcfGOPqn0Se2S6fZbOA0+ryvZacLr+kXHx0yMSk6avMAFwRtBisjgKOxg0/tP1An91vHeixmfvJtHGieNXssh1j+kc/Ot5VT7YxyzPe+8TVts5VrWx7rYwwzWe5LOD86vn1QXlzjDZ9dKyQ7b74/BvHX1kg4Lxn4DhxvEnkfuA+WcCZx8eTJ0+p7epdfaPLLv2mT6YmjbLjsMRsx2WtTxrXqGwe70mjcH75cu+fhzDRxsHQBdyXX3xrf1n6pLT01/KzXubG4o1D0I/w/BoNXL6pk1918rKdH34+aZf9NWvs/qdhLvP556bbeT5oyb6Yd9+Z5esj+6lT2YBds2a9dVu3u10+xhRwV9Vq6fKZ24cEnPwOhUILmjgIS8CNGT3RevutmdLsQNvywIGDdp72wQU1s9v9uuadM4LqAVc9im+CBFy++4N99CkHQrJ9+MFsV1nLa2XmkYeftl575T1ptpGXUGX+8TGTfH1Hjhx1ymGjxWB1E3B0tpK2G6VDJe51Z7skyJ5vOZ8zcGZ9viym+WSZ8nSmV/PlewbOrDNpYlaUEbKtXG73W/Ux08zTGCv7qSxpFHDTMsc6TlRmAVe/Tmvr41nzXHX9zp6ST/7BYwFHVzUIEnL0EAxBdjnurM0cIznvt6/N/OxPvwjc77l8gx8YbedZwPEfesrTnxPOB/UTBto4GLqAI7QvyhuHoTwLON44MrGPzsCZ7WSAMORr3KCtk0y7iVwPCdn69Rli57/+enHO+gTZG9W/WZptzDY0uJpP25g+eQauJDMoXn9dV9f2IPgMHOO3TpVBC5o4iFPAMTfdeLsjnOU2pvuA2MZn4BhZ14T3pVZH2oLiziz/8MMvrn4fHDzGqFlOLgFn0rljn8wB8bT1+7HfPb6w0WKwugk4hu+1oW340ODs2VbKa5ejyU5n4CRy+weVcwm4w4eOBLbP5bup9e1OovLvx7KXYfMVcPIeOLPNyBHPWPXrtrFtcrkmfr4P3p/tqVtZ0ijgDhwocRKVWcDx/jDTvYNGih6ykE8en+U9cHVqt7IuvjB7BUPur7sHPOzYpM9vv/NZXT+kr3fPwa7v0qxJB9uuaRQWnVw3SrRxMDYBd+XfrvNsHFPA+UG+igg4DWmX6yEhW2UE3N8z31HDbJOvgKO+yLd48c92ualxlhACrvJMnfKqNWjgCGl2MLdlkIB7YuwUx1ZRAffslNfszycen+rx+ZXz9S35cWlBBFybzHcn6Myb9IWNFoPVVcAxb77xobMd6XPJkqWiRtZe7ALOj6oKOPqk39r+/dmz30HLNcuDBmYP+Jz2+twHVVHSKOBk2RRw+UJ15fG5IgKOrnKYMWFilunKiLnfzVtKJGa7upllm2XKQ8AJtC9KttWr1rnKpoC7rkUXx8c7h33VQcDd3t3/UWnTHiTgKM8Cztw+XGYg4CoP/7s0MW9+NX2mgDuvRn1ro/GQANUbfP8oO19RAUdowiio7OeTgw5dEht8f/aSgCSXgJP3+5n506f1SyZhoMVgdRNw8iGEB+4b5WxT+pT7k+1VFXCPPvKM1bNH+digYdbv1KG3Z1/zwZDiSPoOHfLfD3K9JPIS6ptvfODaJiZyuSZmme5LMu9hLRQQcG4BR2fjmbZtelhvv/WRUza5d9AjdjLJJeDMmKIyxQXnTcwy3btp3isfhNnuogsau14YTD4IOAF/WTOZAcB1pEAxk2mvqoCjp63Mvs3mWhuyVVTAEXyWUfsOjCbgyter/Awc/UM3fT//vNwZmCHgqgbfQ8iJ73MjzG1pCjj2cbrNuCenMgKOoMHBLMt2ZpnOTJjLN5F2+jx2zPtepSABRwdts5/7733U8S1ftsbl8/v9FQotBqubgDO3l7lv/Pxsy1fAmYnEoZ9f48LzGjl+GpfNerd2KX/I4MwZ9wGNbjyXyzYZ/8w01c6QgOOYl/VaNOvkspN4oD9bhOzPLC9atCRwnSoLBJz/QwyyrkTWCxJwLJo48W0GhFyOWb57wPC814n9dAw1H9Y6N6Nxfio7zq5ZvR4CDlR/tKCJgzAFXFWgs3Xy1Q1Jwu9R/CjRYrC6CbgwKfSBpND9RQW9lkmuOz3FSPfCVZW0Cbh8oLHhQNkl7jihqSXlE970QFidq+J/AXQh0cZBCDgQiBY0cVCsAo4OGMXwpviwkAfEONBiEAKunELvo0L3FxX0O6QnGk2em/q69U7AQ0r5AgHnheKEnsaPm/POrWe1v7n8YT/iovMbWX+v1dJlq+5o4yAEHAhEC5o4KFYBB8JHi0EIuHIKfaah0P1FCV/aMlMhgIArXuaUvTZEpqShjYMQcCAQLWjiAAIuvWgxCAEHogQCDsSNNg5CwIFAtKCJAwi49KLFIAQciBIIOBA32jgIAQcC0YImDiDg0osWgxBwIEog4EDcaOMgBBwIRAuaOICASy9aDELAgSiBgANxo42DEHAFJC03TsYBBFx60WIQAg5ECQQciBttHISAKxBJFG+EFjRxAAGXXrQYhIDLktQn7ooNCDgvn8//2vrm6x+kGYSENg7GJuBo0JmfCQAJvR0530EpnzpVhWZ9eOH5N5z05Rffyio29P4helN5VZk39ytr3179xbA0CbaEbK+8/I79HpyNG7NTO9F6mmzYsNlapkyWnQ9a0MRBoQSc3DZxYcYUpWXLVssqoTFh/IuR/HYKhRaDaRJw9HZ4LW4/LXt9Qi5oOq186hFUr+edD0izh3z7qwhbNm/PjFXl09MR+R4LwibNAo6ObRvWb5bmyPZNoZah/YaqE9o4WHQCjsh3h+VbT6Mi0//Qcni+tJ9/ygrMUSPHufxHjx6zP7UpiyoCTY81471PpNlG+75ke2HaG/YUH1vL5q6U9T795HNr+NAnXLZ80YImDgol4OS2iYuSksP2utAnTfz95NgpdjmKOUYh4CpHHAdPgqekqiwVEXA1z8lOK5eLfOpUFJpK8YnHp0izvazOnfpIc6SkVcCNGP6U9bfLmktzpBQq1grVT1xo42AkAu77736yNx6lGe9+bNsoTwJu3tyFdn70qAlO/XFPP+/kryp7m3LzsrnxTOHFO+TmNj08vlzs3bvfbvPWGx9KlweqZ054+7fLW7jOhr2X+U6tWnazet812LERvO70VujLL7nGzg/oPywwkCor4L74/BuXzQQCLgvtD9o29EmJ5sRlO9Hmxttd22628YJIrkvQnKh1a99ovfzS27avft02jo/o0+tBpx0nDWlfteo3q0mj7Dyqe/bst9fr229/tOvt3r3Xqcdzt7726nuOjdaPvwdNI0N1TEY/OsFuQ4OxJuD+XjZv75AHy+ce7Nypb0Zclu9v7p/YtGmrvQ1M++NjJtl90G+hkGgxmBYBR9uWxhozbgnaX5SY/n2HODOCUN3LLm7q+EwBR58XntfQ8Unk/I8d2/dyYvj556Y7drM/GUsnjPlN/eZypXRLx3JRRt/r8kua2WOl+T2JKy69xrOMqEmSgONtS9uU5ze9qfUdnm1M8yF3aNfTHheZulffaNs5/sxxSTLkocftPmksOnXqlG0bOSIbi5TMOacZmvtbxhTn69dpbefp0q3JpZlYN7+Lhhz7a195vW2/9ppbMuNYK/vqlfz+vB5Pjp3qslN7nhdYtvnllxWOXfNXBW0cDF3A0WlL+hKLMgeiZ6e85ggfstGExbRzRz06Xt1hnKfUvetA6/bug1TfjTd0twYNfLjCG2v+vK+cPmgSZz/Ibwo4KvNgRnk6xbxt247Md6mjrt/osu9HiQcjv3WtjICreU49q+Rg+Y6U9SDgstzaOTuJMn1SMicmfuThp62a59azDyAETaJM9l279ljXNr/FtU0b1b/ZLp9fo7712ZwF6j4nJmaEUq+7/C9Hyf1k2mhg5L5u63a3tXnzNufgWivzB+LggRI73/3Wu+36fAaY0rtvz3Stx8mTJ+08rcvAftk/EHKdaTqa0tIzLh8Narw9uN6JE9lt1q3rAOu7RT859ksubGL/tj/8YI6r70KgxWBaBBzFKccbxy0x9vHJru1M+4P33Ttl+79fnyG2jwUcJRL99NmpQ2+nrYQOrJeXjVM0tn3w/qfWlCmvemKG0ssvvmWPP/SnxvQ9kjlQE9SexlnTx5doyffSC2/ZefpeLa/tYh9Yze/JnF/De7CPkiQJON53r5fFAiU6FtOnKe6pPGb0ROuLz7+18zz+kIDj+KPjngb3S7cc0R+6NWvW23ba5xPGvWitX7fJ3qcUZ7LN8mVrrPsGPeKx9+871BFipo/XmcYq02cix36OL/7jSqntTT2c+lR++snnrG++Xmznjx0tv7LG9WfNnGt/nzfLTgItXPi9bef5o/3WpbJo42DoAo6+BE0yLCG7eQmVyqzS5Q4yyddnMmnCS/bZBE4avFM02MdpYP9hsoqN/Pcq88+UnVnkMzQalRFwdAZO2kwg4MqR2ybIZp7RpbNaJSXZHwsfUBm/vFY20XxsYwFnQmd+pY3LLOA0Hwk+/sdJyDNwfu3MfIO6baxtW3dal16UPbOj1fErVxUtBtMi4Ai/S6imjQUcU6d2K+fPsryESmcdtP4kVGfkI1khJpHt842HIJ/fJdRiIGkCzsyz4Ljx+u7OmXsSV6Wl5bdzTJn0il1Xtg0ScPkg+9OQ9qA2smyi+VjAmVzTtKPH5rfM9es3Wb17Zq+8yfFZ9lFVtHEwEgGnQfaoBFyP2++1fZw0Lru4ma+P7PIMHJ3uJ/ifiNa/zIcl4OiMi7SZQMCVI7dNvjY6y7tnd3agyyXguEyXQ2U/JpqPbZqAM/s2bUQuAde4QVvHXhkB5/cp81q5qmgxCAHn3s5hCLjDh47Y9TitXrXO8cn2Mh5kyscHAZebQsSg3B+agJP7d8uW7R4blSsq4OS+l+uiIe2yjUx+aD5NwNHVBGmTy2RMAbdwwXe2b9PGrdYnH8/39FFVtHEwEgG33ucJlqgEXBB86fW8c+tLlwP5TQHX47Z77FOndMM5+bT78rR8ZQQcneZmtDZkM+/PYpsJ3fcEAZdFbpsg27595U8DU/nEiZN2PkjAEfWuvtG64LyGVrMmHVx2iWxHT+DxfUyagON7oRjzjG8uAcf3YBIVFXDmcuSnzGvlqqLFYJoE3MQJ7v3FmLYwBJwk330ufSZBPrpXmsbjYiRtAo5uqTB5Y/oHnn1H5coIOL+y9DHSnk8bDa2uJuD4Xjsm6MqaKeAIumeYTu5Qv7/9ttGxFwJtHAxdwEk1S0+1EGSLU8CZ/y5zPfxAdVjA0fV/KtP3ovujzGXe0PJW3/WjfGUEnFmP7rmim0gZvm9BYtq63NLXLkPAZaFtwffdmDYJ/QjZTvdHmnWCBBzdV6f1p2HWW7p0lV0+WnavhSbgVq5ca9uOHD5qlylP91QSLOA6d8zeImDeK8IPF3CcU16uPx08Nd8VlzZ32rOfhKZsbyLLVUWLwTQJOE2cE6YtDAHH99AR9BqJfPc55c0x1bzfjnw0hjId2/Vy8oRsWyykTcDRn1W6bcSsN37cC06ZbUECznzIhl7HxXaGRKJcl3vuHuGUTbtfmfLrDKG05MelTl7y2OhJrnt6CU3AaYKNHjAzy4wUcLKvQqKNg6ELOGL37n32F8vu8J22zb65NUYBV5FBgtedEl2KOnIkewAl6BUQ7OMd/8K0N512DOXfeOMDO09P3Pqt6/ChT7qWJ+vRU7Nsnz37C5ePOX78uFPndEZ8fP3VYgg4g769H7K3DZ+5lNuY2bWr/EECM16ua9HFs28Zet+e3H9+/Zv+ewc94loGP6Qg4T8QlA4cKN8XfJCnLrRlfv1V9gZbuheOb2Q3oRuByfbzT8tcdoLsa1ZnL58dKvvjYw6a8qlG2XdV0WIwTQKOoNgw/1QQZn5Q5sBnlps37WT/ySSef266y0f3Aeezj75btMSJJf6jwMj2ZtmMUUonT2bHdcb00ROrJhTHFKOy/7hJsoDbv/+gnSehbZ5527ljt7OftIf8yO4n4IiHhz3ltOex7Y3p79tl/nMx4uGnnTgl6EoBt2FkLMhyrcuvddqMe3qayyehhylJpLI4verKltYFNb1PZfOxnNK6dZtcPnP5O7bvct0Tz23MVCi0cTASAQeqL1rQxEEhBVyYaD9YzVZo/M7SJAEtBtMm4EC8JEnAgXCg8Vf7s1IotHEQAg4EogVNHFQnAWeeSZs88aWC/oj9gIALHxw80wsEHMgFjb99ej7osRUKbRyEgAOBaEETB9VFwBEfz5pnvfnGB3YqxPRqaUeLQQg4ECUQcCAfVq5Y44z9v/6yQrqrhDYOQsCBQLSgiYPqJOBAYdFiEAIORAkEHIgbbRyEgAOBaEETBxBw6UWLQQg4ECUQcCButHEQAg4EogVNHEDApRctBiHgQJRAwIG40cZBCDgQiBY0cQABl160GISAA1ECAQfiRhsHIeBAIFrQxEF1FXCFfAoprWgxCAGXLEpKDlvHjpVPGF5sQMCBuNHGwdgF3NCHxlpdbuknzVWCDpr0stbqQkVe+Df4vlHSFCpa0MRBdRBwtA/pDfgmW7fusN5680OXLQpoXXbu3C3NKlHHVEXRYhACrvoix7q9ew9UaAyMAwi4ZDBm1ERpyon24vM40MbBWAVch3Y9XRuGf8Scapxdp7xyBTh8+IhnflA/xj39vLVkif/0G0yYO5DWl1I+hLkeGlrQxEHcAk7GJiX5dnrah+YsHTStS9gHJr/+aV3yfYWJ1r6Y0GIwDQLurh73O1MbFQt+8VYRzLHu6Sefc/VX1b7DIokCLt99Kce9fNoUErm811+d4bFROZ9jPs0LXVFKS0s9x2e5/CjQxsFYBRxtBJrzkeCpfJjeAfOFFpJiEHAVIer10IImDsIQcA89+Jjnzdl+aNudbHNmfynNDps3b7N//DS1EOULDfV5YH92f1Slf+27FRNaDELARQ/FydtvflT08RIGSRJwPLczTZ2Vz77Mp05lGDZkrDSp1K/bxlq9KjuVH0HrI9dJlv2ojIDTyHd5hUQbB2MTcN9//7NrI1D+gpoNjBpuzq/RwNlx3I4+L7moicdGiQ6cDJV5fj1KV//9Bldd2a8JzSHqV6fmOe7BVavD0P0dWj80t6psQ/nS0jOOndbd5Ttd6vho7rgw0YImDsIQcGNGT7S3YZNG7aTLg7ZPb+8+yLHz/pj54WeO34y5wfePduxUXrt2gz0fsNz3EvL9tGSZU+/ttz5yfHWvvtGxX39dV1eboD5rnpOdRJrSbd3udtWV7TQftzV99eq0dtmlvypoMZh0AfdYWWxq25LyzZt2tD+vvaazbXty7FRXXfN+MiqfPp09aFNqkDkgMhee18iznKmTX3X8JjTPL2GuiwbdRiD75DZmnrjpxjtcdRrVv9nxyeVQmefqlf2ETZIEHE1e/8TjU+x8PtswqM6VV5TPQ0pp1crySd9zwW1+y4yFQdBJnisube6UqQ3pgRnvfWKXB/Yb5lpHc33kupOAo+M2+8xZc7R2JDLNMl1h0eoRGzdscdmXlv1eCoU2DsYm4P52WXPXv0v+Z3ffPSONWlm6dx3o2lC//rrS/uQN9eMPvzo+tksB99DgMXaeBzKmKmfgNAHXp9dDal353cwzP40a3OxqQ3k6uBP0Zmc/H50y1pZVSLSgiYMwBBzDcRQkhrXtvKNssmeG8izgWJyZPho4OU+JJ4im/JmMYNcg3xWXZQevB+4f5fTJAt+sd/+9j7rKfpCPB64bb+ju6cdE+mRZyxMN6t3kKlcFLQaTLuAIvzNwtK3btunhsXF88WTypo8n7+aylqdL7g8Ofswp+yH3tcT0U5g1buj+g2T6Dx5wjyd+6ybLMhbDJkkCziSfbUh13n1nli1+xj422bHTZUXZnsalijCg71BnX/J4qCH3/csvvu0cf+kPKQv/QyWHXXUvvahpRuSUjxXk27Rxq51/9ZV3nbqTJ71sNRFxaiK/pyyzbdnSrDbZsnmbWqcqaONgbAKO7m+jU7iSWTPnOjv0ow/n2DbKz/7kc1Eza6czcBKySwFnYpYLLeDqXd3aOqVclrvs4ma2n/5JrF+/yeXTBJxJvr4w0IImDqoq4Dim7Ji50BszxPszPrVu6dhHmq3du/ba7eiT0okTJ217kICj/MPDnnJS82adnLr0SWfgzHbHj59wyiZm//RHhct0ds+McTmYBsWF9AW1K4SvqmgxmHYBJ5G2fPeN9J2bxzgv20ikP1d5wZeLrCmTXrGTXDe++nDy5ElPuyhJs4AbM2qCkx854hnPPqI0ccKLjk1C4o/rBS0vHx/dd9yhbU+XjT4PH87ee0xnFl94/g3r55+WO8m8giUvoXIf/IeYzki/9Wb5VQ5Grpsss81crlanKmjjYGwC7uILGlvNGneQZgdS2OYOWrjgO1Ejay82ARcECbsH7sueRTHrQsDlpqoCjs5KlCfvzf0XlN2D2euuB6TLRtvOA5RT96aAe/GFtzyJfVUVcPT7MU//y7Ox2voy0hfUriI+M/HljUKgxSAEXLBN7hsT6TOTXxyayP4ksk+aG1j6zTyllSvX2sn0maKtfdu7rA0btji+qEmzgJPINju273L24/s+v3tz/JVs2bLdae8H+Wi8o8/Dh7IPFFD+wIESV7uxj0+232pBV7s4jXtmmuP3E3AEXZ0jsaqtS64y28zlalcTq4I2DsYm4Lp06qtuBGb16nWOnz7pfh8J2asq4OjfwYB+Q8udPsg+pK2iitusCwGXm6oKOD/4B5vriWdtO5PtlZffcZVNATfj3Y8dX8f2vaybW9/h+Koq4Hr3HGzN/vQLx9frzgcC48RE+oLa5evbsH6z/SBSGGgxmAYBR5fE5TYn8rHlu9/Gj5tmNazg5W7Zn2Tdbxuti85vJM0O+a4bl+XZ5TiAgCvHrw1dXfLz+UH1KeV6oIHqTH/9fVf/dCXlzjvuc9m++Pwba2D/4U5ZItdPlhlpz1X2sxUSbRyMTcAR9IX5+jTvSDNt2pS9Vq352ZavgDOTeT+I9Ptx4/XdPHXMduedm70x3A+5Dub1dgi43IQh4OgpVDojmg9y/1Ga+VH5Awtcx3yIQdY37VUVcOzT+mefH2abWpdnb0LWfK3KYt70mZjlq2q1dLWle08KhRaDaRBwhLlNTZvErEdJxpeJ7MtMTRu1N2q6kXVlv8xll2RvF+FEZZOg5ct+6fKqtBGaLUySJOCem/qaZ3tr+4SY8+mXnnp869OtXQZ4fKdOeW8f8qMi+4//zJhtzAdzTOQ6TZ1a/lBO91uz99M761t2u5Nso/Upy7Le889ND+yjqmjjYKwCTr46hNDuH6sqchkgf7SgiYMwBBwoHPI3VsgBTIvBtAi4sNH+zL7y8rsuW0WR+72qsUC3CxTyD0FlSJKAqwz0h2DFijXSDCJEGwdjFXAE/bDptGeYVGXwyAU9uRj0+pPqjhY0cQABp3NDS/dZsjhYv26T597BfN8xlQ9aDELAVZ1JE1+2vlr4vctG++zeQY+4bBVh7Zr1Vr8+Q1w2emK2MrGwdu1668svvrXbHiq77yku0i7gQPxo42DsAi4KKjN4gCxa0MQBBFxxQ78xenUKPcVIicq7du2R1SqFFoMQcFWHpnmj/cT7jPebdqN5RdBiwXyVQ77wmbvhw56UrsiBgANxo42DqRBwoPJoQRMHEHDpRYtBCDgQJRBwIG60cRACDgSiBU0cQMClFy0GIeBAlEDAgbjRxkEIOBCIFjRxAAGXXrQYhIADUQIBB+JGGwch4EAgWtDEAQRcetFiEAIORAkEHIgbbRxMrYDjG2S/+OJb6ao20PrT++fCRAuaOCgGAZfd3vWlOXbopanXtegszYlBi8E0CTh6jQaPVyUl5QM2iI40CrjVq36zY46mrwLxo42DqRVwxK1d+lfrJ1SjWHctaOKgGAQcvWyXtrk5NUsxEEUcxIkWg2kRcLRva11xrZ3nSepplpq0wDPy8PzDcZFGAUfwi5RB/GjjYGIEXFCQrVm93uPfvn2X1aplN5etOnHs2O9W964DpbngaEETB4UScDIOKkKP2++1unUdIM1V6rOqzJv7lf1HJEx4onEJ2zRfIdFiMC0Cjnn6qedcU6dpUBzu2rVXmgvK3r371XinGKR5KcPgphtvV5cZJUkQcN9+84M12piYXkLb+OOZ7nlrb27Tw5ow/gWXrarwHxGNZ6e+lhnTFkpzXtw94GF1LKRl0bsqc0GzSPitVzGgjYOxCbgmDdvaG4vesE15gl6ISzb6pERvCc93g+Zbj6H6p05lp+IoBIXqJx948t+a5wRP31UItKCJg7gFHG1zerdVzXPqVrqPikLzndKy6KW4HdtnX4xrLvv112Y4g9PlYrqiyuD3veRyTTvBE65r9WS5MmgxmBYBZ27TDz+YY+dp3mUN8sUh4KhM85/S5zdfL3b5/OCz2S1bdHHZ+fuaUyESNJF5nKRBwEloP4x+dLz9WdntP++zhdaL09502YIEHE02T8usKHWuamX32fOuB6zx4yonOCHgKghtrAliY8sNSOWnnpjqsmnIdtMzBzeCBpwZ731iJxM6g/X5/K9dNuL9GZ/an73vGmyfPibGPj7ZGjNqolnNgfqnNrR8+qTEgw/3NX/uV9bYxybbefohPDzsSfvgPH/eV04/fjw0eIw9X+eib3902Y8eOZYZyJe5bGGgBU0cFFrA0T4dNPBhl4/3l1956a+rPNtci61c0Do89+zr0qwi41qWt2aE5efKTCYH9h+0Y43OGjKPjhxnPfXks0YtN7Jvhuyaj22XXZyd5kirJ8uVQYvBNAk4E57HUoPsJOBov9OZYm1+XXPMW7lirbV92047z7E+fOgTgfMDawKO+ObrH6ydO3a7bHS/3sGD+njBAk72xTZTwL32yrtWzzsfsF4QQoDWed26ja6yFH6FImkCjvbxpAkvOT6/cWzJj7/aV7BMOFb2Z8aYrp37Wb/+ssLlZ6jeiOFPWQP6DXOOjYQp4AbfP9qaOP5Fo5UOzXvK7d95e6b15NgpokYmnleutX7MrK+J3/cy6dv7Ifu2GCng5PhvljlPL6iWM48Qb7/1kfXA/aOc9MzTz8sqFUYbB4tewNEZupbXuv+laZjtKP/oI+Ps/JzZ5ZPxMn17PeTYKJUcLN8Ipp0SnXXhvHYz5w+Lf/G04beOU14uX9a98LxGZncOJSWHPXUZaa/MW87zRQuaOCikgJPJ9JlIn3ubZ6f2kX3kw5qy+3oojcnxj9js++RJ9wAj1+mbzABN0AH8qlrXefy51tXP59eO7XQm2yzLOlVFi8E0CLgNGzar20+zEWTfsX23uq/5zDGndjffaT02epI1a+Zcp229Oq3VtiaagDPbmD46KyzrMqaAW/z9z7aNzrzMmjXXtrEQIyHq1z/lH8kIBLO8e3c4ZyCTJOD8tqXcV2a9GmfXcdkfefhptR8T02/WYwFnpr9d1tz20VUluhQqOXr0mKcN/3EkpE/a/TDb3NKxj6etifQ989TzgctsUPcm+7Nxg7a2iK0q2jhY9ALuisyOrYiAo08z2Bi5gU38fJQ/cuSonf/b5S087Uw0n73zGraTZoegU8nXX9fVFo+SDm17utrQPVB+fRQCLWjioJACzq/s52vf9i6Xb+7chYHt8oVvEKZE/2Y12M9pt3GJTK4Dl0nASZ+Z97sc4vc9zL6lXZY1W1XRYjANAm75stXq9tNsBNnpiVWzTPta3ipinmlgwUPlyRNfdur4LUMKOMr3vPN+p0xTZ/FUXKNGjvc9m8cC7oP3Zzv9mZ9+Z9LksiHg8ocEnLn9+vUdYi36pvzKjumjtxuY942Rb9vWHU5+5IhnXD4/gi6h8jhE4ob7yCXgGDora8bLrZ3L732jkz4yTvwwfX16PhjYTvro6pifj/lu0RJPP5VFGwcTJeA4abB91849rrqyjV++Yf2smvZD82k2mijab9kSs87992YHQsrLy2BBfVQVLWjiIE4BR59PP/mc6pN5ibkP/f6FkY8vsUvMvs2DHfHgA6Nd/bMPAi4cqnLw1ND2nUllBJx5Dxzv61bXd7MPjCbkowcjzLKJLDOagJPps88WGC10WMAR9CkPyCzg+ABoJobyEHD5I++BG50R2H4CTm5zc9ub9bSySZCAY+gyKpfzFXCzP/ncd30OHz7q+S5+mD55CVW2q4hv394Ddr4i9/HnQhsHi17A0QagMyC5oHbvvfuxddnF+ml7tsngkcgdwRRKwEmbLGucKrt0tmbNevvzrh73ufz59FFZtKCJg7gFnHmWwfTJfEXgG28vvaiJdDnIvrlM90Cavisube6UCyXg6JItcVv3QR4fIW1U1mxVRYvBJAi4XJgihzl9utRjY8iuCbgO7dxn7dlnTlqv+TU0AVcZzO/GB/DFi7OXUinPAo7yfImey2YeAi5/Kirg/JA+WTahJ0oni6fU5TG40AKO7smrzHcplIBbuOA7u0yJHsYsFNo4WPQCjsr8DiB6YakfcuPKm2el38TPZ+YLIeBk4AbdI3KncfM5QfXoXpEpk19xtaFT2X59FAItaOKgkALOvOnWb3/zvY8EvSYjaJtXdPu3btXdbkOJHqYJwux7mXFGpn/fodYrL7/j+Lg/olACjsv0W5K+O267JxO/7ntCa195vase3cog21UGLQbTIOAI2n70sIFZ9jsokE8TcJxndpZdhTChMp8h/v/t3Yl7FEX+x/H/RuVSPFeUFVAwgByK4gEIyAoiRlcXxANdrxBwFVdBRVcEERHPRf2peK0uInggC/qgP2AF5T5FCAmEGJ5evj1Up7qmejJJZqZrUu/X89STrqrunklSqf6kZ3pawpPZr9TVHckaT/p7g6Wu5uurrxwf9KsYFvXpzHCqn4GWdj3AqaA5tSr77+68E5+RN/G2zMtwBLhkLQlwMsbkoie9T97vrZZ1Zl0n7y83+83jYFsDnJzk6d5tcNQn7eY4SWKuZ9YV/Xhg9pl1eRvDuOP/9BaabR5MLcCpH5bth6YX/WBj/tB0Zp/U9atnbP3mY6t223JzAU6o/ekXMZj6V4yIPa58fXnhYmOtIDybqD/HJUs+jfpWr14btcsZx2KyDZo0FDLAyZVK6uf3xbKmjz1QP3P1Hkr99ycf3ZD0M7f9nnNRVzfnQx8DUtRZMbNPgqB6Hm0JcGZR5Cowvb1H98u0LZuY2+r7aC3bGPQlwAn9Z3rtsEqzOyL9SQGuXrtowPY70X9fUlZoB3aTvOFc34e8RKu204NYrn9QzQCnk3YV4OQiC7VvOUMy/oY7ou30N8Or748Al6wlAU7VVVmzuumja2zr5aKPD1HoACdGHP+7UI/x/JxFUbvI9fxuPDGepJhn4BaceFlftel95j71+jtvfxRt17TvprPIrWWbB1MLcC0lb4Y1f2goPtugSUOhAhzKj20M+hTgCkl/47WurXOr7HfZ51+bze1Gewhw5UDG0cxWfuTGjEeeSRzfpdS3T/yss/zDI1d4t5VtHiybACenMEeNuMVsRpHZBk0aCHD+so1BAlzrJAW1pPZ8yfZz58bfrN6eEOBKQ8bRgH7Xms15uahX86+SFZu8QlJhfPKEXNErZyHbyjYPlk2A+++GTWYTSsA2aNJAgPOXbQwS4FBKBDjky3z5tFCh0jYPlk2AQzpsgyYNBDh/2cYgAQ6lRIBD2mzzIAEOOdkGTRoIcP6yjUECHEqJAIe02eZBAhxysg2aNBDg/GUbgwQ4lBIBDmmzzYMEOORkGzRpIMD5yzYGCXAoJQIc0mabB8s+wBXyVhXIZhs0aSDA+cs2BglwKCUCHNJmmwfLLsD1qxge+zBTIQHu2DH7h5O2ltzxoD1/rlG+bIMmDQQ4f9nGIAHOPfKhwfKBz+0RAc5tMvYkG+h3LWlvbPOgswFObuVx6aDrzOYwrB0+fCSqS5iTti4dL9TWaptCX/7bGq+/9n+Jt8wpJdugSQMBzl+2MUiAc4+6V3N7RIBzh22MqbvPLFv6VdQmx8/mblVYTmzzoLMBTn4Z/S6230dPkV/aJX1HhMsD+o8s2C/LNkBK7ZVFbzvxPGyDJg0EOH/ZxiABzj0EuOLzfQzK8V7ur5oPGYtyC672wjYPOhng9DNg+pkw21mxgZeMsrab2yzVknkuktplffk6/4XMzcLVWT4pcq82nf446h6Z5mMvWrg4OLNrRbis3wB8wvg7o3WkyP029e30khbboEkDAc5ftjFIgGub888dFJtXOnfoGdXV2QxVhg4ZG6332qvvhG3Xjbo1a25SAW7snyZl9ZU7AlxxbNiQGTOLXl4cfj39tItj4083flzTfUvlfqpCrWNbX+oEuKD0AU7ID992Bk7/Jcmyeun0UE1tVp+U+vqjWTfPzeWTT5aF68rXTZs2h21SnzZ1Vrgst/SyPc7PP285XrbG2uRxu3bpHS5/9OHS4Ndff4ttO2Rw0+01/nrP32J9nIGLI8D5yzYGCXBtZ85jisxb69b9dGI5czBVB0IV4K4dVhltN2jAqHBZBbjBA0aHdZkrz+82KFwudwS44lABrtMpPYOdO3dHx04hX+c+n7kxvd6uAp6QixgV83hp1sudbR4s+wB34MDBqEh91bffZa1nq+eirzu9elbWtuZzMOltW7Zsb3Z9GZD6oBQEuDgCnL9sY5AAVxgyx0hRZzR0+ry0/ItvwjYV4BS1vTBfQr1q6A1OzGGFQIArDhXgFHN5yl3Ts9rFH8+/NDxrfOfkqVGbuY5ZL3e2ebDsA5xZ3lr8QdZ6tnou+rrVU2dmbWs+B5PelivAqY9A0YtCgItTz4PibyHAFZ4574inZs3LmpcIcAS4YmhtgBt21YSg66l9Ym3mOls2b4/Vy51tHnQ6wJm/ENVuWxbvvvNxcORI5gpVs8+s56KvO3fOoli9sbEx53Mw23IFOHNbvf7Bks+y+tNgGzRpMA/mFP8KAa6w5s19JXj878+F88y462+P2qX+5hvvxeoEOAJcMbQ2wMnJj77GCR5znfbGNg86G+A2/7I1/IU8eP9jwfNzXo7azV+wXByQ1Kcz+6qrZmq9cbZt+1dkrnaVZXNfJr2tuQD33LMLg++++zHa78pv1sT6K2+8O/b9l5pt0KRNfy4UPwsBru3MuUj+OVXLnU7pEX5c06mdMhd1Db08cyEDAa5pDKahvY3BlgQ4eZ+c3mcy26S+cWPmfeztge1Y7GyAU+SDIfUPhzQ/KFImncoJd4dnrHTmenrd/EWbzG3F7t17g2nVs8L3hOhs65ptuZ7/U0++EPtcO7P/998bs9pKyTZo0mYezCn+FQJc2+z/9begoaHpA9HlPXD6PPOfVd8Hq1dnrooXqk8uaojPZ03zk/lBvjI3pzl3FRIBrjjMMWMu6+/NlOVJEx8KXlrwZtSmM8faP559Kfgtz48cKQe2Y7HzAa4YmgtwaGIbNGkzD+YU/woBDqVEgEPabMdi7wLcYzOeJcC1gG3QAD7i4OkvAhzSZjsWexfg0DK2QQP4iIOnvwhwSJvtWEyAQ062QQP4iIOnvwhwSJvtWEyAQ062QQP4iIOnvwhwSJvtWEyAQ062QQP4iIOnvwhwSJvtWEyAQ062QQP4KI2D52mdM/dS5sKrdBHgkDbbsZgAh5xsgwbwUakPnhLaTj/t4nBZbiZPiEsmP5vn/rHQbC4YAhzSZjsWE+AKLJx0jXu0lTPboAF8VK4HT1eDnzyveXNfNZtbbMuWHdFZyk8+/tzsLggCHNJmOxZ7F+Dkj/xfHy8zm1vNNjlKW+2hOrO5LNkGDeCjUh88VSiZMP6uNr2M2tx20r/03182u16a1Pevl9M6XxTeZlB/3rJcV3dY27IwCHBIm+1YTIDTbNu6I9i3b7/ZnFPSpJfUXm5sgwbwUakPnuYcIvXbJz0Ua7NZt+6nWF3fz4b1G7We/Gw9Pi8eqqk1m7Ps3LE7OGC5ddGO7bvCvkKQ7+WJx+eYzcG2bTvD2x0WCwEOabMdi70KcOZ/cGd2zby/RO6hprd37hC/aW63cwbE6kLu4WbuT2fWy5Vt0AA+KvXB05xDptw9PatNkXa5cbdtPpLlPXv2Wfs6ntwj1r7u//8b204ve/fa/7l9791PYuvdXHlP1Gfu43Bd5r7P5vNQbZ/+64tYm0nWMQOc+RjFQIBD2mzHYq8CnJA/cPMMnLSNu35yrF5TcyhcVkFNyCl7/cbzImnCkPaGhvK/kbNt0AA+KuXBs77+aHD+uYNjbc/MXpBzvunerWl9fT1ZPuPExRC2Pp3ZJzerF0ePPx9zXSWp3aTComJuJ/V/f7Yi1maSdfQAN3jgdUGHk5qOTfIY61txlrE5BDikzXYsJsCdaBs5/OaoSP2rr/4T9R84cDBsMyccYWsT0r59+y6zuezYBg3go0IePNV8IuXjj7LfeN+aAJdUz9Un/6DedUd1cGqnC7PmuFzb6WY8+ky07dgxk2J9M594Pva95tp/PmQbPcBJvbpqZlRf9e33waOPzI7qheJagJMTCRS/iu1Y7GWA+8QS4I4dOxYruo7Hv3dz8lFsbULajx5tMJvLjm3QAD4qZIDLhzm3/Pnme7PaFLM9V1Ay+6658sagsTEz55l9OrNukvlOnyffefvD2DZXH3+cXPvPh2xjBrgH7psR1VeuXONFgKP4W7wPcH37DMtqq3ro8VibIi+lqolGvsr75XRJk1BSe7mxDRrAR+pvoVTMOUTqU+6aFmtTbOvalvX6jz9sCK4fMzFqP3SoNnE7CXjmfhTzH1613pBL/xR0OqVHrD1p/2Lp0i+PP4fcV+/LNnqA63nB5bGXUDt36BX8sHZ9VC8UVwLcE489F5WHpz1J8bB4HeCEmkjURQx6myrysqlqb2zMvA9E1XULX3oza2L65uvV4SeotwcEOCCj1AHu3ikPx+ak3r2uNFeJmPOSXm+uT5WK3tck9kmRl1ttzPXU2TyzT/9nWPXppN7Wixj0wFhIrgQ4nf5cKH4WLwNcsZkTUzkjwAEZpQ5wpaT+YdW1p3msrQhwFBcLAa7A1H+C7QUBDshozwHONmfZ2nxFgKO4WAhwyIkAB2S05wBno3/0iO9cDHCAjgCHLAQ4IMO3AIcmBDi4jgCHLAQ4IIMA5y8CHFxHgEMWAhyQQYDzFwEOriPAIQsBDsggwPmLAAfXEeCQhQAHZBDg/EWAg+sIcMhCgAMy2mOA+3LFt2FBbgQ4uI4AhywEOCCjGAHuaP3R4Jwz+8fahl4+rmCfwfbG6+9m3UHhpQVvRsu2z6185OGng44n94i1+Y4AB9cR4JCFAAdkFDrAnX1G3+Cs40UClCwrcr/l2U/N19ZsPdn34bojWW1JplfPivpzrecbAhxcR4BDFgIckFHIAHfH5KpgxLDKoL6+PhaUDh6sCUZcUxmMGX2btnayPhddZTbF5ApwK5avDC44/7Kw6KqnzgwGXjIqqK09HGvv+cch4dk82b57t8GxPl2P7kPCr9cOvzlc95eft8b6J952v/XM3/hxdwSHDx8JJk+qCvvk+Sl33F4V7Nq5J6qrxxDPzH4xWLt2fXiPVNlu0ctvRX2FQoCD6whwyEKAAzIKFeAkZHTpeGGwfv3GWJBR4WjxP5cE1VUzswKOTXPr5ApwW7fuCC4bPCa2D/V8DtXUhl8/eP+zrL4333gv/Dr3+VeiPp30dTjpgjAYPvTA32P7l7Al9S1btgdXXHZ9rO/y4/UuHXuFd4CY/fT8WN8NYycHm3/ZFtX1vqlVTwTdzhkYti186Z+xvkIhwMF1BDhkIcABGYUMcMry5Sujuhk8BvYfGQY90759+4Ohl48Ni2yjlm1U6DKLor9kKs45s1+0LPQ+c1lClY35fUi9ri5zNs/Wt3PH7nBZAlxtbV2s78UXXg+XmwtwX325KtY3eMDoqF4IBDi4LmeAo/hdmLjgO/W30BY7duwKKm+aEmtTYcQMN0/OmpfVJnbt2hMFMb3YSHvSGTihB7jt23dl7VNf11wuVIDbsjkTzAhwQOsR4CiJhYkLvlN/C22lh48jR5reA2eGm+HX3BR07tAr1mYytzFJf74BTnQ/L/m9bcUKcHJGUdgC3IIX3wiXWxrgLhs0JqoXAgEOrksMcDp9AFP8LICPihHgZFnV5897LejV44pY37ZtO6O6jRmITNLfkgAnyw0Nv4fLgy4ZldWnL+cKcJ1O6RGrq48ykZdorx46PlxW7/lTJMCZj6EC3bSps4Ixo/8SLg/oPzK2ngQ4qR87dizabu+efVF/IRDg4DoCHCWvAvioUAFOSMhQwUYPIx+8/2nUpwJJW3Tt0js4erQh1qY/3pznXo7Vjx3LPB8p6uyXYoarygl3a71N1Hp9Lro6XFZn35TKCVOix9CpM3C3VN4T9u3fH59rkn5m6gzcU0++ELbLxSGFRoCD6whwlLwK4KNCBjjXmeGqJVq7rfkSar7Ml1CLgQAH1+UV4BobGymeF8BHBLj8tHZbAhzQenkFOADwkU8BDnEEOLiOAAcACQhw/iLAwXUEOABIQIDzFwEOriPAAUACApy/CHBwHQEOABIQ4PxFgIPrCHAAkIAAZ/fFsq/DK09P69y71Veguo4AB9cR4AAgQbECXENDQzCtaqbZ7LTp1U9Gy488/HT4VT7K48sVhf84D/lA4+tG3Rbs3/+b2VUyBDi4jgAHAAmKFeAOHqxp85mrP5zVv837aAnzsdRdEmY/NT/WXiirVn2f9ZilRICD6whwAJDA5QC3adNms6mo9OcrZ8Zqa2vD5WI9j7ra+O24So0AB9cR4AAgQbED3OrVa6MzWQvmZ+5DKssTxt8ZrSv1++59JBag5Abxartbb/lrtJ4YPfLPwe5de6N+fbuamkOxdimdTukZ9evO+8PAaJ3f9h+I7WfSXx6w7n/x4iVhvUvHXlGffK82b7/1YdZzEfK1vv5otJ7eLjZs2BTb5tROF0brFhIBDq4jwAFAgmIHuDO7VoT1S/pdGwsqtgB37tkDorpaV9U/+3R51CYBzuy3LdvqOr2v48k9EvfTr2J4sOT9T8NlFeD2/5p571rnDj0TH0Pa9bN3Ei5Ve64AZ97aL2n/bUWAg+sIcACQoNgBTvlh7fpYULEFOAlRqq6bN/fVsE3e+C/UGTglKXjZ6sp+44ybMOs//fRLMOPRZ8P2B+9/LGxTAU65pfKerO0UaZfywH0zglrt5VJpMwOcfG+jR94atf34w4bwjKWUpP23FQEOriPAAUACVwLcpIkPxuq6FctXxtpyBbhXFr0dBSdVbJoLcGrb+4+Hr/XrNrYqwAl5L53al7zsKmTZDHB79/wa1c8+I/Py8Zo1P4Ql1/7bggAH1xHgACBBWgFu8IDRUZ/U5QycXl+zem1UP/3UPsFZp/eN6rkCnK1uU1tbF1tPD3TyVX+8OydXB1Pumh4utzTAKfrjyddDhzIXSKi6Tuq7du2J1YuBAAfXEeAAIEEaAe6bb1aHy8s+/zro3m1wuKwHuGdnL4jWnXhb5mICXa4A93vD72F95uNzwvLxR59HfSZZ78IeQ6PnoPYz/JqbomX5bDhZvqjnFWG9JQEu3H/PoUH/ihGx/cv7AmV540+/BB1OuiBre6lL+9AhY6PtBvQfGVunEAhwcB0BDgASFCvApcUMQ9VVTwRdu/SOtSGDAAfXEeAAIEF7D3BJbSDAwX0EOABI0B4D3FmnV4QXAqiLAZ6ZvcBcDQEBDu4jwAFAgvYW4JA/AhxcR4ADgAQEOH8R4OA6AhwAJCDA+YsAB9cR4AAgAQHOXwQ4uI4ABwAJCHD+IsDBdQQ4AEhAgPMXAQ6uI8ABQAICnL8IcHAdAQ4AEhDg/EWAg+sIcACQgADnLwIcXEeAA4AEBDh/EeDgOgIcACQgwPmLAAfXEeAAIAEBzl8EOLiOAAcACQhw/iLAwXUEOABIQIDzFwEOriPAAUACApy/CHBwHQEOABIQ4PxFgIPrCHAAkIAA5y8CHFxHgAOABAQ4fxHg4DoCHAAkIMD5iwAH1xHgACABAc5fBDi4jgAHAAkIcP4iwMF1BDgASECA8xcBDq4jwAFAAgKcvwhwcB0BDgASEOD8RYCD6whwAJCAAOcvAhxcR4ADgAQEOH8R4OA6AhwAJCDA+YsAB9cR4AAgAQHOXwQ4uI4ABwAJCHD+IsDBdQQ4AEigAhzF30KAg6sIcACQwDyYU/wrBDi4igAHAHmoqamJHcwp/hXAJQQ4AMgDAY4CuIQABwB5IMBRAJcQ4AAAAMoMAQ4AAKDMEOAAAADKzP8A9bxKm61Ugy8AAAAASUVORK5CYII=>