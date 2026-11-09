# Báo Cáo Kỹ Thuật PR-12: Milestone RF-05 — Phân Tách ENV Bảo Mật & Tái Tạo Dữ Liệu Seeder Chuẩn Figma 100%

## 1. Tổng Quan & Mục Tiêu Kỹ Thuật
- **Mã PR:** PR-12 / Milestone RF-05
- **Branch:** `feature/rf-05-env-separation-and-data-reseed`
- **Mục tiêu cốt lõi:**
  1. **Phân tách hoàn toàn biến môi trường (ENV Separation):** Đảm bảo kiến trúc bảo mật tuyệt đối bằng việc chia tách endpoint đọc nội dung công khai (CMS Content Sync) và endpoint tiếp nhận Lead nhạy cảm (Private Lead Ingestion) theo chuẩn bảo mật doanh nghiệp, đồng thời duy trì khả năng tương thích ngược (Backward Compatibility).
  2. **Tái thiết kế bộ Database Seeders chuẩn Figma 100%:** Nâng cấp các Seeder trong `database/seeders/` với asset hình ảnh độ phân giải cao được trích xuất từ Figma (Node 12:682, 12:714, 12:791, 12:873, 12:892, 12:1277), mở rộng lưới 3x3 Project học viên (9 dự án) và lưới 3x2 Đánh giá học viên (6 nhận xét kèm avatar thật), loại bỏ hoàn toàn ảnh thiếu/hỏng `da527ba5696d5b94f6f71aebe984b901fc46d929.png`.
  3. **Biên dịch & đóng gói Snapshot:** Tái sinh `database/seeders/snapshot.json` phục vụ Fallback Snapshot cơ chế Zero White Screen khi ngoại tuyến.
  4. **Vượt qua 100% Quality Gates:** Lint, Typecheck, Unit/Integration Tests, và Next.js Build (19/19 routes).

---

## 2. Chi Tiết Thực Hiện Kỹ Thuật

### 2.1. Phân Tách Biến Môi Trường (Security ENV Separation)
- **Cập nhật `.env.example` & `.env.local`:**
  - **PUBLIC CONTENT CMS CONFIGURATION:**
    - `GOOGLE_APPS_SCRIPT_CMS_URL`: Endpoint Web App phục vụ đọc 12 Tabs dữ liệu công khai (Courses, Curriculum, Mentors, Packages, Projects, Testimonials, FAQs, Blogs, Promotions, Settings).
    - `GOOGLE_APPS_SCRIPT_CMS_SECRET`: Shared secret để đọc dữ liệu CMS.
  - **PRIVATE LEADS INGESTION CONFIGURATION:**
    - `GOOGLE_APPS_SCRIPT_LEADS_URL`: Endpoint Web App phục vụ ghi nhận dữ liệu Lead học viên vào bảng tính riêng tư, cô lập khỏi CMS công khai.
    - `GOOGLE_APPS_SCRIPT_LEADS_SECRET`: Secret bảo mật độc lập cho kênh ghi Lead.
    - `LEADS_SPREADSHEET_ID`: Định danh Spreadsheet nội bộ dành riêng cho đội ngũ tư vấn.
  - **BACKWARD COMPATIBILITY FALLBACK:**
    - `GOOGLE_APPS_SCRIPT_URL` & `GOOGLE_APPS_SCRIPT_SECRET` được giữ làm fallback tự động cho các môi trường legacy.

- **Refactor mã nguồn xử lý ENV:**
  - `lib/google-sheets/client.ts`: Ưu tiên đọc `GOOGLE_APPS_SCRIPT_LEADS_URL` và `GOOGLE_APPS_SCRIPT_LEADS_SECRET`; fallback sang `GOOGLE_APPS_SCRIPT_URL` và `GOOGLE_APPS_SCRIPT_SECRET`. Hỗ trợ ghi đè linh hoạt qua `SendToSheetsOptions`.
  - `lib/modules/leads/lead.service.ts`: Truyền tham số cấu hình riêng biệt của kênh Leads khi gọi `GoogleSheetsClient.appendRow`.
  - `lib/cms/sheets-client.ts`: Ưu tiên đọc `GOOGLE_APPS_SCRIPT_CMS_URL` và `GOOGLE_APPS_SCRIPT_CMS_SECRET`; fallback sang `GOOGLE_APPS_SCRIPT_URL` và `GOOGLE_APPS_SCRIPT_SECRET`.
  - `app/api/cms/course-create/route.ts` & `lib/services/health.service.ts`: Đồng bộ cơ chế đọc `GOOGLE_APPS_SCRIPT_CMS_URL` / `GOOGLE_APPS_SCRIPT_URL`.
  - `scripts/seed-sheets.js`: Chuẩn hóa parser tự động nhận diện `GOOGLE_APPS_SCRIPT_CMS_URL` và `GOOGLE_APPS_SCRIPT_CMS_SECRET`.

