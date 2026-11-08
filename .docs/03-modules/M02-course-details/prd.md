# PRD M02 — Chi tiết khóa học (Course Details)

- **Mục đích:** Đặc tả giao diện, cấu trúc nội dung, tương tác đề cương và tiêu chí nghiệm thu cho trang Chi tiết Khóa học (`/courses/[slug]`).
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người duyệt:** TechLead & Client Review
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [Workflow Xem chi tiết khóa học (WF-02)](../../04-workflows/WF-02-view-course-details.md)
  - [Mô hình dữ liệu khóa học (Course Model)](../../02-domain/course-model.md)
  - [Quy tắc Design System 4-Point Spacing](../../07-architecture/design-system-rules.md)
  - Slide bài giảng: `[LYDATA] Data Analytics Courses.pptx.pdf`
  - Bảng nội dung: `Website LY DATA - content to fill.xlsx`

---

## 1. Người dùng và mục tiêu (Users & Goals)

| Tác nhân | Mục tiêu / Nhu cầu | Kết quả mong đợi |
|---|---|---|
| **Người mới bắt đầu (Beginner)** | Xem khóa học *SQL for Data Analytics* xem có cần biết lập trình trước không, lịch học ra sao, học phí bao nhiêu. | Hiểu ngay điều kiện tiên quyết (không cần nền tảng), lịch học Zoom buổi tối phù hợp người đi làm, học phí rõ ràng không ẩn phí. |
| **Người đã có nền tảng (Upskiller)** | Tìm hiểu khóa *Analytical Thinking & Dashboard Design* để nâng cấp tư duy phân tích và kỹ năng vẽ biểu đồ kinh doanh. | Thấy rõ phương pháp giải bài toán thực tế (Metrics, Deep-dive Insight) thay vì chỉ học công cụ thuần túy. |
| **Người muốn chuyển ngành (Career Switcher)** | Cân nhắc khóa học trọn gói *End-to-End Analytics* để có Portfolio hoàn chỉnh và được review CV. | Thấy lộ trình toàn diện 25 buổi, quyền lợi tặng kèm Review CV 1-on-1 từ Mentor Hứa Thảo Ly, mức tiết kiệm khi đăng ký trọn gói. |

---

## 2. Danh mục 3 Khóa học cốt lõi & Cấu hình Slug

Hệ thống hỗ trợ chính xác 3 đường dẫn trang chi tiết:

1. `/courses/sql-for-data-analytics`
   - **Tên:** SQL for Data Analytics
   - **Thời lượng:** 12 buổi (6 tuần) \| Học phí ưu đãi: **2.990.000 VNĐ** (Giá gốc 3.500.000 VNĐ).
   - **Yêu cầu đầu vào:** Beginner - Không yêu cầu kiến thức lập trình trước.
   - **Trọng tâm:** Cú pháp SQL thực chiến, DBeaver, PostgreSQL/MySQL, xử lý dữ liệu thực tế từ bài toán kinh doanh.
2. `/courses/analytical-thinking-dashboard-design`
   - **Tên:** Analytical Thinking & Dashboard Design
   - **Thời lượng:** 16 buổi (8 tuần) \| Học phí ưu đãi: **3.790.000 VNĐ** (Giá gốc 4.500.000 VNĐ) + Tặng kèm Review CV.
   - **Yêu cầu đầu vào:** Đã có kiến thức truy vấn dữ liệu căn bản.
   - **Trọng tâm:** Tư duy chỉ số kinh doanh (Business Metrics), thiết kế Dashboard trực quan trên Power BI/Tableau, kể chuyện với dữ liệu (Data Storytelling).
3. `/courses/end-to-end-analytics`
   - **Tên:** End-to-End Analytics with SQL & Dashboard Design
   - **Thời lượng:** 25 buổi (12 tuần) \| Học phí ưu đãi: **5.690.000 VNĐ** (Giá gốc 6.780.000 VNĐ) + Tặng kèm Review CV & Mock Interview 1-on-1.
   - **Yêu cầu đầu vào:** Người muốn theo đuổi nghề Data Analyst chuyên nghiệp từ số 0.
   - **Trọng tâm:** Trọn bộ từ trích xuất dữ liệu nâng cao đến xây dựng sản phẩm Portfolio thực chiến.

---

## 3. Bố cục 7 Phần & Yêu cầu Chức năng chi tiết

### 1. Course Hero Section
- **Breadcrumbs:** `Trang chủ > Khóa học > [Tên khóa học]`.
- **Badges thông tin:** 
  - Nhãn cấp độ (ví dụ: *Beginner Friendly*).
  - Nhãn thời lượng (ví dụ: *12 buổi / 6 tuần*).
  - Nhãn hình thức (*Live Online qua Zoom*).
  - Nhãn lịch học (*Thứ 3 - Thứ 5 lúc 20:00 - 22:00*).
