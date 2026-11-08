# Câu hỏi còn mở

- **Mục đích:** Tập trung quyết định chưa chốt và ảnh hưởng.
- **Trạng thái:** Draft
- **Người duyệt:** TBD
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** [Client Google Sheets](../../lib/google-sheets/client.ts); [Phạm vi](../01-product/product-scope.md)
- **Câu hỏi còn mở:** Các câu hỏi bên dưới chưa giải quyết. [Danh sách câu hỏi](open-questions.md)

> Đây là khung tài liệu. TBD là nội dung chưa chốt; việc có file không đồng nghĩa yêu cầu được duyệt hoặc tính năng đã hoàn thành.

## Danh sách

| Mã | Câu hỏi | Tài liệu bị ảnh hưởng chính | Thời điểm cần quyết định | Người trả lời | Trạng thái |
|---|---|---|---|---|---|
| Q-01 | Blog gồm danh sách và trang chi tiết theo cấu trúc nào? Tổng số URL/mẫu trang là bao nhiêu? About Us là khu vực riêng theo Product Overview. | [Tài liệu](../03-modules/M03-blog/prd.md) | Trước duyệt PRD Blog | TBD | Open |
| Q-02 | Thiết kế, nội dung, CTA và điều hướng được duyệt là gì? | [Tài liệu](../01-product/product-scope.md) | Trước duyệt PRD bước 4 | TBD | Open |
| Q-03 | Dữ liệu khóa học và nguồn nội dung chuẩn là gì? Xử lý hai nhóm data thế nào? | [Tài liệu](../02-domain/course-model.md) | Trước duyệt mô hình dữ liệu | TBD | Open |
| Q-04 | Phạm vi form, quy tắc gửi/trùng/thử lại và thông báo là gì? | [Tài liệu](../03-modules/M04-lead-capture/prd.md) | Trước duyệt PRD M04 | TBD | Open |
| Q-05 | Đợt CMS Google Sheets + HomePage kiểm thử gồm những phần nội dung nào, vai trò biên tập/duyệt nào, thời điểm xuất bản và cách xử lý dữ liệu lỗi ra sao? | [Tài liệu](../03-modules/M05-content-management/prd.md) | Trước duyệt PRD M05/M01 | TBD | Open |
| Q-06 | Ai truy cập dữ liệu, lưu bao lâu và bảo vệ thế nào? | [Tài liệu](../07-architecture/security-design.md) | Trước task xử lý dữ liệu thật | TBD | Open |
| Q-07 | SEO, tracking, sự kiện và dữ liệu được phép thu thập là gì? | [Tài liệu](../05-non-functional-requirements/observability.md) | Trước duyệt NFR liên quan | TBD | Open |
| Q-08 | Thiết bị, trình duyệt, khả dụng và ngưỡng hiệu năng nào được duyệt? | [Tài liệu](../05-non-functional-requirements/performance.md) | Trước giao task UI/kiểm thử | TBD | Open |
| Q-09 | Hosting, domain, môi trường, ngân sách, người vận hành và rollback? | [Tài liệu](../05-non-functional-requirements/deployment.md) | Trước task hạ tầng/phát hành | TBD | Open |
| Q-10 | Ai duyệt, ưu tiên/lịch phát hành và yêu cầu nào từ tài liệu cũ được giữ? | [Tài liệu](delivery-process.md) | Trước backlog bước 5 | TBD | Open |

## Cách đóng câu hỏi

Ghi câu trả lời, người xác nhận, ngày, bằng chứng và tất cả tài liệu bị ảnh hưởng; cập nhật chúng trước khi chuyển Resolved. Agent dừng phần phụ thuộc chưa chốt; có thể tiếp tục phần độc lập đã duyệt.

## Điểm cần kiểm chứng từ code

Client Google Sheets có thể trả mock thành công khi thiếu URL cấu hình. Thành công cục bộ không chứng minh lưu dữ liệu thực; cần kiểm chứng trong Q-04/Q-09.

---

[Điểm bắt đầu của bộ docs](../README.md)

## Cập nhật một phần ngày 2026-10-28

- Q-04: đã xác nhận cho người dùng thử lại khi Sheets lỗi, gửi email cho học viên và phía khách hàng. Ngưỡng, trường form, quy tắc chống trùng và người nhận cụ thể vẫn mở.
- Q-07: cần lưu lead/UTM phục vụ marketing; quy tắc attribution, dữ liệu được thu và thời hạn lưu chưa chốt.
- Q-09: khách có Workspace, ưu tiên khảo sát free hosting; hosting, ngân sách, tải và người vận hành chưa chốt.
- Q-11 (mới): khách có sở hữu/được phép truy cập lead của thehaudata.com không? Nguồn Form/Sheets/CRM nào? Cần trả lời trước khi truy cập dữ liệu riêng tư. Chủ trả lời: chủ dự án; trạng thái Open.
- Q-12 (mới): danh sách người nhận email, lead/ngày/cao điểm và mục tiêu độ trễ cụ thể? Cần trước khi duyệt email/hosting; chủ trả lời: chủ dự án; trạng thái Open.

## Cập nhật ngày 2026-11-03

- Q-01: Product Overview đã chốt About Us là khu vực riêng. Chỉ cấu trúc Blog và số URL/mẫu trang còn mở.
- Q-05: Chủ dự án đã chọn CMS Google Sheets với HomePage làm màn hình kiểm thử đợt đầu. Còn cần chốt phần HomePage lấy dữ liệu từ Sheets, dữ liệu/môi trường thử, vai trò và cách xuất bản.
- Q-13 (mới): form, email và GA4 có chạy trong đợt kiểm thử CMS + HomePage không? Nếu có, dùng dữ liệu và người nhận nào? Ảnh hưởng [Product Scope](../01-product/product-scope.md), [PRD HomePage](../03-modules/M01-homepage/prd.md) và [PRD lead](../03-modules/M04-lead-capture/prd.md); cần trước khi duyệt PRD; chủ trả lời: chủ dự án; trạng thái Open.
- Q-14 (mới): ai nghiệm thu đợt đầu, đối chiếu nội dung Sheets và HomePage theo tiêu chí nào? Ảnh hưởng [Product Scope](../01-product/product-scope.md) và [Acceptance](../06-acceptance/README.md); cần trước khi giao task; chủ trả lời: chủ dự án; trạng thái Open.

Nguồn xác nhận: nhận xét người dùng ngày 2026-10-28. Chi tiết và phương án tại [bản ghi yêu cầu](customer-requirements-notes.md). Không đóng toàn bộ Q-04/Q-07/Q-09 vì còn quyết định chưa giải quyết.
