"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { PackagePricing } from "@/lib/cms/types";
import { seedPackages } from "@/data/seed-data";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface ComboPricingSectionProps {
  packages?: PackagePricing[];
}

function resolveCourseIdFromPackage(pkg: PackagePricing): string {
  const text = `${pkg.packageId || ""} ${pkg.id || ""} ${pkg.name || ""}`.toLowerCase();
  if (text.includes("sql")) return "sql-for-data-analytics";
  if (text.includes("thinking") || text.includes("dashboard")) return "data-analytical-thinking";
  return "end-to-end-analytics";
}

export default function ComboPricingSection({ packages = seedPackages }: ComboPricingSectionProps) {
  const activePackages = packages && packages.length > 0 ? packages : seedPackages;

  // 1. Lọc các gói lẻ từ Google Sheets theo package_id chứa "single"
  const singlePackages = activePackages.filter((p) =>
    (p.packageId || p.id || "").toLowerCase().includes("single")
  );

  // 2. Lọc gói combo từ Google Sheets theo package_id chứa "combo" (hoặc isPopular)
  const comboPackage =
    activePackages.find((p) => (p.packageId || p.id || "").toLowerCase().includes("combo")) ||
    activePackages.find((p) => p.isPopular) ||
    activePackages[0];

  // Dữ liệu fallback hiển thị cho 2 thẻ đăng ký riêng lẻ nếu sheet chưa đủ gói single
  const displaySinglePackages =
    singlePackages.length >= 2
      ? singlePackages.slice(0, 2)
      : [
          singlePackages[0] || {
            id: "pkg-sql",
            packageId: "single-sql",
            name: "Khóa SQL for Data Analytics",
            featuresList: ["Làm quen với Database và SQL, xây dựng khả năng truy vấn, tổng hợp."],
            salePrice: 2990000,
          },
          singlePackages[1] || {
            id: "pkg-thinking",
            packageId: "single-thinking",
            name: "Khóa Data Analytical Thinking",
            featuresList: ["Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu."],
            salePrice: 3790000,
          },
        ];

  const originalPriceStr = comboPackage?.originalPrice
    ? `${comboPackage.originalPrice.toLocaleString("vi-VN")}VNĐ`
    : "6,780,000VNĐ";
  const finalPriceStr = comboPackage?.salePrice
    ? `${comboPackage.salePrice.toLocaleString("vi-VN")}VNĐ`
    : "5,690,000VNĐ";
  const savingsAmount =
    comboPackage && comboPackage.originalPrice && comboPackage.salePrice
      ? comboPackage.originalPrice - comboPackage.salePrice
      : 1080000;
  const savingsPercent =
    comboPackage && comboPackage.originalPrice && comboPackage.salePrice && comboPackage.originalPrice > comboPackage.salePrice
      ? Math.round((savingsAmount / comboPackage.originalPrice) * 100)
      : 16;

  return (
    <section id="combo-pricing" className="relative w-full bg-neutral-50/50 pt-16 lg:pt-24 pb-0 overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 lg:pb-20">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 lg:mb-16">

          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[46px] text-[#2E2E2E] mb-3 max-w-[800px]">
            Đầu tư thông minh cho sự nghiệp
          </h2>
          <p className="font-medium text-base sm:text-lg text-[#676767] max-w-[680px] leading-relaxed">
            Học trọn bộ 2 kỹ năng quan trọng nhất của một Data Analyst với mức chi phí tiết kiệm hơn so với đăng kí riêng lẻ từng kỹ năng.
          </p>
        </div>

        {/* 2-Column Comparison Grid (Figma Node 12:1180 & 12:1230 - 1:1 Ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-[1240px] mx-auto">
          {/* Card 1: Đăng kí riêng lẻ (Figma Node 12:1180) */}
          <div className="bg-white border-2 border-[#E9E9EC] rounded-[20px] p-6 sm:p-8 lg:p-9 shadow-sm flex flex-col justify-between h-full">
            <div>
              {/* Pill Header (Button 6) */}
              <div className="mb-5 sm:mb-6">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#784080] to-[#AF445A] text-white shadow-xs">
                  <span className="font-semibold text-base sm:text-[18px]">
                    Đăng kí riêng lẻ
                  </span>
                </div>
              </div>

              {/* 2 Separate Course Cards in 1 Row (Figma Frame 1000007460 / Node 12:1184 - Package ID: single-*) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {displaySinglePackages.map((pkg, idx) => {
                  const courseId = resolveCourseIdFromPackage(pkg);
                  return (
                    <div
                      key={pkg.id || idx}
                      className="border border-[#784080]/40 rounded-[12px] p-3.5 sm:p-4 lg:p-[18px] flex flex-col justify-between bg-white shadow-xs cursor-pointer hover:border-[#784080] transition-colors"
                      onClick={() =>
                        openLeadModal({
                          courseId,
                          ctaLocation: `combo_pricing_${courseId}`,
                        })
                      }
                    >
                      <div>
                        <h3 className="font-bold text-base sm:text-[18px] lg:text-[19px] text-[#2E2E2E] leading-snug mb-1">
                          {pkg.name}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-[#969696] font-medium leading-relaxed mb-3">
                          {pkg.featuresList?.[0] || "Làm quen và xây dựng năng lực phân tích dữ liệu thực chiến."}
                        </p>
                      </div>
                      <p className="font-bold text-base sm:text-lg lg:text-[20px] bg-gradient-to-r from-[#784080] to-[#AF445A] bg-clip-text text-transparent">
                        {pkg.salePrice ? `${pkg.salePrice.toLocaleString("vi-VN")}VNĐ` : "2,990,000VNĐ"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Divider Line phân chia giữa 2 khóa học và 4 điểm Pain Points */}
              <div className="h-px bg-[#E9E9EC] my-5 sm:my-6" />
            </div>

            {/* 4 Pain Points / Cons List (Figma Frame 1000007538) - Scaled vertically */}
            <div className="space-y-4 pb-2">
              {[
                "Tự tìm lộ trình phù hợp",
                "Kiến thức thiếu liên kết",
                "Chi phí cao hơn",
                "Mất thời gian tìm hiểu",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0">
                    <Image
                      src="/assets/decorations/verify.svg"
                      alt="icon"
                      width={26}
                      height={26}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[#34343C] text-sm sm:text-base font-medium">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: COMBO END-TO-END ANALYTICS (Figma Node 12:1230 & 12:1179) */}
          <div className="relative bg-gradient-to-r from-[#784080] to-[#AF445A] p-2 sm:p-2.5 rounded-[20px] shadow-2xl flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300 h-full">
            {/* Floating Sale Star Badge (Figma Node 12:1179 / 12:1268) */}
            <div className="absolute -top-5 -right-3 sm:-top-6 sm:-right-4 z-20 pointer-events-none select-none">
              <div className="relative w-[82px] h-[86px] sm:w-[92px] sm:h-[96px] flex items-center justify-center">
                <Image
                  src="/assets/figma/9f1a96eecae4b4f084d165577ecbd536619faec6.svg"
                  alt="Sale Star"
                  fill
                  sizes="96px"
                  className="object-contain drop-shadow-md"
                />
                <div className="relative z-10 flex flex-col items-center justify-center text-center font-heading font-extrabold text-[#2E2E2E] rotate-[10deg] leading-none pt-0.5">
                  <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-[#2E2E2E]">
                    TIẾT KIỆM
                  </span>
                  <span className="text-xs sm:text-[13px] font-black text-[#2E2E2E] mt-0.5">
                    {comboPackage?.badge?.includes("%") ? comboPackage.badge : `~${savingsPercent}%`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 pb-2 text-white">
              {/* Header inside gradient */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-2 bg-white rounded-full pl-3.5 pr-4 py-1.5 shadow-sm">
                  <Image
                    src="/assets/figma/ae7139e451fb9f873198b04a809e63e17fd7844b.png"
                    alt="Fire"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                  <span className="font-semibold text-base sm:text-[18px] bg-gradient-to-r from-[#784080] to-[#AF445A] bg-clip-text text-transparent">
                    Combo
                  </span>
                </div>
              </div>

              {/* Course Title and Price Box Row (Package ID: combo-*) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-bold text-2xl sm:text-[28px] leading-tight text-white mb-1.5">
                    {comboPackage?.name || "End-to-End Analytics with SQL & Dashboard Design"}
                  </h3>
                  <p className="text-white/80 text-base sm:text-lg font-medium">
                    {comboPackage?.badge && !comboPackage.badge.includes("%")
                      ? comboPackage.badge
                      : "2 khóa học hoàn chỉnh"}
                  </p>
                </div>

                {/* Price Box */}
                <div className="bg-white/16 border-[1.5px] border-white/20 rounded-[12px] px-4 py-2.5 flex flex-col items-start sm:items-end backdrop-blur-xs shrink-0">
                  <span className="line-through text-white/80 text-sm sm:text-base font-medium">
                    {originalPriceStr}
                  </span>
                  <span className="text-white font-bold text-xl sm:text-2xl tracking-tight">
                    {finalPriceStr}
                  </span>
                </div>
              </div>
            </div>

            {/* Inner White Body (Figma Frame 1000007453) */}
            <div className="bg-white rounded-[14px] p-6 sm:p-8 flex flex-col justify-between flex-1">
              <div className="space-y-3.5 mb-6">
                {(comboPackage?.featuresList && comboPackage.featuresList.length > 0
                  ? comboPackage.featuresList
                  : [
                      "Lộ trình được thiết kế sẵn",
                      "Nội dung nối tiếp mạch lạc",
                      `Tiết kiệm lên đến ${savingsAmount.toLocaleString("vi-VN")}vnđ`,
                      "Community với hơn 1,200+ members",
                      "Update nội dung miễn phí",
                    ]
                ).map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={24}
                      height={24}
                      className="shrink-0"
                    />
                    <span className="text-[#34343C] text-sm sm:text-base font-semibold">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() =>
                  openLeadModal({
                    courseId: "end-to-end-analytics",
                    ctaLocation: "combo_pricing_combo_button",
                  })
                }
                className="font-bold text-base sm:text-[18px] py-4 rounded-[8px] bg-gradient-to-r from-[#AF445A] to-[#784080] text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
              >
                Đăng kí combo ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