- **Học phí công khai:** Hiển thị giá ưu đãi màu Crimson đậm (`text-crimson-700 font-bold text-3xl`) kèm giá gốc gạch ngang (`line-through text-slate-400`).
- **Nút CTA kép:**
  - Nút chính `[Đăng ký tư vấn ngay]`: Mở Modal Lead Form (M04) ghim sẵn `course_id`.
  - Nút phụ `[Tải đề cương chi tiết (PDF)]`: Tải tài liệu hoặc cuộn xuống phần Accordion.

### 2. Sơ đồ Tư duy Phương pháp học (Visual Methodology Flow)
Hiển thị sơ đồ khối 5 bước chuẩn hóa tư duy phân tích thực tế:
```
[1. Business Problem] ➔ [2. Metrics Definition] ➔ [3. Data Extraction (SQL)] ➔ [4. Deep-dive Insight] ➔ [5. Actionable Dashboard]
```
Mỗi bước có mô tả 2 dòng giải thích vì sao Mentor Thảo Ly chú trọng tư duy bài toán trước khi gõ câu lệnh.

### 3. Đề cương môn học tương tác (Interactive Curriculum Accordion)
- **Danh sách buổi học:** Đọc từ tab `curriculum` theo `course_id` sắp xếp theo `sort_order`.
- **Điều khiển tiện lợi:** Có nút bấm **[Mở rộng tất cả]** và **[Thu gọn tất cả]** ở đầu danh sách.
- **Xử lý nội dung Bullets:**
  - Cột `bullets` trong Google Sheets chứa các dòng cách nhau bằng ký tự xuống dòng (`\n` từ thao tác `Alt+Enter`).
  - Frontend tự động tách chuỗi theo `\n` và render thành danh sách `<ul>` với icon checkmark hoặc dấu chấm tròn tinh tế.
- **Đánh dấu cột mốc quan trọng:** Các buổi có bài kiểm tra giữa kỳ (Midterm Project) hoặc báo cáo Portfolio cuối khóa được gắn badge nổi bật màu cam hổ phách (*Cột mốc quan trọng*).

### 4. Đối tượng phù hợp & Yêu cầu đầu vào
- Thẻ 2 cột:
  - Cột 1: *Khóa học này dành cho ai?* (Sinh viên năm cuối, người làm trái ngành kế toán/marketing/sales muốn chuyển sang DA).
  - Cột 2: *Yêu cầu cần chuẩn bị gì?* (Laptop có kết nối mạng internet ổn định, tinh thần kiên trì và hoàn thành bài tập đúng hạn).

### 5. Chuẩn đầu ra & Sản phẩm Portfolio đạt được
- Liệt kê cụ thể những gì học viên tự tay làm được sau khi tốt nghiệp.
- Mockup demo các dự án học viên mẫu để người học hình dung kết quả.

### 6. Bảng học phí & Gợi ý Gói Combo (Combo Upsell)
- Hiển thị thẻ học phí của khóa hiện tại kèm cam kết: *Học lại miễn phí nếu chưa nắm vững kiến thức; Hỗ trợ giải đáp suốt đời trong cộng đồng cựu học viên DataWithLy*.
- Thẻ gợi ý nâng cấp gói Combo (nếu đang ở khóa lẻ SQL hoặc Dashboard): Khuyên học viên nên chọn gói **End-to-End** để tiết kiệm hơn 1.000.000 VNĐ và được tặng suất Review CV 1-on-1.

### 7. Form tư vấn nhúng & FAQ
- Form nhúng nhanh ở chân trang giúp người dùng không cần bật modal mà có thể gõ thông tin ngay.
- Khối câu hỏi thường gặp dạng accordion thu gọn.

---

## 4. Quản lý trạng thái giao diện (5 UI States)

