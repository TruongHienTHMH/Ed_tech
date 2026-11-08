# PRD M05 — Quản lý nội dung (Content Management & CMS)

- **Mục đích:** Đặc tả cấu trúc 9 bảng dữ liệu trên Google Sheets, cơ chế On-Demand ISR Revalidation, công cụ Data Linting và chính sách vận hành nội dung.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người duyệt:** TechLead & Client Review
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [Vòng đời nội dung (Content Lifecycle)](../../02-domain/content-lifecycle.md)
  - [Quy tắc nghiệp vụ BR-06 đến BR-12](../../02-domain/business-rules.md)
  - [Workflow Xuất bản nội dung (WF-05)](../../04-workflows/WF-05-publish-content.md)
  - [Mô hình CAP và Thiết kế Hệ thống](../../07-architecture/system-context.md)
  - [Đặc tả API Endpoint](../../07-architecture/api-design.md)
  - Bảng mẫu: `docs/references/Website LY DATA - content to fill.xlsx`

---

## 1. Người dùng và mục tiêu (Users & Goals)

| Tác nhân | Mục tiêu / Nhu cầu | Kết quả mong đợi |
|---|---|---|
| **Người sáng lập (Founder - Chị Ly)** | Cập nhật học phí, đổi lịch khai giảng, đăng bài blog mới trực tiếp trên giao diện Google Sheets quen thuộc. | Không cần nhờ lập trình viên sửa code; chỉ cần sửa trên Sheets và bấm nút là web cập nhật ngay sau 1 giây. |
| **Biên tập viên (Editor)** | Soạn thảo nội dung khóa học, dự án học viên, thêm bài viết chia sẻ kinh nghiệm. | Được hệ thống cảnh báo sớm nếu gõ sai cú pháp Markdown hoặc link ảnh bị lỗi trước khi đưa lên web. |
| **Độc giả / Học viên** | Đọc nội dung bài viết và xem khóa học nhanh nhất có thể. | Tải trang siêu tốc (< 1.2s), không bao giờ gặp màn hình trắng hay ảnh lỗi hình icon vỡ. |

---

## 2. Đặc tả Chi tiết Schema 9 Bảng dữ liệu (Google Sheets CMS)

File Google Sheets Quản trị Nội dung (Public Content Sheet) bao gồm chính xác 9 tab sau:

### Tab 1: `courses` (Danh mục Khóa học)
| Tên cột | Kiểu dữ liệu | Bắt buộc | Mô tả & Quy tắc | Ví dụ |
|---|---|:---:|---|---|
| `id` | String | Có | Khóa định danh duy nhất (Kebab-case) | `sql-for-data-analytics` |
| `title` | String | Có | Tên khóa học chính thức | `SQL for Data Analytics` |
| `slug` | String | Có | URL thân thiện SEO (duy nhất) | `sql-for-data-analytics` |
| `tag` | String | Có | Thẻ phân loại môn học | `SQL`, `Dashboard`, `End-to-End` |
| `tagline` | String | Không | Khẩu hiệu ngắn gọn | `Chinh phục truy vấn dữ liệu từ số 0` |
| `price_original` | Number | Có | Học phí niêm yết (VNĐ) | `3500000` |
| `price_discounted`| Number | Có | Học phí ưu đãi thực tế (VNĐ) | `2990000` |
| `duration_weeks` | Number | Có | Thời lượng ước tính (tuần) | `6` |
| `duration_hours` | Number | Có | Tổng thời lượng đào tạo (buổi) | `12` |
| `level` | String | Có | Trình độ đầu vào | `Beginner (Không yêu cầu nền tảng)` |
| `format` | String | Có | Hình thức học | `Live Online qua Zoom tương tác` |
| `schedule` | String | Có | Lịch học trong tuần | `Thứ 3 - Thứ 5 (20:00 - 22:00)` |
| `badge_label` | String | Không | Nhãn nổi bật trên thẻ | `Khóa học nền tảng`, `Bán chạy nhất` |
| `sort_order` | Number | Có | Thứ tự hiển thị trên web | `1` |
| `is_active` | Boolean | Có | Cờ xuất bản (`TRUE`/`FALSE`) | `TRUE` |

