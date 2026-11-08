# Bài toán sản phẩm — DataWithLy

- **Mục đích:** Làm rõ các vấn đề cốt lõi của người học và đội ngũ vận hành mà website DataWithLy cần giải quyết trước khi lựa chọn tính năng hoặc giải pháp kỹ thuật.
- **Trạng thái:** Approved — đã thống nhất bài toán thực tế theo tài liệu trao đổi khách hàng và kế hoạch ngày 2026-11-03.
- **Người duyệt:** Chủ dự án.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview đã duyệt](product-overview.md);
  - Slide thuyết trình: `[LYDATA] Data Analytics Courses.pptx.pdf`;
  - Bảng yêu cầu nội dung: `Website LY DATA - content to fill.xlsx`;
  - [Ghi nhận yêu cầu khách hàng](../08-project/customer-requirements-notes.md);
  - Hướng dẫn biên soạn: [Writing Guide](WRITING-GUIDE.md).

---

## 1. Bối cảnh hiện trạng

Hiện tại, người học tiếp cận thương hiệu **DataWithLy** và Founder **Hứa Thảo Ly** chủ yếu qua các kênh truyền thông xã hội tự nhiên (TikTok `@datawithly`, Instagram `@datawithly`, Threads, Facebook và trang cá nhân LinkedIn).

Khi có nhu cầu tìm hiểu các khóa học phân tích dữ liệu, người học thường nhắn tin trực tiếp qua Direct Message (DM) hoặc Zalo cá nhân để hỏi về lộ trình, giáo trình từng buổi học, mức học phí và lịch khai giảng. Quá trình này dẫn đến tình trạng:
- Thông tin bị phân tán, thiếu một nguồn tham chiếu chính thức và hoàn chỉnh để người học tự đối chiếu mức độ phù hợp với trình độ hiện tại của mình.
- Đội ngũ tư vấn phải trả lời lặp đi lặp lại những câu hỏi tương tự về nội dung từng buổi học, thời lượng và chính sách học phí.
- Dữ liệu học viên đăng ký được ghi chép thủ công hoặc phân tán qua nhiều kênh chat, khiến việc theo dõi lịch hẹn tư vấn và đối soát nguồn chiến dịch marketing (UTM) gặp nhiều khó khăn.

---

## 2. Vấn đề của từng bên liên quan

