# Hướng dẫn tự viết nhóm 01-product

- **Mục đích:** Giúp chủ dự án hoàn thiện các tài liệu sản phẩm bằng lời của mình, dựa trên `references` và những quyết định đã chốt.
- **Trạng thái:** Hướng dẫn biên soạn; không phải yêu cầu đã duyệt.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn:** [Product Overview đã duyệt](product-overview.md), [mục lục references](../references/README.md), [ghi nhận yêu cầu khách hàng](../08-project/customer-requirements-notes.md).

## Cách dùng tài liệu tham khảo

Đi theo thứ tự: **ý đã được chủ dự án chốt → bằng chứng khách hàng cung cấp → báo cáo cũ để gợi ý → code thử nghiệm để biết hiện trạng**. Một câu trong báo cáo cũ hoặc một dấu `[x]` trong Q&A chưa chứng minh tính năng đã chạy và cũng chưa phải yêu cầu cuối cùng.

Khi lấy một ý từ `references`, tự hỏi: “Ai xác nhận? Xác nhận lúc nào? Đây là nhu cầu, đề xuất hay số liệu có thể công bố?” Ghi `Cần xác nhận` nếu chưa có câu trả lời. Không mang các cam kết “100%”, “ngay lập tức”, chi phí `$0`, điểm PageSpeed hoặc số học viên từ báo cáo cũ sang tài liệu sản phẩm như một sự thật.

## 1. [Product Overview](product-overview.md) — đã chốt

**Mục tiêu của file:** trả lời *website tồn tại để làm gì, phục vụ ai và mang lại giá trị gì*. Bản này đã Approved ở mức định hướng. Chỉ cập nhật khi định hướng đổi; không cần đưa schema Sheets, danh sách component hay nhà cung cấp hosting vào đây.

Khi đọc lại, kiểm tra bốn ý: DataWithLy giới thiệu khóa học; có HomePage, Course Detail, About Us và Blog; người học có thể yêu cầu tư vấn hoặc bày tỏ mong muốn đăng ký; đội ngũ nhận lead và nguồn chiến dịch. Các chi tiết số trang, khóa học thật và cách vận hành CMS sẽ viết ở các file sau.

## 2. [Problem Statement](problem-statement.md) — viết bài toán trước tính năng

**Dàn ý nên viết:**

1. **Hiện trạng:** học viên hiện biết đến DataWithLy qua đâu, tìm thông tin khóa học như thế nào, đăng ký và được tư vấn bằng cách nào? Đội ngũ đang lưu và đối chiếu lead ở đâu?
2. **Khó khăn của từng bên:** học viên thiếu thông tin gì để ra quyết định? Đội ngũ gặp trở ngại gì khi cập nhật nội dung và nhận lead từ nhiều nguồn?
3. **Bằng chứng:** một ví dụ thật, phản hồi khách hàng, quy trình hiện tại hoặc số liệu có nguồn. Chưa có thì ghi “Giả thuyết cần kiểm chứng”.
4. **Tác động:** hậu quả có thể quan sát, ví dụ bỏ dở form, khó biết lead đến từ chiến dịch nào, nội dung khóa học không thống nhất. Không tự ước lượng tỷ lệ thất thoát.
5. **Thành công trông như thế nào:** mô tả người học/đội ngũ sẽ làm được gì sau khi giải quyết vấn đề, chưa cần chọn giải pháp kỹ thuật.

**Câu hỏi bạn nên hỏi khách hàng:** “Học viên đang hỏi đi hỏi lại thông tin nào?”, “Ai tiếp nhận form hiện nay?”, “Lead hiện có thiếu thông tin nào khiến marketing khó đối chiếu?”

**Nguồn để gợi ý:** phần mục tiêu và CMS của [báo cáo giải pháp](../references/solution-and-scope-report.md); phần form, CMS và marketing của [Q&A](../references/project-qa.md); [ghi chú UTM/lead](../references/utm-and-leads-primer.md). Dùng như giả thuyết, không chép tuyên bố đã hoàn thành.

**Mẫu câu:** “Người [nhóm] hiện [cách làm]. Khi [tình huống], họ không thể [kết quả cần đạt], dẫn tới [tác động có bằng chứng].”

## 3. [Goals and Non-goals](goals-and-non-goals.md) — chốt kết quả cần đạt

**Dàn ý nên viết:**

1. **Mục tiêu người học:** tìm được thông tin phù hợp, hiểu bước tiếp theo và gửi yêu cầu tư vấn thuận tiện.
2. **Mục tiêu vận hành:** đội ngũ nhận được lead hợp lệ, biết khóa quan tâm và nguồn marketing khi dữ liệu có sẵn; người phụ trách cập nhật nội dung đã được duyệt.
3. **Mục tiêu đo lường:** ghi tên chỉ số, cách đếm, công cụ/nguồn, thời điểm đo và người chịu trách nhiệm. Để ngưỡng `TBD` cho đến khi có baseline hoặc được duyệt.
4. **Ngoài mục tiêu của đợt đầu:** chỉ ghi điều khách thực sự muốn hoãn. Ví dụ “thanh toán online”, “CRM đầy đủ”, “tự động ghi danh” là *ứng viên cần xác nhận*, không tự loại bỏ.
5. **Điều kiện thành công:** người duyệt có thể nhìn vào dữ liệu/kiểm thử nào để nói mục tiêu đã đạt?

