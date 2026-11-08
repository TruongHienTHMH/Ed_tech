import { StudentProject } from "@/lib/cms/types";
import { Seeder } from "./types";

export class ProjectSeeder implements Seeder<StudentProject> {
  run(): StudentProject[] {
    return [
      {
        id: "proj-ecommerce-basket",
        projectId: "proj-ecommerce-basket",
        title: "Phân Tích Giỏ Hàng & Tối Ưu Cross-Selling E-Commerce",
        category: "E-Commerce",
        authorName: "Nguyễn Minh Anh (K7)",
        tools: ["SQL", "PostgreSQL", "Power BI"],
        toolsRaw: "SQL, PostgreSQL, Power BI",
        metrics: "Tăng 18% giá trị đơn hàng trung bình (AOV) nhờ đề xuất combo sản phẩm",
        imageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        sortOrder: 1,
        isActive: true,
      },
      {
        id: "proj-fintech-retention",
        projectId: "proj-fintech-retention",
        title: "Dự Đoán Rủi Ro Rời Bỏ (Churn) Ứng Dụng Thanh Toán Fintech",
        category: "Fintech",
        authorName: "Trần Quốc Bảo (K8)",
        tools: ["SQL", "Cohort Analysis", "Looker Studio"],
        toolsRaw: "SQL, Cohort Analysis, Looker Studio",
        metrics: "Giảm 12% tỷ lệ mất người dùng sau 30 ngày qua mô hình cảnh báo sớm",
        imageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        sortOrder: 2,
        isActive: true,
      },
      {
        id: "proj-retail-inventory",
        projectId: "proj-retail-inventory",
        title: "Tối Ưu Hóa Tồn Kho & Dự Báo Nhu Cầu Bán Lẻ Chuỗi Thời Trang",
        category: "Retail",
        authorName: "Lê Hoàng Yến (K9)",
        tools: ["SQL", "Excel Advanced", "Tableau"],
        toolsRaw: "SQL, Excel Advanced, Tableau",
        metrics: "Tiết kiệm 22% chi phí lưu kho và hạn chế tình trạng đứt hàng bán chạy",
        imageUrl: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
        sortOrder: 3,
        isActive: true,
      },
    ];
  }
}

