# Báo Cáo Kiến Trúc Hệ Thống: Vấn Đề Tiềm Ẩn, Điểm Nghẽn & Lộ Trình Giải Pháp (Problems-Solution-v1)

**Dự án:** DataWithLy E-Learning Platform (`ed_da_tech`)  
**Ngày lập báo cáo:** 20/11/2026  
**Phiên bản:** v1.0  
**Tác giả:** Engineering Team  

---

## 1. Giới Thiệu & Bối Cảnh

Hệ thống DataWithLy hiện đang vận hành theo mô hình kiến trúc lai:
- **Frontend / Presentation Layer:** Next.js 16 (App Router) với Incremental Static Regeneration (ISR) triển khai trên mạng lưới toàn cầu của Vercel (Edge CDN).
- **Content Management System (CMS) & Lead Ingestion:** Google Sheets kết hợp Google Apps Script Web App đóng vai trò cơ sở dữ liệu phi máy chủ (Serverless Database).

Mô hình này giúp tiết kiệm 100% chi phí cơ sở dữ liệu ban đầu, đồng thời cung cấp giao diện nhập liệu trực quan cho đội ngũ Content và Admin. Tuy nhiên, khi lượng người dùng và học viên tăng trưởng, sự khác biệt giữa hai môi trường (Production vs. Local Development) cùng các giới hạn vật lý của Google Workspace API sẽ tạo ra những điểm nghẽn kỹ thuật cần được phân tích và có phương án phòng ngừa.

---

## 2. Các Điểm Nghẽn & Vấn Đề Tiềm Ẩn (Potential Problems & Bottlenecks)

### ⚠️ Điểm nghẽn 1: Form Đăng Ký Tư Vấn / Thu Thập Leads (`POST /api/leads`)
* **Bản chất kiến trúc:**
  * Thao tác xem website (Courses, Packages, Projects, Testimonials) là thao tác **ĐỌC (READ)**, được Vercel Edge CDN hấp thụ và lưu đệm 99% bằng ISR.
  * Thao tác học viên điền Họ tên, Số điện thoại, Email để nhận tư vấn là thao tác **GHI (WRITE)** trực tiếp qua API.
* **Vấn đề khi Traffic tăng cao:**
  * Trong các đợt phát động chiến dịch Marketing (Facebook Ads, Google Ads, TikTok Ads) hoặc sự kiện ra mắt khóa học, nếu có 50–100 học viên cùng nhấn nút "Gửi đăng ký" trong vòng 1–2 phút:
  * Google Apps Script là môi trường đơn luồng (Single-Threaded). Mỗi lần mở file bảng tính, chạy cơ chế khóa chống xung đột (`LockService`), kiểm tra dữ liệu trùng lặp và ghi dòng mới (`appendRow`) mất từ **1.5s đến 3.5s**.
* **Mã lỗi phát sinh:**
  * `Exception: Lock wait timeout: Could not obtain lock within 10000 ms` (các request phía sau phải xếp hàng quá 10 giây).
  * Mã lỗi `HTTP 429 Too Many Requests` trả về từ Google Apps Script.
  * Trải nghiệm người dùng: Nút gửi trên form quay vô tận và hiển thị thông báo lỗi: *"Đăng ký không thành công, vui lòng thử lại sau"*.

---

### ⚠️ Điểm nghẽn 2: Giới Hạn Thực Thi Đồng Thời của Google (Simultaneous Executions Limit)
* **Quy định hạn ngạch của Google Apps Script:**
  * Tài khoản cá nhân (`@gmail.com`): Tối đa **10 tác vụ thực thi đồng thời (concurrent executions)**.
  * Tài khoản doanh nghiệp (Google Workspace): Tối đa **30 tác vụ thực thi đồng thời**.
* **Vấn đề:**
  * Nếu trong cùng một giây, có nhiều hơn 10–30 kết nối gọi vào Apps Script (vừa có request kéo dữ liệu từ Web, vừa có người nộp form tư vấn, vừa có thao tác từ CMS Modal):
* **Mã lỗi phát sinh:**
  ```text
  ScriptError: Too many simultaneous invocations for this user account.
  ```

---

### ⚠️ Điểm nghẽn 3: Giới Hạn Kích Thước của Google CacheService (100 KB Limit)
* **Cơ chế lưu đệm trên Apps Script (`04_CmsEndpoints.gs`):**
  ```javascript
  // CacheService của Google giới hạn nghiêm ngặt 100KB mỗi khóa (key)
  if (str.length < 100000) {
    cache.put(CMS_CACHE_KEY, str, CMS_CACHE_TTL_SEC);
  }
  ```
