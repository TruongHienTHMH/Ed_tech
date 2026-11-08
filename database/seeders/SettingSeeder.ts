import { SystemSettings, TrustMetric } from "@/lib/cms/types";
import { Seeder } from "./types";

export class SettingSeeder implements Seeder<SystemSettings> {
  run(): SystemSettings {
    return {
      hotline: "(+84) 934 938 431",
      zaloUrl: "https://zalo.me/0934938431",
      contactEmail: "vietds@gmail.com",
      announcementBar: "🎉 Khai giảng khóa mới ngày 26 tháng 10, 2026 - Giảm ngay 500.000đ khi đăng ký sớm!",
      revalidationUrl: "/api/revalidate",
    };
  }

  getTrustMetrics(): TrustMetric[] {
    return [
      { metricKey: "students_enrolled", numberDisplay: "1,000+", label: "Học viên tốt nghiệp", iconName: "Users", isActive: true, sortOrder: 1 },
      { metricKey: "employment_rate", numberDisplay: "92%", label: "Có việc làm trong 3 tháng", iconName: "Briefcase", isActive: true, sortOrder: 2 },
      { metricKey: "average_rating", numberDisplay: "4.8/5", label: "Đánh giá hài lòng từ học viên", iconName: "Star", isActive: true, sortOrder: 3 },
      { metricKey: "partner_companies", numberDisplay: "30+", label: "Doanh nghiệp đối tác tuyển dụng", iconName: "Building", isActive: true, sortOrder: 4 },
    ];
  }
}