### 2.2. Nâng Cấp Bộ Seeders Chuẩn Hóa Figma 100%
- **`database/seeders/CourseSeeder.ts`:**
  Gán 3 ảnh bìa 4K sắc nét tương ứng từng khóa học từ `public/assets/figma/`:
  - `sql-for-data-analytics`: `/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png`
  - `data-analytical-thinking`: `/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png`
  - `end-to-end-analytics`: `/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png`

- **`database/seeders/ProjectSeeder.ts`:**
  Mở rộng từ 3 lên **9 dự án thực tế** khớp hoàn hảo lưới 3x3 của Figma Node `12:873` với 9 dashboard dashboards từ `public/assets/figma/`:
  1. `proj-ecommerce-basket`: `/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png`
  2. `proj-fintech-retention`: `/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png`
  3. `proj-retail-inventory`: `/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png`
  4. `proj-fmcg-sales-performance`: `/assets/figma/973e833b234c55daebe419eefe02eb6e80f7d86d.png`
  5. `proj-logistics-delivery-sla`: `/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png`
  6. `proj-banking-credit-risk`: `/assets/figma/c0aae3c5c5404ee626ce858087d79649de2e3dc1.png`
  7. `proj-healthcare-appointment-analytics`: `/assets/figma/cf9dcd253d74531ef55b272e2e080b01e9bbd6bb.png`
  8. `proj-edtech-student-engagement`: `/assets/figma/1af45d712faebc37b4905756835680a337298304.png`
  9. `proj-realestate-market-trend`: `/assets/figma/f0920e49e6a571ac94250b3258b77d8c976423b6.png`

- **`database/seeders/TestimonialSeeder.ts` & `components/home/TestimonialsSection.tsx`:**
  - Mở rộng thành **6 đánh giá học viên thực tế** khớp lưới 3x2 của Figma Node `12:892`.
  - Gán 6 avatar chân thực từ Figma:
    + `/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png`
    + `/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png`
    + `/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png`
    + `/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png`
    + `/assets/figma/fb2492c1b7d7c65a104edaa8e809cc8a5a19315f.png`
    + `/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png`
  - Cập nhật `TestimonialsSection.tsx` để render trực tiếp ảnh avatar của học viên với `next/image` kết hợp fallback icon thanh lịch.

- **`database/seeders/MentorSeeder.ts` & `components/course/CourseFigmaInstructor.tsx`:**
  - Thay thế link hỏng `da527ba5696d5b94f6f71aebe984b901fc46d929.png` bằng avatar độ nét cao `/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png`.

- **Tái tạo `snapshot.json`:**
  - Chạy `npm run db:seed` thành công, lưu lại toàn bộ dữ liệu mẫu chuẩn hóa vào `database/seeders/snapshot.json`.

---

## 3. Kết Quả Quality Gates

| Bộ Kiểm Thử | Lệnh Kiểm Tra | Kết Quả | Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Linting** | `npm run lint` | **PASS** | 0 errors |
| **Typecheck** | `npm run typecheck` | **PASS** | 0 TypeScript errors |
| **QA Test Suite** | `npm run test` | **PASS** | 90/90 tests passed (GAS Duplicate QA, Lead Honeypot, Rate Limiter BR-09) |
| **Database Seeder** | `npm run db:seed` | **PASS** | 3 Courses, 18 Modules, 9 Projects, 6 Testimonials, 3 Blogs, 4 FAQs |
| **Production Build** | `npm run build` | **PASS** | 19/19 routes SSG/Static/ISR Compiled |

---

## 4. Danh Sách Tệp Thay Đổi
- `.env.example`: Cấu hình phân tách bảo mật CMS và Leads.
- `.env.local`: Cấu hình cục bộ phân tách rõ ràng CMS và Leads.
- `lib/google-sheets/client.ts`: Ưu tiên đọc biến môi trường Leads.
- `lib/modules/leads/lead.service.ts`: Tích hợp cấu hình Leads tách biệt.
- `lib/cms/sheets-client.ts`: Ưu tiên đọc biến môi trường CMS Content.
- `app/api/cms/course-create/route.ts`: Đồng bộ đọc biến môi trường CMS.
- `lib/services/health.service.ts`: Kiểm tra tình trạng kết nối CMS Web App.
- `scripts/seed-sheets.js`: Chuẩn hóa đọc biến môi trường CMS URL.
- `database/seeders/CourseSeeder.ts`: 3 ảnh bìa 4K sắc nét theo từng khóa học.
- `database/seeders/ProjectSeeder.ts`: Mở rộng 9 dự án thực tế lưới 3x3 Figma.
- `database/seeders/TestimonialSeeder.ts`: Mở rộng 6 học viên lưới 3x2 Figma kèm avatar thật.
- `database/seeders/MentorSeeder.ts`: Cập nhật avatar sắc nét Mentor Hứa Thảo Ly.
- `components/course/CourseFigmaInstructor.tsx`: Sửa avatar link chuẩn Mentor.
- `components/home/TestimonialsSection.tsx`: Hiển thị avatar học viên thật từ Seeder.
- `database/seeders/snapshot.json`: Snapshot dữ liệu chuẩn hóa mới nhất.