### Tab 2: `curriculum` (Chi tiết Đề cương từng buổi)
| Tên cột | Kiểu dữ liệu | Bắt buộc | Mô tả & Quy tắc | Ví dụ |
|---|---|:---:|---|---|
| `course_id` | String | Có | Liên kết khóa ngoại đến `courses.id` | `sql-for-data-analytics` |
| `module_number` | Number | Có | Số thứ tự Module / Buổi | `1` |
| `module_title` | String | Có | Tiêu đề nội dung buổi học | `Cơ sở dữ liệu & Truy vấn căn bản` |
| `duration` | String | Có | Thời lượng buổi học | `2 giờ` |
| `bullets` | String (Multiline)| Có | Các gạch đầu dòng chi tiết. **Bắt buộc dùng tổ hợp phím `Alt + Enter` để xuống dòng trong ô**. | `• Cài đặt môi trường DBeaver\n• Cấu trúc bảng và kiểu dữ liệu\n• Mệnh đề SELECT & WHERE` |
| `sort_order` | Number | Có | Thứ tự sắp xếp trong Accordion | `1` |

### Tab 3: `packages_pricing` (Gói Combo & Học phí trọn gói)
| Tên cột | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|---|---|:---:|---|---|
| `package_id` | String | Có | ID gói combo | `combo-all-in-one` |
| `name` | String | Có | Tên gói ưu đãi | `Combo Trọn Bộ: SQL + Dashboard Design` |
| `original_price` | Number | Có | Giá gốc | `6780000` |
| `final_price` | Number | Có | Giá combo ưu đãi | `5690000` |
| `savings` | String | Không | Mức tiết kiệm | `Tiết kiệm 1.090.000đ` |
| `is_popular` | Boolean | Có | Gói nổi bật nhất (`TRUE`/`FALSE`) | `TRUE` |
| `features` | Multiline | Có | Quyền lợi gói (phân tách `Alt+Enter`) | `• 25 buổi Live Online\n• Tặng Review CV 1-on-1` |
| `course_ids` | String | Có | Danh sách id khóa học gộp (phân tách dấu phẩy) | `sql-for-data-analytics,analytical-thinking-dashboard-design` |

### Tab 4: `student_projects` (Dự án Học viên Tiêu biểu)
| Tên cột | Kiểu dữ liệu | Bắt buộc | Mô tả | Ví dụ |
|---|---|:---:|---|---|
| `project_id` | String | Có | Khóa định danh dự án | `project-film-analytics` |
| `title` | String | Có | Tiêu đề dự án thực tế | `Film Industry Revenue Analytics` |
| `category` | String | Có | Ngành / Lĩnh vực | `Entertainment / Box Office` |
| `author_name` | String | Có | Tên học viên thực hiện | `Nguyễn Văn A (K8)` |
| `tools` | String | Có | Công cụ sử dụng (cách nhau dấu phẩy)| `SQL, Power BI, DAX` |
| `metrics` | String | Có | Kết quả / Giá trị bài toán mang lại | `Tăng 23% độ chính xác dự báo chi phí marketing` |
| `image_url` | String | Có | Đường dẫn ảnh mockup dashboard | `https://images.unsplash.com/...` |
| `sort_order` | Number | Có | Thứ tự hiển thị trong khối 2x2 | `1` |
| `is_active` | Boolean | Có | Cờ hiển thị (`TRUE`/`FALSE`) | `TRUE` |

### Tab 5: `mentor_profile` (Thông tin Giảng viên)
Cấu trúc dạng Key - Value (`key`, `value`):
- `name`: `Hứa Thảo Ly`
- `title`: `Lead Data Analyst & Mentor`
- `experience_summary`: `Hơn 5 năm kinh nghiệm thực chiến phân tích dữ liệu tại MoMo, Tiki, ACB...`
- `teaching_pillars`: `1. Tư duy bài toán kinh doanh | 2. Kỹ thuật viết code chuẩn mực | 3. Trực quan hóa dữ liệu sắc nét`
- `avatar_url`: `https://.../mentor-ly-avatar.jpg`

### Tab 6: `testimonials` (Cảm nhận Học viên)
| Cột | Bắt buộc | Mô tả |
|---|:---:|---|
| `id`, `student_name`, `student_role`, `course_taken`, `quote`, `avatar_url`, `sort_order`, `is_active` | Có | Đánh giá trích xuất trực tiếp từ slide bài giảng K1-K10 |

### Tab 7: `blog_posts` (Bài viết chia sẻ kiến thức)
| Cột | Bắt buộc | Mô tả |
|---|:---:|---|
| `post_id`, `slug`, `title`, `category`, `read_time`, `author`, `published_date`, `summary`, `content_markdown`, `thumbnail_url`, `is_active` | Có | Nội dung bài viết định dạng chuẩn Markdown (hỗ trợ code block SQL, Python) |

