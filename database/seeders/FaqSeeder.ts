import { FAQ } from "@/lib/cms/types";
import { Seeder } from "./types";

export class FaqSeeder implements Seeder<FAQ> {
  run(): FAQ[] {
    return [
      {
        id: "faq-01",
        question: "Mình chưa từng học lập trình hoặc học khối ngành kinh tế có theo được không?",
        answer:
          "Hoàn toàn được! Lộ trình được thiết kế đặc biệt dành cho người mới bắt đầu từ con số 0. Giảng viên sẽ hướng dẫn từ tư duy dữ liệu cơ bản, cài đặt công cụ từng bước và thực hành trực tiếp qua các tình huống kinh doanh thực tế.",
        category: "General",
        sortOrder: 1,
        isActive: true,
      },
      {
        id: "faq-02",
        question: "Hình thức học và thời gian học như thế nào?",
        answer:
          "Khóa học diễn ra trực tiếp qua Zoom Meeting vào các buổi tối trong tuần (19h30 - 21h30). Mỗi buổi học đều có video record chất lượng cao và tài liệu bài giảng được gửi lại sau buổi học để học viên xem lại bất kỳ lúc nào.",
        category: "Learning Format",
        sortOrder: 2,
        isActive: true,
      },
      {
        id: "faq-03",
        question: "Học viên có được hỗ trợ sau khi kết thúc khóa học không?",
        answer:
          "Có! Học viên được tham gia cộng đồng Alumni Data trọn đời, được hỗ trợ giải đáp thắc mắc công việc thực tế, review CV/Portfolio xin việc và kết nối cơ hội tuyển dụng từ mạng lưới đối tác của Lydata.",
        category: "Support",
        sortOrder: 3,
        isActive: true,
      },
      {
        id: "faq-04",
        question: "Chính sách bảo lưu và hoàn học phí như thế nào?",
        answer:
          "Học viên được hỗ trợ bảo lưu khóa học tối đa 06 tháng khi có việc bận đột xuất. Nếu sau 02 buổi học đầu tiên cảm thấy chưa phù hợp, bạn được quyền yêu cầu hoàn lại 100% học phí mà không cần bất kỳ thủ tục phức tạp nào.",
        category: "Policy",
        sortOrder: 4,
        isActive: true,
      },
    ];
  }
}

