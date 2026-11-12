"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, X, ArrowRight } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
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
          <div className="mb-3">
            <Badge variant="tag" size="md">
              BẢNG GIÁ & ƯU ĐÃI
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[46px] text-[#2E2E2E] mb-3 max-w-[800px]">
            Đầu tư thông minh cho sự nghiệp
          </h2>
          <p className="font-medium text-base sm:text-lg text-[#676767] max-w-[680px] leading-relaxed">
            Kết hợp SQL và Analytical Thinking &amp; Dashboard trong một lộ trình xuyên suốt, giúp bạn xây dựng nền tảng Data Analytics có hệ thống và tiết kiệm hơn so với đăng ký từng khóa riêng lẻ.
          </p>
        </div>

        {/* 2-Column Comparison Grid (Figma Node 12:1175) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-[1100px] mx-auto">
          {/* Column 1: Đăng kí riêng lẻ (Unbundled Card: 5 columns) */}
          <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              {/* Pill Header */}
              <div className="mb-6">
                <Badge variant="level" size="md" className="bg-neutral-100 text-neutral-700 border-neutral-200">
                  Đăng kí riêng lẻ
                </Badge>
              </div>

              {/* 2 Separate Course Cards */}
              <div className="flex flex-col gap-3.5 mb-6">
                {/* Course 1 */}
                <div className="border border-neutral-200/80 rounded-2xl p-4 flex flex-col justify-between bg-neutral-50/70">
                  <div>
                    <h3 className="font-bold text-base text-[#2E2E2E] mb-1">
                      Khóa SQL for Data Analytics
                    </h3>
                    <p className="text-xs text-neutral-500 mb-2.5 line-clamp-2">
                      Làm quen với Database và SQL, xây dựng khả năng truy vấn dữ liệu thực tế.
                    </p>
                  </div>
                  <p className="font-bold text-base sm:text-lg text-[#AF445A]">
                    2,990,000VNĐ
                  </p>
                </div>

                {/* Course 2 */}
                <div className="border border-neutral-200/80 rounded-2xl p-4 flex flex-col justify-between bg-neutral-50/70">
                  <div>
                    <h3 className="font-bold text-base text-[#2E2E2E] mb-1">
                      Analytical Thinking & Dashboard
                    </h3>
                    <p className="text-xs text-neutral-500 mb-2.5 line-clamp-2">
                      Tư duy xác định vấn đề, lựa chọn metrics, thiết kế Dashboard ra quyết định.
                    </p>
                  </div>
                  <p className="font-bold text-base sm:text-lg text-[#AF445A]">
                    3,790,000VNĐ
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-200 my-6" />

              {/* Features / Fit */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-sm text-[#34343C]">
                  <div className="w-2 h-2 rounded-full bg-[#AF445A]/70 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">
                    Phù hợp nếu bạn muốn tập trung vào một nhóm kỹ năng hoặc đã có nền tảng trước đó.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm text-[#34343C]">
                  <div className="w-2 h-2 rounded-full bg-[#AF445A]/70 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-semibold text-[#AF445A]">
                    Chi phí cao hơn (Tổng 6.780.000VNĐ)
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleOpenRegister("Đăng kí riêng lẻ")}
              className="border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100 font-semibold text-sm"
            >
              Chọn đăng kí riêng lẻ
            </Button>
          </div>

          {/* Column 2: COMBO END-TO-END ANALYTICS (Featured Pro Card: 7 columns) */}
          <div className="lg:col-span-7 relative bg-brand-gradient p-1 rounded-3xl shadow-2xl flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300">
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
            <div className="flex flex-col h-full bg-transparent p-6 sm:p-8 text-white">
              {/* Header inside gradient */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="gold" size="sm" className="bg-white/95 text-[#AF445A] font-bold uppercase shadow-sm">
                  Combo Nổi Bật
                </Badge>
                <Badge variant="discount" size="sm">
                  Tiết kiệm 1,080,000VNĐ
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-1.5">
                  End-to-End Analytics with SQL & Dashboard
                </h3>
                <p className="text-white/85 text-sm sm:text-base">2 khóa học hoàn chỉnh trong 1 lộ trình đào tạo khép kín</p>
              </div>

              {/* Price Row */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 sm:p-5 flex items-baseline justify-between gap-4 mb-6">
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
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-[#34343C] flex-1 flex flex-col justify-between">
                <div className="space-y-3.5 mb-6">
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
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconRight={<ArrowRight className="w-5 h-5" />}
                  onClick={() => handleOpenRegister("Combo End-to-End Analytics")}
                  className="font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-xl"
                >
                  Đăng kí combo ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
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