### Tab 8: `site_settings` (Cấu hình chung toàn trang)
Cấu trúc Key - Value:
- `brand_name`: `DataWithLy`
- `hotline`: `0934752432`
- `email`: `hientruongthmh@gmail.com`
- `zalo_link`: `https://zalo.me/0934752432`
- `consultant_emails`: `hien0934752432@gmail.com, hien.truong230214@vnuk.edu.vn`

### Tab 9: `faq` (Câu hỏi thường gặp)
| Cột | Bắt buộc | Mô tả |
|---|:---:|---|
| `id`, `question`, `answer`, `category`, `sort_order` | Có | Hỏi đáp về lịch học, hoàn trả, hỗ trợ cài đặt công cụ DBeaver/Power BI |

---

## 3. Cơ Chế Caching 5 Tầng & On-Demand ISR Revalidation

Hệ thống quản lý nội dung M05 hoạt động dựa trên [Kiến trúc Caching Đa Tầng & Chống Rò Rỉ Bộ Nhớ](../../07-architecture/caching-and-memory-optimization.md):
- **Tầng Data Cache:** Gọi `fetch` với `revalidate: 3600` (Stale-While-Revalidate 1 giờ) và gắn Cache Tags chuẩn hóa (`courses-data`, `blog-data`, `site-config`).
- **Tầng In-Memory Bounded LRU Cache:** Giới hạn tối đa 50 items (TTL 1 giờ), tự động giải phóng bộ nhớ để chống Memory Leak.
- **Tầng Static Fallback Snapshot:** Lưu trữ tại `lib/cms/fallbacks/` (`homepage.json`, `courses.json`, `blog.json`) bảo đảm Zero White Screen khi Google Sheets bị lỗi hoặc quá tải.

### Endpoint: `POST /api/revalidate`
- **Xác thực bảo mật:** Query parameter `secret` hoặc Header `x-revalidation-secret` khớp với biến môi trường `REVALIDATION_SECRET`.
- **Payload (JSON):**
  ```json
  {
    "tag": "courses-data" // hoặc "blog-data", "site-config", "all-content"
  }
  ```
- **Xử lý phía Server:**
  ```typescript
  import { revalidateTag, revalidatePath } from 'next/cache';
  
  if (tag === 'courses-data') {
    revalidateTag('courses-data');
    revalidatePath('/courses/[slug]', 'page');
  } else if (tag === 'blog-data') {
    revalidateTag('blog-data');
    revalidatePath('/blog/[slug]', 'page');
  } else if (tag === 'all-content') {
    revalidatePath('/', 'layout');
  }
  ```
- **Phản hồi:** Trả về `{ revalidated: true, timestamp: 1718000000, tag: "courses-data" }`. Xóa sạch Edge CDN Cache chỉ trong vòng < 1 giây!

---

## 4. Công cụ Kiểm tra Dữ liệu (1-Click Data Linter)

Để ngăn chặn lỗi làm hỏng trang (Zero Broken Build), kịch bản Apps Script hoặc CLI tích hợp sẵn bộ kiểm tra trước khi publish:

| Mã kiểm tra | Quy tắc kiểm tra | Mức độ nghiêm trọng | Hành động |
|---|---|:---:|---|
| **LINT-01** | Trùng lặp `slug` trong tab `courses` hoặc `blog_posts`. | Nguy hiểm (Blocker) | Báo đỏ hàng bị trùng, từ chối xuất bản. |
| **LINT-02** | Trường bắt buộc (`id`, `title`, `slug`, `price_discounted`) bị bỏ trống. | Nguy hiểm (Blocker) | Tô vàng ô thiếu dữ liệu, yêu cầu điền đủ. |
| **LINT-03** | Khóa ngoại không khớp: `curriculum.course_id` không tồn tại trong `courses.id`. | Nguy hiểm (Blocker) | Cảnh báo bài học mồ côi (Orphan Curriculum). |
| **LINT-04** | Sai định dạng ngày tháng trong `blog_posts.published_date` (phải là `YYYY-MM-DD`). | Cảnh báo (Warning) | Tự động chuẩn hóa về ISO Date. |
| **LINT-05** | Đường dẫn ảnh `image_url` không bắt đầu bằng `https://`. | Cảnh báo (Warning) | Hệ thống tự động kích hoạt `SafeImage` Fallback. |

---

## 5. Quy tắc Vận hành Nội dung Song Song (Tuân thủ BR-13)

