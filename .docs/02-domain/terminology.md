# Thuật ngữ nghiệp vụ — DataWithLy (Business Terminology)

- **Mục đích:** Xây dựng từ điển thuật ngữ nghiệp vụ chuẩn mực và thống nhất cho toàn bộ hệ thống DataWithLy; giải thích rõ ràng các khái niệm chuyên môn giữa đội ngũ giảng dạy, tư vấn tuyển sinh, marketing và đội ngũ kỹ thuật để tránh bất kỳ sự hiểu lầm hay mâu thuẫn định nghĩa nào.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch nghiệp vụ ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Domain Overview](domain-overview.md);
  - [Course Model](course-model.md);
  - Slide bài giảng: `[LYDATA] Data Analytics Courses.pptx.pdf`;
  - [Customer Requirements Notes](../08-project/customer-requirements-notes.md).

---

## 1. Nhóm thuật ngữ Đào tạo & Khóa học (Training & Curriculum)

| Thuật ngữ (Tiếng Anh) | Thuật ngữ (Tiếng Việt) | Định nghĩa & Ý nghĩa nghiệp vụ trong DataWithLy |
|:---|:---|:---|
| **Course** | Khóa học | Một chương trình đào tạo hoàn chỉnh về một chủ đề cụ thể (ví dụ: `SQL for Data Analytics`, `Analytical Thinking & Dashboard Design`). Mỗi khóa học có mã định danh slug duy nhất, mức học phí niêm yết và thời lượng số buổi xác định. |
| **Cohort** | Đợt khai giảng / Lớp học | Một đợt mở lớp tuyển sinh cụ thể trong năm (ví dụ: `K11 - Khai giảng giữa tháng 11/2026`). Mỗi cohort có ngày khai giảng, lịch học trong tuần và sĩ số học viên giới hạn để đảm bảo chất lượng kèm cặp. |
| **Syllabus / Curriculum** | Giáo trình / Lộ trình chi tiết | Toàn bộ danh sách các module kiến thức, tuần học và nội dung chi tiết của từng buổi học (từ Buổi 1 đến Buổi 25), bao gồm mục tiêu lý thuyết và bài tập thực hành doanh nghiệp. |
| **Accordion** | Giao diện xếp chồng đóng/mở | Thành phần giao diện người dùng cho phép bấm vào từng buổi học để mở rộng xem chi tiết và thu gọn lại, giúp giáo trình dài 25 buổi hiển thị gọn gàng, trực quan mà không làm rối mắt người học. |
| **Live Online Class** | Lớp học trực tuyến tương tác trực tiếp | Hình thức học tập qua phòng học Zoom Meeting tương tác 2 chiều 100% giữa Mentor Hứa Thảo Ly và học viên, có sửa bài tập trực tiếp và giải đáp thắc mắc ngay trong giờ học (khác với hình thức xem video quay sẵn). |
| **Capstone Project** | Dự án tốt nghiệp thực chiến | Đề tài phân tích dữ liệu quy mô lớn (Cohort Analysis, RFM User Segmentation, E-commerce Funnel) do chính học viên thực hiện trên bộ dữ liệu thực tế ẩn danh để hoàn thiện Portfolio xin việc. |
| **Business Problem** | Bài toán kinh doanh | Vấn đề thực tế mà một doanh nghiệp đang gặp phải (ví dụ: tỷ lệ khách hàng rời bỏ tăng cao, doanh thu sụt giảm). Khóa học đào tạo học viên bắt đầu từ bài toán kinh doanh trước khi viết code. |
| **Metrics / KPI** | Chỉ số đo lường kinh doanh | Các đại lượng định lượng (ví dụ: Retention Rate, Churn Rate, AOV, LTV, DAU/MAU) được tính toán từ dữ liệu để đánh giá sức khỏe doanh nghiệp và đưa ra quyết định. |
| **Data Storytelling** | Kể chuyện bằng dữ liệu | Kỹ năng tổng hợp kết quả phân tích thành một câu chuyện logic, trực quan qua Slide thuyết trình và Dashboard để thuyết phục cấp trên và các bên liên quan ra quyết định hành động. |

---

## 2. Nhóm thuật ngữ Tuyển sinh & Khách hàng tiềm năng (Leads & Enrollment)

| Thuật ngữ | Ý nghĩa nghiệp vụ trong DataWithLy |
|:---|:---|
| **Visitor / Prospect** | **Người quan tâm / Người truy cập:** Người dùng duyệt website DataWithLy để xem thông tin khóa học, đọc blog hoặc xem dự án học viên nhưng chưa gửi thông tin liên hệ. |
| **Lead (Hồ sơ đăng ký)** | **Khách hàng tiềm năng:** Một lượt người dùng điền đầy đủ thông tin vào Modal Form và bấm gửi thành công. Hồ sơ bao gồm: Họ tên, Số điện thoại, Email, Khóa học quan tâm, Khung giờ hẹn gọi và nguồn chiến dịch quảng cáo. |
| **Lead Lifecycle** | **Vòng đời xử lý hồ sơ:** Chu trình chuyển đổi trạng thái của một Lead từ khi nộp form (`NEW`), được tư vấn viên liên hệ (`CONTACTING`), tư vấn lộ trình (`CONSULTED`), đến khi hoàn tất học phí nhập học (`ENROLLED`) hoặc hủy (`DROPPED`). |
| **Idempotency Token (`submission_id`)** | **Mã chống gửi trùng:** Một chuỗi định danh duy nhất (UUIDv4) được tạo ra cho mỗi lượt mở form. Dù học viên có lỡ tay bấm nút gửi 2 - 3 lần liên tục, hệ thống chỉ ghi nhận duy nhất 1 dòng hồ sơ trên Google Sheets. |
| **Honeypot Anti-Bot** | **Bẫy bot tự động:** Một ô nhập liệu kỹ thuật được ẩn hoàn toàn khỏi mắt người dùng thật. Chỉ có bot tự động quét mã mới điền dữ liệu vào ô này. Nếu ô có chữ, hệ thống tự động loại bỏ mà không lưu vào bảng tính. |
| **Rate Limiting** | **Giới hạn tần suất:** Cơ chế kỹ thuật giới hạn mỗi địa chỉ IP chỉ được gửi biểu mẫu tối đa 3 lần trong vòng 1 phút, nhằm ngăn chặn các hành vi cố tình spam phá hoại. |
| **PII (Personally Identifiable Information)** | **Thông tin định danh cá nhân:** Các dữ liệu nhạy cảm của học viên (Họ tên, SĐT, Email). Tuân thủ Nghị định 13/2023/NĐ-CP, PII tuyệt đối không được đưa vào Google Analytics, URL query hay nhật ký console công khai. |

