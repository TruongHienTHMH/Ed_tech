import { Course } from "@/lib/cms/types";
import { Seeder } from "./types";

export class CourseSeeder implements Seeder<Course> {
  run(): Course[] {
    return [
      {
        id: "end-to-end-analytics",
        title: "Khóa End-to-End Analytics with SQL & Dashboard Design Design",
        slug: "end-to-end-analytics",
        tag: "End-to-End",
        tagline: "Lộ trình học toàn diện kết hợp giữa SQL và Dashboard Design",
        description:
          "Xây dựng nền tảng Data Analytics toàn diện, từ truy vấn và xử lý dữ liệu với SQL đến tư duy phân tích, trực quan hóa và thiết kế Dashboard hoàn chỉnh cho doanh nghiệp.",
        tuitionVnd: 5690000,
        originalTuitionVnd: 6780000,
        totalSessions: 25,
        practiceCount: 6,
        capstoneCount: 2,
        level: "Beginner",
        coverImageUrl: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
        courseKind: "Khóa học nổi bật",
        studyStyle: "Live Class",
        studentEnrollment: 200,
        whoIsFor: [
          "Bạn là người mới bắt đầu và muốn xây dựng nền tảng Data Analytics theo một lộ trình có hệ thống",
          "Bạn là sinh viên hoặc người đang định hướng/ chuyển hướng sang Data Analyst",
          "Bạn đã biết một phần SQL hoặc Data Analytics nhưng kiến thức còn rời rạc",
          "Bạn muốn học cả kỹ năng xử lý dữ liệu và tư duy phân tích thay vì chỉ học công cụ"
        ],
        outcomes: [
          "Sử dụng SQL để truy vấn, tổng hợp, kết hợp và làm sạch dữ liệu",
          "Tiếp cận Business Problem theo một quy trình có hệ thống",
          "Xác định Metrics phù hợp với từng bài toán",
          "Phân tích dữ liệu và đưa ra Insight, đồng thời đưa ra đề xuất hành động",
          "Trực quan hóa dữ liệu và xây dựng dashboard",
        ],
        inputRequirement:
          "Không yêu cầu kiến thức lập trình hay toán cao cấp từ trước. Bạn chỉ cần chuẩn bị máy tính cá nhân (Windows hoặc macOS) và tinh thần học hỏi nghiêm túc.",
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
        totalSessions: 12,
        practiceCount: 4,
        capstoneCount: 1,
        level: "Beginner",
        coverImageUrl: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 2,
        courseKind: "Khóa học nền tảng",
        studyStyle: "Live Class",
        studentEnrollment: 280,
        whoIsFor: [
          "- Bạn là người mới bắt đầu học Data Analytics và muốn xây dựng nền tảng SQL",
          "- Bạn là sinh viên hoặc người đang định hướng / chuyển hướng sang Data Analyst",
          "- Bạn là người đã sử dụng Excel / Google Sheets và muốn phát triển kỹ năng xử lý dữ liệu bằng SQL",
          "- Bạn muốn hệ thống lại kiến thức SQL và thực hành qua các bài toán phân tích dữ liệu",
        ],
        outcomes: [
          "Hiểu cách dữ liệu được tổ chức và lưu trữ trong Database",
          "Sử dụng SQL để truy vấn, lọc, tổng hợp và kết hợp dữ liệu",
          "Ứng dụng SQL vào các bài toán phân tích như Cohort và RFM",
          "Hoàn thành các bài Practice, Case Study và Capstone Project bằng SQL",
        ],
        inputRequirement:
          "Không yêu cầu kiến thức lập trình hay toán cao cấp từ trước. Bạn chỉ cần chuẩn bị máy tính cá nhân (Windows hoặc macOS) và tinh thần học hỏi nghiêm túc.",
      },
      {
        id: "data-analytical-thinking",
        title: "Khóa Analytical Thinking & Dashboard Design",
        slug: "data-analytical-thinking",
        tag: "Dashboard",
        tagline: "Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu và thiết kế báo cáo",
        description:
          "Khóa học trang bị nền tảng từ cách sử dụng công cụ SQL, BI Tool (Data Studio) đến kiến thức thống kê (Statistics), tư duy phân tích (Analytical Thinking), tư duy phản biện (Critical Thinking), xử lý vấn đề (Problem Solving), kể chuyện bằng dữ liệu (Data Storytelling).",
        tuitionVnd: 3790000,
        originalTuitionVnd: 4500000,
        totalSessions: 16,
        practiceCount: 3,
        capstoneCount: 2,
        level: "Intermediate",
        coverImageUrl: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
        isActive: true,
        isFeatured: false,
        sortOrder: 3,
        courseKind: "Khóa học chuyên sâu",
        studyStyle: "Live Class",
        studentEnrollment: 250,
        whoIsFor: [
          "Bạn đã có kiến thức SQL cơ bản và muốn phát triển tư duy phân tích dữ liệu",
          "Bạn là junior Data Analyst muốn cải thiện cách tiếp cận Business Problem, Metrics và Insight",
          "Bạn đã biết cách truy vấn dữ liệu nhưng chưa tự tin trong việc biến dữ liệu thành phân tích có ý nghĩa",
          "Bạn muốn cải thiện kỹ năng Data Visualization và xây dựng Dashboard phục vụ ra quyết định",
        ],
        outcomes: [
          "Tiếp cận Business Problem theo một quy trình có hệ thống",
          "Xác định Metrics phù hợp với từng bài toán",
          "Phân tích dữ liệu và đưa ra Insight, đồng thời đưa ra đề xuất hành động",
          "Trực quan hóa dữ liệu và xây dựng dashboard",
        ],
        inputRequirement:
          "Học viên cần có kiến thức SQL cơ bản, bao gồm truy vấn, lọc, tổng hợp và kết hợp dữ liệu.",
      },
    ];
  }
}
