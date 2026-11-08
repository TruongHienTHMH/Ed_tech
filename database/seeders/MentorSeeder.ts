import { Mentor } from "@/lib/cms/types";
import { Seeder } from "./types";

export class MentorSeeder implements Seeder<Mentor> {
  run(): Mentor[] {
    return [
      {
        id: "hua-thao-ly",
        name: "Hứa Thảo Ly",
        role: "Founder Lydata & Senior Data Analyst",
        title: "Founder Lydata • Ex-Senior DA MoMo, Tiki, ACB",
        bio: "Xin chào, mình là Lý - Founder của Lydata. Với hơn 6+ năm kinh nghiệm làm việc trong lĩnh vực Data Analytics tại các tập đoàn và kỳ lân công nghệ hàng đầu như MoMo, Tiki, ACB Bank, mình đã đồng hành cùng hơn 1,000+ học viên chuyển ngành và nâng cao năng lực phân tích dữ liệu ứng dụng thực chiến.",
        avatarUrl: "/assets/figma/da527ba5696d5b94f6f71aebe984b901fc46d929.png",
        companies: ["MoMo", "Tiki", "ACB Bank"],
        companiesWorked: "MoMo, Tiki, ACB Bank",
        linkedinUrl: "https://linkedin.com",
        experienceYears: 6,
        isActive: true,
      },
    ];
  }
}

