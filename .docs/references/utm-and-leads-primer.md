# UTM, lead và bộ công cụ khởi đầu

- **Ngày cập nhật:** 2026-10-28
- **Trạng thái:** Draft — ghi nhận yêu cầu và đề xuất, chưa triển khai.
- **Người duyệt phương án:** TBD.
- **Nguồn:** Nhận xét của chủ dự án ngày 2026-10-28 và các liên kết chính thức trong bài; quota/giá cần kiểm tra lại trước phát hành.

## Lead và UTM có nghĩa gì?

Lead là người đã chủ động để lại thông tin để được tư vấn; lượt truy cập chưa phải lead. UTM là nhãn gắn vào URL để nhận biết nguồn chiến dịch, không phải công cụ lấy thông tin cá nhân.

Ví dụ minh họa (example.com không phải domain đã chốt):

```text
https://example.com/courses/sql?utm_source=facebook&utm_medium=paid_social&utm_campaign=sql_launch&utm_content=video_a
```

| Trường | Ý nghĩa | Ví dụ |
|---|---|---|
| utm_source | Nguồn phát link | facebook |
| utm_medium | Loại kênh | paid_social |
| utm_campaign | Tên chiến dịch | sql_launch |
| utm_content | Phân biệt nội dung quảng cáo | video_a |
| utm_term | Từ khóa khi cần | sql_beginner |

Luồng đề xuất: marketing tạo URL → người học mở URL → website đọc nhãn → người học gửi form → API kiểm tra → lưu thông tin đăng ký và UTM vào Sheets → xử lý email xác nhận/thông báo.

GA4 nhận sự kiện hành vi; Sheets giữ lead cụ thể. Không ghi mọi page view vào Sheets, không đưa họ tên/email/điện thoại sang GA4. UTM không được chứa dữ liệu cá nhân. Xem [hướng dẫn UTM của Google](https://support.google.com/analytics/answer/10917952) và [quy định PII](https://support.google.com/analytics/answer/6366371).

## Các quy tắc còn cần duyệt

- First-touch: nguồn đầu tiên ghi nhận trong khoảng thời gian quy định.
- Last non-direct touch: nguồn chiến dịch/referral gần nhất, không bị lượt quay lại trực tiếp xóa. Đây là đề xuất cho dữ liệu lead, không khẳng định giống mô hình attribution GA4.
- Ví dụ: Facebook → Google → mở bookmark → gửi form. Có thể giữ first=Facebook, last non-direct=Google.
- Đề xuất cửa sổ cố định 30 ngày tính từ first-touch; hết hạn tạo chu kỳ mới. Đây là quy tắc mới cần duyệt, không suy ra từ hành vi gia hạn của code thử nghiệm.
- Nếu không có UTM nhưng có referrer bên ngoài, ghi referral/organic theo quy tắc được chốt. Chỉ ghi direct khi có đủ ngữ cảnh cho kết luận đó; nếu không thu thập được do storage bị chặn, ghi unknown cùng lý do, không bịa nguồn.
- Không đọc được localStorage vẫn có thể đọc UTM URL của lượt hiện tại. Không đảm bảo nối hành trình xuyên thiết bị, trình duyệt hoặc chế độ riêng tư.
- Dữ liệu client có thể bị sửa; không dùng UTM cho phân quyền hoặc xác thực.
- Chuẩn hóa chữ thường và quy ước đặt tên chiến dịch; không tự gắn UTM vào link nội bộ làm sai nguồn.

## Công cụ và chi phí

| Công cụ | Dùng để làm gì | Chi phí/giới hạn |
|---|---|---|
| URL builder theo hướng dẫn Google | Tạo URL có UTM | Không cần mua phần mềm |
| GA4 tiêu chuẩn | Báo cáo hành vi/chuyển đổi | Có bản miễn phí; không phải kho lead |
| Google Tag Manager bản web tiêu chuẩn | Quản lý thẻ GA4 | Miễn phí; server-side hosting là phần khác |
| Google Sheets + Apps Script | Lưu lead, xử lý tích hợp nhỏ | Dùng Workspace khách đã có; có quota, không phải hạ tầng vô hạn |
| Cloudflare Turnstile Free | Giảm gửi form tự động | Gói miễn phí; phải xác minh token phía server |

Nguồn: [GA4](https://marketingplatform.google.com/about/analytics/), [GTM](https://marketingplatform.google.com/about/tag-manager/), [quota Apps Script](https://developers.google.com/apps-script/guides/services/quotas), [Turnstile](https://developers.cloudflare.com/turnstile/plans/).

Không cam kết toàn bộ hệ thống hoàn toàn miễn phí: Workspace đã là dịch vụ khách trả tiền, domain và phần vượt quota có thể phát sinh phí.

## Bài tập làm quen trước khi triển khai

1. Tạo hai URL cùng trang đích với campaign/content khác nhau.
2. Trên môi trường thử, kiểm tra website đọc đúng nhãn, không mất nhãn khi chuyển trang.
3. Gửi dữ liệu giả vào Sheets thử; đối chiếu từng trường, không dùng dữ liệu khách thật.
4. Kiểm tra sự kiện GA4/GTM; gửi lại cùng mã không tạo lead hoặc conversion mới.
5. Thử chặn storage, thiếu UTM, quay lại trực tiếp và API lỗi. Ghi kết quả trước khi chốt quy tắc.

## Website tham khảo thehaudata.com

Trang công khai có nút đăng ký dẫn tới forms.gle theo lần kiểm tra 2026-10-28: [website tham khảo](https://thehaudata.com/). Chưa đọc form, không gửi thử form.

Không thể lấy danh sách lead riêng tư bằng cách xem website. Nếu khách hàng sở hữu/được cấp quyền hợp lệ, có thể yêu cầu chủ form xuất Responses/Sheets hoặc cấp quyền dữ liệu/GA4 cần thiết. Nếu là website bên khác, chỉ đối chiếu UX và thông tin công khai; số truy cập ước tính không phải số lead.

Cần hỏi: khách hàng có sở hữu hoặc được phép truy cập dữ liệu của website này không? Nếu có, nguồn dữ liệu hiện tại là Form/Sheets/CRM nào và có lưu nguồn chiến dịch không? Không thể khôi phục lịch sử UTM chưa từng được ghi nhận.
