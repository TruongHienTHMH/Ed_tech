# Ma Trận Truy Vết Toàn Diện (Traceability Matrix)

- **Mục đích:** Đảm bảo khả năng truy vết 100% (End-to-End Traceability) từ Yêu cầu chức năng (Modules M00-M05), Quy tắc kinh doanh (Business Rules BR-01 đến BR-13) và Bộ tiêu chuẩn phi chức năng (NFR Specifications) sang Tiêu chí chấp nhận (AC), Kịch bản kiểm thử (Test Cases) và Bằng chứng nghiệm thu thực tế.
- **Trạng thái:** Active / Production Ready
- **Người duyệt:** TechLead & Client Hứa Thảo Ly
- **Ngày cập nhật:** 2026-11-05
- **Nguồn tham khảo:** 
  - [Khung kiểm thử README.md](README.md)
  - [Kịch bản kiểm thử E2E test-scenarios.md](test-scenarios.md)
  - [Kịch bản Unit Test unit-test-scenarios.md](unit-test-scenarios.md)
  - [Báo cáo kiểm thử tải traffic-simulation-and-load-testing.md](traffic-simulation-and-load-testing.md)
  - [Quy tắc kinh doanh BR-01 đến BR-13](../02-domain/business-rules.md)

---

## 1. Ma Trận Truy Vết Yêu Cầu Chức Năng (Functional Requirements Matrix)

