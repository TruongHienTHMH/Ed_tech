# Bối cảnh hệ thống — DataWithLy (System Context)

- **Mục đích:** Đặc tả kiến trúc tổng thể, sơ đồ bối cảnh C4 (Context & Container Diagram), ranh giới hệ thống và các luồng giao tiếp giữa DataWithLy Web Application với các hệ thống bên ngoài.
- **Trạng thái:** Approved — đã thống nhất theo kế hoạch kiến trúc ngày 2026-11-03.
- **Người duyệt:** Chủ dự án & TechLead.
- **Ngày cập nhật:** 2026-11-03.
- **Nguồn tham khảo:** 
  - [Product Overview](../01-product/product-overview.md);
  - [Product Scope](../01-product/product-scope.md);
  - [Yêu cầu bổ sung](../references/additional-requirements.md);
  - [Q&A dự án](../references/project-qa.md);
  - Mã nguồn: Next.js App Router (`app/`), Google Sheets Client (`lib/google-sheets/`).

---

## 1. Sơ đồ bối cảnh hệ thống (C4 Context Diagram)

Sơ đồ thể hiện vị trí trung tâm của nền tảng **DataWithLy Website**, các nhóm tác nhân tương tác và các hệ thống dịch vụ bên ngoài:

```mermaid
graph TD
    subgraph Users["NGƯỜI DÙNG & TÁC NHÂN"]
        User_Student["Học viên / Người tìm hiểu khóa học<br/>(Student / Prospect)"]
        User_Admin["Người quản trị / Mentor Hứa Thảo Ly<br/>(Content Manager / Founder)"]
        User_Consultant["Đội ngũ Tư vấn viên<br/>(Sales / Admissions Team)"]
        User_Bot["Công cụ tìm kiếm & Bots<br/>(Googlebot, Social Crawlers, Bad Bots)"]
    end

    subgraph System_Boundary["HỆ THỐNG TRUNG TÂM: DATAWITHLY"]
        Web_App["Website DataWithLy<br/>(Next.js 15+ App Router / TypeScript / Tailwind CSS)"]
    end

    subgraph External_Services["HỆ THỐNG BÊN NGOÀI & DỊCH VỤ ĐÁM MÂY"]
        Google_Content[("Google Sheets: Public Content<br/>(Quản trị khóa học, học phí, blog, review)")]
        Google_Leads[("Google Sheets: Private Leads<br/>(Lưu trữ thông tin học viên đăng ký tư vấn)")]
        GAS_Webhook["Google Apps Script Webhook<br/>(LockService, Anti-spam, Email Alert)"]
        CDN_Media["Cloudinary / R2 CDN<br/>(Lưu trữ & tối ưu ảnh WebP/AVIF)"]
        Mail_Service["Dịch vụ Email Google Workspace<br/>(Gửi cảnh báo tư vấn viên & xác nhận học viên)"]
        Analytics_Platform["Google Analytics 4 & GTM<br/>(Đo lường lưu lượng, UTM campaign, Custom Events)"]
    end

    %% Tương tác người dùng
    User_Student -->|Xem khóa học, syllabus, dự án & nộp form tư vấn| Web_App
    User_Admin -->|Chỉnh sửa nội dung & bấm Xuất bản| Google_Content
    User_Consultant -->|Xem danh sách lead & cập nhật trạng thái tư vấn| Google_Leads
    User_Bot -->|Thu thập dữ liệu SEO & OpenGraph| Web_App

    %% Tương tác hệ thống
    Google_Content -->|"1. Đọc nội dung qua CSV/API - ISR Cache"| Web_App
    Google_Content -.->|2. Bắn Webhook On-demand Revalidate khi xuất bản| Web_App
    Web_App -->|3. Tải tài nguyên media tối ưu| CDN_Media
    Web_App -->|4. Đẩy lead một chiều kèm Secret Token| GAS_Webhook
    GAS_Webhook -->|5. Ghi dữ liệu tuần tự có khóa an toàn| Google_Leads
    GAS_Webhook -->|6. Kích hoạt gửi email tự động 2 chiều| Mail_Service
    Web_App -->|7. Gửi sự kiện chuyển đổi không chứa PII| Analytics_Platform
```

---

## 2. Ranh giới hệ thống & Phân định trách nhiệm (System Boundaries)

