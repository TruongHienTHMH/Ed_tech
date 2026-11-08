# Yêu cầu khách hàng và phương án để viết PD

- **Ngày cập nhật:** 2026-10-28
- **Trạng thái:** Draft — ghi nhận yêu cầu và đề xuất, chưa triển khai.
- **Người duyệt phương án:** TBD.
- **Nguồn:** Nhận xét của chủ dự án ngày 2026-10-28 và các liên kết chính thức trong bài; quota/giá cần kiểm tra lại trước phát hành.

## Nguồn và trạng thái

Nguồn: 12 nhận xét của chủ dự án trong cuộc trao đổi ngày 2026-10-28. Các xác nhận bên dưới là đầu vào nghiệp vụ; phương án kỹ thuật vẫn Draft, không phải đã triển khai. Chưa viết lại product-overview hoặc tự chốt kiến trúc.

## Điều đã xác nhận

| Mã | Nội dung | Nguồn nhận xét |
|---|---|---|
| C-01 | Code hiện tại chỉ thử làm việc dữ liệu với Sheets | 8 |
| C-02 | Khách hàng đã dùng Workspace | 4, 10 |
| C-03 | Email gửi học viên và phía khách hàng | 11 |
| C-04 | Sheets lỗi thì cho người dùng thử lại | 12 |
| C-05 | Cần lưu UTM/lead phục vụ marketing, đối chiếu | 1, 9 |
| C-06 | Ưu tiên tìm công cụ và hosting miễn phí | 1, 2; ngân sách cụ thể chưa chốt |

## Bản đồ yêu cầu → phương án → nghiệm thu

| Yêu cầu | Phương án đề xuất | Bằng chứng nghiệm thu cần có |
|---|---|---|
| Hiệu năng và scale | Cache nội dung, tối ưu ảnh/JS, không gọi Sheets mỗi page view; kiểm tra riêng tải API | Đo trang và API trên cấu hình thiết bị/mạng/tải đã duyệt; ngưỡng TBD |
| Cô lập lỗi | Boundary cho lỗi render phù hợp, xử lý lỗi form/API riêng, fallback ảnh | Gây lỗi có kiểm soát và xác minh vùng còn lại/đường phục hồi |
| 404 | Trang không tìm thấy có điều hướng và trạng thái HTTP thích hợp | Kiểm tra URL sai và khóa học/bài viết không tồn tại, tránh soft 404 |
| Bảo vệ Sheets | Endpoint xác thực, validation, rate limit, honeypot/Turnstile, ghi văn bản an toàn, quyền tối thiểu | Test input sai, công thức, spam, webhook không xác thực, đồng thời/gửi trùng |
| Email hai bên | Lưu lead trước; email có trạng thái riêng, đối soát và retry | Test một bên gửi lỗi, hết quota, timeout, không mất lead/không gửi lại bên đã xác nhận |
| SEO | Metadata riêng, canonical, sitemap/robots đúng môi trường, nội dung crawl được | Kiểm tra HTML, metadata, sitemap, preview không index; không hứa thứ hạng |
| Tracking/UTM | UTM có quy tắc, GA4/GTM, loại PII, conversion chỉ cho lead mới đã lưu | Test URL chiến dịch → form → Sheets → sự kiện; không bắt buộc GA4 bằng Sheets tuyệt đối |
| Sheets không khả dụng | Giữ form trong phiên, báo lỗi và nút thử lại, cùng mã lượt gửi | Test lỗi trước ghi và mất phản hồi sau ghi |
| Phát hành ổn định | CI/test/build, preview riêng, duyệt production và rollback | CI chặn lỗi, kiểm tra preview không ghi dữ liệu thật, diễn tập rollback |

## Đọc theo module

- [UTM/lead và tài liệu học](../references/utm-and-leads-primer.md).
- [Hosting và CI/CD](../07-architecture/hosting-options.md).
- [Email, quota và retry](../03-modules/M04-lead-capture/email-and-retry-notes.md).
- [Chống lạm dụng và nơi đọc lỗi](../07-architecture/lead-protection-and-errors.md).

## Cần chốt tiếp

Quyền sở hữu dữ liệu thehaudata.com; lead/ngày và tải cao điểm; danh sách người nhận phía khách hàng; thời hạn lưu dữ liệu; quy tắc attribution; mức độ trễ chấp nhận; domain gửi email; budget nếu hết free quota; runtime/hosting sau kiểm chứng.

Không lấy dữ liệu lead riêng tư của website tham khảo nếu không có quyền. Không dùng số lượt xem công khai/ước tính thay cho số lead thật.

## Ghi nhận về workspace

.docs được người dùng chuyển từ docs để lưu local. Đã kiểm tra quy tắc *.docs trong .gitignore có hiệu lực; không có file .docs đang tracked. Không đổi cấu trúc về docs, không thêm tài liệu vào Git. Agent/CI ở máy khác sẽ không có bộ docs này nếu chỉ clone repository; cần cung cấp riêng khi giao việc ở môi trường khác.
