-- ==============================================================================
-- DATABASE SCHEMA DEFINITION: DataWithLy Platform
-- Dialect: PostgreSQL (15+) / Relational Standard
-- Purpose: Nguồn chân lý duy nhất (Single Source of Truth) về cấu trúc dữ liệu
--          chuẩn hóa cho toàn bộ hệ thống DataWithLy.
-- Mapping: Tương thích 1-1 với 9 Tab Google Sheets Content + 1 Tab Private Leads.
-- ==============================================================================

-- Bật extension tạo UUID ngẫu nhiên nếu cần
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS (Kiểu dữ liệu liệt kê)
-- ==============================================================================

CREATE TYPE course_status_enum AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE lead_status_enum AS ENUM ('NEW', 'CONTACTING', 'CONSULTED', 'ENROLLED', 'DROPPED', 'SPAM');
CREATE TYPE email_delivery_status_enum AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');
CREATE TYPE setting_type_enum AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- ==============================================================================
-- 2. TAB: COURSES (Danh mục khóa học cốt lõi)
-- ==============================================================================

CREATE TABLE courses (
    id VARCHAR(100) PRIMARY KEY,                         -- Kebab-case id (vd: 'sql-for-data-analytics')
    title VARCHAR(255) NOT NULL,                        -- Tên khóa học chính thức
    slug VARCHAR(100) NOT NULL UNIQUE,                  -- URL thân thiện SEO
    tag VARCHAR(50) NOT NULL,                           -- Nhãn danh mục: 'SQL', 'Dashboard', 'End-to-End'
    tagline VARCHAR(255),                               -- Khẩu hiệu ngắn gọn
    price_original NUMERIC(12, 0) NOT NULL DEFAULT 0,   -- Giá niêm yết (VNĐ)
    price_discounted NUMERIC(12, 0) NOT NULL DEFAULT 0, -- Học phí ưu đãi thực tế (VNĐ)
    duration_weeks INT NOT NULL DEFAULT 0,              -- Thời lượng ước tính (tuần)
    duration_hours INT NOT NULL DEFAULT 0,              -- Tổng số buổi đào tạo (buổi)
    level VARCHAR(100) NOT NULL,                        -- Yêu cầu đầu vào: 'Beginner', 'Intermediate'
    format VARCHAR(100) NOT NULL DEFAULT 'Live Online qua Zoom', -- Hình thức học
    schedule VARCHAR(255) NOT NULL,                     -- Lịch học trong tuần (vd: 'T3 - T5: 20h00 - 22h00')
    badge_label VARCHAR(50),                            -- Nhãn nổi bật: 'Bán chạy nhất', 'Đang tuyển sinh'
    sort_order INT NOT NULL DEFAULT 0,                  -- Thứ tự hiển thị trên giao diện
    is_active BOOLEAN NOT NULL DEFAULT TRUE,            -- Cờ hiển thị công khai trên website
    status course_status_enum NOT NULL DEFAULT 'PUBLISHED', -- Trạng thái vòng đời
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_course_prices CHECK (price_discounted <= price_original)
);

COMMENT ON TABLE courses IS 'Bảng lưu trữ thông tin danh mục các khóa học cốt lõi DataWithLy';
COMMENT ON COLUMN courses.id IS 'Khóa chính định danh duy nhất (kebab-case)';
COMMENT ON COLUMN courses.status IS 'Trạng thái khóa học: DRAFT (Bản nháp), PUBLISHED (Xuất bản), ARCHIVED (Xóa mềm/Lưu trữ)';

CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_is_active ON courses(is_active);

-- ==============================================================================
-- 3. TAB: CURRICULUM (Đề cương chi tiết từng buổi học)
-- ==============================================================================

