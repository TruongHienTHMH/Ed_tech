# M05 — Quản lý nội dung (Content Management & CMS)

- **Mục đích:** Xác định ranh giới, kiến trúc đồng bộ nội dung không cần chạm mã nguồn (Zero-Code Content Delivery) qua Google Sheets và Next.js On-Demand ISR.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Fullstack Agent
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [PRD M05 Chi tiết](prd.md)
  - [Vòng đời nội dung (Content Lifecycle)](../../02-domain/content-lifecycle.md)
  - [Quy tắc nghiệp vụ (Business Rules BR-06 đến BR-12)](../../02-domain/business-rules.md)
  - [Workflow Xuất bản nội dung (WF-05)](../../04-workflows/WF-05-publish-content.md)
  - [Mô hình CAP và Thiết kế Kiến trúc](../../07-architecture/system-context.md)
  - [Đặc tả API Endpoint](../../07-architecture/api-design.md)

---

## 1. Ranh giới module (Module Boundaries)

Module M05 đóng vai trò là "bộ não dữ liệu" cho toàn bộ nội dung công khai của website DataWithLy. Thay vì sử dụng các hệ thống CMS phức tạp nặng nề đòi hỏi chi phí hosting và bảo trì cao (như Strapi, Sanity hay WordPress), hệ thống sử dụng **Google Sheets làm Headless CMS** kết hợp lớp đồng bộ an toàn (Data Sync Pipeline) và Edge Caching của Next.js.

```
[Google Sheets CMS (Public Content Sheet)]
       │
       ├──> [1-Click Data Linter (Kiểm tra lỗi dữ liệu & URL ảnh)]
       │
       ▼ (Google Apps Script / Webhook Trigger)
[Next.js Revalidation API: POST /api/revalidate?secret=...]
       │
       ▼ (revalidateTag / revalidatePath)
[Next.js Server ISR Cache (In-Memory / Edge CDN)]
       │
       ▼ (Đọc dữ liệu < 1.2s - Chuẩn AP)
[Client Web Application (HomePage, Course Details, Blog)]
```

### Trong phạm vi (In-Scope)
1. **Mô hình Dữ liệu 9 Bảng chuẩn (9 Tabs Schema):**
   - Định nghĩa cấu trúc chuẩn cho 9 tab trong file Google Sheets Quản trị nội dung: `courses`, `curriculum`, `packages_pricing`, `student_projects`, `mentor_profile`, `testimonials`, `blog_posts`, `site_settings`, `faq`.
2. **Công cụ kiểm tra tính toàn vẹn dữ liệu (1-Click Data Linter):**
   - Script kiểm tra các lỗi phổ biến trước khi xuất bản: thiếu khóa chính (slug, id), trùng lặp slug, lỗi định dạng ngày tháng, và link ảnh hỏng.
3. **Webhook Kích hoạt Cập nhật Tức thì (On-Demand ISR Revalidation):**
   - API route nội bộ: `POST /api/revalidate`.
   - Xác thực bí mật `REVALIDATION_SECRET` qua header hoặc query param.
   - Hỗ trợ làm mới cache chọn lọc theo tag (`courses`, `blog`, `homepage`, `all`).
4. **Cơ chế phòng hộ hình ảnh (SafeImage Component & Image Fallback):**
   - Xử lý các đường link ảnh ngoài (Google Drive, Imgur, Cloudinary) bị hỏng, bị chặn truy cập hoặc quá hạn. Tự động hiển thị SVG placeholder chuẩn màu thương hiệu Crimson.
5. **Bộ dữ liệu tĩnh dự phòng cục bộ (Static Fallback Cache):**
   - Lưu trữ bản snapshot dữ liệu chuẩn tại thư mục `lib/cms/fallbacks/` đảm bảo website luôn hoạt động 100% ngay cả khi Google Sheets bị sập hoặc hết quota API.

### Ngoài phạm vi (Out-of-Scope)
- Quản lý dữ liệu học viên và thông tin Lead (thuộc phạm vi riêng biệt của [M04 Lead Capture](../M04-lead-capture/README.md) và Private Leads Sheet).
- Trình soạn thảo văn bản phong phú trực tiếp trên giao diện web (toàn bộ nội dung Markdown được biên tập trực tiếp trên Google Sheets hoặc Google Docs).

---

## 2. Các thành phần chính (Components & File Structure)

- `lib/cms/google-sheets-client.ts`: Module kết nối và truy vấn Google Sheets qua Google Sheets API v4 hoặc Public CSV Export.
- `lib/cms/content-fetcher.ts`: Service Layer cung cấp các hàm lấy dữ liệu sạch có cache (`getCourses()`, `getCourseBySlug()`, `getBlogPosts()`, v.v.).
- `lib/cms/data-linter.ts`: Logic kiểm tra tính hợp lệ của dữ liệu trước khi nạp vào bộ nhớ.
- `app/api/revalidate/route.ts`: Endpoint xử lý Webhook làm mới ISR Cache.
- `components/common/SafeImage.tsx`: Component hiển thị ảnh Next.js tối ưu có cơ chế bắt lỗi `onError` và fallback tự động.
- `lib/cms/fallbacks/`: Thư mục chứa các file JSON dự phòng khẩn cấp (`homepage.json`, `courses.json`, `blog.json`).

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M05](prd.md)
