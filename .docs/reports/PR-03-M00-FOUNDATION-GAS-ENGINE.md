# Báo Cáo Kỹ Thuật (Pull Request) #03: Hạ Tầng Kỹ Thuật, Storage & Hệ Thống Quản Trị Google Apps Script CMS

- **Mã báo cáo:** `PR-03-M00-FOUNDATION-GAS-ENGINE`
- **Tên nhánh đề xuất:** `feature/m00-foundation-gas-engine`
- **Trạng thái:** Sẵn sàng hợp nhất (Ready for Review & Merge)
- **Tác giả:** Đội ngũ Kỹ thuật & Project Assistant
- **Ngày lập:** 2026-11-08

---

## 1. Tóm tắt nội dung (Summary)
Đợt bàn giao này thiết lập toàn bộ nền tảng hạ tầng cốt lõi cho website **DataWithLy**, bao gồm:
- Thiết lập hệ thống Storage đa tầng (hỗ trợ cả Cloudflare R2 cho môi trường Production và Local Provider cho môi trường phát triển).
- Xây dựng trọn bộ hệ thống quản trị nội dung Google Apps Script CMS Engine tích hợp trực tiếp vào Google Sheets, cho phép Founder (Chị Ly) quản trị toàn bộ 12 tab dữ liệu qua Menu và Modal Forms giao diện trực quan, không cần chạm vào mã nguồn website.
- Thiết lập hệ thống tài liệu OpenAPI Swagger UI tại `/api-docs` và các endpoints kiểm tra sức khỏe hệ thống `/api/health`.

---

## 2. Yêu cầu & Nghiệp vụ liên quan (Related Requirements)
- **Phân hệ đáp ứng:** `M00` (Setup & Connectivity), `M05` (Content Management).
- **Quy tắc nghiệp vụ tuân thủ:**
  * **BR-09:** Cơ chế giới hạn tần suất gửi yêu cầu Sliding Window Rate Limiting (chống DDOS và cạn kiệt tài nguyên).
  * **BR-10:** Chống tấn công chèn mã độc vào bảng tính (Formula Injection Sanitization - tự động escape các ký tự `=`, `+`, `-`, `@`).
  * **BR-13:** Cơ chế quản trị song song giữa Custom Menu Apps Script và Direct Cell Edit có kiểm tra tính hợp lệ dữ liệu (Data Linter).
- **Yêu cầu phi chức năng:** Độ trễ API Google Sheets đạt SLA < 800ms, hệ thống chịu lỗi khi mất mạng nhờ bộ nhớ đệm Fallback Snapshot.

---

## 3. Danh mục các thay đổi (Changes Made)
- [x] **Giao diện người dùng (Frontend changes):**
  * Trang tra cứu tài liệu API Swagger UI tại `/api-docs` và schema `/api-docs/openapi.json`.
  * Trang kiểm tra kết nối dữ liệu `/tests-data` và component `CardTest.tsx`.
- [x] **Xử lý logic & API (Backend/API changes):**
  * `lib/storage/`: Tầng trừu tượng Storage Provider (`CloudflareR2StorageProvider`, `LocalStorageProvider`, `StorageFactory`).
  * `lib/security/rate-limiter.ts`: Bộ đếm giới hạn tốc độ In-Memory Rate Limiter.
  * `lib/google-sheets/sanitizer.ts`: Bộ lọc làm sạch dữ liệu đầu vào chống chèn công thức độc hại.
  * `lib/cms/cache.ts`: Quản lý bộ nhớ đệm có giới hạn (Bounded LRU Cache).
  * `app/api/health/route.ts` & `app/api/health/sheets/route.ts`: Endpoints đo độ trễ và giám sát sức khỏe kết nối.
- [x] **Cấu trúc dữ liệu & Bảng Google Sheets (Database / CMS changes):**
  * Thư mục `apps-script/`:
    - 15 tệp mã nguồn logic `.gs` quản trị các nghiệp vụ (Menu, Slug Resolution, Batch UUID, Modal Handlers, WebApp REST Endpoints).
    - 10 tệp giao diện Modal `.html` (CourseModal, CurriculumModal, MentorModal, PackageModal, TestimonialModal, FaqModal, SettingsModal, BlogModal, PromotionsModal, SharedStyles).
    - Công cụ đóng gói tự động `scripts/bundle-apps-script.js` xuất ra file duy nhất `dist/Code.bundle.gs` (3,259 dòng mã) để nạp 1-click vào Google Sheets.
- [x] **Cập nhật tài liệu kỹ thuật & Hướng dẫn vận hành (Documentation updates):**
  * `apps-script/README.md`: Hướng dẫn chi tiết cho Chị Ly cách nạp bundle vào Google Sheets và cài đặt Script Properties.

---

## 4. Kết quả kiểm thử & Đo kiểm (Testing)
- [x] **Kiểm thử bộ Modals Duplicate QA (`npm run test:gas`):**
  * **70/70 tests PASSED.**
  * Không có bất kỳ hàm hoặc biến nào bị trùng lặp trên 15 tệp `.gs`.
  * 100% các DOM IDs, Form IDs trong 10 file modal HTML đều là duy nhất tuyệt đối.
  * Thuật toán tự động sinh slug (`resolveUniqueSlug`) đồng nhất 100% giữa Client và Server (kể cả tiếng Việt có dấu, ký tự lạ, và cơ chế hậu tố `-v1`, `-v2`).
- [x] **Kiểm thử giới hạn tốc độ (`npm run test:rate`):**
  * Cho phép 3 request/phút, chặn đứng request thứ 4 với HTTP 429, tự động mở khóa sau 60s.
- [x] **Kiểm thử biên dịch:** `npx tsc --noEmit` đạt 0 lỗi.

---

## 5. Bằng chứng giao diện & Đối soát Figma (UI Evidence)
- **Giao diện Modal Google Sheets:** Thiết kế đồng bộ hệ màu Crimson Red `#8B1D2C`, bo góc chuẩn 12px, responsive trên mọi kích thước màn hình máy tính của Client.
- **Swagger API Explorer:** Truy cập trực tiếp tại `http://localhost:3000/api-docs` với đầy đủ 9 nhóm API có thể test trực tiếp.

---

## 6. Ghi chú dành cho Khách hàng / Người duyệt (Client & Reviewer Notes)
- **Dành cho Chị Ly:** File nạp vào Google Sheets đã được tự động gom gọn thành 1 tệp duy nhất tại `apps-script/dist/Code.bundle.gs`. Chị chỉ cần dán tệp này vào mục *Tiện ích mở rộng -> Apps Script* trên Google Sheets là menu **[DataWithLy CMS]** sẽ xuất hiện ngay lập tức với đầy đủ 9 bảng popup nhập liệu tiện dụng!

---

## 7. Danh sách kiểm tra nghiệm thu (Checklist)
- [x] Nhánh tuân thủ quy chuẩn `feature/m00-foundation-gas-engine`.
- [x] Không lưu trữ API keys hoặc secret hardcoded trong mã nguồn.
- [x] Đã kiểm thử 70 test cases độc lập không có lỗi.
- [x] Sẵn sàng để hợp nhất vào nhánh phát triển chính.

