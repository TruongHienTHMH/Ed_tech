# Tổng quan kiến trúc

- **Mục đích:** Ghi hiện trạng có nguồn và chuẩn bị phương án để duyệt.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-10-27
- **Nguồn tham khảo:** [Dependency khai báo](../../package.json); [Trang chủ](../../app/page.tsx); [Route leads](../../app/api/leads/route.ts); [Client tích hợp](../../lib/google-sheets/client.ts)
- **Câu hỏi còn mở:** Q-03 đến Q-09. [Danh sách câu hỏi](../08-project/open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Hiện trạng đã kiểm tra tĩnh

- package.json khai báo Next.js 16.3.4, React 19.2.8, Tailwind CSS 4 và TypeScript.
- Có app/, components/, data/ và lib/.
- app/page.tsx ghép các section trang chủ; app/homepage/page.tsx tái sử dụng trang chủ.
- Có data/ và data/homepage/; chưa chốt nguồn nội dung chuẩn.
- Chưa thấy route riêng CourseDetails và Blog trong lần kiểm tra này.

## Phương án đề xuất và ràng buộc

TBD: ranh giới module, rendering/cache, dịch vụ ngoài, phụ thuộc. Đọc hướng dẫn Next.js cục bộ theo AGENTS.md trước khi viết code.

## Cách kiểm chứng

TBD: đối chiếu PRD, mô hình nghiệp vụ, cấu hình và kiểm tra phù hợp trên môi trường được phép. Kiểm tra tĩnh không chứng minh ứng dụng hay tích hợp đã chạy thành công.

---

[Điểm bắt đầu của bộ docs](../README.md)

## Bối cảnh code đã được chủ dự án làm rõ

Code hiện tại là bản thử nghiệm làm việc dữ liệu với Sheets, không phải sản phẩm đã nghiệm thu. Các phát hiện kỹ thuật trước đây là đầu vào cho thiết kế production sau này. Xem [ghi chú yêu cầu](../08-project/customer-requirements-notes.md).
