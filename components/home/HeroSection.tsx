"use client";

import React, { useState } from "react";
import Image from "next/image";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function HeroSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openLeadModal({
      ctaLocation: "hero_quick_signup",
      initialEmail: email,
      courseId: "sql-for-data-analytics",
    });
  };

  return (
    <section className="relative w-full bg-white pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden">
      {/* Left Artwork (Figma Node 12:702 - Hidden on Mobile/Tablet to keep view clean & centered) */}
      <div className="hidden xl:block absolute left-0 xl:-left-8 2xl:left-0 top-1/2 -translate-y-1/2 w-[300px] xl:w-[350px] 2xl:w-[420px] pointer-events-none select-none z-10">
        <Image
          src="/assets/decorations/hero-left-artwork.png"
          alt="Data Analytics Team Work Illustration"
          width={980}
          height={1120}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Right Artwork (Figma Node 12:708 - Clean 3D Laptop & Charts, Hidden on Mobile/Tablet) */}
      <div className="hidden xl:block absolute right-0 xl:-right-8 2xl:right-0 top-1/2 -translate-y-1/2 w-[280px] xl:w-[330px] 2xl:w-[390px] pointer-events-none select-none z-10">
        <Image
          src="/assets/decorations/hero-right-artwork.png"
          alt="3D Analytics Dashboard & Tech Illustration"
          width={803}
          height={1120}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Central Content Area - Perfectly Centered & Spaced */}
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-20">
        {/* Eyebrow text */}
        <p className="text-[#676767] tracking-[1.5px] text-xs sm:text-sm uppercase font-medium mb-3">
          ONLINE DATA ANALYTICS COURSE
        </p>

        {/* Main Headline - Balanced typography across all screens */}
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl xl:text-[56px] 2xl:text-[62px] leading-tight xl:leading-[66px] text-[#252525] max-w-[800px] mb-4">
          Học Data Analytics từ tư duy đến thực hành.
        </h1>

        {/* Subtitle */}
        <p className="text-[#676767] text-base sm:text-lg max-w-[620px] mb-8 font-normal leading-relaxed">
          Lộ trình bài bản từ cơ bản đến nâng cao, dự án thực tế, hỗ trợ tận tâm
        </p>

        {/* Email Capture & CTA Form */}
        <div className="w-full max-w-[420px] mb-8 sm:mb-10">
          <form onSubmit={handleSubmit} className="w-full">
            <label
              htmlFor="hero-email"
              className="text-left text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5 block"
            >
              Email address
            </label>
            <input
              id="hero-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="border border-neutral-300 rounded-lg px-4 py-3 text-sm w-full bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20 placeholder:text-neutral-400 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-lg font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 mt-3 text-sm sm:text-base cursor-pointer bg-gradient-to-r from-[#8B1D2C] to-[#784080] hover:opacity-95 active:scale-[0.99]"
            >
              Khám phá các khóa học
            </button>
            <p className="text-xs text-neutral-600 mt-2.5 text-center leading-normal font-medium">
              ✨ Nhập email để nhận ngay trọn bộ lộ trình chi tiết &amp; tư vấn 1:1 miễn phí từ Mentor Hứa Thảo Ly
            </p>
          </form>
        </div>

        {/* Social Proof Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          {/* 5 Overlapping Student Avatars */}
          <div className="flex -space-x-2 items-center">
            {[
              "/assets/figma/08742fdf977fc095f72d070c8238ee5aa891910d.png",
              "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png",
              "/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png",
              "/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png",
              "/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png",
            ].map((src, i) => (
              <div
                key={i}
                className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-sm"
              >
                <Image
                  src={src}
                  alt={`Học viên ${i + 1}`}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* 5 Stars & Text */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[#F59E0B] text-base tracking-wider" aria-label="5 sao">
              ★★★★★
            </div>
            <span className="font-semibold text-xs sm:text-sm text-neutral-700">
              500+ học viên đã tham gia
            </span>
          </div>
        </div>

        {/* Tech Stack Icons (SQL, Google Sheet, Data Studio, Power BI, Python) */}
        <div className="w-full pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-12">
          {/* SQL */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/figma/52f212ce1d5856de39c345a5483b7fbbe1e9712b.svg"
              alt="SQL"
              width={26}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs sm:text-sm text-[#252525]">SQL</span>
          </div>

          {/* Google Sheet */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/figma/72ec619ff8b3151dbee655baadb01afaf522ea4d.svg"
              alt="Google Sheet"
              width={22}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs sm:text-sm text-[#252525]">Google Sheet</span>
          </div>

          {/* Data Studio */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/figma/d6fbd1298a91240247b0a088b0f1da19e38dcbd4.png"
              alt="Data Studio"
              width={26}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs sm:text-sm text-[#252525]">Data Studio</span>
          </div>

          {/* Power BI */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/figma/8263b1f1b457ebc83e9a52d57ea805c7651a93d3.svg"
              alt="Power BI"
              width={26}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs sm:text-sm text-[#252525]">Power BI</span>
          </div>

          {/* Python */}
          <div className="flex items-center gap-2">
            <Image
              src="/assets/figma/ed3ca1377cb8b78d00124c758fb07f7f3e4b96b3.svg"
              alt="Python"
              width={26}
              height={26}
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <span className="font-semibold text-xs sm:text-sm text-[#252525]">Python</span>
          </div>
        </div>
      </div>
    </section>
  );
}
