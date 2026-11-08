# M03 — Góc chia sẻ kiến thức (Blog & Knowledge Sharing)

- **Mục đích:** Xác định ranh giới, kiến trúc thành phần, luồng xử lý Markdown và quy chuẩn SEO cho Module Blog (`/blog` và `/blog/[slug]`).
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Frontend Agent
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [PRD M03 Chi tiết](prd.md)
  - [Vòng đời nội dung (Content Lifecycle)](../../02-domain/content-lifecycle.md)
  - [Quy tắc Design System & 4-Point Spacing](../../07-architecture/design-system-rules.md)
  - [Mô hình CAP và Thiết kế Kiến trúc](../../07-architecture/system-context.md)

---

## 1. Ranh giới module (Module Boundaries)

Module Blog đóng vai trò là kênh thu hút lưu lượng truy cập tự nhiên (Organic Search Traffic / SEO) và xây dựng uy tín chuyên môn cho thương hiệu DataWithLy và Mentor Hứa Thảo Ly thông qua các bài viết phân tích kỹ thuật sâu sắc, hướng dẫn thực hành SQL/Power BI và chia sẻ bài học thực chiến.

### Trong phạm vi (In-Scope)
1. **Trang Danh sách bài viết (`app/blog/page.tsx`):**
   - Header danh mục bài viết kèm bộ lọc phân loại theo chủ đề: *Tất cả, SQL thực chiến, Dashboard & BI, Tư duy kinh doanh, Định hướng nghề DA*.
   - Danh sách thẻ bài viết (Blog Cards) bố cục dạng lưới 3 cột trên Desktop, hiển thị ảnh thumbnail qua `SafeImage`, tag chủ đề, tiêu đề, tóm tắt, ngày đăng và thời gian đọc ước tính.
2. **Trang Đọc bài viết chi tiết (`app/blog/[slug]/page.tsx`):**
   - Thanh tiến độ đọc bài viết (Reading Progress Bar) dính ở đỉnh màn hình (`sticky top-0`).
   - Breadcrumb điều hướng chuẩn cấu trúc Schema.org.
   - Trình phân tích cú pháp Markdown (`react-markdown` + `rehype-highlight` hoặc Shiki) hỗ trợ tô màu cú pháp (Syntax Highlighting) cho các khối mã nguồn SQL, Python, DAX.
   - Mục lục tự động (Table of Contents - TOC) dính cạnh bài viết trên màn hình Desktop.
   - Hộp thông tin tác giả Mentor Hứa Thảo Ly và Khối kêu gọi hành động (Related CTA Box) dẫn link tới khóa học liên quan.
   - Danh sách 3 bài viết gợi ý liên quan (Related Posts).
3. **Tối ưu hóa SEO & Metadata tự động:**
   - Tạo thẻ OpenGraph (OG Image, Title, Description, Canonical URL) động cho từng bài viết.
   - Dữ liệu cấu trúc JSON-LD (`Article`, `BreadcrumbList`).

### Ngoài phạm vi (Out-of-Scope)
- Bình luận trực tiếp trên bài viết (độc giả được định hướng thảo luận trong cộng đồng Zalo/Facebook DataWithLy).
- Hệ thống tài khoản người dùng hoặc tính năng đánh dấu bài viết yêu thích.

---

## 2. Kiến trúc Component

```
[Page: app/blog/page.tsx]
  ├── <HeaderNavigation />
  ├── <BlogHeroHeader />
  ├── <CategoryFilterTabs /> (Client Component: Filter active category)
  ├── <BlogGrid posts={filteredPosts} />
  │     └── Nx <BlogCard /> (SafeImage, Badge, ReadTime)
  └── <Footer />

[Page: app/blog/[slug]/page.tsx]
  ├── <ReadingProgressBar /> (Client Component: scroll percentage)
  ├── <HeaderNavigation />
  ├── <ArticleHeader post={data} />
  ├── <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
  │     ├── <ArticleContent markdown={data.content} /> (Markdown + Code Highlighting)
  │     └── <TableOfContents headings={headings} /> (Desktop Sticky Sidebar)
  ├── <AuthorBioBox author="Hứa Thảo Ly" />
  ├── <RelatedCourseBanner courseId={recommendedCourse} />
  ├── <RelatedArticles posts={relatedPosts} />
  └── <Footer />
```

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M03](prd.md)