| Trạng thái | Điều kiện kích hoạt | Giao diện hiển thị | Hành vi hệ thống |
|---|---|---|---|
| **1. Bình thường (Normal)** | `slug` khớp với khóa học hợp lệ và `is_active = TRUE`. | Dựng đầy đủ 7 section của trang khóa học với dữ liệu đề cương chuẩn. | Cho phép tương tác mở đóng Accordion, nhấn CTA tư vấn. |
| **2. Đang tải (Loading)** | Chuyển trang hoặc route dynamic đang fetch ISR. | Hiển thị Skeleton Loader chuẩn của Hero và danh sách 12-25 thanh Accordion nhấp nháy xám nhạt (`animate-pulse`). | Bảo đảm CLS < 0.1, giữ nguyên vị trí layout. |
| **3. Không tìm thấy (Not Found / 404)** | `slug` không tồn tại trong danh mục khóa học hoặc `is_active = FALSE`. | Kích hoạt hàm `notFound()` của Next.js. Hiển thị trang 404 thân thiện: *"Khóa học này hiện không tồn tại hoặc đã tạm dừng tuyển sinh"*, kèm nút `[Về danh sách khóa học]`. | Trả về mã trạng thái HTTP 404 chuẩn SEO. |
| **4. Lỗi (Error)** | Sự cố fetch đề cương môn học từ Sheets. | Error Boundary cấp độ trang bắt lỗi. Hiển thị UI: *"Không thể tải nội dung đề cương môn học"* kèm nút `[Tải lại trang]`. | Hệ thống fallback về dữ liệu cục bộ trong `lib/cms/fallbacks/courses.json`. |
| **5. Mở Modal Lead** | Người dùng nhấn nút CTA `[Đăng ký tư vấn ngay]`. | Modal Lead M04 mở lên mượt mà, trường khóa học tự động chọn đúng khóa hiện tại. | Trình duyệt khóa cuộn trang nền (`overflow-hidden`). |

---

## 5. Tiêu chí nghiệm thu (Acceptance Criteria)

| Mã AC | Yêu cầu | Given | When | Then |
|---|---|---|---|---|
| **AC-M02-01** | Truy cập 3 Khóa học | Người dùng truy cập lần lượt 3 URL: `/courses/sql-for-data-analytics`, `/courses/analytical-thinking-dashboard-design`, `/courses/end-to-end-analytics`. | Trang tải xong. | Cả 3 trang tải thành công (< 1.2s), hiển thị đúng tiêu đề, số buổi học (12, 16, 25 buổi) và học phí niêm yết chuẩn xác. |
| **AC-M02-02** | URL không tồn tại | Người dùng gõ URL `/courses/khoa-hoc-khong-ton-tai`. | Nhấn Enter. | Hệ thống hiển thị trang 404 chuẩn SEO của DataWithLy, có nút dẫn về Trang chủ, không bị sập ứng dụng. |
| **AC-M02-03** | Mở rộng / Thu gọn Accordion | Người dùng ở phần Đề cương môn học (Curriculum). | Nhấn nút `[Mở rộng tất cả]`. | Toàn bộ các thanh Accordion của tất cả các buổi học đồng loạt mở ra nội dung chi tiết. Nhấn `[Thu gọn tất cả]` thì đồng loạt đóng lại. |
| **AC-M02-04** | Parse Multiline Bullets | Đề cương buổi 1 trong Sheets có 4 gạch đầu dòng cách nhau bởi `Alt+Enter`. | Xem nội dung buổi 1 trên Accordion. | 4 gạch đầu dòng hiển thị thành 4 mục riêng biệt trong danh sách `<ul>`, phông chữ rõ ràng, không bị lỗi dính dòng. |
| **AC-M02-05** | Ghim sẵn Course ID vào Modal | Người dùng đang ở trang `/courses/analytical-thinking-dashboard-design`. | Nhấn nút `[Đăng ký tư vấn ngay]`. | Modal Lead Form mở lên; trường `Khóa học quan tâm` được ghim sẵn lựa chọn *"Analytical Thinking & Dashboard Design"*. |
| **AC-M02-06** | Combo Upsell | Người dùng xem trang chi tiết khóa lẻ SQL. | Cuộn xuống bảng học phí. | Nhìn thấy gợi ý nâng cấp gói Combo End-to-End với mức tiết kiệm rõ ràng hơn 1.000.000 VNĐ. |
| **AC-M02-07** | Responsive Mobile | Người dùng mở trang chi tiết trên iPhone hoặc điện thoại Android màn hình nhỏ. | Cuộn đọc nội dung và mở Accordion. | Header sticky, chữ không bị tràn màn hình, bảng giá căn chỉnh thành 1 cột dễ đọc, nút CTA luôn dễ bấm với ngón tay cái. |
| **AC-M02-08** | Không có Claim sai sự thật | Đọc toàn bộ nội dung khóa học và giảng viên. | Kiểm tra thông tin cam kết việc làm. | Không có cam kết ảo "bao đỗ Google/Grab"; chỉ nêu rõ cam kết hỗ trợ sửa CV 1-on-1, luyện phỏng vấn và hỗ trợ chuyên môn thực tế từ Mentor. |

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Quay lại README M02](README.md)
