# Bộ Tài Liệu Bàn Giao & Quy Trình Vận Hành Hệ Thống DataWithLy

- **Dự án:** Nền tảng Đào tạo Data Analytics Thực Chiến - DataWithLy
- **Mục đích:** Cung cấp hướng dẫn vận hành toàn diện cho Khách hàng (Founder Hứa Thảo Ly & Đội ngũ Tư vấn) và tài liệu kiến trúc kỹ thuật dành cho Đội ngũ Lập trình viên tiếp quản.
- **Trạng thái:** Sẵn sàng bàn giao chính thức (Production Ready)
- **Ngày phát hành:** 2026-11-22

---

## 1. Bản Đồ Tài Liệu Bàn Giao (Documentation Sitemap)

Hệ thống tài liệu bàn giao được phân tách rành mạch cho 2 nhóm đối tượng độc giả:

```
.docs/09-handover/
├── README.md                           <-- Bản đồ điều hướng chung (Tài liệu này)
├── client-operations-guide.md          <-- [DÀNH CHO NON-TECH]: Chị Ly & Đội ngũ Vận hành
└── technical-handover-checklist.md     <-- [DÀNH CHO TECH]: Đội ngũ Kỹ thuật tiếp quản
```

---

## 2. Chi Tiết Từng Tài Liệu

### 📘 1. [Sổ Tay Vận Hành Dành Cho Khách Hàng (client-operations-guide.md)](client-operations-guide.md)
* **Đối tượng:** Chị Hứa Thảo Ly, Quản trị viên nội dung, Tư vấn viên.
* **Nội dung trọng tâm:**
  1. **Danh sách Tài nguyên & Quyền hạn cần bàn giao:** Google Sheets Master CMS, Leads CRM, Google Drive Media, Vercel, Domain DNS, Gmail chính chủ.
  2. **Bảng định vị Hard Code & Hướng dẫn sửa:** Chỉ rõ chính xác tên file và dòng code chứa các nội dung tĩnh (Hero story, kinh nghiệm, giải thưởng, liên kết MXH...) kèm **Mẫu PR Template tối giản** chuẩn mực chỉ gồm *Vị trí đã update* và *Nội dung update*.
  3. **Hướng dẫn 5 Nghiệp vụ Cốt lõi (Kèm sẵn khung placeholder ảnh):**
     * a. Đồng bộ nội dung lên Website (1-Click Revalidation qua menu `[🚀 DataWithLy CMS]`).
     * b. Thêm khóa học mới.
     * c. Thêm lộ trình học mới (Roadmap).
     * d. Quản trị combo package (Gói học ưu đãi).
     * e. Quản trị đề cương buổi học (Quy tắc vàng `Alt + Enter` / `Option + Enter`).
  4. **Quy trình tiếp nhận & Xử lý đơn Lead học viên:** Hòm thư tự động, Zalo cá nhân của Mentor và trạng thái cập nhật trên bảng tính.

---

### 🛠️ 2. [Tài Liệu Kỹ Thuật & Cấu Trúc Mã Nguồn (technical-handover-checklist.md)](technical-handover-checklist.md)
* **Đối tượng:** TechLead, DevOps, Fullstack / Backend Developer tiếp quản.
* **Nội dung trọng tâm:**
  1. **Sơ đồ kiến trúc luồng dữ liệu (Data Flow):** Luồng di chuyển giữa Google Sheets, Google Apps Script, Next.js Server và Giao diện người dùng.
  2. **Danh mục toàn bộ mã nguồn làm việc với Google Sheets:**
     * `lib/cms/sheets-client.ts`: Lõi giao tiếp Google Sheets (Cache In-memory 5m, auto-retry, snapshot fallback an toàn).
     * `lib/cms/content-fetcher.ts`: Tầng nghiệp vụ xử lý quan hệ giữa Khóa học, Đề cương và Gói combo.
     * `app/api/leads/route.ts` & `app/api/revalidate/route.ts`: API nhận đơn lead và kích hoạt xóa cache on-demand.
     * `apps-script/cms/` & `apps-script/leads/`: Bộ mã nguồn Google Apps Script CMS Master và Leads CRM.
     * `scripts/`: Bộ công cụ tự động hóa đóng gói bundle và kiểm thử CI/CD.
  3. **Các mã nguồn quản trị quan trọng:**
     * Cơ chế Incremental Static Regeneration (ISR Caching) và On-Demand Purge (`revalidatePath`).
     * Hàng rào bảo mật 4 lớp chống spam (Honeypot, Rate Limiter, Idempotency UUID, Formula Sanitization).
     * Ma trận biến môi trường (Client-safe vs Server-only).
  4. **Quy trình bàn giao quyền sở hữu (Ownership Transfer):** Hướng dẫn chuyển quyền Google Sheets và deploy lại Apps Script dưới tài khoản Google của chị Ly.

---

## 3. Quy Trình Vận Hành Chuẩn (Standard Operating Procedure - SOP)

```
[1. Biên tập nội dung trên Google Sheets]
                 │
                 ▼
[2. Bấm Menu: [🚀 DataWithLy CMS] > 🔍 Kiểm Tra Lỗi Dữ Liệu]
                 │
                 ▼
[3. Bấm Menu: [🚀 DataWithLy CMS] > ⚡ Đồng Bộ Lên Website]
                 │ (Chỉ mất 1 - 2 giây)
                 ▼
[4. Website cập nhật nội dung mới tức thì!]
```

---

[Đến Sổ tay Khách hàng](client-operations-guide.md) | [Đến Checklist Kỹ thuật](technical-handover-checklist.md)
