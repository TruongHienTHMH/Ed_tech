# Tiêu Chuẩn NFR: Tối Ưu Hóa Công Cụ Tìm Kiếm (SEO & Social Sharing)

- **Mục đích:** Đặc tả các tiêu chuẩn kỹ thuật về SEO On-page, cấu trúc thẻ OpenGraph mạng xã hội, dữ liệu có cấu trúc Schema.org JSON-LD và sơ đồ trang web tự động, giúp thương hiệu **DataWithLy** và các bài viết của Mentor Hứa Thảo Ly đạt thứ hạng cao tự nhiên trên Google.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người quản lý:** TechLead & SEO Specialist
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Biên bản yêu cầu bổ sung](../references/additional-requirements.md)
  - [Module Góc chia sẻ M03](../03-modules/M03-blog/README.md)
  - [Google Search Central SEO Guidelines](https://developers.google.com/search/docs)

---

## 1. Bảng Tiêu Chuẩn SEO Chi Tiết (NFR-SEO-001 đến NFR-SEO-006)

| Mã NFR | Tiêu chuẩn chất lượng | Phạm vi áp dụng | Ngưỡng cam kết & Hành vi hệ thống | Phương pháp kiểm tra | Mức ưu tiên |
|:---:|---|---|---|---|:---:|
| **NFR-SEO-001** | **Thẻ Meta Động Tự Động (Dynamic Metadata)** | Toàn bộ các trang | Tự động sinh thẻ `<title>` và `<meta name="description">` độc nhất cho từng trang:<br>• Độ dài Title: **50 - 60 ký tự** (chứa từ khóa chính + thương hiệu DataWithLy).<br>• Độ dài Description: **140 - 160 ký tự** (tóm tắt súc tích, kích thích click). | Kiểm tra mã nguồn trang (`view-source:`) và SEO Meta in 1-Click Chrome Extension. | **P0** |
| **NFR-SEO-002** | **Thẻ Xem Trước Mạng Xã Hội (OpenGraph & Twitter)** | Tất cả các link chia sẻ | Tự động sinh đầy đủ thẻ `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card: "summary_large_image"`:<br>• Ảnh đại diện OpenGraph tỉ lệ vàng **1200 x 630 pixel** hiển thị sắc nét khi dán link lên Facebook, Zalo, LinkedIn, Telegram. | Facebook Sharing Debugger, Twitter Card Validator. | **P0** |
| **NFR-SEO-003** | **Dữ Liệu Có Cấu Trúc (JSON-LD Structured Data)** | Trang khóa học & Blog | Nhúng trực tiếp các đối tượng Schema.org vào thẻ `<script type="application/ld+json">`:<br>• Trang Khóa học: Schema **`Course`** (Tên, mô tả, giảng viên Hứa Thảo Ly, học phí, định dạng Zoom).<br>• Trang Blog: Schema **`Article`** (Tiêu đề, ngày đăng, tác giả, ảnh đại diện).<br>• Trang chủ: Schema **`Organization`** & **`BreadcrumbList`**. | Google Rich Results Test (Đạt chuẩn 100% không có lỗi hoặc cảnh báo). | **P1** |
| **NFR-SEO-004** | **Phân Cấp Ngữ Nghĩa HTML5 (Semantic HTML)** | Toàn bộ cây DOM | • Mỗi trang chỉ có **đúng 1 thẻ `<h1>` duy nhất** cho tiêu đề chính.<br>• Phân cấp tiêu đề phụ tuần tự: `<h2>` ➔ `<h3>` (không nhảy cóc từ H1 xuống H3).<br>• Sử dụng các thẻ ngữ nghĩa chuẩn: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. | W3C Markup Validation Service, Lighthouse SEO Audit score = 100 điểm. | **P0** |
| **NFR-SEO-005** | **Sitemap & Robots.txt Động** | Route `/sitemap.xml` & `/robots.txt` | • Tuyến đường `/sitemap.xml` tự động sinh danh sách toàn bộ các URL khóa học và bài blog đang hoạt động (`is_active = TRUE`), cập nhật ngay khi có bài mới.<br>• `/robots.txt` cho phép bot Google quét toàn bộ nội dung công khai, chặn quét các trang nội bộ (`/api/`, `/admin/`). | Truy cập trực tiếp `https://datawithly.edu.vn/sitemap.xml` và `robots.txt`. | **P1** |
| **NFR-SEO-006** | **Chuẩn Hóa Đường Dẫn Chính Thức (Canonical URL)** | Toàn bộ URL | Khai báo thẻ `<link rel="canonical" href="...">` chuẩn hóa tên miền gốc `https://datawithly.edu.vn`. Tự động chuyển hướng mã HTTP 301 từ các đường dẫn phụ (có dấu gạch chéo cuối trang hoặc link không có HTTPS). | Kiểm tra thẻ canonical trong `<head>` và response header HTTP 301. | **P1** |

---

## 2. Cấu Trúc Dữ Liệu Schema JSON-LD Mẫu Cho Khóa Học

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "SQL for Data Analytics",
  "description": "Khóa học truy vấn dữ liệu SQL thực chiến từ số 0 cùng Mentor Hứa Thảo Ly (Ex Senior DA tại MoMo, Tiki, ACB).",
  "provider": {
    "@type": "Organization",
    "name": "DataWithLy",
    "sameAs": "https://datawithly.edu.vn"
  },
  "instructor": {
    "@type": "Person",
    "name": "Hứa Thảo Ly",
    "jobTitle": "Lead Data Analyst"
  },
  "offers": {
    "@type": "Offer",
    "price": "2990000",
    "priceCurrency": "VND",
    "availability": "https://schema.org/InStock",
    "url": "https://datawithly.edu.vn/courses/sql-for-data-analytics"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "duration": "PT24H"
  }
}
```

---

## 3. Kịch Bản Nghiệm Thu SEO (SEO Acceptance Criteria)

| Mã AC | Kịch bản kiểm tra | Hành động kích hoạt | Tiêu chí nghiệm thu Đạt |
|---|---|---|---|
| **AC-SEO-01** | Kiểm tra hiển thị xem trước khi dán link | Dán link một bài blog hoặc khóa học lên khung chat Zalo / Facebook Messenger. | Hộp thoại xem trước xuất hiện ngay với ảnh thumbnail sắc nét, tiêu đề và mô tả chính xác, không bị hiện ảnh trắng. |
| **AC-SEO-02** | Kiểm thử Google Rich Results | Dán URL khóa học vào công cụ Google Rich Results Test (`search.google.com/test/rich-results`). | Công cụ xác nhận nhận diện thành công Rich Snippet kiểu **"Course"** với đầy đủ tên khóa, học phí VNĐ và thông tin giảng viên. |
| **AC-SEO-03** | Điểm số Lighthouse SEO | Chạy audit SEO trên công cụ Google Lighthouse (Chrome DevTools). | Điểm số SEO đạt tuyệt đối **100/100 điểm** (đầy đủ thẻ meta, thẻ alt cho hình ảnh, thẻ canonical, và phân cấp tiêu đề chuẩn). |
| **AC-SEO-04** | Kiểm tra Sitemap tự động | Thêm một bài viết blog mới trên Google Sheets tab `blog_posts` ➔ Mở xem `/sitemap.xml`. | URL của bài viết mới xuất hiện ngay lập tức trong danh sách sitemap với thẻ `<lastmod>` chuẩn ngày giờ hiện tại. |

---

[Quay lại Mục lục NFR](README.md) | [Đến NFR Khả năng quan sát](observability.md)