| Mã Yêu Cầu | Tên & Mô Tả Yêu Cầu | Module & Tài Liệu Nguồn | Business Rules Liên Quan | Tiêu Chí Chấp Nhận (AC) | Mã Test Case (TC) | Bằng Chứng Xác Minh | Trạng Thái |
|---|---|---|---|---|---|---|:---:|
| **REQ-M00-001** | Kết nối an toàn Google Sheets API & Service Account | [M00-Setup](../03-modules/M00-setup-and-connectivity/README.md) | BR-09, BR-10 | AC-M00-001 | `TC-M00-001`, `TC-UNIT-011` | Log kết nối HTTP 200, test latency < 500ms | **Pass** |
| **REQ-M00-002** | Endpoint Health Check `/api/health` | [M00-Setup](../03-modules/M00-setup-and-connectivity/README.md) | BR-11 | AC-M00-002 | `TC-M00-001`, `TC-UNIT-013` | JSON response đầy đủ trạng thái kết nối và bộ nhớ Node.js | **Pass** |
| **REQ-M00-003** | Tài liệu Swagger UI tương tác trực tiếp `/api/docs` | [M00-Setup](../03-modules/M00-setup-and-connectivity/README.md) | NFR-OBS-002 | AC-M00-003 | `TC-M00-001` | Giao diện Swagger UI render chuẩn OpenAPI 3.0 | **Pass** |
| **REQ-M00-004** | Bộ script thao tác dữ liệu (CRUD) có Mutex Lock | [M00-Setup](../03-modules/M00-setup-and-connectivity/README.md) | BR-01, BR-13 | AC-M00-004 | `TC-M00-002`, `TC-UNIT-016` | Dữ liệu ghi tuần tự qua `LockService.waitLock(10000)` | **Pass** |
| **REQ-M01-001** | Hero Section định vị thương hiệu DataWithLy | [M01-HomePage](../03-modules/M01-homepage/README.md) | NFR-USABILITY-001 | AC-M01-001 | `TC-M01-001` | Tiêu đề, slogan, bảng màu Crimson Wine Red `#8B1D2C` chuẩn | **Pass** |
| **REQ-M01-002** | Khối Social Proof & Tiểu sử Mentor Hứa Thảo Ly | [M01-HomePage](../03-modules/M01-homepage/README.md) | NFR-USABILITY-002 | AC-M01-002 | `TC-M01-001` | Thông tin chính xác: Ex-Senior DA tại MoMo, Tiki, ACB | **Pass** |
| **REQ-M01-003** | Danh sách khóa học nổi bật trên Trang chủ | [M01-HomePage](../03-modules/M01-homepage/README.md) | BR-01, BR-04 | AC-M01-003 | `TC-M01-001`, `TC-UNIT-009` | Render card khóa học, lọc theo tag, chỉ hiện `is_active=true` | **Pass** |
| **REQ-M01-004** | Nút kêu gọi hành động (CTA) & Điều hướng mượt mà | [M01-HomePage](../03-modules/M01-homepage/README.md) | NFR-USABILITY-003 | AC-M01-004 | `TC-M01-001` | Cuộn mượt đến form hoặc chuyển trang trong < 100ms | **Pass** |
| **REQ-M02-001** | Trang chi tiết khóa học theo URL Slug động | [M02-CourseDetails](../03-modules/M02-course-details/README.md) | BR-04 | AC-M02-001 | `TC-M02-001`, `TC-UNIT-008` | URL chuẩn SEO `/courses/[slug]`, render đầy đủ thông tin | **Pass** |
| **REQ-M02-002** | Xử lý đề cương xuống dòng `\n` thành danh sách `<li>` | [M02-CourseDetails](../03-modules/M02-course-details/README.md) | NFR-USABILITY-006 | AC-M02-002 | `TC-M02-001`, `TC-UNIT-010` | Render bullet point đẹp mắt từ thao tác Alt+Enter trong Sheet | **Pass** |
| **REQ-M02-003** | Khung Sticky CTA Form đăng ký cố định trên màn hình | [M02-CourseDetails](../03-modules/M02-course-details/README.md) | NFR-USABILITY-004 | AC-M02-003 | `TC-M02-001` | Giữ vị trí khi cuộn trang, tự động gán sẵn ID khóa học | **Pass** |
| **REQ-M02-004** | Cơ chế Xóa mềm (Soft Delete) trả về trang 404 thân thiện | [M02-CourseDetails](../03-modules/M02-course-details/README.md) | BR-01, BR-11 | AC-M02-004 | `TC-M02-002` | Khóa học `is_active=false` trả về giao diện 404 có nút quay lại | **Pass** |
| **REQ-M03-001** | Danh sách bài viết Blog kiến thức Data Analytics | [M03-Blog](../03-modules/M03-blog/README.md) | BR-04 | AC-M03-001 | `TC-M03-001` | Phân loại theo chuyên mục, phân trang hoặc infinite load | **Pass** |
| **REQ-M03-002** | Trình đọc bài viết Markdown an toàn | [M03-Blog](../03-modules/M03-blog/README.md) | NFR-SEC-004 | AC-M03-002 | `TC-M03-001` | Render code block, sanitize HTML chống tấn công XSS | **Pass** |
| **REQ-M03-003** | Thẻ OpenGraph và nút chia sẻ mạng xã hội | [M03-Blog](../03-modules/M03-blog/README.md) | NFR-SEO-002 | AC-M03-003 | `TC-M03-001` | Preview đẹp mắt trên Facebook/LinkedIn/Zalo khi paste link | **Pass** |
| **REQ-M04-001** | Form thu thập Lead tư vấn học viên | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-03, BR-05 | AC-M04-001 | `TC-M04-001`, `TC-UNIT-001` | Nhập Họ tên, SĐT, Email, Khóa học quan tâm, nộp < 1.5s | **Pass** |
| **REQ-M04-002** | Xác thực dữ liệu đầu vào bằng Zod Schema | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-05 | AC-M04-002 | `TC-UNIT-001`, `TC-UNIT-002` | Báo lỗi tiếng Việt chuẩn xác tại từng trường dữ liệu | **Pass** |
| **REQ-M04-003** | Cơ chế bẫy Spam tự động qua Honeypot field | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-06 | AC-M04-003 | `TC-M04-002`, `TC-UNIT-003` | Bot điền trường ẩn -> Drop âm thầm (HTTP 200 giả) | **Pass** |
| **REQ-M04-004** | Kiểm soát tần suất nộp (Rate Limiter 3 req/phút/IP) | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-02 | AC-M04-004 | `TC-M04-003`, `TC-UNIT-005` | Vượt quá 3 lần -> Trả HTTP 429 kèm header `Retry-After` | **Pass** |
| **REQ-M04-005** | Thông báo Lead tức thì qua Bot Telegram (< 3s) | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-07 | AC-M04-005 | `TC-M04-001` | Tin nhắn đẩy về Telegram tư vấn viên trong < 3 giây | **Pass** |
| **REQ-M04-006** | Làm sạch chống Formula Injection khi ghi vào Sheet | [M04-LeadCapture](../03-modules/M04-lead-capture/README.md) | BR-10 | AC-M04-006 | `TC-M04-002`, `TC-UNIT-004` | Ký tự `=`, `+`, `-`, `@` được prefix thành `"'="` an toàn | **Pass** |
| **REQ-M05-001** | Quản lý nội dung song song qua Apps Script & Sheet | [M05-ContentManagement](../03-modules/M05-content-management/README.md) | BR-13 | AC-M05-001 | `TC-M00-002`, `TC-M05-002` | Menu [DataWithLy CMS] hoạt động tốt, hỗ trợ sửa trực tiếp | **Pass** |
| **REQ-M05-002** | Công cụ Data Linter kiểm tra lỗi dữ liệu trước khi xuất bản | [M05-ContentManagement](../03-modules/M05-content-management/README.md) | BR-04, BR-13 | AC-M05-002 | `TC-M05-002`, `TC-UNIT-015` | Phát hiện trùng slug, thiếu học phí, sai format ngày trong < 2s | **Pass** |
| **REQ-M05-003** | Xuất bản tức thì 1-click qua On-demand ISR Revalidation | [M05-ContentManagement](../03-modules/M05-content-management/README.md) | BR-12 | AC-M05-003 | `TC-M05-001`, `TC-LOAD-005` | Endpoint `/api/revalidate` làm mới trang trong < 1-2s | **Pass** |

