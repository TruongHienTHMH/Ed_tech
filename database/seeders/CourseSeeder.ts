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
        coverImageUrl: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        courseKind: "Khóa học nổi bật",
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
        coverImageUrl: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 2,
        courseKind: "Khóa học nền tảng",
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
        coverImageUrl: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        courseKind: "Khóa học chuyên sâu",
      },
    ];
  }
}
