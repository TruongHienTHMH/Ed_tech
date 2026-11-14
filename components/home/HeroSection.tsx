"use client";

import React from "react";
import Image from "next/image";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden">
      {/* Central Content Area - Perfectly Centered & Spaced */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-20">
        {/* Top Hero Headline Block with Flanking Left & Right Components (Figma Node 157:903) */}
        <div className="relative w-full flex flex-col items-center text-center mb-10 sm:mb-12">
          {/* Left Artwork Component (Figma Node 157:835 & 157:832 - Clean transparent component in flanking space) */}
          <div className="hidden lg:block absolute left-0 xl:left-2 2xl:left-4 top-1/2 -translate-y-1/2 w-[210px] xl:w-[240px] 2xl:w-[250px] pointer-events-none select-none z-10 transition-all">
            <Image
              src="/assets/decorations/hero-clean-left.png"
              alt="Iconic Left - Data Analytics Team"
              width={478}
              height={444}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Right Artwork Component (Figma Node 157:904 - Clean transparent component in flanking space) */}
          <div className="hidden lg:block absolute right-0 xl:right-2 2xl:right-4 top-1/2 -translate-y-1/2 w-[220px] xl:w-[250px] 2xl:w-[260px] pointer-events-none select-none z-10 transition-all">
            <Image
              src="/assets/decorations/hero-clean-right.png"
              alt="Iconic Right - Data Analytics 3D Dashboard"
              width={498}
              height={424}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Eyebrow text */}
          <p className="text-[#676767] tracking-[1.5px] text-xs sm:text-sm uppercase font-medium mb-3">
            ONLINE DATA ANALYTICS COURSE
          </p>

          {/* Main Headline - Balanced typography */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl xl:text-[54px] 2xl:text-[58px] leading-tight xl:leading-[64px] text-[#252525] max-w-[620px] xl:max-w-[660px] mb-4">
            Học Data Analytics từ tư duy đến thực hành.
          </h1>

          {/* Subtitle */}
          <p className="text-[#676767] text-base sm:text-lg max-w-[560px] xl:max-w-[600px] font-normal leading-relaxed">
            Đồng hành cùng mentor có hơn 5 năm kinh nghiệm tại MoMo, Tiki, từ kiến thức nền tảng đến thực hành giải quyết bài toán dữ liệu
          </p>
        </div>

        {/* 4-Stage RoadMap Component (Replaces Email Form - Figma Node 157:903 / Image Design) */}
        <div className="w-full max-w-[1060px] mb-12 sm:mb-14">
          {/* RoadMap Header */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F4] text-[#AF445A] text-xs font-bold uppercase tracking-wider mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A]" />
            LỘ TRÌNH HỌC DATA ANALYTICS
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#252525] tracking-tight mb-2">
            Học từ nền tảng đến ứng dụng thực tế
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-[580px] mx-auto mb-8 sm:mb-10 font-normal">
            Lộ trình 4 giai đoạn, xây dựng đầy đủ kiến thức và kỹ năng để làm Data Analyst.
          </p>

          {/* Connected Timeline Bar */}
          <div className="relative w-full max-w-[880px] mx-auto mb-7 px-4 sm:px-8">
            {/* Background Track Line */}
            <div className="absolute top-1/2 left-[12%] right-[12%] h-[3px] -translate-y-1/2 bg-[#F3D8DF]" />
            {/* Active Colored Line (Phase 1 to Phase 2) */}
            <div className="absolute top-1/2 left-[12%] w-[28%] h-[3px] -translate-y-1/2 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A]" />

            {/* 4 Stage Icon Nodes */}
            <div className="relative flex items-center justify-between">
              {/* Node 1: Database */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#8B1D2C] text-white flex items-center justify-center shadow-md ring-4 ring-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                </div>
              </div>

              {/* Node 2: Bar Chart (Active / Highlighted) */}
              <div className="flex flex-col items-center">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#8B1D2C] to-[#AF445A] text-white flex items-center justify-center shadow-lg ring-4 ring-[#FAD2DA] scale-105">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
              </div>

              {/* Node 3: Brain / Analytical Thinking */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#E5E7EB] text-neutral-400 flex items-center justify-center shadow-xs ring-4 ring-white">
                  <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
                  </svg>
                </div>
              </div>

              {/* Node 4: Rocket / Project */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#E5E7EB] text-neutral-400 flex items-center justify-center shadow-xs ring-4 ring-white">
                  <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m0 0L21 3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stage Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full text-left">
            {/* Stage 1 */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">01</span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-1">Data Foundation</h3>
                <p className="text-xs text-neutral-500 mt-1.5 mb-4 leading-relaxed">
                  Nắm vững nền tảng dữ liệu và SQL.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">SQL cơ bản</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Database</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Xử lý dữ liệu</span>
              </div>
            </div>

            {/* Stage 2 (Active Highlighted) */}
            <div className="bg-white border-2 border-[#AF445A] rounded-2xl p-5 shadow-lg shadow-[#AF445A]/10 relative flex flex-col justify-between transform lg:-translate-y-1">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#AF445A] uppercase">02</span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-1">Data Analysis &amp; Visualization</h3>
                <p className="text-xs text-neutral-500 mt-1.5 mb-4 leading-relaxed">
                  Phân tích, trực quan hóa và khám phá insight.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 bg-[#FDF2F4] text-[#AF445A] rounded-md text-[11px] font-semibold">SQL nâng cao</span>
                <span className="px-2.5 py-1 bg-[#FDF2F4] text-[#AF445A] rounded-md text-[11px] font-semibold">Phân tích dữ liệu</span>
                <span className="px-2.5 py-1 bg-[#FDF2F4] text-[#AF445A] rounded-md text-[11px] font-semibold">Dashboard</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">03</span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-1">Analytical Thinking</h3>
                <p className="text-xs text-neutral-500 mt-1.5 mb-4 leading-relaxed">
                  Rèn luyện tư duy phân tích và giải quyết vấn đề.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Business problem</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Metrics</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Storytelling</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">04</span>
                <h3 className="font-heading font-bold text-base text-neutral-900 mt-1">Case Study &amp; Project</h3>
                <p className="text-xs text-neutral-500 mt-1.5 mb-4 leading-relaxed">
                  Vận dụng tổng hợp qua bài tập lớn.
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Case study</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Capstone</span>
                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-[11px] font-medium">Portfolio</span>
              </div>
            </div>
          </div>

          {/* RoadMap CTA Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => openLeadModal({ ctaLocation: "hero_roadmap" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[12px] font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base cursor-pointer bg-gradient-to-r from-[#784080] to-[#AF445A] hover:opacity-95 active:scale-[0.98]"
            >
              Khám phá lộ trình chi tiết &rarr;
            </button>
          </div>
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
              200+ học viên đã tham gia
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
