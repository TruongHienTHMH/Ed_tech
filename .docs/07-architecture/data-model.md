# Mô hình dữ liệu kỹ thuật

- **Mục đích:** Ghi hiện trạng có nguồn và chuẩn bị phương án để duyệt.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-10-27
- **Nguồn tham khảo:** [Dependency khai báo](../../package.json); [Trang chủ](../../app/page.tsx); [Route leads](../../app/api/leads/route.ts); [Client tích hợp](../../lib/google-sheets/client.ts)
- **Câu hỏi còn mở:** Q-03 đến Q-09. [Danh sách câu hỏi](../08-project/open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Hiện trạng đã kiểm tra tĩnh

Có dữ liệu nội dung TypeScript; [types lead hiện có](../../lib/modules/leads/types.ts) khai báo LeadInputDto và LeadServiceResult. Chưa xác nhận schema CMS hay dữ liệu vận hành.

## Phương án đề xuất và ràng buộc

| Thực thể/trường | Kiểu | Bắt buộc | Validation | Quan hệ | Nguồn | Phân loại dữ liệu |
|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

TBD: định danh, mapping nghiệp vụ, dữ liệu mẫu, tương thích/migration nếu cần. Không đổi kiểu công khai trong đợt docs.

## Cách kiểm chứng

TBD: đối chiếu PRD, mô hình nghiệp vụ, cấu hình và kiểm tra phù hợp trên môi trường được phép. Kiểm tra tĩnh không chứng minh ứng dụng hay tích hợp đã chạy thành công.

---

[Điểm bắt đầu của bộ docs](../README.md)
