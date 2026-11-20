"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, X } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { PackagePricing } from "@/lib/cms/types";
import { seedPackages } from "@/data/seed-data";

interface ComboPricingSectionProps {
  packages?: PackagePricing[];
}

export default function ComboPricingSection({ packages = seedPackages }: ComboPricingSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Combo End-to-End Analytics");
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activePackages = packages && packages.length > 0 ? packages : seedPackages;
  const comboPackage = activePackages.find((p) => p.isPopular) || activePackages[0];
  const originalPriceStr = comboPackage?.originalPrice
    ? `${comboPackage.originalPrice.toLocaleString("vi-VN")}VNĐ`
    : "6,780,000VNĐ";
  const finalPriceStr = comboPackage?.salePrice
    ? `${comboPackage.salePrice.toLocaleString("vi-VN")}VNĐ`
    : "5,690,000VNĐ";
  const savingsAmount = comboPackage && comboPackage.originalPrice && comboPackage.salePrice
    ? comboPackage.originalPrice - comboPackage.salePrice
    : 1080000;

  const handleOpenRegister = (planName: string) => {
    setSelectedPlan(planName);
    setModalOpen(true);
    setSuccess(false);
    setErrorMessage(null);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      setErrorMessage("Vui lòng điền họ tên và số điện thoại.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const submissionId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submissionId,
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          phone: leadForm.phone.trim(),
          course_id: selectedPlan.toLowerCase().includes("combo")
            ? "end-to-end-analytics"
            : "sql-for-data-analytics",
          course_name: selectedPlan,
          form_id: "combo_pricing_card",
          cta_id: "combo_register_button",
          client_submitted_at: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSuccess(true);
      } else {
        setErrorMessage(
          data?.error?.message || "Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại."
        );
      }
    } catch {
      setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="combo-pricing" className="relative w-full bg-neutral-50/50 pt-16 lg:pt-24 pb-0 overflow-hidden">
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

              {/* 2 Separate Course Cards in 1 Row (Figma Frame 1000007460 / Node 12:1184 - 504 Fill x 217 Hug) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Course 1: SQL for Data Analytics */}
                <div className="border border-[#784080]/40 rounded-[12px] p-3.5 sm:p-4 lg:p-[18px] flex flex-col justify-between bg-white shadow-xs">
                  <div>
                    <h3 className="font-bold text-base sm:text-[18px] lg:text-[19px] text-[#2E2E2E] leading-snug mb-1">
                      Khóa SQL for Data Analytics
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#969696] font-medium leading-relaxed mb-3">
                      Làm quen với Database và SQL, xây dựng khả năng truy vấn, tổng hợp.
                    </p>
                  </div>
                  <p className="font-bold text-base sm:text-lg lg:text-[20px] bg-gradient-to-r from-[#784080] to-[#AF445A] bg-clip-text text-transparent">
                    2,990,000VNĐ
                  </p>
                </div>

                {/* Course 2: Data Analytical Thinking */}
                <div className="border border-[#784080]/40 rounded-[12px] p-3.5 sm:p-4 lg:p-[18px] flex flex-col justify-between bg-white shadow-xs">
                  <div>
                    <h3 className="font-bold text-base sm:text-[18px] lg:text-[19px] text-[#2E2E2E] leading-snug mb-1">
                      Khóa Data Analytical Thinking
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#969696] font-medium leading-relaxed mb-3">
                      Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu.
                    </p>
                  </div>
                  <p className="font-bold text-base sm:text-lg lg:text-[20px] bg-gradient-to-r from-[#784080] to-[#AF445A] bg-clip-text text-transparent">
                    3,790,000VNĐ
                  </p>
                </div>
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
                      src="/assets/figma/427717fb616f6e486ff78a45ffe62b030a5012e7.svg"
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
                    ~16%
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

              {/* Course Title and Price Box Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-bold text-2xl sm:text-[28px] leading-tight text-white mb-1.5">
                    End-to-End Analytics with SQL & Dashboard
                  </h3>
                  <p className="text-white/80 text-base sm:text-lg font-medium">
                    2 khóa học hoàn chỉnh
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
                {[
                  "Lộ trình được thiết kế sẵn",
                  "Nội dung nối tiếp mạch lạc",
                  `Tiết kiệm lên đến ${savingsAmount.toLocaleString("vi-VN")}vnđ`,
                  "Community với hơn 1,200+ members",
                  "Update nội dung miễn phí",
                ].map((benefit, i) => (
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
                onClick={() => handleOpenRegister("Combo End-to-End Analytics")}
                className="font-bold text-base sm:text-[18px] py-4 rounded-[8px] bg-gradient-to-r from-[#AF445A] to-[#784080] text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
              >
                Đăng kí combo ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Separation Banner into BlogSection (Figma Node 12:891 / Rectangle 1577) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-upper.svg"
          alt="Section Separation Banner"
          width={1920}
          height={50}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Registration Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Đăng ký thành công!</h3>
                <p className="text-sm text-neutral-600 mb-6">
                  Đội ngũ Ly Data sẽ liên hệ với bạn qua Zalo/Điện thoại trong vòng 15 phút để hỗ trợ hoàn tất lộ trình học.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setModalOpen(false)}
                  className="font-semibold"
                >
                  Hoàn tất
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-1">Đăng ký tư vấn khóa học</h3>
                <p className="text-sm text-neutral-500 mb-5">
                  Gói đã chọn: <strong className="text-[#AF445A]">{selectedPlan}</strong>
                </p>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A] focus:ring-1 focus:ring-[#AF445A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Số điện thoại / Zalo</label>
                    <input
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A] focus:ring-1 focus:ring-[#AF445A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email nhận tài liệu</label>
                    <input
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      placeholder="email@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A] focus:ring-1 focus:ring-[#AF445A]"
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg font-medium">{errorMessage}</p>
                  )}

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={isSubmitting}
                      className="font-bold text-sm sm:text-base py-3"
                    >
                      Gửi thông tin đăng ký
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
