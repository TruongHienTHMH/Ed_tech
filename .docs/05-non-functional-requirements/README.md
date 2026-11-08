# Tiêu Chuẩn Yêu Cầu Phi Chức Năng (Non-Functional Requirements - NFR)

- **Mục đích:** Đặc tả hệ thống tiêu chuẩn chất lượng kỹ thuật phi chức năng, tiêu chí đo lường định lượng và phương pháp nghiệm thu cho nền tảng giáo dục **DataWithLy**.
- **Hai trọng tâm cốt lõi:**
  1. **UI/UX Đỉnh Cao Cho Học Viên:** Phản hồi tức thì (< 100ms), tải trang siêu tốc (LCP < 1.2s, CLS < 0.05), Responsive 4-point spacing mượt mà trên mobile/desktop, chịu lỗi Client (SessionStorage form persistence, Zero White Screen), và chuẩn tiếp cận WCAG 2.1 AA.
  2. **Quản Trị Nội Dung "Dễ Xài — Dễ Hiểu — Logic — Thân Thiện" Cho Chị Ly:** Xuất bản 1-click tức thì (< 1-2s), Data Linter quét lỗi < 2s, form popup `[DataWithLy CMS]` có dropdown chọn khóa học, tự động chuẩn hóa tiền tệ và xuống dòng bullets `\n` (`Alt+Enter`), xóa mềm an toàn (Soft Delete), và quan sát sức khỏe hệ thống trực quan qua Swagger UI.
- **Trạng thái:** Sẵn sàng triển khai (Approved for Implementation)
- **Người quản lý:** TechLead & Project Assistant
- **Ngày cập nhật:** 2026-11-04
- **Nguồn tham khảo:** 
  - [Biên bản yêu cầu bổ sung](../references/additional-requirements.md)
  - [Biên bản hỏi đáp dự án](../references/project-qa.md)
  - [Bảng yêu cầu nội dung](../references/Website%20LY%20DATA%20-%20content%20to%20fill.xlsx)
  - [Kiến trúc Caching & Chống Memory Leak](../07-architecture/caching-and-memory-optimization.md)
  - [Sổ tay vận hành cho Khách hàng](../09-handover/client-operations-guide.md)

---

## 1. Danh Mục 7 Nhóm Yêu Cầu Phi Chức Năng

```
                          ┌─────────────────────────────────────┐
                          │    TIÊU CHUẨN NFR DATAWITHLY        │
                          └──────────────────┬──────────────────┘
                                             │
             ┌───────────────────────────────┴──────────────────────────────┐
             ▼                                                              ▼
┌─────────────────────────┐                                    ┌─────────────────────────┐
│   TRỤ CỘT 1: UI / UX   │                                    │  TRỤ CỘT 2: QUẢN TRỊ    │
├─────────────────────────┤                                    ├─────────────────────────┤
│ • Khả năng sử dụng      │                                    │ • Khả năng quan sát     │
│ • Hiệu năng & CWV       │                                    │ • An toàn thông tin     │
│ • Độ tin cậy & Fallback │                                    │ • Triển khai & CI/CD    │
│ • SEO & Cấu trúc web    │                                    │ • Công thái học CMS     │
└─────────────────────────┘                                    └─────────────────────────┘
```

| Nhóm NFR | Tên tài liệu | Mã định danh | Trọng tâm chất lượng & Trải nghiệm |
|:---:|---|:---:|---|
| **Usability** | [Khả năng sử dụng & UI/UX](usability.md) | `NFR-USABILITY-001` đến `010` | 4-point spacing, Responsive breakpoints, Tap target >= 44px, nút Hotline & Zalo di động, Form persistence, WCAG 2.1 AA, Công thái học quản trị (Admin Ergonomics). |
| **Performance** | [Hiệu năng & Tốc độ](performance.md) | `NFR-PERF-001` đến `008` | Core Web Vitals (LCP < 1.2s, INP < 100ms, CLS < 0.05), Edge CDN TTFB < 50ms, JS bundle < 85KB, Tối ưu WebP/AVIF, Xuất bản 1-click < 1-2s, Chịu tải >= 1.000 users/phút. |
| **Reliability** | [Độ tin cậy & Chịu lỗi](reliability.md) | `NFR-RELIABILITY-001` đến `008` | Zero White Screen Error Boundary, 3x Client Auto-retry, Static Fallback Snapshot, SafeImage Broken Link Shield, Soft Delete an toàn, Uptime SLA 99.9%. |
| **Security** | [An toàn thông tin](security.md) | `NFR-SEC-001` đến `008` | Chống spam 3 lớp (Honeypot, Idempotency, Rate Limit), Bảo vệ PII (Nghị định 13/2023/NĐ-CP), Khử trùng công thức (Formula Sanitization), Bounded LRU chống tràn RAM. |
| **SEO** | [Tối ưu hóa tìm kiếm](seo.md) | `NFR-SEO-001` đến `006` | Dynamic Metadata, OpenGraph cards mạng xã hội, Structured Data JSON-LD (Course, Article), Semantic HTML5, Dynamic Sitemap & Robots.txt. |
| **Observability** | [Khả năng quan sát](observability.md) | `NFR-OBS-001` đến `006` | Live Ping `/api/health/sheets`, Swagger UI `/api-docs` tương tác, Memory Heap SLA (< 250MB), Email cảnh báo Lead tức thì, Data Linter đối soát < 2s. |
| **Deployment** | [Triển khai & CI/CD](deployment.md) | `NFR-DEPLOY-001` đến `006` | Zero-Downtime Edge Deployment, Cách ly 100% Staging vs Production, Rollback < 30s, Quy trình phát hành Google Apps Script Webhook. |

---

## 2. Quy Ước Mã Hóa & Nguyên Tắc Đo Lường

1. **Quy ước đặt mã:** Mọi yêu cầu bắt buộc định dạng `NFR-<NHÓM>-NNN` (ví dụ: `NFR-USABILITY-001`, `NFR-PERF-002`).
2. **Tiêu chí kiểm chứng định lượng:**
   - Mỗi tiêu chuẩn NFR phải có: **Đối tượng áp dụng**, **Ngưỡng đo lường cụ thể (SLA)**, **Công cụ / Lệnh kiểm tra**, và **Tiêu chí nghiệm thu Đạt/Không đạt**.
   - Tuyệt đối không dùng các cam kết mơ hồ như "website chạy rất nhanh", "giao diện trực quan" mà không đi kèm con số hay phương pháp đo lường cụ thể.
3. **Phân cấp Mức độ Ưu tiên:**
   - **P0 (Bắt buộc / Blocker):** Phải vượt qua 100% trước khi đưa vào khai thác thực tế (vd: Zero White Screen, Chống spam 3 lớp, Responsive không tràn màn hình, LCP < 2.5s).
   - **P1 (Quan trọng / High):** Đạt tiêu chuẩn tối ưu hóa cao cấp (vd: LCP < 1.2s, Data Linter < 2s, Copy code 1-click).
   - **P2 (Cải tiến / Medium):** Các tiện ích nâng cấp mở rộng cho giai đoạn sau.

---

[Quay về điểm bắt đầu của bộ docs](../README.md) | [Đến NFR Usability](usability.md)
