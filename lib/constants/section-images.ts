/**
 * ==============================================================================
 * SECTION IMAGES REGISTRY & ASSET CATALOG
 * Authoritative Mapping: Figma Desktop Nodes & Google Sheets Source of Truth
 * ==============================================================================
 *
 * Provides a structured, centralized catalog of image assets for landing page sections:
 * - StudentProjectsSection (Figma Node 12:873 - 3x3 Project Grid)
 * - HeroSection (Roadmap icons, Student avatars, Social proof, Tech stack)
 * - CoursesSection (Course cover cards: Combo, SQL, Thinking)
 * - WhyChooseUsSection (Highlight icons)
 * - AlumniCompaniesSection (Top/Bottom gradient wave banners & Partner brand logos)
 * - ComboPricingSection (Sale Star, Fire badge, Check icons)
 * - TestimonialsSection (Student reviewer avatars)
 * - MentorSection (Instructor Hứa Thảo Ly avatar & credentials)
 */

export interface SectionImageItem {
  id: string;
  section: string;
  figmaNodeId?: string;
  filePath: string;
  title: string;
  alt: string;
  category?: string;
  authorName?: string;
  tools?: string[];
  metrics?: string;
  aspect?: "normal" | "tall";
  width?: number;
  height?: number;
}

/**
 * 1. SECTION: STUDENT PROJECTS (Figma Node 12:873 - 3x3 Grid)
 * Cross-referenced with Google Sheets tab "Read me first" (gid=261123543)
 * under section "Thành quả của học viên".
 */
export const STUDENT_PROJECT_IMAGES: SectionImageItem[] = [
  {
    id: "proj-ecommerce-basket",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
    title: "Phân Tích Giỏ Hàng & Tối Ưu Cross-Selling E-Commerce",
    alt: "E-Commerce Basket Analysis Dashboard",
    category: "E-Commerce",
    authorName: "Nguyễn Minh Anh (K7)",
    tools: ["SQL", "PostgreSQL", "Power BI"],
    metrics: "Tăng 18% giá trị đơn hàng trung bình (AOV) nhờ đề xuất combo sản phẩm",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-fintech-retention",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/973e833b234c55daebe419eefe02eb6e80f7d86d.png",
    title: "Dự Đoán Rủi Ro Rời Bỏ (Churn) Ứng Dụng Thanh Toán Fintech",
    alt: "Fintech User Churn & Retention Cohort Dashboard",
    category: "Fintech",
    authorName: "Trần Quốc Bảo (K8)",
    tools: ["SQL", "Cohort Analysis", "Looker Studio"],
    metrics: "Giảm 12% tỷ lệ mất người dùng sau 30 ngày qua mô hình cảnh báo sớm",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-retail-inventory",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/f0920e49e6a571ac94250b3258b77d8c976423b6.png",
    title: "Tối Ưu Hóa Tồn Kho & Dự Báo Nhu Cầu Bán Lẻ Chuỗi Thời Trang",
    alt: "Retail Inventory & Demand Forecast Dashboard",
    category: "Retail",
    authorName: "Lê Hoàng Yến (K9)",
    tools: ["SQL", "Excel Advanced", "Tableau"],
    metrics: "Tiết kiệm 22% chi phí lưu kho và hạn chế tình trạng đứt hàng bán chạy",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-fmcg-sales-performance",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/cf9dcd253d74531ef55b272e2e080b01e9bbd6bb.png",
    title: "Dashboard Giám Sát Hiệu Suất Bán Hàng Kênh Phân Phối FMCG",
    alt: "FMCG Distribution & Sales KPI Dashboard",
    category: "FMCG",
    authorName: "Phạm Hải Đăng (K6)",
    tools: ["SQL", "BigQuery", "Power BI"],
    metrics: "Tự động hóa 100% báo cáo doanh số hàng ngày, tiết kiệm 15 giờ làm việc/tuần",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-logistics-delivery-sla",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/1af45d712faebc37b4905756835680a337298304.png",
    title: "Phân Tích & Tối Ưu SLA Giao Hàng Chặng Cuối Logistics",
    alt: "Logistics Last-Mile Delivery SLA Dashboard",
    category: "Logistics",
    authorName: "Đỗ Mai Linh (K8)",
    tools: ["SQL", "Window Functions", "Looker"],
    metrics: "Cải thiện tỷ lệ giao đúng hẹn từ 81% lên 94.5% trên toàn quốc",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-banking-credit-risk",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/c0aae3c5c5404ee626ce858087d79649de2e3dc1.png",
    title: "Phân Khúc Khách Hàng & Giám Sát Rủi Ro Tín Dụng Ngân Hàng",
    alt: "Banking Credit Risk & RFM Customer Segmentation Dashboard",
    category: "Banking",
    authorName: "Vũ Tuấn Kiệt (K9)",
    tools: ["SQL", "RFM Segmentation", "Tableau"],
    metrics: "Phát hiện sớm 15% nợ nhóm 2 và đề xuất giải pháp cơ cấu kịp thời",
    aspect: "normal",
    width: 384,
    height: 216,
  },
  {
    id: "proj-healthcare-appointment",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
    title: "Phân Tích Tỷ Lệ Hủy Lịch Khám & Tối Ưu Năng Suất Phòng Khám",
    alt: "Healthcare Clinic Operations & Appointment Dashboard",
    category: "Healthcare",
    authorName: "Ngô Thu Hương (K7)",
    tools: ["SQL", "Data Studio", "Google Sheets"],
    metrics: "Giảm 25% tỷ lệ no-show qua hệ thống tự động nhắc hẹn thông minh",
    aspect: "tall",
    width: 384,
    height: 320,
  },
  {
    id: "proj-edtech-student-engagement",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
    title: "Đo Lường Mức Độ Gắn Kết & Tỷ Lệ Hoàn Thành Khóa Học Trực Tuyến",
    alt: "EdTech Learning Funnel & Completion Rate Dashboard",
    category: "EdTech",
    authorName: "Trương Gia Huy (K10)",
    tools: ["SQL", "Funnel Analysis", "Metabase"],
    metrics: "Tăng tỷ lệ hoàn thành khóa học từ 42% lên 68% qua tối ưu điểm rơi nội dung",
    aspect: "tall",
    width: 384,
    height: 320,
  },
  {
    id: "proj-realestate-market-trend",
    section: "student_projects",
    figmaNodeId: "12:873",
    filePath: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
    title: "Nghiên Cứu Biến Động Giá & Xu Hướng Thị Trường Bất Động Sản",
    alt: "Real Estate Market Trends & Valuation Dashboard",
    category: "Real Estate",
    authorName: "Hoàng Bích Ngọc (K8)",
    tools: ["SQL", "CTE Advanced", "Power BI"],
    metrics: "Xây dựng chỉ số định giá bất động sản theo bán kính hạ tầng chuẩn xác 91%",
    aspect: "tall",
    width: 384,
    height: 320,
  },
];

