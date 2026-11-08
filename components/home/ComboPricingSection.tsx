"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, X, ArrowRight } from "@/components/common/Icons";
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
  const savingsStr = `Tiết kiệm ${savingsAmount.toLocaleString("vi-VN")}vnđ`;

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
    <section id="combo-pricing" className="relative w-full bg-neutral-50/50 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[46px] text-[#2E2E2E] mb-3 max-w-[800px]">
            Đầu tư thông minh cho sự nghiệp
          </h2>
          <p className="font-medium text-base sm:text-lg text-[#676767] max-w-[620px] leading-relaxed">
            Học trọn bộ 2 kỹ năng quan trọng nhất của một Data Analyst với mức chi phí tiết kiệm hơn so với đăng kí riêng lẻ từng kỹ năng.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-[1100px] mx-auto">
          {/* Column 1: Đăng kí riêng lẻ (Standard / Unbundled) */}
          <div className="lg:col-span-6 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              {/* Pill Header */}
              <div className="mb-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-brand-gradient-reverse text-white font-semibold text-sm">
                  Đăng kí riêng lẻ
                </span>
              </div>

              {/* 2 Separate Course Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Course 1 */}
                <div className="border border-[#784080]/30 rounded-xl p-4 flex flex-col justify-between bg-neutral-50/50">
                  <div>
                    <h3 className="font-bold text-base text-[#2E2E2E] mb-1">
                      Khóa SQL for Data Analytics
                    </h3>
                    <p className="text-xs text-[#969696] mb-3 line-clamp-2">
                      Làm quen với Database và SQL, xây dựng khả năng truy vấn.
                    </p>
                  </div>
                  <p className="font-bold text-lg text-brand-gradient">
                    2,990,000VNĐ
                  </p>
                </div>

                {/* Course 2 */}
                <div className="border border-[#784080]/30 rounded-xl p-4 flex flex-col justify-between bg-neutral-50/50">
                  <div>
                    <h3 className="font-bold text-base text-[#2E2E2E] mb-1">
                      Khóa Data Analytical Thinking
                    </h3>
                    <p className="text-xs text-[#969696] mb-3 line-clamp-2">
                      Học cách xác định vấn đề, lựa chọn metrics, phân tích dữ liệu.
                    </p>
                  </div>
                  <p className="font-bold text-lg text-brand-gradient">
                    3,790,000VNĐ
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-200 my-6" />

              {/* Cons / Limitations */}
              <div className="space-y-3.5 mb-8">
                <div className="flex items-center gap-3 text-sm text-[#34343C]">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <span>Tự tìm lộ trình phù hợp</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#34343C]">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <span>Kiến thức thiếu liên kết</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#34343C]">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <span>Chi phí cao hơn (Tổng 6,780,000VNĐ)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#34343C]">
                  <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <span>Mất thời gian tìm hiểu</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenRegister("Đăng kí riêng lẻ")}
              className="w-full py-3 rounded-lg border border-neutral-300 text-neutral-700 font-semibold text-sm hover:bg-neutral-50 transition-colors"
            >
              Chọn đăng kí riêng lẻ
            </button>
          </div>

          {/* Column 2: COMBO END-TO-END ANALYTICS (Featured Pro Card) */}
          <div className="lg:col-span-6 relative bg-brand-gradient p-1 rounded-2xl shadow-2xl flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300">
            {/* Top Savings Badge Floating */}
            <div className="absolute -top-4 -right-2 sm:-right-4 z-20 flex items-center justify-center">
              <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src="/assets/figma/9f1a96eecae4b4f084d165577ecbd536619faec6.svg"
                  alt="Savings Star"
                  fill
                  sizes="96px"
                  className="object-contain drop-shadow-lg"
                />
                <div className="relative text-center font-bold text-[#2E2E2E] leading-tight rotate-12">
                  <span className="block text-[10px] sm:text-[11px] uppercase tracking-wider">TIẾT KIỆM</span>
                  <span className="block text-sm sm:text-base font-extrabold text-[#784080]">~16%</span>
                </div>
              </div>
            </div>

            {/* Inner Content Box */}
            <div className="flex flex-col h-full bg-transparent p-5 sm:p-7 text-white">
              {/* Header inside gradient */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-1.5 shadow-sm">
                  <Image
                    src="/assets/figma/ae7139e451fb9f873198b04a809e63e17fd7844b.png"
                    alt="Fire hot"
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  <span className="font-bold text-xs text-brand-gradient uppercase">Combo</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1">
                  End-to-End Analytics with SQL & Dashboard
                </h3>
                <p className="text-white/80 text-sm">2 khóa học hoàn chỉnh trong 1 lộ trình</p>
              </div>

              {/* Price Row */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-4 flex items-baseline justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs text-white/75 block">Giá gốc 2 khóa:</span>
                  <span className="line-through text-white/70 text-sm font-medium">{originalPriceStr}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#FFC934] font-semibold block uppercase">Ưu đãi trọn gói:</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{finalPriceStr}</span>
                </div>
              </div>

              {/* White Section with Benefits */}
              <div className="bg-white rounded-xl p-5 sm:p-6 text-[#34343C] flex-1 flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={22}
                      height={22}
                      className="shrink-0"
                    />
                    <span>Lộ trình được thiết kế sẵn từ A-Z</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={22}
                      height={22}
                      className="shrink-0"
                    />
                    <span>Nội dung nối tiếp mạch lạc thực chiến</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-semibold text-[#AF445A]">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={22}
                      height={22}
                      className="shrink-0"
                    />
                    <span>{savingsStr}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={22}
                      height={22}
                      className="shrink-0"
                    />
                    <span>Community với hơn 1,200+ members</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Image
                      src="/assets/figma/bb89cec2b7cc67e662e0f2532b951f267ce166fe.svg"
                      alt="check"
                      width={22}
                      height={22}
                      className="shrink-0"
                    />
                    <span>Update nội dung kiến thức trọn đời</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenRegister("Combo End-to-End Analytics")}
                  className="w-full py-4 bg-brand-gradient hover:opacity-95 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Đăng kí combo ngay</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
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
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-full py-3 bg-brand-gradient text-white font-semibold rounded-xl"
                >
                  Hoàn tất
                </button>
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
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A]"
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
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A]"
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
                      className="w-full px-3.5 py-2.5 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:border-[#AF445A]"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-brand-gradient text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all mt-4 disabled:opacity-60"
                  >
                    {isSubmitting ? "Đang gửi đăng ký..." : "Gửi thông tin nhận ưu đãi"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
