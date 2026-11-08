# Mục tiêu và ngoài mục tiêu — DataWithLy

- **Mục đích:** Nối từng bài toán thực tế đã nêu trong [Problem Statement](problem-statement.md) với các mục tiêu cụ thể, chỉ số đo lường và ranh giới phát hành rõ ràng trước khi bàn giao việc triển khai cho Agent Code.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch và trao đổi ngày 2026-11-03.
- **Người duyệt:** Chủ dự án.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview](product-overview.md);
  - [Problem Statement](problem-statement.md);
  - [Ghi nhận yêu cầu khách hàng](../08-project/customer-requirements-notes.md);
  - Bảng yêu cầu nội dung `Website LY DATA - content to fill.xlsx`;
  - Slide bài giảng `[LYDATA] Data Analytics Courses.pptx.pdf`;
  - Hướng dẫn biên soạn: [Writing Guide](WRITING-GUIDE.md).

---

## 1. Mục tiêu sản phẩm cốt lõi (Core Goals)

| STT | Mục tiêu sản phẩm | Bài toán giải quyết | Phương thức thực hiện & Đo lường |
|:---:|:---|:---|:---|
| **G-01** | **Minh bạch hóa 100% thông tin 3 khóa học thực tế** | Người học thiếu thông tin lộ trình, học phí và khó tự đánh giá mức độ phù hợp | Trình bày đầy đủ thông tin: Lộ trình, số buổi học (12 - 25 buổi), học phí niêm yết công khai (2.990k - 5.690k), hình thức Live Online qua Zoom, và syllabus chi tiết từng buổi. |
| **G-02** | **Thu thập Lead an toàn, phân tách dữ liệu & Tự động ghi nhận UTM** | Đội ngũ tư vấn tiếp nhận lead rời rạc; marketing không đo được nguồn chiến dịch | Biểu mẫu Modal đăng ký tự động bắt các tham số UTM (`utm_source`, `utm_medium`, `utm_campaign`), gửi một chiều an toàn qua Webhook vào file Google Sheets nội bộ; không phơi bày dữ liệu học viên ra ngoài mã nguồn. |
| **G-03** | **Cơ chế giữ Form & Tự động thử lại khi gặp lỗi (Auto-retry)** | Rủi ro người dùng mất dữ liệu nhập khi mạng chập chờn hoặc Sheets phản hồi chậm | Form duy trì trạng thái dữ liệu người dùng đã gõ trong phiên (không reset form nếu gửi lỗi), hiển thị thông báo lỗi rõ ràng và cung cấp nút *"Thử lại"* kèm mã `submission_id`. |
| **G-04** | **Bảo vệ hệ thống & Chống Spam 3 lớp** | Rủi ro bot spam làm rác dữ liệu Sheets và quá tải tài khoản Workspace | Tích hợp 3 lớp phòng vệ: (1) Bẫy Honeypot ẩn với người dùng thật; (2) Chống gửi trùng lặp với `submission_id` duy nhất; (3) Giới hạn tần suất nộp form theo IP (Rate Limiting). |
| **G-05** | **Tự động hóa thông báo Email 2 chiều** | Giảm độ trễ phản hồi học viên và tạo trải nghiệm chuyên nghiệp | Tự động kích hoạt: (1) Email thông báo tức thì đến tư vấn viên (`hien0934752432@gmail.com`, `hien.truong230214@vnuk.edu.vn`); (2) Email cảm ơn và xác nhận gửi đến học viên. |
| **G-06** | **Quản trị nội dung độc lập qua Google Sheets CMS** | Khách hàng không thể tự sửa nội dung nếu không có lập trình viên can thiệp | Toàn bộ câu chữ, giá bán, lịch học, dự án học viên, bài viết và banner ưu đãi được nạp từ Google Sheets công khai; hỗ trợ On-demand Revalidation (ISR) làm mới website tức thì khi bấm *"Xuất bản"*. |
| **G-07** | **Đảm bảo trải nghiệm UI/UX mượt mà & Cô lập lỗi (Error Boundary)** | Ngăn chặn việc website bị crash trắng trang khi dữ liệu Sheets bị thiếu/sai | Thiết kế giao diện responsive trên mọi thiết bị với tone màu Đỏ Mận hiện đại; bọc Error Boundary tại từng component để hiển thị dữ liệu dự phòng an toàn (Fallback Gracefully) nếu có lỗi. |