---

## 3. Nhóm thuật ngữ Tiếp thị số & Đo lường (Marketing & Tracking)

| Thuật ngữ | Ý nghĩa nghiệp vụ trong DataWithLy |
|:---|:---|
| **UTM Parameters** | **Tham số theo dõi chiến dịch:** Các đoạn mã gắn ở đuôi đường link chia sẻ (ví dụ: `?utm_source=tiktok&utm_campaign=k11_tuyensinh`). Website tự động trích xuất các tham số này để lưu kèm hồ sơ học viên, giúp Chị Ly biết chính xác học viên đến từ bài đăng hay kênh quảng cáo nào. |
| **Conversion Event** | **Sự kiện chuyển đổi:** Hành vi quan trọng mà người dùng thực hiện trên website mang lại giá trị cho doanh nghiệp (ví dụ: `click_cta_hero`, `open_lead_modal`, `submit_lead_success`). |
| **Social Proof / Testimonial** | **Bằng chứng xã hội / Đánh giá học viên:** Lời nhận xét, hình ảnh avatar và chức danh thực tế của học viên khóa trước đã tốt nghiệp và đi làm tại các doanh nghiệp (Shopee, Tiki, ACB, Momo...), dùng để củng cố niềm tin cho học viên mới. |
| **Trust Bar** | **Dải logo bảo chứng:** Băng chuyền chuyển động ngang (Infinite Marquee) hiển thị các thương hiệu doanh nghiệp hoặc tập đoàn công nghệ mà học viên DataWithLy đã trúng tuyển hoặc áp dụng kỹ năng thực tế. |

---

## 4. Nhóm thuật ngữ Quản trị Nội dung (Google Sheets CMS & Tech)

| Thuật ngữ | Ý nghĩa nghiệp vụ trong DataWithLy |
|:---|:---|
| **Headless CMS** | **Hệ thống quản trị nội dung phi giao diện:** Việc sử dụng Google Sheets làm nơi nhập liệu và lưu trữ nội dung; website Next.js đóng vai trò đọc dữ liệu này và vẽ nên giao diện người dùng mà không cần xây dựng trang Admin web riêng biệt. |
| **Public Content Sheet** | **Bảng tính nội dung công khai (File 1):** Tệp Google Sheets chứa 9 tab dữ liệu hiển thị trên website (Courses, Curriculum, Packages, Mentors, Testimonials, StudentProjects, Blogs, Partners, SiteConfig). Website chỉ có quyền ĐỌC. |
| **Private Leads Sheet** | **Bảng tính học viên bảo mật (File 2):** Tệp Google Sheets độc lập chỉ dùng để lưu trữ danh sách đăng ký tư vấn. Website chỉ có quyền GHI một chiều qua Webhook, tuyệt đối không có quyền đọc danh sách học viên ra ngoài. |
| **ISR (Incremental Static Regeneration)** | **Tái tạo trang tĩnh gia tăng:** Công nghệ của Next.js giúp trang web chạy dưới dạng HTML tĩnh siêu tốc (< 1.2s), nhưng tự động làm mới nội dung mới nhất từ Google Sheets định kỳ hoặc tức thì khi người quản trị bấm nút *"Xuất bản"*. |
| **On-demand Revalidation** | **Làm mới bộ nhớ đệm theo yêu cầu:** Tính năng khi Chị Ly bấm *"LY DATA CMS -> Xuất bản thay đổi lên Web"*, một tín hiệu Webhook sẽ được bắn sang Next.js để xóa cache cũ và nạp ngay nội dung mới trên toàn cầu sau 1 - 2 giây. |
| **Data Linting** | **Quét lỗi dữ liệu tự động:** Tính năng 1-Click trên menu Google Sheets giúp duyệt qua tất cả các ô tính, tự động tô màu đỏ các ô bị nhập sai định dạng hoặc để trống trước khi xuất bản lên website. |
| **Formula Injection Sanitization** | **Khử trùng công thức:** Tự động chèn dấu nháy đơn `'` trước các ký tự `=`, `+`, `-`, `@` khi lưu vào Google Sheets để ngăn chặn kẻ xấu cố tình chèn mã độc thực thi vào bảng tính của Chị Ly. |
| **LockService** | **Cơ chế khóa an toàn:** Thuật toán hàng đợi trong Google Apps Script giúp khóa tạm thời bảng tính trong tích tắc để ghi dữ liệu tuần tự, đảm bảo không bao giờ bị mất lead khi có nhiều học viên cùng bấm nộp trong cùng một giây. |

---

[Điểm bắt đầu của bộ docs](../README.md)