---

## 2. Ma Trận Truy Vết Quy Tắc Kinh Doanh (Business Rules Matrix)

| Mã Quy Tắc | Tên Quy Tắc Kinh Doanh | Mục Tiêu & Nguyên Tắc Bảo Vệ | Mã Test Case (TC) | Mã Unit Test | Loại Bằng Chứng | Trạng Thái |
|---|---|---|---|---|---|:---:|
| **BR-01** | Soft Delete & Archive Khóa học | Không xóa cứng dòng dữ liệu; dùng cờ `is_active=FALSE` để bảo toàn lịch sử học viên và liên kết cũ | `TC-M02-002` | `TC-UNIT-016` | Row Google Sheet giữ nguyên, cờ `is_active=FALSE`, web trả 404 thân thiện | **Pass** |
| **BR-02** | Giới Hạn Tần Suất (Rate Limiting) | Tối đa 3 lượt nộp lead / phút / IP; lưu bằng Bounded LRU Cache chống rò rỉ bộ nhớ | `TC-M04-003` | `TC-UNIT-005`, `TC-UNIT-006` | HTTP 429 response, header `Retry-After: 60`, heap memory không tăng | **Pass** |
| **BR-03** | Bảo Vệ Dữ Liệu Học Viên (PII Protection) | Tuyệt đối không public tab `private_leads`; ẩn email/SĐT trên các log hệ thống | `TC-M04-001` | `TC-UNIT-002` | Kiểm tra HTTP response không chứa SĐT/Email; sheet permissions cấu hình Private | **Pass** |
| **BR-04** | Tính Độc Nhất Của Slug (Unique Slug) | Mỗi khóa học và bài viết có slug duy nhất định dạng kebab-case; không dấu, không khoảng trắng | `TC-M02-001`, `TC-M05-002` | `TC-UNIT-008`, `TC-UNIT-015` | Data Linter báo lỗi đỏ nếu phát hiện trùng lặp slug | **Pass** |
| **BR-05** | Chuẩn Hóa Số Điện Thoại Việt Nam | Bắt buộc 10 chữ số hợp lệ theo định dạng nhà mạng Việt Nam (`03x`, `05x`, `07x`, `08x`, `09x` hoặc `+84`) | `TC-M04-001` | `TC-UNIT-001` | Zod validation reject số sai, normalize về định dạng chuẩn | **Pass** |
| **BR-06** | Bẫy Bot Tự Động (Honeypot Trap) | Thêm field ẩn `website`; bot tự động điền sẽ bị drop âm thầm mà không ghi vào database | `TC-M04-002` | `TC-UNIT-003` | Bot nộp form nhận HTTP 200 giả nhưng Sheet không phát sinh dòng mới | **Pass** |
| **BR-07** | Thông Báo Lead Nhanh Tức Thì (< 3s) | Đẩy thông báo tức thì về Telegram tư vấn viên qua Webhook có retry khi học viên nộp form | `TC-M04-001` | `TC-UNIT-014` | Timestamp nhận tin nhắn Telegram cách timestamp nộp form < 3000ms | **Pass** |
| **BR-08** | Chống Trùng Lặp Lead (Idempotency Key) | Mỗi lượt nộp sinh UUID; nếu nộp trùng trong 30s thì bỏ qua bản ghi thứ hai | `TC-M04-001` | `TC-UNIT-007` | 2 request trùng UUID/payload trong 30s chỉ tạo 1 dòng duy nhất trên Sheet | **Pass** |
| **BR-09** | Không Lộ ID File Google Sheets | Tuyệt đối không để lộ Spreadsheet ID, Sheet GID hoặc Service Account Key ở client-side | `TC-M00-001` | `TC-UNIT-012` | Inspect mã nguồn trang web và Network tab không tìm thấy ID private | **Pass** |
| **BR-10** | Chống Google Sheets Formula Injection | Tự động thêm tiền tố dấu nháy đơn (`'`) vào các chuỗi bắt đầu bằng `=`, `+`, `-`, `@`, `\t`, `\r` | `TC-M04-002` | `TC-UNIT-004` | Ký tự đầu vào `=SUM()` được ghi vào ô Sheet dưới dạng text `"'=SUM()"` | **Pass** |
| **BR-11** | Chống Màn Hình Trắng (Zero White Screen) | Toàn bộ các khối component độc lập được bọc React Error Boundary kèm thẻ Fallback Card | `TC-M05-002` | `TC-UNIT-017` | Giả lập lỗi API: component hỏng hiển thị card lỗi, trang web vẫn hoạt động | **Pass** |
| **BR-12** | Xuất Bản Tức Thì Qua On-demand ISR | Cho phép quản trị viên bấm nút đồng bộ để làm mới cache tức thì mà không cần chờ build | `TC-M05-001` | `TC-UNIT-018` | Gọi POST `/api/revalidate` trả về `revalidated: true`, trang cập nhật sau < 1.5s | **Pass** |
| **BR-13** | Quản Trị Song Song An Toàn | Hỗ trợ quản trị song song: qua Sidebar Menu Apps Script chuẩn form hoặc chỉnh sửa trực tiếp trên Sheet | `TC-M00-002`, `TC-M05-002` | `TC-UNIT-015` | Thao tác bằng 2 cách đều đồng bộ dữ liệu chuẩn, có Data Linter đối soát | **Pass** |