* **Vấn đề khi mở rộng nội dung:**
  * Hiện tại chuỗi JSON của 11 tabs dao động từ 25 KB đến 40 KB, lưu cache rất mượt.
  * Trong tương lai, khi website bổ sung 50–100 bài viết Blog chuyên sâu, hàng trăm đánh giá học viên và hình ảnh dự án tốt nghiệp:
  * Chuỗi JSON phản hồi của `get_all` sẽ vượt ngưỡng 100 KB.
  * Khi đó, lệnh `cache.put` âm thầm bỏ qua (không thể lưu vào CacheService nữa).
  * Apps Script mất tầng đệm RAM, buộc phải mở lại 11 trang tính đọc từng dòng trong mỗi lần có request $\rightarrow$ Độ trễ API tăng từ ~200ms lên 4–6 giây.

---

### ⚠️ Điểm nghẽn 4: Thao Tác Nhập Liệu Hàng Loạt Của Quản Trị Viên (Admin Batch Edits)
* **Cơ chế `onEdit(e)`:**
  * Nhằm đảm bảo dữ liệu luôn tươi mới, hàm `onEdit(e)` được cấu hình để tự động dọn sạch CacheService khi có chỉnh sửa.
* **Vấn đề:**
  * Nếu Quản trị viên thực hiện thao tác kéo thả, xóa hoặc dán (Paste) hàng loạt 50–100 dòng cùng lúc trên Google Sheets:
  * Sự kiện `onEdit` sẽ kích hoạt dồn dập hàng chục lần liên tiếp.
  * Có thể khiến bảng tính Google Sheets bị treo nhẹ vài giây để chờ Apps Script hoàn tất kiểm tra khóa, Slug và dọn cache.

---

## 3. Lộ Trình Kiến Trúc & Giải Pháp Theo Quy Mô (Strategic Roadmap)

Nhằm đảm bảo hệ thống vận hành bền vững, bảo mật và mở rộng không giới hạn, lộ trình kiến trúc được phân tách thành 3 giai đoạn:

| Giai đoạn | Quy mô Lưu lượng (Traffic) | Giải pháp Kiến trúc Chi tiết | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Giai đoạn 1 (Hiện tại)** | Dưới 20.000 lượt xem/ngày<br>Vài chục leads/ngày | **Vercel ISR (Cache 300s) + Apps Script Single-Pass + On-Demand Webhook:**<br>• Tối ưu 1 lượt quét bảng tính.<br>• Phân tách rạch ròi Dev (bỏ qua cache) và Prod (tối ưu CDN).<br>• Tiết kiệm 100% chi phí máy chủ và cơ sở dữ liệu. | ✅ **Đã hoàn thiện & kiểm thử thành công** |
| **Giai đoạn 2 (Tăng trưởng)** | Chạy Ads lớn<br>Hàng trăm leads/ngày | **Kiến trúc Hàng đợi (Message Queue) cho Form Leads:**<br>• Đưa một hàng đợi Serverless (ví dụ: Upstash Redis / QStash hoặc Cloudflare Queues).<br>• Khi học viên gửi form, API Next.js tiếp nhận và ghi nhận thành công trong **~100ms**.<br>• Background Worker sẽ rút từng lead từ hàng đợi và ghi từ từ sang Google Sheets, loại bỏ 100% lỗi `Lock wait timeout` và `429 Too Many Requests`. | 🚀 **Sẵn sàng triển khai khi mở rộng Marketing** |
| **Giai đoạn 3 (Quy mô lớn)** | Hàng trăm nghìn lượt xem/ngày<br>Hàng nghìn bài viết/khóa học | **Mô hình Hybrid Database (Headless CMS Sync):**<br>• Vẫn giữ Google Sheets làm giao diện nhập liệu trực quan, quen thuộc cho Admin và Content Writer.<br>• Tích hợp Webhook đồng bộ dữ liệu tự động sang Cơ sở dữ liệu chuẩn (Supabase PostgreSQL / Cloudflare D1 / PlanetScale).<br>• Next.js đọc trực tiếp từ Database với độ trễ siêu thấp (< 10ms), giải quyết triệt để giới hạn 100KB của CacheService. | 🔮 **Kế hoạch nâng cấp dài hạn** |

---

## 4. Tổng Kết

Kiến trúc hiện tại đã được cấu hình tối ưu tuyệt đối cho giai đoạn hiện tại (Giai đoạn 1), đảm bảo:
1. **Không vi phạm Quota** của Google Apps Script trong điều kiện vận hành thông thường.
2. **Tốc độ tải trang đạt chuẩn Core Web Vitals** nhờ Vercel Edge Cache.
3. **Phản hồi tức thì ở môi trường Local Development** mà không gây ảnh hưởng hay làm biến dạng cấu hình Production.
