# WF-02 — Xem chi tiết khóa học (View Course Details)

- **Mục đích:** Đặc tả hành trình người học xem chi tiết mục tiêu, đối tượng phù hợp, visual flow tiếp cận bài toán và Accordion giáo trình (Syllabus) chi tiết của từng khóa học lẻ.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch kiến trúc ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview](../01-product/product-overview.md);
  - [System Context](../07-architecture/system-context.md);
  - PRD liên quan: [PRD M02 Course Details](../03-modules/M02-course-details/prd.md);
  - Slide bài giảng: `[LYDATA] Data Analytics Courses.pptx.pdf`;
  - Bảng yêu cầu nội dung: `Website LY DATA - content to fill.xlsx`.

---

## 1. Phân tích định lý CAP áp dụng cho Workflow này

> [!IMPORTANT]
> **LỰA CHỌN CAP: AP (Availability & Partition Tolerance)**
> - **Mục tiêu ưu tiên:** Tính sẵn sàng tuyệt đối (Availability). Khi học viên bấm vào link khóa học từ quảng cáo Facebook/TikTok Ads, trang chi tiết phải mở ra ngay lập tức, không để học viên phải chờ đợi gọi API vào Google Sheets.
> - **Chiến lược kỹ thuật:** 3 trang khóa học (`/courses/sql-for-data-analytics`, `/courses/analytical-thinking-dashboard-design`, `/courses/end-to-end-analytics-sql-dashboard`) được sinh sẵn hoàn toàn bằng hàm `generateStaticParams()` tại thời điểm build. Dữ liệu Syllabus Accordion được nạp sẵn từ tab `Curriculum` và lưu trên Vercel Edge CDN.

---

## 2. Tác nhân & Điều kiện kích hoạt

- **Tác nhân chính:** Người học đang quan tâm một khóa học cụ thể.
- **Điểm bắt đầu:** Bấm nút `[Xem chi tiết]` từ Trang chủ hoặc truy cập trực tiếp qua URL chiến dịch marketing (có kèm tham số UTM).

---

## 3. Luồng chính (Happy Path)

| Bước | Hành động tác nhân | Phản hồi của Hệ thống | Ràng buộc kỹ thuật / Quy tắc BR |
|:---:|---|---|---|
| **1** | Học viên mở trang `/courses/[slug]` | Hiển thị trang khóa học tĩnh với Hero khóa học, breadcrumb điều hướng, học phí ưu đãi và thanh Sticky Enrollment Card cố định ở cạnh phải (Desktop) hoặc thanh đáy (Mobile). | Đạt chuẩn SEO với thẻ Meta Title, Meta Description và Schema `Course`. |
| **2** | Xem visual flow tiếp cận bài toán | Hiển thị chu trình 5 bước trực quan: `Business Problem → Metrics → Analysis → Insight → Dashboard`. | Thay thế cho lộ trình công cụ thông thường theo yêu cầu khách hàng. |
| **3** | Xem khối *"Khóa học này dành cho ai?"* | Trình bày 3 nhóm đối tượng phù hợp và các cam kết đầu ra (có icon tick xanh). | Dữ liệu đồng bộ từ slide và bảng nội dung. |
| **4** | Tương tác với Khối Lộ trình Giáo trình (Curriculum Accordion) | - Hiển thị danh sách chia theo Tuần và từng Buổi học (12 - 25 buổi).<br/>- Học viên bấm nút `[Mở rộng tất cả]` -> Toàn bộ các buổi học mở ra đồng loạt với hiệu ứng chuyển động mượt mà.<br/>- Học viên bấm vào từng buổi -> Accordion mở ra hiển thị các gạch đầu dòng chi tiết lý thuyết và bài tập thực hành. | Ứng dụng CSS transition, không giật khung hình; tuân thủ 4-point spacing. |
| **5** | Xem bảng học phí & Gói Combo | Hiển thị mức giá niêm yết rõ ràng và bảng so sánh quyền lợi giữa khóa lẻ và gói Combo toàn diện. | Dữ liệu nạp từ tab `Packages_Pricing`. |
| **6** | Bấm nút CTA `[Đăng ký ngay]` hoặc `[Nhận tư vấn khóa học này]` | Mở Modal đăng ký tư vấn theo [WF-03](WF-03-submit-consultation.md) với trường Khóa học quan tâm được khóa cố định theo khóa học hiện tại. | Tự động truyền tham số `course_id` vào Form State. |

---

## 4. Nhánh lỗi & Xử lý URL không tồn tại

- **Khóa học không tồn tại (Slug sai):**
  - Hàm `generateStaticParams` không tìm thấy slug tương ứng -> Tự động chuyển hướng gọi hàm `notFound()` của Next.js.
  - Hiển thị trang 404 chuẩn thương hiệu DataWithLy với nút quay về trang chủ hoặc xem các khóa học khác.

---

[Điểm bắt đầu của bộ docs](../README.md)
