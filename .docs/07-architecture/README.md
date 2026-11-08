# Kiến trúc

- **Mục đích:** Phân biệt hiện trạng, đề xuất và quyết định.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-10-27
- **Nguồn tham khảo:** [Quy trình triển khai](../08-project/delivery-process.md)
- **Câu hỏi còn mở:** Xem danh sách tập trung. [Danh sách câu hỏi](../08-project/open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Danh mục tài liệu kiến trúc (Architecture Index)

- [Bối cảnh hệ thống & C4 Diagram](system-context.md) — Sơ đồ C4 Context/Container và quy chuẩn Clean Architecture (Repository, Adapter, Strategy, Factory).
- [Kiến trúc Caching Đa Tầng & Chống Rò Rỉ Bộ Nhớ](caching-and-memory-optimization.md) — Chiến lược Caching 5 tầng, đối soát 7 điểm Real-time, và kiểm soát RAM Node.js Serverless.
- [Thiết kế API & Hợp đồng giao tiếp](api-design.md) — Đặc tả API `/api/leads`, `/api/revalidate`, `/api/health/sheets` và Swagger UI (`/api-docs`).
- [Thiết kế an toàn & Chống spam 3 lớp](security-design.md) — Bẫy Honeypot, Idempotency Token, và Rate Limiting.
- [Bảo vệ dữ liệu Lead & Xử lý lỗi](lead-protection-and-errors.md) — Chịu lỗi Client, lưu tạm sessionStorage và cơ chế Zero White Screen.
- [Quy tắc Design System & 4-Point Spacing](design-system-rules.md) — Hệ thống Spacing 4px, bảng màu Crimson Primary `#8B1D2C` và Typography.
- [Mô hình dữ liệu](data-model.md) — Quan hệ thực thể nội dung và hồ sơ lead.
- [Tổng quan kiến trúc](architecture-overview.md) — Định hướng kỹ thuật cấp cao.
- [Tùy chọn hạ tầng & Hosting](hosting-options.md) — So sánh Vercel Edge Serverless vs Google Cloud.
- [Quy ước ADR](technical-decisions/README.md) — Hồ sơ các quyết định kiến trúc cốt lõi.

## Quy tắc

Hiện trạng có nguồn code và giới hạn kiểm tra; đề xuất ở Draft; quyết định có người duyệt và bằng chứng. Không chốt CMS/hosting chỉ vì tài liệu cũ có đề cập.

---

[Điểm bắt đầu của bộ docs](../README.md)
