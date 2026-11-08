import { Testimonial } from "@/lib/cms/types";
import { Seeder } from "./types";

export class TestimonialSeeder implements Seeder<Testimonial> {
  run(): Testimonial[] {
    return [
      {
        id: "test-01",
        studentName: "Nguyễn Hải Đăng",
        studentRole: "Ex-Marketing Exec → Junior Data Analyst",
        role: "Ex-Marketing Exec → Junior Data Analyst",
        company: "Shopee Vietnam",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "Trước đây mình rất sợ các câu lệnh và công thức phức tạp. Nhờ cách dạy trực quan theo từng tình huống kinh doanh của chị Lý, mình đã hiểu sâu bản chất JOIN, CTE và Window Function. Hiện tại mình đã pass vòng phỏng vấn DA tại Shopee!",
        reviewText:
          "Trước đây mình rất sợ các câu lệnh và công thức phức tạp. Nhờ cách dạy trực quan theo từng tình huống kinh doanh của chị Lý, mình đã hiểu sâu bản chất JOIN, CTE và Window Function. Hiện tại mình đã pass vòng phỏng vấn DA tại Shopee!",
        avatarUrl: "/assets/figma/da527ba5696d5b94f6f71aebe984b901fc46d929.png",
        isActive: true,
      },
      {
        id: "test-02",
        studentName: "Trần Mai Phương",
        studentRole: "Business Analyst",
        role: "Business Analyst",
        company: "MB Bank",
        courseId: "end-to-end-analytics",
        rating: 5,
        comment:
          "Khóa Combo End-to-End thực sự là bước ngoặt. Không chỉ dạy kỹ thuật viết code, chị Lý còn truyền cho mình tư duy bóc tách vấn đề MECE và cách nói chuyện với Stakeholder. Các buổi review bài tập 1-on-1 siêu chi tiết và tâm huyết.",
        reviewText:
          "Khóa Combo End-to-End thực sự là bước ngoặt. Không chỉ dạy kỹ thuật viết code, chị Lý còn truyền cho mình tư duy bóc tách vấn đề MECE và cách nói chuyện với Stakeholder. Các buổi review bài tập 1-on-1 siêu chi tiết và tâm huyết.",
        avatarUrl: "/assets/figma/da527ba5696d5b94f6f71aebe984b901fc46d929.png",
        isActive: true,
      },
      {
        id: "test-03",
        studentName: "Phạm Quốc Tuấn",
        studentRole: "Operations Specialist",
        role: "Operations Specialist",
        company: "Giao Hàng Nhanh (GHN)",
        courseId: "data-analytical-thinking",
        rating: 5,
        comment:
          "Khóa học giúp mình xóa bỏ tư duy làm báo cáo chay. Mình tự tay xây dựng được hệ thống Dashboard tự động cảnh báo đơn trễ và đo lường SLA giao hàng. Sếp khen ngợi và tăng lương ngay sau khi áp dụng vào thực tế.",
        reviewText:
          "Khóa học giúp mình xóa bỏ tư duy làm báo cáo chay. Mình tự tay xây dựng được hệ thống Dashboard tự động cảnh báo đơn trễ và đo lường SLA giao hàng. Sếp khen ngợi và tăng lương ngay sau khi áp dụng vào thực tế.",
        avatarUrl: "/assets/figma/da527ba5696d5b94f6f71aebe984b901fc46d929.png",
        isActive: true,
      },
    ];
  }
}
