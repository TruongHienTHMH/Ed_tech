import { PackagePricing } from "@/lib/cms/types";
import { Seeder } from "./types";

export class PackageSeeder implements Seeder<PackagePricing> {
  run(): PackagePricing[] {
    return [
      {
        id: "pkg-combo-full",
        packageId: "combo-end-to-end",
        name: "Combo End-to-End Analytics (SQL + Thinking + BI)",
        originalPrice: 6780000,
        salePrice: 5690000,
        badge: "Tiết Kiệm 1.080.000đ",
        featuresList: [
          "Trọn bộ 2 khóa học: SQL Thực Chiến + Data Thinking",
          "Tổng cộng 25 buổi học trực tiếp (Live Online)",
          "Thực hành trên 2 dự án doanh nghiệp lớn (E-commerce & Fintech)",
          "1 Dự án tốt nghiệp Capstone hoàn chỉnh cho Portfolio",
          "Mentor review code & bài tập 1-on-1 hàng tuần",
          "Tham gia cộng đồng Alumni Data & hỗ trợ CV trọn đời",
        ],
        isPopular: true,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "pkg-sql-only",
        packageId: "single-sql",
        name: "Khóa Lẻ: SQL for Data Analytics",
        originalPrice: 3500000,
        salePrice: 2990000,
        badge: "Ưu Đãi Sớm",
        featuresList: [
          "12 buổi học chuyên sâu về cơ sở dữ liệu và truy vấn SQL (2 buổi/tuần)",
          "Thực hành với hệ quản trị PostgreSQL / MySQL",
          "2 bài thực hành lớn (Hands-on Labs) có Mentor chấm điểm",
          "Định hướng nghề nghiệp và tối ưu hồ sơ ứng tuyển",
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "pkg-thinking-only",
        packageId: "single-thinking",
        name: "Khóa Lẻ: Analytical Thinking & Dashboard Design",
        originalPrice: 4500000,
        salePrice: 3790000,
        badge: "Chuyên Sâu",
        featuresList: [
          "16 buổi học tư duy giải quyết vấn đề kinh doanh và thiết kế Dashboard",
          "Xây dựng cây chỉ số Metrics Tree, mô hình Cohort, RFM",
          "Thiết kế Dashboard báo cáo điều hành chuyên nghiệp với Data Studio",
          "Thực hành tư vấn chiến lược cho doanh nghiệp giả lập",
        ],
        isPopular: false,
        isActive: true,
        sortOrder: 3,
      },
    ];
  }
}

