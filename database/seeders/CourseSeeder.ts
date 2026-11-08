import { Course } from "@/lib/cms/types";
import { Seeder } from "./types";

export class CourseSeeder implements Seeder<Course> {
  run(): Course[] {
    return [
      {
        id: "end-to-end-analytics",
        title: "End-to-End Analytics with SQL & Dashboard",
        slug: "end-to-end-analytics",
        tag: "End-to-End",
        tagline: "Xây dựng nền tảng Data Analytics toàn diện từ truy vấn đến trực quan hóa",
        description:
          "Xây dựng nền tảng Data Analytics toàn diện, từ truy vấn và xử lý dữ liệu với SQL đến tư duy phân tích, trực quan hóa và thiết kế Dashboard hoàn chỉnh cho doanh nghiệp.",
        tuitionVnd: 5699000,
        originalTuitionVnd: 6780000,
        duration: "27 buổi (6 tuần)",
        level: "Beginner",
        coverImageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        id: "sql-for-data-analytics",
        title: "Khóa SQL for Data Analytics",
        slug: "sql-for-data-analytics",
        tag: "SQL",
        tagline: "Làm quen với Database và SQL, xây dựng khả năng truy vấn và tổng hợp dữ liệu",
        description:
          "Làm quen với Database và SQL, xây dựng khả năng truy vấn, lọc, biến đổi và tối ưu dữ liệu từ các hệ thống cơ sở dữ liệu lớn trong thực tế doanh nghiệp.",
        tuitionVnd: 2990000,
        originalTuitionVnd: 3500000,
        duration: "12 buổi (6 tuần)",
        level: "Beginner",
        coverImageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
      },
      {
        id: "data-analytical-thinking",
        title: "Khóa Data Analytical Thinking",
        slug: "data-analytical-thinking",
        tag: "Dashboard",
        tagline: "Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu và thiết kế báo cáo",
        description:
          "Học cách xác định vấn đề kinh doanh, phân rã chỉ số (Metrics Tree), phân tích dữ liệu chuyên sâu và trực quan hóa Dashboard phục vụ quyết định quản trị.",
        tuitionVnd: 3790000,
        originalTuitionVnd: 4500000,
        duration: "15 buổi (5 tuần)",
        level: "Intermediate",
        coverImageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 3,
      },
    ];
  }
}

