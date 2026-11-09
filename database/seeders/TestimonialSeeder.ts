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
        avatarUrl: "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png",
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
        avatarUrl: "/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png",
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
        avatarUrl: "/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png",
        isActive: true,
      },
      {
        id: "test-04",
        studentName: "Lê Hoàng Yến",
        studentRole: "Product Growth Executive",
        role: "Product Growth Executive",
        company: "MoMo",
        courseId: "end-to-end-analytics",
        rating: 5,
        comment:
          "Bộ tài liệu thực tế và dataset từ các công ty kỳ lân giúp mình tự tin xử lý bài test ứng tuyển. Chị Lý định hướng xây dựng portfolio cực kỳ bài bản và thuyết phục các hiring manager.",
        reviewText:
          "Bộ tài liệu thực tế và dataset từ các công ty kỳ lân giúp mình tự tin xử lý bài test ứng tuyển. Chị Lý định hướng xây dựng portfolio cực kỳ bài bản và thuyết phục các hiring manager.",
        avatarUrl: "/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png",
        isActive: true,
      },
      {
        id: "test-05",
        studentName: "Vũ Minh Quân",
        studentRole: "Financial Analyst",
        role: "Financial Analyst",
        company: "VNDIRECT",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "Từ người chỉ quen dùng Excel, mình đã tự tin viết các truy vấn SQL phân tích hàng triệu dòng giao dịch chứng khoán trong tích tắc. Thời gian trích xuất dữ liệu giảm từ 2 ngày xuống còn 15 phút.",
        reviewText:
          "Từ người chỉ quen dùng Excel, mình đã tự tin viết các truy vấn SQL phân tích hàng triệu dòng giao dịch chứng khoán trong tích tắc. Thời gian trích xuất dữ liệu giảm từ 2 ngày xuống còn 15 phút.",
        avatarUrl: "/assets/figma/fb2492c1b7d7c65a104edaa8e809cc8a5a19315f.png",
        isActive: true,
      },
      {
        id: "test-06",
        studentName: "Đỗ Khánh Linh",
        studentRole: "Commercial Analytics Specialist",
        role: "Commercial Analytics Specialist",
        company: "Unilever Vietnam",
        courseId: "data-analytical-thinking",
        rating: 5,
        comment:
          "Tư duy phân rã cây chỉ số (Metric Tree) và thiết kế Dashboard chuẩn Executive đã giúp các bài thuyết trình số liệu của mình với BGĐ trở nên cô đọng, sắc bén và ra được quyết định ngay lập tức.",
        reviewText:
          "Tư duy phân rã cây chỉ số (Metric Tree) và thiết kế Dashboard chuẩn Executive đã giúp các bài thuyết trình số liệu của mình với BGĐ trở nên cô đọng, sắc bén và ra được quyết định ngay lập tức.",
        avatarUrl: "/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png",
        isActive: true,
      },
    ];
  }
}