---

## 3. Ma Trận Truy Vết Yêu Cầu Phi Chức Năng (Non-Functional Requirements Matrix)

| Nhóm Tiêu Chuẩn | Mã Định Danh | Chỉ Số Định Lượng Yêu Cầu | Mã Test Case | Loại Kiểm Thử | Bằng Chứng Xác Minh |
|---|---|---|---|---|---|
| **Usability** | `NFR-USABILITY-001` | Thiết kế lưới 4-point spacing, bảng màu Crimson `#8B1D2C` | `TC-M01-001` | UI Audit | Figma Inspect & CSS Computed Styles kiểm tra khoảng cách |
| **Usability** | `NFR-USABILITY-003` | Tương thích 100% màn hình Mobile (375px), Tablet (768px), PC | `TC-M01-001` | Responsive Test | Playwright test chạy trên iPhone 13, iPad Air, Desktop |
| **Usability** | `NFR-USABILITY-007` | Chuẩn trợ năng WCAG 2.1 AA (Tương phản chữ/nền >= 4.5:1) | `TC-M01-001` | Accessibility | Axe DevTools / Lighthouse Accessibility Score >= 95 |
| **Performance** | `NFR-PERF-001` | Largest Contentful Paint (LCP) < 1.2s trên mạng di động 4G | `TC-LOAD-001` | Performance | Báo cáo Lighthouse Performance >= 95 |
| **Performance** | `NFR-PERF-002` | Interaction to Next Paint (INP) < 100ms trên toàn bộ thao tác | `TC-LOAD-001` | Performance | Web Vitals Extension / Chrome Performance Profiler |
| **Performance** | `NFR-PERF-003` | Cumulative Layout Shift (CLS) < 0.05 (không giật layout) | `TC-M01-001` | Performance | Báo cáo Google Search Console Core Web Vitals Pass |
| **Performance** | `NFR-PERF-005` | Time to First Byte (TTFB) < 50ms nhờ Vercel Edge Cache | `TC-LOAD-002` | K6 Load Test | Header `x-vercel-cache: HIT`, phản hồi < 50ms |
| **Performance** | `NFR-PERF-007` | Chịu tải Spike 1.000 VUs / phút, Edge Cache Hit >= 95% | `TC-LOAD-002` | K6 Load Test | K6 summary report: 0 lỗi HTTP 5xx, Sheets API 0 call |
| **Reliability** | `NFR-RELIABILITY-001` | Uptime cam kết 99.9% (thời gian gián đoạn tối đa < 43 phút/tháng) | `TC-M00-001` | Uptime Monitor | UptimeRobot / BetterStack theo dõi endpoint `/api/health` |
| **Reliability** | `NFR-RELIABILITY-003` | Cơ chế Stale-While-Revalidate: phục vụ bản cache khi Sheet lỗi | `TC-LOAD-005` | Chaos Testing | Ngắt mạng Sheets API: Người dùng vẫn đọc được dữ liệu cache |
| **Reliability** | `NFR-RELIABILITY-006` | Khử rò rỉ bộ nhớ (Zero Memory Leak): Heap Node.js ổn định < 150MB | `TC-LOAD-004` | K6 Soak Test | Đồ thị bộ nhớ dạng răng cưa chuẩn sau 4 giờ ngâm tải liên tục |
| **Security** | `NFR-SEC-001` | Bảo vệ form: 100% không dính Formula Injection (`=`, `+`, `-`, `@`) | `TC-M04-002` | `TC-UNIT-004` | Tự động thêm tiền tố dấu nháy đơn (`'`) vào mọi ô nhập liệu |
| **Security** | `NFR-SEC-002` | Tiêu đề bảo mật HTTP: CSP, HSTS, X-Content-Type-Options | `TC-M00-001` | Security Headers | SecurityHeaders.com chấm điểm Grade A |
| **Security** | `NFR-SEC-005` | Bảo vệ thông tin cá nhân học viên PII theo Luật An ninh mạng VN | `TC-M04-001` | Security Audit | Toàn bộ dữ liệu truyền tải qua HTTPS TLS 1.3, mã hóa nghỉ |
| **SEO** | `NFR-SEO-001` | 100% Khóa học có Schema Course JSON-LD hợp lệ theo schema.org | `TC-M02-001` | SEO Test | Google Rich Results Test thông báo Valid không có lỗi |
| **SEO** | `NFR-SEO-003` | Tự động tạo `sitemap.xml` và `robots.txt` chuẩn SEO | `TC-M03-001` | SEO Test | Truy cập `/sitemap.xml` trả về đầy đủ URL các khóa học và blog |
| **Observability** | `NFR-OBS-001` | Endpoint `/api/health` trả về trạng thái, latency và memory | `TC-M00-001` | Monitoring | Phản hồi JSON chuẩn phục vụ dashboard giám sát |
| **Observability** | `NFR-OBS-003` | Cảnh báo tự động về Telegram khi tỷ lệ lỗi form > 5% trong 15 phút | `TC-M04-001` | Alerting | Test trigger lỗi nhân tạo -> Bot Telegram gửi cảnh báo đỏ |
| **Deployment** | `NFR-DEPLOY-001` | Tự động triển khai CI/CD qua GitHub Actions lên Vercel Edge | `TC-M00-001` | Pipeline Test | Push code lên nhánh `main` tự động chạy test và deploy |

---

[Quay lại Khung kiểm thử README.md](README.md) | [Xem Kịch bản kiểm thử E2E](test-scenarios.md) | [Xem Kịch bản Unit Test](unit-test-scenarios.md)