---

## 2. Mục tiêu trọng tâm của Đợt 1 (MVP: CMS + HomePage Staging)

Chủ dự án đã xác nhận ưu tiên kiểm chứng hệ thống CMS bằng màn hình **HomePage** và luồng thu thập lead trên môi trường thử nghiệm:
1. **Hoàn thiện giao diện HomePage** chuẩn thương hiệu DataWithLy (tone màu Đỏ Mận) với đầy đủ các phân khu: Hero, 3 Card USP, Lưới 3 khóa học, Thư viện Dự án học viên, Đánh giá học viên, Bài viết chia sẻ.
2. **Kiểm chứng luồng dữ liệu Google Sheets CMS:** Người quản trị chỉnh sửa văn bản hoặc trạng thái khóa học trên Sheets, website cập nhật chính xác nội dung mới.
3. **Kiểm chứng Lead Form an toàn trên môi trường Staging:** Form đăng ký tư vấn trên HomePage được kết nối vào **Google Sheets Staging** (file test riêng để bảo vệ dữ liệu thực tế), kích hoạt gửi email cảnh báo demo tới các địa chỉ đã thống nhất (`hientruongthmh@gmail.com` gửi tới `hien0934752432@gmail.com` và `hien.truong230214@vnuk.edu.vn`).

---

## 3. Ngoài mục tiêu của đợt đầu (Non-goals)

Để tập trung nguồn lực hoàn thiện hệ thống cốt lõi và phát hành an toàn, các tính năng sau **chưa thuộc phạm vi của đợt đầu**:
- **Không tích hợp cổng thanh toán trực tuyến (Payment Gateway):** Việc thu học phí thực hiện qua tư vấn trực tiếp 1-1 và chuyển khoản ngân hàng thủ công.
- **Không xây dựng hệ thống LMS học trực tuyến riêng:** Lớp học được tổ chức trực tiếp qua Zoom Meeting tương tác 1-1, học viên nhận tài liệu và bài tập qua Drive/nhóm hỗ trợ.
- **Không xây dựng trang Admin Dashboard web phức tạp:** Khách hàng sử dụng trực tiếp bảng tính Google Sheets quen thuộc làm giao diện quản trị nội dung.
- **Không hoàn thiện các trang chi tiết riêng (Course Detail, About Us, Blog) trong Đợt 1:** Các trang này sẽ được triển khai lần lượt ở Đợt 2 và Đợt 3 theo đúng lộ trình đã phân kỳ.
- **Không đưa lead thử nghiệm vào file Sheets Production:** Đợt 1 chỉ kiểm thử trên Sheets Staging.

---

## 4. Tiêu chí nghiệm thu & Điều kiện thành công

Tài liệu này được coi là đạt yêu cầu khi các Agent Code và Đội ngũ kiểm thử đối chiếu được các kết quả sau:
1. **Kiểm thử CMS:** Thay đổi một tiêu đề hoặc học phí trên Google Sheets -> Kích hoạt xuất bản -> Mở website kiểm tra thấy nội dung thay đổi đúng trong vòng dưới 2 giây.
2. **Kiểm thử Lead Form & Chống spam:**
   - Điền form hợp lệ -> Dữ liệu xuất hiện ngay lập tức trong Google Sheets Staging kèm đầy đủ UTM.
   - Bấm nút gửi liên tục 3 lần -> Bảng tính chỉ ghi nhận duy nhất 1 dòng (chống trùng thành công).
   - Bot tự động điền trường ẩn Honeypot -> Hệ thống chặn request, không ghi vào Sheets.
   - Ngắt mạng khi gửi -> Form giữ nguyên thông tin đã nhập, hiển thị thông báo lỗi thân thiện và nút thử lại.
3. **Kiểm thử Email:** Email thông báo xuất hiện trong hộp thư đến của `hien0934752432@gmail.com` và `hien.truong230214@vnuk.edu.vn` đầy đủ thông tin học viên và khóa học quan tâm.

---

[Điểm bắt đầu của bộ docs](../README.md)
