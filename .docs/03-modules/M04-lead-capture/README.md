# M04 — Thu thập thông tin tư vấn (Lead Capture)

- **Mục đích:** Xác định ranh giới, kiến trúc bảo mật 3 lớp, luồng xử lý dữ liệu và cam kết phục hồi cho Module Thu thập Lead.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người phụ trách:** TechLead & Fullstack Agent
- **Ngày cập nhật:** 2026-11-03
- **Nguồn tham khảo:** 
  - [PRD M04 Chi tiết](prd.md)
  - [Ghi chú lưu lead & email retry](email-and-retry-notes.md)
  - [Workflow Đăng ký tư vấn (WF-03)](../../04-workflows/WF-03-submit-consultation.md)
  - [Thiết kế an toàn & Chống spam 3 lớp](../../07-architecture/security-design.md)
  - [Bảo vệ dữ liệu Lead & Chịu lỗi Client](../../07-architecture/lead-protection-and-errors.md)
  - [Đặc tả API Endpoint](../../07-architecture/api-design.md)

---

## 1. Ranh giới module (Module Boundaries)

Module Lead Capture đóng vai trò là kênh thu thập khách hàng tiềm năng chính của website DataWithLy, chuyển hóa sự quan tâm của học viên thành thông tin liên hệ được ghi nhận an toàn và kích hoạt quy trình tư vấn 1-on-1 từ Mentor Hứa Thảo Ly.

```
[UI Form / Modal Island]
       │  (Zod Validation, Honeypot, SessionStorage Backup)
       ▼
[Next.js API Route: POST /api/leads]
       │  (Rate Limit IP, Idempotency Token, Formula Sanitization)
       ▼
[Google Apps Script Gateway (Private Webhook)]
       │  (LockService.waitLock 10s, Deduplication Check)
       ▼
[Private Google Sheets: Leads Tab]
       │  (Asynchronous Eventual Consistency)
       ├──> [MailApp: Email xác nhận gửi Học viên]
       └──> [MailApp: Email cảnh báo gửi Chị Ly & Đội ngũ tư vấn]
```

### Trong phạm vi (In-Scope)
1. **Giao diện Modal & Form nhúng (Lead Form Island):**
   - Hỗ trợ cả 2 chế độ hiển thị: Modal Pop-up (kích hoạt từ CTA trên toàn trang) và Form nhúng (trên trang chi tiết khóa học).
   - Validation Client-side thời gian thực bằng `react-hook-form` + `zod`.
   - Cơ chế lưu tạm thông tin vào `sessionStorage` để phục hồi tự động khi người dùng vô tình reload hoặc gặp sự cố rớt mạng.
2. **Hàng rào bảo mật 3 lớp (3-Layer Anti-Spam Shield):**
   - *Lớp 1: Honeypot ẩn (`website_hp`)* đánh lừa bot tự động điền form.
   - *Lớp 2: Khóa chống trùng lặp (`submission_id`)* ngăn chặn click đúp hoặc spam mạng.
   - *Lớp 3: Rate Limiting theo IP* giới hạn tối đa 3 lượt gửi trong 10 phút.
3. **API Endpoint Nội bộ (`POST /api/leads`):**
   - Xác thực schema Zod trên Server.
   - Vệ sinh chuỗi chống chèn công thức Google Sheets (Formula Injection Sanitization - tự động thêm dấu `'` vào chuỗi bắt đầu bằng `=`, `+`, `-`, `@`).
   - Ẩn hoàn toàn Webhook URL và Secret Key của Google Sheets khỏi client-side.
4. **Cơ chế chịu lỗi Client & Tự động thử lại (Client-side Resilience):**
   - 3 lần tự động gửi lại có giãn cách lũy thừa (Exponential Backoff: 1s, 2s, 4s).
   - Nút `[Thử lại]` thủ công giữ nguyên 100% dữ liệu đã điền nếu cả 3 lần thử tự động đều thất bại.
5. **Gửi thông báo Email 2 chiều (2-Way Asynchronous Email Dispatch):**
   - Email 1: Thư xác nhận gửi học viên từ `DataWithLy <hientruongthmh@gmail.com>`.
   - Email 2: Thư cảnh báo lead mới gửi đội ngũ tư vấn (`hien0934752432@gmail.com`, `hien.truong230214@vnuk.edu.vn`).

### Ngoài phạm vi (Out-of-Scope)
- Quản lý trạng thái xử lý sau lead (CRM, gọi điện chốt đơn, quản lý phễu tư vấn - thực hiện trực tiếp trên Google Sheets Private).
- Cổng thanh toán học phí trực tuyến (VNPay, Momo, Chuyển khoản QR tự động).
- Lưu trữ PII học viên vào cơ sở dữ liệu SQL ngoài (tuân thủ nguyên tắc Serverless không lưu trữ PII dư thừa).

---

## 2. Các thành phần chính (Components & File Structure)

- `components/lead/LeadModal.tsx`: Hộp thoại Modal bật lên khi click CTA.
- `components/lead/LeadForm.tsx`: Component form chính chứa các trường input và logic validation.
- `components/lead/SuccessScreen.tsx`: Màn hình cảm ơn và link tham gia cộng đồng Zalo.
- `app/api/leads/route.ts`: API route xử lý validate, rate limit, sanitization và proxy sang Apps Script.
- `lib/validation/lead-schema.ts`: Schema Zod dùng chung cho Client và Server.
- `lib/security/rate-limiter.ts`: In-memory / Edge sliding window rate limiter.
- `lib/security/sanitizer.ts`: Helper làm sạch chuỗi input chống Formula Injection.

---

[Điểm bắt đầu của bộ docs](../../README.md) | [Đọc tiếp: PRD Chi tiết M04](prd.md)
