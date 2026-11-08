# Thư mục Báo cáo Tiến độ Dự án (Project PR Reports)

- **Mục đích:** Lưu trữ các bản báo cáo tiến độ và nghiệm thu nội bộ theo mô hình **Local Pull Request (Local PR Reports)**. Mỗi file report tương đương với một đợt bàn giao mốc quan trọng (Milestone Deliverable), giúp Chủ dự án, Khách hàng (Chị Ly) và các kỹ sư dễ dàng kiểm tra:
  - Những hạng mục và checklist cụ thể đã hoàn thành theo format chuẩn tiếng Việt.
  - Các phân tích đánh đổi kỹ thuật (Architectural Trade-offs & Định lý CAP).
  - Danh mục các quy tắc nghiệp vụ, bảo mật và chuẩn thiết kế đã tuân thủ.
  - Bằng chứng đối soát với bản vẽ Figma và kết quả kiểm thử tự động.
- **Người quản lý:** TechLead & Chủ dự án.
- **Cập nhật lần cuối:** 2026-11-08 (Tiến độ hoàn thành: **60% dự án**).

---

## Danh mục các bản Báo cáo (PR Reports Index)

| Mã Báo cáo | Tên đợt bàn giao | Trọng tâm nội dung | Trạng thái |
|:---:|---|---|:---:|
| **[PR-01](PR-01-FOUNDATION-ARCHITECTURE-CAP.md)** | **Foundation, Architecture & CAP Trade-offs** | Hoàn thiện toàn diện nhóm `01-product`, `02-domain`, `07-architecture`, `04-workflows`, chuẩn hóa 4-point spacing system và báo cáo chuyên sâu về định lý CAP. | **Approved / Merged** |
| **[PR-02](PR-02-MODULES-PRD-SPECIFICATIONS.md)** | **Modules PRD & User-Centric Specifications** | Hoàn thiện đặc tả chi tiết 6 module (`M00` - `M05`), Database Schema SQL/ORM, Sổ tay Vận hành & Bàn giao (`09-handover/`), quy tắc BR-13, kiến trúc Caching 5 tầng & chống Memory Leak, và toàn bộ 8 tài liệu NFR (`05-non-functional-requirements/`). | **Approved & Ready for Coding** |
| **[PR-03](PR-03-M00-FOUNDATION-GAS-ENGINE.md)** | **M00: Foundation, Storage & Apps Script CMS** | Thiết lập Storage đa tầng (Cloudflare R2 & Local), Swagger OpenAPI UI `/api-docs`, 15 tệp .gs và 10 modals .html quản trị Google Sheets trọn gói (3,259 dòng bundle). | **Approved & Ready to Merge** |
| **[PR-04](PR-04-M01-M04-HOMEPAGE-LEAD-CAPTURE.md)** | **M01 & M04: Homepage & Secure Lead Capture** | Bố cục 8 phần Trang chủ chuẩn Figma 12:682, hệ thống thu thập Lead an toàn `/api/leads` (chống spam 3 lớp, honeypot, rate limit BR-09, offline local storage fallback, GTM & Attribution tracking). | **Approved & Ready to Merge** |
| **[PR-05](PR-05-M02-COURSE-DETAILS-AND-SEEDER.md)** | **M02: Chi Tiết Khóa Học & Laravel Database Seeder** | Căn chỉnh chi tiết khóa học khớp 100% Figma 12:1277 (cột trái 792px, cột phải 384px sticky), xây dựng module Database Seeder phong cách Laravel (`database/seeders/` + `npm run db:seed`), loại bỏ hoàn toàn seed data thô. | **Approved & Ready to Merge** |
| **[PR-06](PR-06-M03-BLOG-SYSTEM-AND-LEAD-MODAL.md)** | **M03 & Lead Modal: Blog System & Modal Figma 12:3320** | Modal Form tư vấn chuẩn 100% Figma 12:3320 (checkbox coaching, radio cam kết, gradient submit), gắn popup toàn cục. Phân hệ Blog (`/blog` & `/blog/[slug]`) với Reading Progress Bar, Table of Contents scrollspy, code block có nút Copy, Author box. | **Approved & Ready to Merge** |
| **[PR-07](PR-07-CI-QUALITY-GATES.md)** | **CI/CD Quality Gates & PR Template** | Thiết lập GitHub Actions workflow `.github/workflows/ci.yml`, template PR tiếng Việt `.github/PULL_REQUEST_TEMPLATE.md`, scripts `typecheck`, `test`, `ci`, xử lý sạch 100% cảnh báo/lỗi ESLint. | **Approved & Ready to Merge** |

---

## Bản mẫu Pull Request Chuẩn Tiếng Việt
- [Bản mẫu Pull Request Template Tiếng Việt](PULL_REQUEST_TEMPLATE.md)

---

[Quay về điểm bắt đầu của bộ docs](../README.md)