Hệ thống hỗ trợ 2 kênh vận hành nội dung theo quy tắc [BR-13](../../02-domain/business-rules.md):
- **Kênh 1 — Apps Script Custom Menu (Khuyến nghị cao):** Sử dụng thanh menu `[🚀 DataWithLy CMS]` do [Module M00](../M00-setup-and-connectivity/README.md) cung cấp để thêm khóa học, thêm buổi học có form nhập liệu tự động validate.
- **Kênh 2 — Chỉnh sửa trực tiếp trên ô (Direct Cell Edit):** Áp dụng cho sửa lỗi chính tả, thay đổi học phí; kèm theo quy tắc "3 Nên & 3 Không" và hướng dẫn chi tiết tại [Sổ tay Vận hành cho Khách hàng](../../09-handover/client-operations-guide.md).

### Bộ quy tắc "3 Nên & 3 Không":
- ✅ **3 NÊN:**
  1. **Nên dùng tổ hợp phím `Alt + Enter`** khi muốn xuống dòng trong ô `bullets` của đề cương môn học hoặc `features` của gói combo.
  2. **Nên kiểm tra link ảnh** ở chế độ ẩn danh (Incognito) để chắc chắn ảnh có quyền truy cập công khai trước khi dán vào Sheets.
  3. **Nên chạy Data Linter và bấm nút "Đồng Bộ Lên Website"** sau khi sửa xong để Edge CDN làm mới cache ngay lập tức sau 1-2 giây.
- ❌ **3 KHÔNG:**
  1. **Không sửa đổi tên các Cột tiêu đề** ở Dòng 1 của bất kỳ tab nào (sẽ làm lệch schema nạp dữ liệu).
  2. **Không xóa dòng dữ liệu trực tiếp** nếu muốn ẩn khóa học; hãy áp dụng **Soft Delete** (đổi `is_active` từ `TRUE` thành `FALSE` và `status` thành `ARCHIVED`).
  3. **Không dán công thức tính toán phức tạp** vào các cột văn bản để tránh nguy cơ lỗi Formula Parse trên Next.js parser.

---

## 6. Tiêu chí nghiệm thu (Acceptance Criteria)

| Mã AC | Yêu cầu | Given | When | Then |
|---|---|---|---|---|
| **AC-M05-01** | Đồng bộ Khóa học mới | Chị Ly thêm 1 khóa học mới vào tab `courses` với `is_active = TRUE`. | Gọi Webhook `POST /api/revalidate?tag=courses`. | Trong vòng 1 giây, trang `/` và trang `/courses` hiển thị ngay khóa học mới mà không cần rebuild ứng dụng. |
| **AC-M05-02** | Ẩn Khóa học | Chị Ly đổi `is_active = FALSE` cho khóa học SQL. | Gọi Webhook Revalidate. | Khóa học biến mất khỏi danh sách trang chủ; truy cập trực tiếp URL `/courses/sql-for-data-analytics` trả về trang thông báo tạm dừng tuyển sinh hoặc 404 thân thiện. |
| **AC-M05-03** | Multiline Bullets | Biên tập viên soạn đề cương môn học, dùng `Alt+Enter` xuống dòng 3 gạch đầu dòng trong 1 ô. | Xem đề cương trên trang chi tiết khóa học. | 3 gạch đầu dòng hiển thị thành 3 thẻ `<li>` tách biệt đẹp mắt, không bị dính chùm thành một dòng văn bản thô. |
| **AC-M05-04** | SafeImage Fallback | Link ảnh avatar của một học viên trong `testimonials` bị xóa khỏi host ảnh ngoài (HTTP 404). | Người dùng mở trang xem khối đánh giá. | Ảnh bị lỗi kích hoạt `onError` của component `SafeImage`, tự động thay thế bằng Avatar Placeholder chuẩn chữ cái đầu hoặc logo DataWithLy, không hiển thị icon ảnh vỡ của trình duyệt. |
| **AC-M05-05** | Fallback khi Sheets lỗi | Ngắt kết nối mạng hoặc Google Sheets API hết hạn mức quota (HTTP 429/500). | Người dùng tải trang chủ. | Website tự động phục vụ dữ liệu đã lưu trong ISR Cache trước đó hoặc nạp file dự phòng cục bộ `lib/cms/fallbacks/homepage.json`, trang web hoạt động bình thường 100% (< 1.2s). |
| **AC-M05-06** | Bảo mật Revalidate | Hacker gọi `POST /api/revalidate` với secret bừa bãi. | Request đến Server. | Server từ chối ngay với mã lỗi `401 Unauthorized`, không kích hoạt tác vụ xóa cache. |
| **AC-M05-07** | Data Linter bắt trùng slug | Người dùng vô tình tạo 2 bài blog có cùng slug `huong-dan-hoc-sql-cho-nguoi-moi`. | Chạy Data Linter. | Linter cảnh báo lỗi trùng lặp và từ chối đồng bộ dữ liệu của bài viết thứ hai. |

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Quay lại README M05](README.md)
