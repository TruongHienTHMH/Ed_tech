import { Testimonial } from "@/lib/cms/types";
import { Seeder } from "./types";

export class TestimonialSeeder implements Seeder<Testimonial> {
  run(): Testimonial[] {
    return [
      {
        id: "testi-01",
        studentName: "Nguyen Van Huy",
        studentRole: "Khóa SQL for Data Analytics",
        role: "Khóa SQL for Data Analytics",
        company: "MoMo",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "I'm a Senior Data Analyst, I bridge the gap between raw datasets and strategic business intelligence.",
        reviewText:
          "I'm a Senior Data Analyst, I bridge the gap between raw datasets and strategic business intelligence.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-02",
        studentName: "Trần Mai Phương",
        studentRole: "Combo End-to-End Analytics",
        role: "Combo End-to-End Analytics",
        company: "MB Bank",
        courseId: "end-to-end-analytics",
        rating: 5,
        comment:
          "Khóa Combo End-to-End thực sự là bước ngoặt. Không chỉ dạy kỹ thuật viết code, chị Lý còn truyền cho mình tư duy bóc tách vấn đề MECE và cách nói chuyện với Stakeholder. Các buổi review bài tập 1-on-1 siêu chi tiết và tâm huyết.",
        reviewText:
          "Khóa Combo End-to-End thực sự là bước ngoặt. Không chỉ dạy kỹ thuật viết code, chị Lý còn truyền cho mình tư duy bóc tách vấn đề MECE và cách nói chuyện với Stakeholder. Các buổi review bài tập 1-on-1 siêu chi tiết và tâm huyết.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-03",
        studentName: "Nguyễn Hải Đăng",
        studentRole: "Khóa SQL for Data Analytics",
        role: "Khóa SQL for Data Analytics",
        company: "Shopee Vietnam",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "Trước đây mình rất sợ các câu lệnh và công thức phức tạp. Nhờ cách dạy trực quan theo từng tình huống kinh doanh của chị Lý, mình đã hiểu sâu bản chất JOIN, CTE và Window Function. Hiện tại mình đã pass vòng phỏng vấn DA tại Shopee!",
        reviewText:
          "Trước đây mình rất sợ các câu lệnh và công thức phức tạp. Nhờ cách dạy trực quan theo từng tình huống kinh doanh của chị Lý, mình đã hiểu sâu bản chất JOIN, CTE và Window Function. Hiện tại mình đã pass vòng phỏng vấn DA tại Shopee!",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-04",
        studentName: "Phạm Quốc Tuấn",
        studentRole: "Khóa Data Analytical Thinking",
        role: "Khóa Data Analytical Thinking",
        company: "Giao Hàng Nhanh (GHN)",
        courseId: "data-analytical-thinking",
        rating: 5,
        comment:
          "Khóa học giúp mình xóa bỏ tư duy làm báo cáo chay. Mình tự tay xây dựng được hệ thống Dashboard tự động cảnh báo đơn trễ và đo lường SLA giao hàng. Sếp khen ngợi và tăng lương ngay sau khi áp dụng vào thực tế.",
        reviewText:
          "Khóa học giúp mình xóa bỏ tư duy làm báo cáo chay. Mình tự tay xây dựng được hệ thống Dashboard tự động cảnh báo đơn trễ và đo lường SLA giao hàng. Sếp khen ngợi và tăng lương ngay sau khi áp dụng vào thực tế.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-05",
        studentName: "Lê Hoàng Yến",
        studentRole: "Combo End-to-End Analytics",
        role: "Combo End-to-End Analytics",
        company: "MoMo",
        courseId: "end-to-end-analytics",
        rating: 5,
        comment:
          "Bộ tài liệu thực tế và dataset từ các công ty kỳ lân giúp mình tự tin xử lý bài test ứng tuyển. Chị Lý định hướng xây dựng portfolio cực kỳ bài bản và thuyết phục các hiring manager.",
        reviewText:
          "Bộ tài liệu thực tế và dataset từ các công ty kỳ lân giúp mình tự tin xử lý bài test ứng tuyển. Chị Lý định hướng xây dựng portfolio cực kỳ bài bản và thuyết phục các hiring manager.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-06",
        studentName: "Vũ Minh Quân",
        studentRole: "Khóa SQL for Data Analytics",
        role: "Khóa SQL for Data Analytics",
        company: "VNDIRECT",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "Từ người chỉ quen dùng Excel, mình đã tự tin viết các truy vấn SQL phân tích hàng triệu dòng giao dịch chứng khoán trong tích tắc. Thời gian trích xuất dữ liệu giảm từ 2 ngày xuống còn 15 phút.",
        reviewText:
          "Từ người chỉ quen dùng Excel, mình đã tự tin viết các truy vấn SQL phân tích hàng triệu dòng giao dịch chứng khoán trong tích tắc. Thời gian trích xuất dữ liệu giảm từ 2 ngày xuống còn 15 phút.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-07",
        studentName: "Đỗ Khánh Linh",
        studentRole: "Khóa Data Analytical Thinking",
        role: "Khóa Data Analytical Thinking",
        company: "Unilever Vietnam",
        courseId: "data-analytical-thinking",
        rating: 5,
        comment:
          "Tư duy phân rã cây chỉ số (Metric Tree) và thiết kế Dashboard chuẩn Executive đã giúp các bài thuyết trình số liệu của mình với BGĐ trở nên cô đọng, sắc bén và ra được quyết định ngay lập tức.",
        reviewText:
          "Tư duy phân rã cây chỉ số (Metric Tree) và thiết kế Dashboard chuẩn Executive đã giúp các bài thuyết trình số liệu của mình với BGĐ trở nên cô đọng, sắc bén và ra được quyết định ngay lập tức.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-08",
        studentName: "Trần Minh Anh",
        studentRole: "Khóa Data Analytical Thinking",
        role: "Khóa Data Analytical Thinking",
        company: "Tiki",
        courseId: "data-analytical-thinking",
        rating: 5,
        comment:
          "Tư duy phân tích số liệu của chị Ly thực sự mở mang góc nhìn của mình. Mình học được cách đặt câu hỏi 'Tại sao số này giảm?' và biến số liệu thô thành đề xuất tăng doanh thu.",
        reviewText:
          "Tư duy phân tích số liệu của chị Ly thực sự mở mang góc nhìn của mình. Mình học được cách đặt câu hỏi 'Tại sao số này giảm?' và biến số liệu thô thành đề xuất tăng doanh thu.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
      {
        id: "testi-09",
        studentName: "Hoàng Gia Bảo",
        studentRole: "Khóa SQL for Data Analytics",
        role: "Khóa SQL for Data Analytics",
        company: "ACB Bank",
        courseId: "sql-for-data-analytics",
        rating: 5,
        comment:
          "Cách cô Ly truyền đạt rất logic, dễ hiểu ngay cả với người mới bắt đầu. Các case study về ngành ngân hàng và thanh toán điện tử bám sát thực tế công việc hàng ngày.",
        reviewText:
          "Cách cô Ly truyền đạt rất logic, dễ hiểu ngay cả với người mới bắt đầu. Các case study về ngành ngân hàng và thanh toán điện tử bám sát thực tế công việc hàng ngày.",
        avatarUrl: "/assets/mentor/icon-student-primary.svg",
        isActive: true,
      },
    ];
  }
}
