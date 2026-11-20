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
        tagline: "Lộ trình học toàn diện kết hợp giữa SQL và Dashboard Design",
        description:
          "Xây dựng nền tảng Data Analytics toàn diện, từ truy vấn và xử lý dữ liệu với SQL đến tư duy phân tích, trực quan hóa và thiết kế Dashboard hoàn chỉnh cho doanh nghiệp.",
        tuitionVnd: 5690000,
        originalTuitionVnd: 6780000,
        duration: "25 buổi học (Live Online)",
        level: "Beginner",
        coverImageUrl: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        courseKind: "Khóa học nổi bật",
        studyStyle: "Live Class",
        studentEnrollment: 350,
      },
      {
        id: "sql-for-data-analytics",
        title: "Khóa SQL for Data Analytics",
        slug: "sql-for-data-analytics",
        tag: "SQL",
        tagline: "Làm quen với Database và SQL, xây dựng khả năng truy vấn, tổng hợp",
        description:
          "Khóa học giúp bạn từng bước làm quen với Database và SQL, xây dựng khả năng truy vấn, tổng hợp, biến đổi và làm sạch dữ liệu. Bên cạnh kiến thức SQL, bạn sẽ thực hành qua bài tập, Case Study và Capstone Project để biết cách ứng dụng SQL vào công việc Data Analyst.",
        tuitionVnd: 2990000,
        originalTuitionVnd: 3500000,
        duration: "12 buổi học (2 buổi/tuần)",
        level: "Beginner",
        coverImageUrl: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 2,
        courseKind: "Khóa học nền tảng",
        studyStyle: "Live Class",
        studentEnrollment: 280,
      },
      {
        id: "data-analytical-thinking",
        title: "Khóa Data Analytical Thinking",
        slug: "data-analytical-thinking",
        tag: "Dashboard",
        tagline: "Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu và thiết kế báo cáo",
        description:
          "Khóa học trang bị nền tảng từ cách sử dụng công cụ SQL, BI Tool (Data Studio) đến kiến thức thống kê (Statistics), tư duy phân tích (Analytical Thinking), tư duy phản biện (Critical Thinking), xử lý vấn đề (Problem Solving), kể chuyện bằng dữ liệu (Data Storytelling).",
        tuitionVnd: 3790000,
        originalTuitionVnd: 4500000,
        duration: "16 buổi học (Live Online)",
        level: "Intermediate",
        coverImageUrl: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        courseKind: "Khóa học chuyên sâu",
        studyStyle: "Live Class",
        studentEnrollment: 250,
      },
    ];
  }
}
