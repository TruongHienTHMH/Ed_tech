import { Mentor } from "@/lib/cms/types";
import { Seeder } from "./types";

export class MentorSeeder implements Seeder<Mentor> {
  run(): Mentor[] {
    return [
      {
        id: "hua-thao-ly",
        name: "Hứa Thảo Lý",
        role: "Founder LYDATA & Senior Data Analyst",
        title: "Founder LYDATA • Senior Data Analyst @ MoMo • Former Tiki, ACB",
        bio: "Với hơn 5+ năm kinh nghiệm làm việc trong lĩnh vực Data Analytics (Senior Data Analyst @ MoMo, Former Data Analyst @ Tiki, Former Data Analyst @ ACB) và từng là Quán quân E!Contest FTU2, Á quân Innovation Contest MoMo, Á quân GenAI MiMir Master, mình đã đồng hành cùng hơn 200+ học viên chuyển ngành và nâng cao năng lực phân tích dữ liệu ứng dụng thực chiến.",
        avatarUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        companies: ["MoMo", "Tiki", "ACB"],
        companiesWorked: "MoMo, Tiki, ACB",
        linkedinUrl: "https://www.facebook.com/profile.php?id=61594436940087",
        experienceYears: 5,
        isActive: true,
      },
    ];
  }
}