/**
 * 2. MASTER SECTION IMAGES REGISTRY
 */
export const SECTION_IMAGES_REGISTRY: Record<string, SectionImageItem[]> = {
  student_projects: STUDENT_PROJECT_IMAGES,
  courses: [
    {
      id: "course-combo-end-to-end",
      section: "courses",
      figmaNodeId: "12:791",
      filePath: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
      title: "End-to-End Analytics with SQL & Dashboard",
      alt: "End-to-End Analytics Cover",
    },
    {
      id: "course-sql-for-data-analytics",
      section: "courses",
      figmaNodeId: "12:791",
      filePath: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
      title: "Khóa SQL for Data Analytics",
      alt: "SQL for Data Analytics Cover",
    },
    {
      id: "course-data-analytical-thinking",
      section: "courses",
      figmaNodeId: "12:791",
      filePath: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
      title: "Khóa Data Analytical Thinking",
      alt: "Data Analytical Thinking Cover",
    },
  ],
  pricing: [
    {
      id: "pricing-sale-star",
      section: "pricing",
      figmaNodeId: "12:1179",
      filePath: "/assets/figma/9f1a96eecae4b4f084d165577ecbd536619faec6.svg",
      title: "Huy hiệu Sale Star Tiết kiệm ~16%",
      alt: "Sale Star Badge",
    },
    {
      id: "pricing-fire-badge",
      section: "pricing",
      figmaNodeId: "12:1230",
      filePath: "/assets/figma/ae7139e451fb9f873198b04a809e63e17fd7844b.png",
      title: "Biểu tượng Lửa Hot Combo",
      alt: "Fire Badge",
    },
    {
      id: "pricing-check-icon",
      section: "pricing",
      figmaNodeId: "12:1230",
      filePath: "/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg",
      title: "Icon tích chọn quyền lợi",
      alt: "Check Icon",
    },
    {
      id: "pricing-warning-icon",
      section: "pricing",
      figmaNodeId: "12:1180",
      filePath: "/assets/figma/427717fb616f6e486ff78a45ffe62b030a5012e7.svg",
      title: "Icon cảnh báo điểm hạn chế",
      alt: "Warning Icon",
    },
  ],
  alumni_companies: [
    {
      id: "alumni-wave-upper",
      section: "alumni_companies",
      figmaNodeId: "12:781",
      filePath: "/assets/figma/banner-upper.png",
      title: "Thanh chuyển sắc Gradient Upper Wave",
      alt: "Upper Wave Gradient Banner",
    },
    {
      id: "alumni-wave-lower",
      section: "alumni_companies",
      figmaNodeId: "12:783",
      filePath: "/assets/figma/banner-lower.png",
      title: "Thanh chuyển sắc Gradient Lower Wave",
      alt: "Lower Wave Gradient Banner",
    },
  ],
  mentor: [
    {
      id: "mentor-hua-thao-ly",
      section: "mentor",
      figmaNodeId: "12:682",
      filePath: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
      title: "Giảng viên Hứa Thảo Ly",
      alt: "Hứa Thảo Ly Portrait",
    },
  ],
};

/**
 * Tra cứu danh sách ảnh theo Section
 */
export function getSectionImages(sectionKey: string): SectionImageItem[] {
  return SECTION_IMAGES_REGISTRY[sectionKey] || [];
}

/**
 * Tra cứu ảnh dự án học viên theo ID
 */
export function getProjectImageById(id: string): SectionImageItem | undefined {
  return STUDENT_PROJECT_IMAGES.find((p) => p.id === id);
}