**Phân biệt:** mục tiêu là “có thể đối chiếu số lead theo chiến dịch”; giải pháp là “lưu UTM trong Sheets”. Hai ý có thể cùng xuất hiện nhưng phải ghi đúng vai trò.

**Nguồn để gợi ý:** [Product Overview](product-overview.md), [yêu cầu bổ sung](../references/additional-requirements.md), phần SEO/marketing của [Q&A](../references/project-qa.md). Các chỉ số tốc độ và chi phí trong báo cáo cũ cần đo/duyệt lại trước khi dùng làm mục tiêu.

## 4. [Actors and Roles](actors-and-roles.md) — tách người dùng khỏi người làm dự án

**Dàn ý nên viết:**

1. **Tác nhân bên ngoài:** người xem nội dung, người để lại thông tin tư vấn, người muốn đăng ký học. Xác nhận các nhóm này có khác nhau về hành động hay không.
2. **Tác nhân vận hành:** người tư vấn nhận lead; người viết nội dung; người duyệt/xuất bản; người quản lý quyền truy cập Sheets.
3. **Mỗi vai trò:** mục tiêu, việc được làm, dữ liệu được xem, thao tác cần được duyệt và người chịu trách nhiệm khi có lỗi.
4. **Vai trò dự án:** chủ dự án duyệt phạm vi, tech lead rà tính khả thi, Agent thực hiện task. Đây không mặc định là tài khoản trên website.

**Câu hỏi bạn nên hỏi khách hàng:** “Ai được sửa giá và lịch khai giảng?”, “Ai xem số điện thoại lead?”, “Một người có thể vừa viết vừa duyệt bài không?”, “Ai nhận thông báo form?”

**Nguồn để gợi ý:** mục quản trị và phân quyền trong [Q&A](../references/project-qa.md), mô hình tách nội dung công khai/lead riêng tư trong [báo cáo giải pháp](../references/solution-and-scope-report.md). Quyền thật phải được khách hàng xác nhận; báo cáo cũ chỉ là đề xuất.

## 5. [Product Scope](product-scope.md) — mục tiếp theo cần chốt

**Dàn ý nên viết theo từng đợt phát hành:**

1. **Đích của đợt:** bạn đã ưu tiên làm vững CMS bằng Google Sheets và dùng HomePage làm màn hình kiểm thử đầu tiên. Ghi rõ “kiểm thử nội bộ” hay “phát hành cho học viên”.
2. **Trong phạm vi:** từng phần của HomePage sẽ lấy dữ liệu từ Sheets (ví dụ hero, khóa nổi bật, bài viết, CTA, cấu hình liên hệ). Chỉ đánh dấu phần có dữ liệu/nguồn được chốt.
3. **Ngoài phạm vi đợt đó:** Course Detail, About Us và Blog có ở các đợt sau hay cần phần tối thiểu ngay? Ghi quyết định, không bỏ chúng khỏi mục tiêu sản phẩm đã duyệt.
4. **Phạm vi CMS:** ai sửa dữ liệu nào, bước kiểm tra/xuất bản, nội dung ẩn/hiện, lịch sử và xử lý khi Sheets sai hoặc không đọc được. Đây là hành vi mong muốn, chưa cần chọn cấu trúc cột.
5. **Phạm vi lead:** trong mock test HomePage có form thật hay form thử? Dữ liệu vào Sheets test hay Sheets khách? Email và GA4 có bật không? Cần chốt để không làm bẩn dữ liệu thật.
6. **Điều kiện hoàn thành:** với mỗi mục trong phạm vi, ghi một kết quả có thể kiểm tra được và người duyệt.

**Nguồn để gợi ý:** bảng phân hệ trong [báo cáo ban đầu](../references/initial-product-report.md), phần CMS trong [báo cáo giải pháp](../references/solution-and-scope-report.md), [yêu cầu đã được ghi nhận](../08-project/customer-requirements-notes.md). Danh sách phân hệ cũ gồm nhiều hơn HomePage; không mặc định làm toàn bộ trong đợt đầu.

**Mẫu dòng phạm vi:** “Đợt 1 / HomePage / phần khóa nổi bật / người quản lý cập nhật [loại nội dung] trong Sheets thử / website hiển thị bản đã xuất bản / tiêu chí kiểm tra [TBD] / người duyệt [TBD].”

## Thứ tự làm và điều kiện chuyển bước

1. Đọc lại Product Overview đã chốt và đánh dấu chỗ nào cần hỏi khách về nội dung thật.
2. Viết Problem Statement và Actors and Roles bằng thông tin có nguồn; giữ `Cần xác nhận` ở phần còn thiếu.
3. Viết Goals and Non-goals, gắn mỗi mục tiêu với một vấn đề đã mô tả.
4. Viết Product Scope cho **đợt CMS + HomePage mock test** trước, rồi ghi các đợt sau ở mức định hướng.
5. Gửi bốn file Draft để duyệt. Sau khi Product Scope được chốt mới triển khai PRD M05/M01, workflow, mô hình dữ liệu và tiêu chí nghiệm thu cho task code liên quan.

Một file đủ để duyệt khi người khác đọc xong biết **điều gì đã được quyết định, bằng chứng ở đâu, điều gì còn mở và việc mở đó chặn bước nào**. `TBD` không cần biến mất hoàn toàn; chỉ những `TBD` ảnh hưởng trực tiếp đến task sắp giao mới phải được giải quyết trước task đó.
