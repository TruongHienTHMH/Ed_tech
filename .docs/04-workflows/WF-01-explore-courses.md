# WF-01 — Khám phá khóa học (Explore Courses)

- **Mục đích:** Đặc tả hành trình người học truy cập Trang chủ, tìm hiểu thông tin tổng quan về thương hiệu DataWithLy, duyệt danh mục 3 khóa học và kích hoạt hành động tiếp theo.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch kiến trúc ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview](../01-product/product-overview.md);
  - [Product Scope](../01-product/product-scope.md);
  - [System Context](../07-architecture/system-context.md);
  - PRD liên quan: [PRD M01 HomePage](../03-modules/M01-homepage/prd.md).

---

## 1. Phân tích định lý CAP áp dụng cho Workflow này

> [!IMPORTANT]
> **LỰA CHỌN CAP: AP (Availability & Partition Tolerance)**
> - **Mục tiêu ưu tiên:** Tính sẵn sàng tối đa (High Availability). Khi học viên truy cập vào website từ bất kỳ đâu, trang chủ và danh mục khóa học phải mở tức thì (thời gian mở trang < 1.2s), không bao giờ bị nghẽn mạng hay sập trắng.
> - **Cơ chế kỹ thuật:** Sử dụng công nghệ **Next.js Incremental Static Regeneration (ISR)** và mạng lưới CDN. Toàn bộ nội dung khóa học được nạp sẵn dưới dạng HTML/JSON tĩnh. Nếu Google Sheets API gặp sự cố phân vùng mạng (Partition) hoặc chạm giới hạn 300 req/phút, hệ thống **vẫn phục vụ bản sao tĩnh hợp lệ gần nhất** cho học viên (chấp nhận tính nhất quán cuối — *Eventual Consistency*).

---

## 2. Tác nhân & Điều kiện kích hoạt

- **Tác nhân chính:** Người xem (Visitor) / Người có nhu cầu học Data Analytics.
- **Điểm bắt đầu (Trigger):** Người dùng nhập địa chỉ website hoặc bấm vào đường link từ mạng xã hội (TikTok, Facebook, Threads, LinkedIn).
- **Điều kiện tiên quyết:** Website đã được build và deploy trên Vercel.

---

## 3. Luồng chính (Happy Path)

| Bước | Hành động tác nhân | Phản hồi của Hệ thống | Ràng buộc kỹ thuật / Quy tắc BR |
|:---:|---|---|---|
| **1** | Người dùng truy cập URL `/` | Trả về trang chủ tĩnh siêu tốc từ CDN Cache (< 1.2s). Hiển thị đầy đủ Top Banner, Header, Hero Section với tone màu Đỏ Mận chuẩn nhận diện DataWithLy. | Đạt chuẩn Core Web Vitals (LCP < 1.2s, CLS < 0.05). |
| **2** | Người dùng xem khối Hero và 3 Card USP | Hiển thị định vị *"Học Data Analytics từ tư duy đến thực hành"*, profile Mentor Hứa Thảo Ly và 3 card giá trị: *Lộ trình bài bản*, *Dự án thực tế*, *Mentor đồng hành & feedback*. | Tuân thủ 4-point spacing system; bọc Error Boundary tại component Hero. |
| **3** | Cuộn chuột xuống khối *"Khóa học tại DataWithLy"* | Hiển thị lưới 3 khóa học thực tế:<br/>1. `SQL for Data Analytics` (12 buổi / 2.990k)<br/>2. `Analytical Thinking & Dashboard Design` (16 buổi / 3.790k)<br/>3. `End-to-End Analytics with SQL & Dashboard Design` (25 buổi / 5.690k) | Dữ liệu được nạp từ Tab `Courses` qua ISR Cache. |
| **4** | Xem thư viện dự án học viên & Feedback | Hiển thị các sản phẩm Dashboard thực tế (Film, AdventureWork, EduTech...) và nhận xét của cựu học viên. | Card có chiều cao chuẩn hóa, hình ảnh tải qua SafeImage fallback. |
| **5** | Người dùng bấm nút CTA `[Xem chi tiết]` tại thẻ khóa học | Chuyển hướng sang trang chi tiết khóa học tương ứng (`/courses/[slug]`) theo [WF-02](WF-02-view-course-details.md). | Next.js Client Navigation (`next/link`). |
| **6** | Người dùng bấm nút CTA `[Đăng ký ngay]` hoặc `[Nhận tư vấn]` | Mở Lead Modal tư vấn theo [WF-03](WF-03-submit-consultation.md) với khóa học tương ứng được chọn sẵn. | Trạng thái Modal Client-side hydrated. |

---

## 4. Nhánh lỗi & Phục hồi sự cố (Alternative & Error Paths)

- **Nhánh A1 (Google Sheets API không phản hồi khi Revalidate):**
  - Hệ thống tiếp tục phục vụ bản cache HTML tĩnh trước đó.
  - Ghi log cảnh báo `SHEETS_FETCH_FAILED` ra server console, không hiển thị lỗi ra phía người dùng.
- **Nhánh A2 (Một hình ảnh trên CDN bị mất link):**
  - Component `SafeImage` phát hiện lỗi nạp ảnh, tự động kích hoạt hiển thị ảnh placeholder thương hiệu DataWithLy, không làm xô lệch khung hình (Zero CLS).

---

[Điểm bắt đầu của bộ docs](../README.md)