CREATE TABLE curriculum (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL,                    -- Liên kết khóa ngoại đến courses.id
    module_number INT NOT NULL,                         -- Số thứ tự buổi học (1, 2, 3...)
    module_title VARCHAR(255) NOT NULL,                 -- Tiêu đề buổi học
    duration VARCHAR(50) NOT NULL DEFAULT '2 giờ',      -- Thời lượng buổi học
    bullets TEXT NOT NULL,                              -- Nội dung chi tiết (các dòng phân cách bởi \n từ Alt+Enter)
    is_milestone BOOLEAN NOT NULL DEFAULT FALSE,        -- Cột mốc quan trọng (Midterm project, Final portfolio)
    sort_order INT NOT NULL DEFAULT 0,                  -- Thứ tự sắp xếp trong Accordion
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curriculum_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE curriculum IS 'Bảng lưu trữ đề cương chi tiết 12-25 buổi học cho từng khóa học';
COMMENT ON COLUMN curriculum.bullets IS 'Chuỗi văn bản đa dòng chứa các gạch đầu dòng, phân cách bởi ký tự xuống dòng \n';

CREATE INDEX idx_curriculum_course_id ON curriculum(course_id);
CREATE INDEX idx_curriculum_sort ON curriculum(course_id, sort_order);

-- ==============================================================================
-- 4. TAB: PACKAGES_PRICING (Bảng giá và gói Combo ưu đãi)
-- ==============================================================================

CREATE TABLE packages_pricing (
    id SERIAL PRIMARY KEY,
    package_id VARCHAR(100) NOT NULL UNIQUE,            -- Khóa định danh gói (vd: 'combo-all-in-one')
    name VARCHAR(255) NOT NULL,                         -- Tên gói combo
    original_price NUMERIC(12, 0) NOT NULL DEFAULT 0,   -- Giá gốc trước ưu đãi
    final_price NUMERIC(12, 0) NOT NULL DEFAULT 0,      -- Giá bán sau ưu đãi
    savings_label VARCHAR(100),                         -- Nhãn tiết kiệm (vd: 'Tiết kiệm 1.090.000đ')
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,          -- Gói được lựa chọn nhiều nhất
    features TEXT NOT NULL,                             -- Danh sách quyền lợi (phân cách bởi \n)
    course_ids TEXT[] NOT NULL DEFAULT '{}',            -- Mảng ID các khóa học gộp trong gói
    cta_text VARCHAR(100) NOT NULL DEFAULT 'Nhận ưu đãi trọn gói',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE packages_pricing IS 'Bảng lưu trữ cấu hình các gói Combo đào tạo và học phí trọn gói';

-- ==============================================================================
-- 5. TAB: STUDENT_PROJECTS (Thư viện dự án học viên tiêu biểu)
-- ==============================================================================

CREATE TABLE student_projects (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(100) NOT NULL UNIQUE,            -- Khóa định danh (vd: 'project-film-revenue')
    title VARCHAR(255) NOT NULL,                        -- Tiêu đề dự án thực tế
    category VARCHAR(100) NOT NULL,                     -- Lĩnh vực: 'Entertainment', 'E-commerce', 'EdTech'
    author_name VARCHAR(150) NOT NULL,                  -- Tên học viên thực hiện (vd: 'Nguyễn Văn A - K8')
    author_title VARCHAR(150),                          -- Vị trí công việc hiện tại của học viên
    tools TEXT[] NOT NULL DEFAULT '{}',                 -- Bộ công cụ sử dụng (vd: ARRAY['SQL', 'Power BI', 'DAX'])
    metrics VARCHAR(255) NOT NULL,                      -- Tác động/kết quả bài toán kinh doanh
    image_url TEXT NOT NULL,                            -- Đường dẫn ảnh mockup dashboard
    demo_url TEXT,                                      -- Liên kết xem dashboard tương tác (nếu có)
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE student_projects IS 'Bảng lưu trữ 4 dự án học viên tiêu biểu hiển thị trên Trang chủ';

-- ==============================================================================
-- 6. TAB: MENTOR_PROFILE (Thông tin giảng viên Hứa Thảo Ly)
-- ==============================================================================

CREATE TABLE mentor_profile (
    key VARCHAR(100) PRIMARY KEY,                       -- Khóa cấu hình (vd: 'full_name', 'bio', 'avatar_url')
    value TEXT NOT NULL,                                -- Giá trị cấu hình
    description VARCHAR(255),                           -- Mô tả mục đích
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE mentor_profile IS 'Bảng lưu trữ thông tin tiểu sử và năng lực Mentor Hứa Thảo Ly';

-- ==============================================================================
-- 7. TAB: TESTIMONIALS (Đánh giá học viên thực tế K1-K10)
-- ==============================================================================

CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,                 -- Họ tên học viên
    student_role VARCHAR(150) NOT NULL,                 -- Vị trí công việc sau khóa học
    student_company VARCHAR(150),                       -- Công ty (nếu công khai)
    course_taken VARCHAR(150) NOT NULL,                 -- Khóa học đã tham gia
    quote TEXT NOT NULL,                                -- Lời nhận xét trích dẫn từ slide bài giảng
    avatar_url TEXT,                                    -- Đường dẫn ảnh đại diện
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE testimonials IS 'Bảng lưu trữ đánh giá học viên thực tế từ slide thuyết trình K1-K10';

-- ==============================================================================
-- 8. TAB: BLOG_POSTS (Bài viết chia sẻ kiến thức chuyên môn)
-- ==============================================================================

CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,                  -- URL thân thiện SEO
    title VARCHAR(255) NOT NULL,                        -- Tiêu đề bài viết
    category VARCHAR(100) NOT NULL,                     -- Phân loại: 'SQL', 'Dashboard & BI', 'Career'
    read_time VARCHAR(50) NOT NULL DEFAULT '5 phút đọc',-- Thời gian đọc ước tính
    author VARCHAR(100) NOT NULL DEFAULT 'Hứa Thảo Ly', -- Tác giả bài viết
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,  -- Ngày phát hành
    summary TEXT NOT NULL,                              -- Tóm tắt hiển thị trên card preview
    content_markdown TEXT NOT NULL,                     -- Toàn văn bài viết định dạng Markdown
    thumbnail_url TEXT NOT NULL,                        -- Đường dẫn ảnh đại diện
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE blog_posts IS 'Bảng lưu trữ các bài viết chuyên môn định dạng Markdown có syntax highlighting';

CREATE INDEX idx_blog_slug ON blog_posts(slug);
CREATE INDEX idx_blog_category ON blog_posts(category);

-- ==============================================================================
-- 9. TAB: SITE_SETTINGS (Cấu hình chung toàn hệ thống)
-- ==============================================================================

CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,                       -- Khóa cấu hình (vd: 'hotline', 'brand_name')
    value TEXT NOT NULL,                                -- Giá trị
    type setting_type_enum NOT NULL DEFAULT 'STRING',   -- Kiểu dữ liệu
    description VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE site_settings IS 'Bảng lưu trữ các cấu hình tĩnh (Hotline, Email, Liên kết Zalo, Thông báo)';

-- ==============================================================================
-- 10. TAB: FAQ (Câu hỏi thường gặp)
-- ==============================================================================

CREATE TABLE faq (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,                             -- Câu hỏi
    answer TEXT NOT NULL,                               -- Câu trả lời chi tiết
    category VARCHAR(100) NOT NULL DEFAULT 'General',   -- Nhóm câu hỏi
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE faq IS 'Bảng lưu trữ danh sách câu hỏi thường gặp về khóa học và chính sách';

-- ==============================================================================
-- 11. TAB: LEADS (Private Leads Sheet - Thu thập thông tin học viên)
-- ==============================================================================

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),     -- Khóa UUID nội bộ
    submission_id VARCHAR(100) NOT NULL UNIQUE,         -- Khóa chống gửi trùng lặp cấp Client
    full_name VARCHAR(150) NOT NULL,                    -- Họ và tên học viên
    email VARCHAR(255) NOT NULL,                        -- Email liên hệ
    phone VARCHAR(20) NOT NULL,                         -- Số điện thoại di động VN
    course_id VARCHAR(100) NOT NULL,                    -- Khóa học quan tâm
    learning_goal TEXT,                                 -- Mục tiêu học tập / ghi chú thêm
    utm_source VARCHAR(100),                            -- Nguồn chiến dịch marketing
    utm_medium VARCHAR(100),                            -- Kênh chiến dịch
    utm_campaign VARCHAR(150),                          -- Tên chiến dịch
    status lead_status_enum NOT NULL DEFAULT 'NEW',     -- Trạng thái chăm sóc của tư vấn viên
    email_student_status email_delivery_status_enum NOT NULL DEFAULT 'PENDING', -- Trạng thái gửi mail học viên
    email_admin_status email_delivery_status_enum NOT NULL DEFAULT 'PENDING',   -- Trạng thái gửi mail đội tư vấn
    ip_address VARCHAR(50),                             -- Địa chỉ IP client (cho audit rate limit)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE leads IS 'Bảng bảo mật lưu trữ hồ sơ Lead học viên tiềm năng (Lưu trữ riêng tư)';

CREATE INDEX idx_leads_submission_id ON leads(submission_id);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);

-- ==============================================================================
-- PHỤ LỤC: PRISMA ORM SCHEMA EQUIVALENT (Tham khảo cho tương lai)
-- ==============================================================================
/*
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Course {
  id              String       @id
  title           String
  slug            String       @unique
  tag             String
  tagline         String?
  priceOriginal   Decimal      @default(0) @map("price_original")
  priceDiscounted Decimal      @default(0) @map("price_discounted")
  durationWeeks   Int          @default(0) @map("duration_weeks")
  durationHours   Int          @default(0) @map("duration_hours")
  level           String
  format          String       @default("Live Online qua Zoom")
  schedule        String
  badgeLabel      String?      @map("badge_label")
  sortOrder       Int          @default(0) @map("sort_order")
  isActive        Boolean      @default(true) @map("is_active")
  status          String       @default("PUBLISHED")
  createdAt       DateTime     @default(now()) @map("created_at")
  updatedAt       DateTime     @updatedAt @map("updated_at")
  curriculum      Curriculum[]

  @@map("courses")
}

model Curriculum {
  id           Int      @id @default(autoincrement())
  courseId     String   @map("course_id")
  moduleNumber Int      @map("module_number")
  moduleTitle  String   @map("module_title")
  duration     String   @default("2 giờ")
  bullets      String
  isMilestone  Boolean  @default(false) @map("is_milestone")
  sortOrder    Int      @default(0) @map("sort_order")
  createdAt    DateTime @default(now()) @map("created_at")
  course       Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@map("curriculum")
}

model Lead {
  id                 String   @id @default(uuid())
  submissionId       String   @unique @map("submission_id")
  fullName           String   @map("full_name")
  email              String
  phone              String
  courseId           String   @map("course_id")
  learningGoal       String?  @map("learning_goal")
  utmSource          String?  @map("utm_source")
  utmMedium          String?  @map("utm_medium")
  utmCampaign        String?  @map("utm_campaign")
  status             String   @default("NEW")
  emailStudentStatus String   @default("PENDING") @map("email_student_status")
  emailAdminStatus   String   @default("PENDING") @map("email_admin_status")
  createdAt          DateTime @default(now()) @map("created_at")

  @@map("leads")
}
*/

