# BÁO CÁO NGHIỆM THU: TÁCH BIỆT APPS SCRIPT CMS & LEADS CRM, KHẮC PHỤC LỖI ĐỒNG BỘ REVALIDATION (RF-17 ĐẾN RF-20)

**Mã định danh:** PR-21-RF-15  
**Nhánh Git đề xuất:** `feature/rf-15-decouple-cms-leads-and-revalidation-sync`  
**Trạng thái:** ✅ SẴN SÀNG MERGE VÀO `develop` (100% Quality Gates Passed)  
**Thời gian cập nhật:** 14/11/2026  

---

## 1. TỔNG QUAN THAY ĐỔI (OVERVIEW)

PR này giải quyết trọn vẹn 4 yêu cầu lớn:
1. **Tách biệt kiến trúc 2 Google Sheets độc lập (RF-17 & RF-18):**
   - **Google Sheets CMS (Public Content):** Đúng chuẩn 10 Tabs công khai (`courses`, `curriculum`, `packages_pricing`, `student_projects`, `mentor_profiles`, `testimonials`, `faqs`, `trust_metrics`, `settings`, `blog_posts`). Toàn bộ 10 file modal HTML được nhóm lại trong `apps-script/cms/`.
   - **Google Sheets Leads (Private CRM):** Chuẩn 1 Tab nội bộ (`leads`). Độc lập hoàn toàn, bảo mật dữ liệu khách hàng tuyệt đối, không chia sẻ script hay quyền truy cập với đội ngũ biên tập CMS.
2. **Đồng bộ hóa Schema & Type giữa Next.js Server và Apps Script (RF-18):**
   - Bổ sung `course_kind` cho `Course` (Đánh dấu Khóa học nổi bật, Khóa học mới).
   - Đảm bảo `BlogPost` có đầy đủ `description` (tóm tắt thẻ meta/trích đoạn) và `content` (nội dung chi tiết).
   - Lộ trình học `CurriculumModule` liên kết chính xác `course_id`, ngày học (`date`), tuần (`week`), buổi (`day`), và danh sách `sub_content`.
3. **Loại bỏ 100% Secret Hardcoded & Sửa Lỗi DNS Revalidation (RF-19):**
   - Xóa bỏ triệt để fallback domain `datawithly.edu.vn` và token cứng trong `00_CmsConfig.gs` và bảng tính `settings`.
   - Cơ chế tự động phát hiện và chuyển hướng Webhook Revalidation đến domain Vercel thực tế: `https://ed-tech-mu-umber.vercel.app/api/revalidate`.
   - Cung cấp menu 1-click trên Google Sheets CMS để cài đặt URL Vercel và Revalidation Secret dễ dàng.
4. **Tối ưu hóa Invalidation Cache cho Next.js Server (RF-20):**
   - Bổ sung cache tags `next: { tags: ["cms", "sheets"], revalidate: 300 }` vào `SheetsClient.getLiveSyncReport()`.
   - Khi bấm "⚡ Đồng Bộ Lên Website Ngay Lập Tức" trên Google Sheets, webhook xóa đồng thời Path Cache (`/`, `/courses/...`, `/blog`), Tag Cache (`cms`, `sheets`) và in-memory LRU cache giúp website cập nhật tức thì mà không cần redeploy.

---

## 2. DANH SÁCH FILE THAY ĐỔI CHI TIẾT

| Phân Vùng | Đường Dẫn File | Mô Tả Thay Đổi |
| :--- | :--- | :--- |
| **Apps Script CMS** | `apps-script/cms/*` (15 files .gs + 10 files .html) | Dự án Apps Script riêng cho CMS 10 tab, hỗ trợ 10 Modal nhập liệu, đóng gói thành `Code.cms.bundle.gs`. |
| **Apps Script Leads** | `apps-script/leads/*` (5 files .gs) | Dự án Apps Script riêng cho CRM Leads 1 tab, bảo mật mã token và đóng gói thành `Code.leads.bundle.gs`. |
| **GAS Tooling** | `scripts/push-gas.js`, `.clasp.content.json`, `.clasp.leads.json` | Tự động hóa build & push 2 dự án GAS riêng biệt bằng lệnh `npm run push:cms` và `npm run push:leads`. |
| **Next.js CMS Client** | `lib/cms/sheets-client.ts`, `lib/cms/types.ts` | Bổ sung kiểu `course_kind`, `BlogPost.content`, bóc tách 10 tab và gắn cache tags `cms`, `sheets`. |
| **Next.js Revalidation**| `app/api/revalidate/route.ts` | Webhook thanh lọc toàn bộ cache (Layout, Pages, Tags, LRU) an toàn với mã xác thực. |
| **Leads Service** | `lib/modules/leads/lead.service.ts`, `lib/modules/leads/types.ts` | Tương thích với Web App Leads mới, bảo toàn BR-09 Rate Limiting và Anti-Spam. |

---

## 3. KẾT QUẢ KIỂM THỬ (AUTOMATED QUALITY GATES)

- `npm run bundle:gas`: **PASS** (Đóng gói `Code.cms.bundle.gs` 246KB và `Code.leads.bundle.gs` 31KB).
- `npm run test:gas`: **80 / 80 tests PASSED**.
- `npm run test:lead`: **10 / 10 tests PASSED**.
- `npm run test:rate`: **PASS** (100% Rate limiter BR-09).
- `npm run test:email`: **18 / 18 tests PASSED**.
- `npm run lint`: **0 errors**.
- `npm run build`: **19 / 19 routes** biên dịch thành công (Static + SSG + Dynamic API).
