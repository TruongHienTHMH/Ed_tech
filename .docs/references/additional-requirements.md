## Lưu trữ các yêu cầu chức năng thêm. ##
1. Responesive
2. Func của các CTA - Menu phải hoạt động đúng chức năng.
3. CheckPerformance của hệ thống.
4. Handle 404: 
  * **Trang 404 (Không tìm thấy trang):** Khi người dùng gõ sai link hoặc truy cập link cũ không tồn tại, hệ thống chuyển hướng đến trang 404 được thiết kế theo đúng nhận diện thương hiệu LY DATA, kèm nút bấm *"Quay về Trang chủ"* hoặc *"Khám phá các khóa học khác"* để giữ chân học viên.
  * **Cơ chế Error Boundary (Cô lập lỗi):** Nếu một thành phần nhỏ bị lỗi (ví dụ một ảnh bị mất link), hệ thống sẽ tự động dùng ảnh dự phòng (Fallback Gracefully) mà **tuyệt đối không làm sập toàn bộ trang web**.
5. Email function:
* 
    Gửi thông báo về email chính.
    Gửi thông báo them form đến cho học viên.
6. Hệ thống web phải có các chức năng sau:
    1. Chống spam với các cách sau:
        - *Honeypot Anti-Bot:* Đặt một ô nhập liệu ẩn mà người thường không thấy, chỉ có bot tự động mới điền. Nếu phát hiện bot -> chặn ngay lập tức.
        - *Chống gửi trùng (Deduplication / Idempotency):* Mỗi lượt gửi form được cấp một mã `submission_id` duy nhất. Nếu học viên lỡ tay bấm liên tiếp 2-3 lần, hệ thống chỉ ghi nhận 1 dòng duy nhất.
        - *Rate Limiting theo IP:* Giới hạn mỗi người dùng chỉ được gửi tối đa 3 lần/phút để ngăn chặn kẻ xấu cố tình spam phá hoại.
    2. Giữ lại form, cơ chế foBack - giữ data nếu có lỗi - tránh user nhập lại từ đâu.
    3. Nguyên cứu check các hệ thống CRM và Email phục vụ cho Marketing.
7. Đảm bảo được SEO và Tracking.
    - Tích hợp GA4 để tracking lưu lượng.
    - metadata đầy đủ để SEO web
    - Tracking các CTA - BTN -> Có thể lưu trong Sheets.
    - Hỗ trợ lưu trữ đầy đủ các chiến dịch quản cáo.
    
