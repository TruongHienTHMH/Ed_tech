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
        studentEnrollment: 350,
        whoIsFor: [
          "Người mới bắt đầu chưa có kiến thức về lập trình hay cơ sở dữ liệu.",
          "Nhân sự Marketing, Vận hành, Tài chính muốn tự động hóa việc làm báo cáo.",
          "Sinh viên hoặc người đi làm muốn chuyển ngành sang vị trí Data Analyst.",
        ],
        outcomes: [
          "Tự tin viết câu lệnh SQL phức tạp (JOINs, Window Functions, CTE).",
          "Thiết kế Dashboard chuyên nghiệp bằng Power BI cho báo cáo doanh nghiệp.",
          "Sở hữu Portfolio đồ án Capstone thực chiến để gây ấn tượng với nhà tuyển dụng.",
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
          "Người mới bắt đầu chưa có kiến thức về lập trình hay cơ sở dữ liệu.",
          "Nhân sự muốn học SQL để tự truy xuất dữ liệu và làm báo cáo tự động.",
          "Sinh viên hoặc người đi làm muốn ứng tuyển vị trí Data / Business Analyst.",
        ],
        outcomes: [
          "Tự tin viết câu lệnh SQL phức tạp (JOINs, Window Functions, CTE).",
          "Tối ưu hóa tốc độ truy vấn trên hệ thống dữ liệu lớn của doanh nghiệp.",
          "Sở hữu Portfolio đồ án Capstone thực chiến để gây ấn tượng với nhà tuyển dụng.",
        ],
        inputRequirement:
          "Không yêu cầu kiến thức lập trình hay toán cao cấp từ trước. Bạn chỉ cần chuẩn bị máy tính cá nhân (Windows hoặc macOS) và tinh thần học hỏi nghiêm túc.",
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
          "Data Analyst muốn nâng cao tư duy phân tích và kỹ năng thiết kế Dashboard.",
          "Nhân sự cấp trung muốn đọc hiểu và trình bày dữ liệu thuyết phục hơn.",
          "Người đã có kiến thức SQL cơ bản muốn hoàn thiện kỹ năng phân tích chuyên sâu.",
        ],
        outcomes: [
          "Phân tích dữ liệu với tư duy phản biện, xác định đúng vấn đề kinh doanh.",
          "Thiết kế Metrics Tree và Dashboard phục vụ quyết định quản trị.",
          "Trình bày insight bằng ngôn ngữ dữ liệu thuyết phục cho stakeholder.",
        ],
        inputRequirement:
          "Học viên cần có kiến thức SQL cơ bản, bao gồm truy vấn, lọc, tổng hợp và kết hợp dữ liệu.",
      },
    ];
  }
}
