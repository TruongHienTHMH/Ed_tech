# Ghi chú lưu lead, email và thử lại

- **Ngày cập nhật:** 2026-10-28
- **Trạng thái:** Draft — ghi nhận yêu cầu và đề xuất, chưa triển khai.
- **Người duyệt phương án:** TBD.
- **Nguồn:** Nhận xét của chủ dự án ngày 2026-10-28 và các liên kết chính thức trong bài; quota/giá cần kiểm tra lại trước phát hành.

## Thông tin khách hàng đã xác nhận — 2026-10-28

- Khách hàng đã có Google Workspace.
- Gửi email xác nhận cho học viên và thông báo cho phía khách hàng.
- Nếu Sheets lỗi, cho người dùng thử lại; chưa yêu cầu hệ thống nhận lead bền vững khi Sheets không hoạt động.
- Code hiện tại là thử nghiệm làm việc với dữ liệu Sheets, không phải bản production được nghiệm thu.

## Luồng đề xuất

1. Kiểm tra đầu vào và chống lạm dụng ở server.
2. Ghi lead với submission_id; nơi lưu kiểm tra trùng theo cách an toàn khi có nhiều request đồng thời.
3. Ghi được lead mới thì xác nhận tiếp nhận. Email là trạng thái riêng, không quyết định sự tồn tại của lead.
4. Ghi nhận hai công việc email: học viên và khách hàng. Theo dõi trạng thái riêng để gửi lại đúng người còn thiếu.
5. Lỗi Sheets/timeout: giữ nội dung form trong phiên và hiện nút Thử lại. Dùng lại submission_id cho cùng lần gửi; nếu lần trước đã ghi nhưng mất phản hồi, lần thử lại không ghi thêm dòng/không gửi lại mail đã xác nhận gửi.

Không báo thành công khi chưa lưu. Không yêu cầu người dùng đăng ký lại chỉ vì email lỗi sau khi lead đã lưu. Không giữ thông tin cá nhân lâu dài trong localStorage theo mặc định. Thời gian giữ form và timeout cụ thể còn cần duyệt.

## Email và quota

Quota Apps Script Workspace công bố 1.500 người nhận/ngày, có giới hạn riêng và điều kiện cho tài khoản mới/trial. Tài khoản thực thi script cần thuộc Workspace đã được xác nhận; việc khách có Workspace chưa chứng minh script đang chạy dưới đúng tài khoản. Xem [quota chính thức](https://developers.google.com/apps-script/guides/services/quotas).

Ví dụ ngân sách bảo thủ: một học viên + một người phía khách hàng là khoảng hai lượt người nhận mỗi lead; lấy 1.500/2 = 750 chỉ để hình dung, không phải cam kết công suất (còn mail khác, retry, giới hạn liên quan). Phải kiểm tra quota thực tế và dùng MailApp.getRemainingDailyQuota() khi chọn MailApp.

## Nếu gần hoặc hết quota

- Giữ lead đã lưu; ghi email pending/failed, theo dõi quota và gửi lại có kiểm soát khi đủ hạn mức. Không retry liên tục trong lúc quota chưa hồi phục.
- Nếu độ trễ này không đáp ứng nhu cầu, dùng dịch vụ email giao dịch qua API; xác thực domain gửi và xem trạng thái delivery/bounce.
- Resend là ứng viên: Free công bố 3.000 email/tháng, 100/ngày, nên không phải cách miễn phí tăng công suất so với Workspace. Gói trả phí là phương án khi tải vượt khả năng hiện có. [Resend pricing](https://resend.com/pricing).
- Không chia tài khoản để né quota. Không tự đổi nhà cung cấp khi có timeout chưa rõ gửi thành công hay chưa vì có thể phát email trùng.

## Đề xuất lưu công việc gửi mail

Ở quy mô nhỏ có thể lưu trạng thái gửi và lịch thử lại cùng lead/ở bảng công việc riêng trong Sheets, chạy tác vụ định kỳ; đây là đề xuất cần thiết kế, chưa phải hàng đợi được triển khai. Nếu ghi công việc không thành công sau khi ghi lead, cần tác vụ đối soát lead thiếu trạng thái email. Có thể chuyển sang hàng đợi bền vững nếu yêu cầu độ tin cậy cao hơn.

Đánh dấu pending/sent/failed theo từng người nhận; ghi số lần thử và thời điểm thử tiếp theo, giới hạn retry/cảnh báo và có thao tác gửi lại. Provider nhận email không đồng nghĩa đã vào inbox; timeout lúc gửi có thể làm kết quả không chắc chắn. Không cam kết exactly-once tuyệt đối cho email khi provider không có cơ chế phù hợp.

## Thời gian mục tiêu — đề xuất, chưa được duyệt

Không có mức tối thiểu/tối đa chung cho mọi website. Tách thời gian trang tải, phản hồi form và email.

- Form: mục tiêu ban đầu 95% lượt hợp lệ nhận phản hồi lưu trong 5 giây ở điều kiện bình thường; cần đo thực tế và điều chỉnh theo Apps Script.
- Email: mục tiêu 95% được provider chấp nhận trong 60 giây sau lưu; nếu còn pending quá 5 phút thì cảnh báo/đưa vào xử lý.
- Đây không phải bảo đảm email tới inbox trong 60 giây; spam filter và máy chủ nhận nằm ngoài quyền kiểm soát.
- Ngưỡng đo, thời gian timeout, cửa sổ thống kê, retry và người nhận cảnh báo vẫn phải duyệt.

## Kịch bản nghiệm thu đề xuất

Sheets lỗi giữ form và cho retry; timeout sau ghi không tạo lead trùng; gửi được cho học viên nhưng lỗi người quản lý thì chỉ thử lại người quản lý; hết quota không mất lead; thiếu cấu hình production không báo thành công giả; lead trùng không phát conversion mới.