| Thành phần / Phân hệ | Vai trò & Trách nhiệm chính | Giao thức truyền thông | Cơ chế bảo vệ & Ràng buộc |
|---|---|:---:|---|
| **DataWithLy Web Frontend** | Render giao diện người dùng (Server Components & Client Components), phục vụ bản sao tĩnh (ISR) dưới 1.2s, xử lý responsive theo 4-point spacing system. | HTTPS / TLS 1.3 | Error Boundary cô lập lỗi từng component, CSP Header, Zod Schema validation ở client. |
| **Next.js Server / API Routes** | Tiếp nhận form nộp lead (`POST /api/leads`), kiểm tra Honeypot, kiểm tra Rate Limit, chuyển tiếp dữ liệu an toàn sang Google Apps Script; tiếp nhận Webhook làm mới cache (`POST /api/revalidate`). | Server-to-Server HTTPS | Token xác thực bí mật (`X-Webhook-Secret`), biến môi trường phía server (`.env.local`), không để lộ PII. |
| **Google Sheets Public Content** | Hoạt động như một **Headless CMS** thân thiện. Quản lý 9 tab dữ liệu công khai (Courses, Curriculum, Packages_Pricing, Mentors, Testimonials, StudentProjects, Blogs, Partners, SiteConfig). | HTTPS (CSV Export / Sheets API v4) | Quyền truy cập: Chỉ Đọc (`Viewer`) đối với hệ thống website. Không chứa bất kỳ dữ liệu nhạy cảm nào. |
| **Google Apps Script Webhook** | Đóng vai trò là **Bộ điều phối trung tâm (Central Controller)** cho luồng nộp lead: kiểm tra token bí mật, khử trùng dữ liệu chống Formula Injection, điều phối khóa luồng hàng đợi (`LockService`). | HTTPS POST (`doPost(e)`) | Quyền thực thi: `Execute as: Me`, `Access: Anyone`. Xác thực bằng shared secret header. |
| **Google Sheets Private Leads** | Cơ sở dữ liệu lưu trữ hồ sơ học viên đăng ký tư vấn nội bộ (Họ tên, SĐT, Email, Khóa học quan tâm, Khung giờ hẹn, UTM campaign). | Internal Spreadsheet Append | **Tuyệt đối không mở API đọc công khai**. Chỉ có Founder và tư vấn viên được chỉ định mới có quyền mở tệp. |
| **Media CDN (Cloudinary / R2)** | Phân phối hình ảnh đại diện, avatar giảng viên, ảnh chụp Dashboard học viên ở định dạng WebP/AVIF tối ưu. | HTTPS CDN URL | Tránh bẫy nghẽn băng thông của Google Drive; tối ưu chỉ số LCP của Core Web Vitals. |
| **Email Service** | Tự động gửi email cảnh báo tức thì cho tư vấn viên và gửi thư cảm ơn tự động cho học viên. | Google Workspace MailApp / Gmail API | Chạy bất đồng bộ, có nhật ký riêng, không làm chặn luồng submit form của học viên. |
| **Analytics (GA4 / GTM)** | Đo lường hiệu quả chiến dịch marketing, lượt click CTA, lượt xem lộ trình học và tỷ lệ gửi form thành công. | Client-side Beacon HTTPS | Tuân thủ quyền riêng tư: **Tuyệt đối không gửi PII** (Email, SĐT) vào các thông số sự kiện. |

---

## 3. Kiến trúc Container chi tiết của Next.js Application

Hệ thống Next.js 15+ App Router được tổ chức theo kiến trúc phân tầng sạch (Clean Layered Architecture):

```mermaid
graph TB
    subgraph Presentation_Layer["1. TẦNG GIAO DIỆN (PRESENTATION LAYER)"]
        Pages["App Router Pages<br/>(app/page.tsx, app/courses/[slug]/page.tsx)"]
        UI_Components["UI Components (4-point Spacing)<br/>(Hero, CourseCard, SyllabusAccordion, Testimonials)"]
        Forms["Client Form Components<br/>(LeadModal, LeadForm with Local State Preservation)"]
        ErrorBoundary["Error Boundaries Component<br/>(Graceful Fallback & Zero White Screen)"]
    end

    subgraph API_Layer["2. TẦNG API & ĐIỀU PHỐI (API LAYER)"]
        Route_Leads["POST /api/leads<br/>(Rate Limiting, Honeypot Check, Lead Dispatcher)"]
        Route_Revalidate["POST /api/revalidate<br/>(Secret Auth, On-demand ISR Invalidation)"]
        Route_Health["GET /api/health/sheets<br/>(Live Ping & Memory Health SLA)"]
    end

    subgraph Domain_Service_Layer["3. TẦNG NGHIỆP VỤ & VALIDATION (DOMAIN & SERVICE LAYER)"]
        Lead_Service["Lead Service<br/>(Submission Orchestration, Auto-retry Logic)"]
        Zod_Validators["Zod Validation Schemas<br/>(LeadSubmissionSchema, CourseSchema, SiteConfigSchema)"]
        Sanitizer["Formula Injection Sanitizer<br/>(CSV/Spreadsheet Sanitization)"]
        Rate_Limiter["Bounded LRU Rate Limiter<br/>(Max 3000 IPs, Self-Evicting chống Leak)"]
    end

    subgraph Data_Access_Layer["4. TẦNG TRUY XUẤT DỮ LIỆU & CACHING (DATA ACCESS & CACHING)"]
        Caching_Engine["5-Tier Caching Engine<br/>(Edge CDN, Tag-based ISR, Bounded LRU Cache)"]
        Sheets_Client["Google Sheets Client<br/>(Fetch with ISR Cache, Staging/Production Switch)"]
        GAS_Client["Apps Script Webhook Client<br/>(HTTPS Request with Timeout & Secret Header)"]
        Disk_Fallback["Static Fallback Snapshot<br/>(lib/cms/fallbacks/*.json)"]
    end

    Pages --> UI_Components
    Pages --> Forms
    Pages --> ErrorBoundary
    Forms --> Route_Leads
    Route_Leads --> Rate_Limiter
    Route_Leads --> Lead_Service
    Route_Revalidate --> Caching_Engine
    Caching_Engine --> Sheets_Client
    Sheets_Client -.-> Disk_Fallback
    Lead_Service --> Zod_Validators
    Lead_Service --> Sanitizer
    Lead_Service --> GAS_Client
    Pages --> Caching_Engine
```