| Nhóm bị ảnh hưởng | Vấn đề thực tế (Nỗi đau) | Bằng chứng / Nguồn xác nhận | Tác động cụ thể |
|---|---|---|---|
| **Người mới bắt đầu & Người chuyển ngành Data** | Không biết bắt đầu học Data Analytics từ đâu; lo ngại việc học nặng về lý thuyết hoặc chỉ học vẹt cú pháp công cụ (syntax SQL/tool) mà không biết cách giải quyết bài toán kinh doanh thực tế. | Slide bài giảng trang 2: *"Trong quá trình mentoring, mình nhận ra rằng khó khăn của nhiều bạn khi bắt đầu không nằm ở việc thiếu tài liệu, mà là không biết nên học gì, và làm thế nào để chuyển kiến thức thành khả năng giải quyết bài toán thực tế."* | Lúng túng, mất phương hướng khi chọn khóa học; tốn thời gian tự mày mò các tài liệu rời rạc. |
| **Người đã biết cơ bản (Junior DA, Excel user)** | Đã biết viết truy vấn SQL cơ bản hoặc kéo chart, nhưng chưa có tư duy phân tích (Analytical Thinking), chưa biết cách định nghĩa metrics, tìm kiếm insight và thiết kế dashboard phục vụ ra quyết định. | Bảng `content to fill.xlsx` (Mô tả khóa Analytical Thinking) & Slide trang 19: *"Bạn đã biết cách truy vấn dữ liệu nhưng thường lúng túng khi nhận một business question."* | Không tự tin ứng tuyển vị trí Data Analyst; gặp khó khăn khi làm bài test tuyển dụng hoặc trình bày kết quả trước cấp trên. |
| **Học viên muốn đăng ký học** | Thiếu thông tin minh bạch, chi tiết về toàn bộ các buổi học (Syllabus) trước khi quyết định đóng học phí; lo lắng về việc mất thông tin khi gửi form hoặc không nhận được xác nhận kịp thời. | Bảng `content to fill.xlsx` (Yêu cầu làm rõ Syllabus chi tiết cho 3 khóa) & [Yêu cầu bổ sung](../references/additional-requirements.md). | Chần chừ trong việc ra quyết định đăng ký; cần được hỗ trợ tư vấn lộ trình 1-1 trước khi nhập học. |
| **Đội ngũ tư vấn & Tuyển sinh** | Tiếp nhận thông tin học viên phân tán; tốn thời gian xử lý thủ công; có nguy cơ sót lead hoặc liên hệ sai khung giờ hẹn của học viên. | [Customer Requirements Notes](../08-project/customer-requirements-notes.md) & [Q&A dự án](../references/project-qa.md). | Chậm trễ trong việc phản hồi học viên (giảm tỷ lệ chốt tuyển sinh); khó quản lý trạng thái tư vấn. |
| **Đội ngũ Marketing** | Không đối soát được số lượng đăng ký đến từ kênh truyền thông nào (TikTok, Facebook Ads, Threads hay giới thiệu tự nhiên) do thiếu cơ chế bắt và lưu trữ tham số UTM tự động. | Yêu cầu C-05 trong [Customer Requirements Notes](../08-project/customer-requirements-notes.md) và tài liệu [UTM Primer](../references/utm-and-leads-primer.md). | Khó đánh giá hiệu quả chi phí marketing và hiệu quả của từng chiến dịch quảng cáo. |
| **Người quản trị nội dung (Chị Ly)** | Thường xuyên có cập nhật về lịch khai giảng mới, học phí ưu đãi hoặc các bài viết chia sẻ mẹo SQL mới, nhưng không có kỹ năng lập trình web để tự sửa code. | Yêu cầu quản lý qua Google Sheets trong [Solution Report](../references/solution-and-scope-report.md) và [Q&A dự án](../references/project-qa.md). | Phụ thuộc hoàn toàn vào lập trình viên mỗi khi muốn thay đổi câu chữ hoặc thông tin lịch học trên website. |

---

## 3. Thành công trông như thế nào? (Vision of Success)

Khi dự án website DataWithLy hoàn thành:

1. **Đối với người học:**
   - Chỉ cần mở website là nắm trọn vẹn lộ trình học có hệ thống từ tư duy đến thực hành của 3 khóa học chuẩn (`SQL for Data Analytics`, `Analytical Thinking & Dashboard Design`, `End-to-End Analytics with SQL & Dashboard Design`).
   - Xem được giáo trình chi tiết từng buổi học (Syllabus Accordion) và các sản phẩm dashboard thực tế của học viên khóa trước để tin tưởng chất lượng đào tạo.
   - Nộp form đăng ký tư vấn trong vòng dưới 30 giây, nhận được email xác nhận ngay lập tức, và form luôn giữ lại thông tin nếu đường truyền mạng gặp sự cố.
2. **Đối với đội ngũ tư vấn và vận hành:**
   - 100% lead đăng ký từ website được chuyển tự động vào bảng tính Google Sheets nội bộ bảo mật kèm thông tin: Họ tên, Số điện thoại, Khóa học quan tâm, Khung giờ hẹn gọi và nguồn chiến dịch (UTM).
   - Tư vấn viên nhận được thông báo tức thì qua email để liên hệ chăm sóc học viên trong thời gian sớm nhất.
3. **Đối với người quản trị nội dung:**
   - Chị Hứa Thảo Ly và đội ngũ có thể mở file Google Sheets bất cứ lúc nào để sửa đổi học phí, cập nhật ngày khai giảng, bổ sung review học viên hoặc đăng bài blog mới; website tự động cập nhật nội dung mới mượt mà mà không cần chỉnh sửa một dòng code nào.

---

[Điểm bắt đầu của bộ docs](../README.md)
