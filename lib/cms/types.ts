/**
 * CMS Content Domain Models & Types
 * Represents the 12 normalized tabs from Google Sheets Content Master
 */

export interface Course {
  id: string;                         // e.g. "sql-for-data-analytics"
  title: string;                      // e.g. "SQL for Data Analytics"
  slug: string;                       // e.g. "sql-for-data-analytics"
  tag: string;                        // e.g. "SQL", "Dashboard", "Python", "End-to-End"
  tagline: string;
  description: string;
  tuitionVnd: number;                 // e.g. 4500000
  originalTuitionVnd?: number;        // e.g. 6000000
  duration: string;                   // e.g. "8 tuần (24 buổi)"
  level: "Beginner" | "Intermediate" | "Advanced";
  coverImageUrl: string;
  isActive: boolean;                  // Soft delete flag
  isFeatured: boolean;
  sortOrder: number;
  courseKind?: string;                // e.g. "Khóa học nổi bật", "Khóa học nền tảng", "Khóa học chuyên sâu"
  curriculumModules?: CurriculumModule[];
}

export interface CurriculumModule {
  id: string;
  courseId: string;
  courseName?: string;
  week?: number | string;             // Tuần học (e.g. 1, "Tuần 1")
  day?: number;                       // Buổi học (e.g. 1, 2, 3...)
  date?: string;                      // Ngày của buổi học (e.g. "TH10 03")
  sessionTitle?: string;              // Nội dung của từng buổi
  sessionDesc?: string;               // Miêu tả nội dung buổi học
  subContent?: string[];              // Sub content: Dot list khi bấm drop down
  duration?: string;                  // Thời lượng (e.g. "3 giờ")
  sortOrder?: number;
  startDate?: string;                 // Ngày bắt đầu học phần (e.g. "2026-03-01")
  endDate?: string;                   // Ngày kết thúc học phần (e.g. "2026-04-30")
  moduleNumber: number;               // Day / Buổi số
  title: string;                      // Tiêu đề buổi học
  summary: string;                    // Miêu tả tóm tắt
  bulletPoints: string[];             // Parsed from multiline text (\n or Alt+Enter)
  durationHours: number;
  lessonsCount?: number;
  weekNumber?: number;                // e.g. 1, 2, 3, 4, 5, 6
  weekLabel?: string;                 // e.g. "Tuần 1", "Week 1"
  sessionDateBadge?: string;          // e.g. "TH10 03", "TH10 26", "TH11 01"
  isMilestone?: boolean;              // Highlighted session (e.g. Capstone project, Practice)
  milestoneBadge?: string;            // e.g. "Thực hành", "Capstone Project"
}

export interface PackagePricing {
  id: string;                         // e.g. "pkg-foundation"
  packageId: string;                  // e.g. "combo-foundation"
  name: string;                       // e.g. "Gói Nền Tảng (SQL + Power BI)"
  originalPrice: number;              // e.g. 13000000
  salePrice: number;                  // e.g. 8900000
  badge?: string;                     // e.g. "Tiết Kiệm 32%"
  featuresList: string[];             // Parsed from multiline text (\n)
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface StudentProject {
  id: string;                         // e.g. "project-ecommerce-basket-analysis"
  projectId: string;                  // e.g. "project-ecommerce-basket-analysis"
  title: string;                      // e.g. "Phân Tích Giỏ Hàng & Tối Ưu Cross-Selling E-Commerce"
  category: string;                   // e.g. "E-commerce", "Entertainment"
  authorName: string;                 // e.g. "Nguyễn Minh Anh (K7)"
  tools: string[];                    // e.g. ["SQL", "Power BI", "Python"]
  toolsRaw?: string;                  // Raw string from Google Sheets
  metrics: string;                    // e.g. "Tăng 18% giá trị đơn hàng trung bình (AOV)..."
  imageUrl: string;                   // e.g. "/uploads/projects/ecommerce-market-basket.jpg"
  sortOrder: number;
  isActive: boolean;
  demoUrl?: string;
}

export interface Promotion {
  id: string;                         // e.g. "promo-earlybird-2026"
  code: string;                       // e.g. "EARLYBIRD15"
  title: string;                      // e.g. "Ưu Đãi Đăng Ký Sớm Khóa Mới"
  discountType: "PERCENT" | "FIXED_VND";
  discountValue: number;              // e.g. 15 or 500000
  startDate: string;                  // e.g. "2026-03-01"
  endDate: string;                    // e.g. "2026-03-31 23:59:59"
  applicableCourses: string;          // e.g. "ALL" or "sql-for-data-analytics"
  badge?: string;                     // e.g. "Giảm 15%"
  isActive: boolean;
  sortOrder: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;                       // e.g. "Lead Mentor & Founder DataWithLy"
  title?: string;
  bio: string;
  avatarUrl: string;
  companies: string[];                // e.g. ["MoMo", "Tiki", "ACB Bank"]
  companiesWorked?: string;
  linkedinUrl?: string;
  experienceYears?: number;
  isActive?: boolean;
}

export interface Testimonial {
  id: string;
  studentName: string;
  studentRole: string;
  role?: string;
  company: string;
  courseId: string;
  rating: number;                     // 1 - 5
  comment: string;
  reviewText?: string;
  avatarUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface FAQ {
  id: string;
  category: "CHUNG" | "LỊCH HỌC" | "HỌC PHÍ" | "ĐẦU RA" | string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

export interface TrustMetric {
  metricKey: string;
  numberDisplay: string;
  label: string;
  iconName: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SystemSettings {
  hotline: string;
  zaloUrl: string;
  contactEmail: string;
  announcementBar: string;
  revalidationUrl: string;
  raw?: Record<string, string>;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  description?: string;               // Short / SEO description
  contentMarkdown?: string;
  coverImageUrl?: string;
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt: string;
  readTimeMinutes?: number;
  isActive: boolean;
}

export interface LeadSubmission {
  submissionId: string;
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  courseId?: string;
  courseName?: string;
  coachingCourse?: string;
  targetOrGoal?: string;
  attendanceCommitment?: string;
  message?: string;
  status: "NEW" | "CONTACTING" | "CONSULTED" | "ENROLLED" | "DROPPED" | "SPAM" | string;
  notes?: string;
  assignedTo?: string;
  source?: string;
  updatedAt?: string;
}