---

## 4. Các quyết định kiến trúc ranh giới (Architectural Boundary Decisions)

1. **Tách biệt hoàn toàn Môi trường Staging và Production ở tầng Webhook:**
   - Trong giai đoạn Đợt 1 (MVP), biến môi trường `GOOGLE_APPS_SCRIPT_URL` trỏ vào Webhook của tệp **Google Sheets Staging (Test)**.
   - Khi chuyển sang Đợt 4 (Production), chỉ cần cập nhật URL và Secret Token sang tệp **Private Leads Production** của Chị Hứa Thảo Ly mà không cần sửa đổi bất kỳ dòng mã logic nào.
2. **Loại bỏ trạng thái phiên (Stateless Architecture):**
   - Ứng dụng Next.js hoạt động hoàn toàn dưới dạng phi trạng thái (Stateless), giúp hệ thống dễ dàng triển khai trên mạng lưới Vercel Edge Serverless mà không bị phụ thuộc vào Server Memory giữa các request.
   - Trạng thái điền form dở dang của học viên được lưu giữ cục bộ tại trình duyệt (`React State / SessionStorage`) để đảm bảo khả năng phục hồi dữ liệu khi mạng chập chờn.

---

## 5. Quy chuẩn Thiết kế Mã Nguồn & Các Mẫu Thiết Kế (Design Patterns)

Để đảm bảo mã nguồn có tính mở rộng cao (Extensibility), dễ dàng bảo trì và sẵn sàng cho việc nâng cấp cơ sở dữ liệu từ Google Sheets sang PostgreSQL trong tương lai, hệ thống áp dụng các mẫu thiết kế hướng đối tượng chuẩn mực:

```mermaid
classDiagram
    class ICourseRepository {
        <<interface>>
        +getById(id: string) Promise~CourseEntity~
        +getBySlug(slug: string) Promise~CourseEntity~
        +listAll() Promise~CourseEntity[]~
        +createCourse(dto: CreateCourseDTO) Promise~CourseEntity~
        +updateCourse(id: string, dto: UpdateCourseDTO) Promise~CourseEntity~
        +softDeleteCourse(id: string) Promise~boolean~
    }

    class GoogleSheetsCourseRepository {
        -sheetsClient: GoogleSheetsClient
        -adapter: GoogleSheetsRowAdapter
        +getById(id: string)
        +getBySlug(slug: string)
        +listAll()
        +createCourse(dto)
        +updateCourse(id, dto)
        +softDeleteCourse(id)
    }

    class PostgresCourseRepository {
        -dbClient: Pool
        +getById(id: string)
        +getBySlug(slug: string)
        +listAll()
        +createCourse(dto)
        +updateCourse(id, dto)
        +softDeleteCourse(id)
    }

    class RepositoryFactory {
        +getCourseRepository() ICourseRepository
        +getLeadRepository() ILeadRepository
    }

    ICourseRepository <|.. GoogleSheetsCourseRepository : implements
    ICourseRepository <|.. PostgresCourseRepository : implements
    RepositoryFactory ..> ICourseRepository : creates
```

### Chi tiết 4 Mẫu thiết kế nòng cốt:
1. **Repository Pattern (`ICourseRepository`, `ILeadRepository`):**
   - Đặt tại `lib/domain/repositories/`. Tầng Presentation và Business Logic chỉ giao tiếp qua Interface, hoàn toàn độc lập với chi tiết kỹ thuật của Google Sheets hay PostgreSQL.
2. **Adapter Pattern (`GoogleSheetsRowAdapter`):**
   - Đảm nhận việc chuyển đổi linh hoạt giữa dữ liệu mảng chuỗi thô của Google Sheets và các Domain Entities chuẩn hóa.
3. **Strategy Pattern (`INotificationStrategy`):**
   - Tách biệt cơ chế gửi email thông báo: `AppsScriptMailStrategy` (cho Google Workspace), `ResendEmailStrategy` (khi cần tăng tải), và `MockEmailStrategy` (cho kiểm thử tự động).
4. **Factory Pattern (`RepositoryFactory`):**
   - Tự động quyết định khởi tạo Repository phù hợp dựa trên biến môi trường `DATA_SOURCE_MODE`.

---

[Điểm bắt đầu của bộ docs](../README.md)
