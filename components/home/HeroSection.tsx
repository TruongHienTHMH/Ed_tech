"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "@/components/common/Icons";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function HeroSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openLeadModal({
      ctaLocation: "hero_quick_signup",
      courseId: "sql-for-data-analytics",
    });
  };

  return (
    <section className="relative w-full bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#AF445A]/5 via-[#784080]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <p className="font-medium text-xs sm:text-sm lg:text-base tracking-[1.08px] text-[#676767] uppercase mb-3">
          ONLINE DATA ANALYTICS COURSE
        </p>

        {/* Main Headline */}
        <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-[68px] leading-tight lg:leading-[74px] tracking-tight lg:tracking-[-2.72px] text-[#252525] max-w-[860px] mb-4">
          Học Data Analytics từ{" "}
          <span className="text-brand-gradient">tư duy đến thực hành.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#676767] max-w-[650px] mb-8 font-normal">
          Lộ trình bài bản từ cơ bản đến nâng cao, dự án thực tế, hỗ trợ tận tâm cùng Mentor Hứa Thảo Ly.
        </p>

        {/* Email Capture Box */}
        <div className="w-full max-w-[400px] mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-white text-sm text-[#252525] placeholder:text-neutral-400 focus:outline-none focus:border-[#AF445A] focus:ring-2 focus:ring-[#AF445A]/20 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-brand-gradient hover:opacity-95 text-white font-semibold text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Khám phá các khóa học & Tư vấn 1:1</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-[#969696] leading-relaxed">
              Bằng việc tiếp tục, bạn đồng ý với Điều khoản và Chính sách bảo mật của chúng tôi.
            </p>
          </form>
        </div>

        {/* Social Proof & Rating Stack */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
          {/* Overlapping Avatars */}
          <div className="flex -space-x-3 items-center">
            <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <Image
                src="/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png"
                alt="Student avatar 1"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <Image
                src="/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png"
                alt="Student avatar 2"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <Image
                src="/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png"
                alt="Student avatar 3"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="relative w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <Image
                src="/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png"
                alt="Student avatar 4"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="relative w-11 h-11 rounded-full border-2 border-white bg-brand-gradient text-white flex items-center justify-center font-bold text-xs shadow-sm">
              500+
            </div>
          </div>

          {/* Stars & Text */}
          <div className="flex flex-col items-center sm:items-start text-left">
            <div className="flex items-center gap-1">
              <Image src="/assets/figma/9eb6b22f5c81a72b2a90e105fc53b2ba16eb1bf4.svg" alt="star" width={18} height={18} />
              <Image src="/assets/figma/d9c6ca87acaa4467665d47731de04dda988842eb.svg" alt="star" width={18} height={18} />
              <Image src="/assets/figma/1009d81a82644fe92f9059e7792d4b2dd46eaab7.svg" alt="star" width={18} height={18} />
              <Image src="/assets/figma/62e0189d2523908b33efb81df87265ba9570cefd.svg" alt="star" width={18} height={18} />
              <Image src="/assets/figma/edb6a531a1489b04b7637b5ada8d4ab1d2695717.svg" alt="star" width={18} height={18} />
              <span className="ml-1 text-sm font-bold text-[#252525]">(5.0/5)</span>
            </div>
            <p className="text-sm font-medium text-[#252525] mt-0.5">
              500+ học viên đã tham gia & hài lòng
            </p>
          </div>
        </div>

        {/* Tech Stack Bar (SQL, Google Sheet, Data Studio, Power BI, Python) */}
        <div className="w-full pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12 opacity-85">
          {/* SQL */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/figma/52f212ce1d5856de39c345a5483b7fbbe1e9712b.svg"
              alt="SQL"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-semibold text-sm sm:text-base text-[#252525]">SQL</span>
          </div>

          {/* Google Sheet */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/figma/72ec619ff8b3151dbee655baadb01afaf522ea4d.svg"
              alt="Google Sheet"
              width={24}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-semibold text-sm sm:text-base text-[#252525]">Google Sheet</span>
          </div>

          {/* Data Studio */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/figma/d6fbd1298a91240247b0a088b0f1da19e38dcbd4.png"
              alt="Data Studio"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-semibold text-sm sm:text-base text-[#252525]">Data Studio</span>
          </div>

          {/* Power BI */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/figma/8263b1f1b457ebc83e9a52d57ea805c7651a93d3.svg"
              alt="Power BI"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-semibold text-sm sm:text-base text-[#252525]">Power BI</span>
          </div>

          {/* Python */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/figma/ed3ca1377cb8b78d00124c758fb07f7f3e4b96b3.svg"
              alt="Python"
              width={28}
              height={28}
              className="h-7 w-auto object-contain"
              style={{ width: "auto" }}
            />
            <span className="font-semibold text-sm sm:text-base text-[#252525]">Python</span>
          </div>
        </div>
      </div>
    </section>
  );
}
