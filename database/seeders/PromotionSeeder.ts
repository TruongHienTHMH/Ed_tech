import { Promotion } from "@/lib/cms/types";
import { Seeder } from "./types";

export class PromotionSeeder implements Seeder<Promotion> {
  run(): Promotion[] {
    return [
      {
        id: "promo-early-bird",
        code: "EARLYBIRD",
        title: "Ưu Đãi Đăng Ký Sớm K10",
        discountType: "FIXED_VND",
        discountValue: 500000,
        startDate: "2026-10-01",
        endDate: "2026-12-31",
        applicableCourses: "ALL",
        badge: "Giảm 500.000đ",
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "promo-combo-special",
        code: "COMBODATA",
        title: "Ưu Đãi Trọn Bộ Combo Data Analyst",
        discountType: "FIXED_VND",
        discountValue: 1090000,
        startDate: "2026-10-01",
        endDate: "2026-12-31",
        applicableCourses: "end-to-end-analytics",
        badge: "Tiết Kiệm 1.090K",
        isActive: true,
        sortOrder: 2,
      },
    ];
  }
}

