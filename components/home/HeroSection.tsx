"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { openLeadModal } from "@/components/forms/LeadModalManager";
import RoadmapCard, { RoadmapStage } from "@/components/home/RoadmapCard";

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: "stage-1",
    step: "01",
    title: "Data Foundation",
    desc: "Nắm vững nền tảng dữ liệu và SQL.",
    tags: ["SQL", "Database", "Data Cleaning"],
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-white" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    id: "stage-2",
    step: "02",
    title: "Data Analysis & Visualization",
    desc: "Phân tích, trực quan hóa và khám phá insight.",
    tags: ["Data Analysis", "Dashboard"],
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-white" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    id: "stage-3",
    step: "03",
    title: "Analytical Thinking",
    desc: "Rèn luyện tư duy phân tích và giải quyết vấn đề.",
    tags: ["Define business problem", "Metrics", "Data Storytelling"],
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-white" : "text-neutral-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
      </svg>
    ),
  },
  {
    id: "stage-4",
    step: "04",
    title: "Case Study & Project",
    desc: "Vận dụng tổng hợp qua bài tập lớn.",
    tags: ["Project Capstone", "Portfolio"],
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 ${active ? "text-white" : "text-neutral-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m0 0L21 3" />
      </svg>
    ),
  },
];

export default function HeroSection() {
  const [activeStage, setActiveStage] = useState<number>(1); // Mặc định giai đoạn 2 như ảnh thiết kế
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isInView, setIsInView] = useState<boolean>(true);
  const roadmapSectionRef = useRef<HTMLDivElement>(null);
  const mobileSliderRef = useRef<HTMLDivElement>(null);

  // Chỉ bật auto-cycle khi Roadmap section thực sự nằm trong tầm nhìn (viewport)
  useEffect(() => {
    const el = roadmapSectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through the 4 stages every 4s for a lively, premium transition (chỉ chạy khi đang trong view)
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % ROADMAP_STAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isInView]);

  // Tự động cuộn thẻ tương ứng vào giữa thanh trượt ngang trên điện thoại mà TUYỆT ĐỐI không làm giật/kéo màn hình trình duyệt window
  useEffect(() => {
    const container = mobileSliderRef.current;
    if (!container) return;
    const targetCard = container.children[activeStage] as HTMLElement;
    if (targetCard && typeof window !== "undefined" && window.innerWidth < 640) {
      // Chỉ thay đổi scrollLeft của container, TUYỆT ĐỐI KHÔNG dùng targetCard.scrollIntoView() vì nó sẽ kéo cả window di chuyển
      const targetLeft = targetCard.offsetLeft - (container.clientWidth - targetCard.clientWidth) / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [activeStage]);

  // Dynamic progress line percentage calculation (from Node 0 to Node 3)
  const linePercentage = `${(activeStage / (ROADMAP_STAGES.length - 1)) * 100}%`;

  return (
    <section className="relative w-full bg-white pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-20 overflow-hidden">
      {/* Left Artwork Component (Figma Node 157:835 - Shifted down below headline, positioned symmetrically on the left, zero text overlap) */}
      <div className="hidden xl:block absolute xl:left-20 2xl:left-24 xl:top-[165px] 2xl:top-[170px] w-[260px] xl:w-[290px] 2xl:w-[340px] pointer-events-none select-none z-10 transition-all duration-300">
        <Image
          src="/assets/decorations/hero-left.svg"
          alt="Iconic Left - Data Analytics Team"
          width={478}
          height={444}
          className="w-full h-auto object-contain drop-shadow-sm"
          priority
        />
      </div>

      {/* Right Artwork Component (Figma Node 157:904 - Shifted down below headline, positioned symmetrically on the right, zero text overlap) */}
      <div className="hidden xl:block absolute xl:right-20 2xl:right-24 xl:top-[165px] 2xl:top-[170px] w-[270px] xl:w-[300px] 2xl:w-[350px] pointer-events-none select-none z-10 transition-all duration-300">
        <Image
          src="/assets/decorations/hero-right.svg"
          alt="Iconic Right - Data Analytics 3D Dashboard"
          width={498}
          height={424}
          className="w-full h-auto object-contain drop-shadow-sm"
          priority
        />
      </div>

      {/* Central Content Area - Perfectly Centered & Spaced */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-20">
        {/* Top Hero Headline Block */}
        <div className="relative w-full flex flex-col items-center text-center mb-10 sm:mb-12">
          {/* Eyebrow text */}
          <p className="text-[#676767] tracking-[1.5px] text-xs sm:text-sm uppercase font-medium mb-3">
            ONLINE DATA ANALYTICS COURSE
          </p>

          {/* Main Headline - Balanced 2-line typography with zero overlap */}
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl xl:text-[52px] 2xl:text-[56px] leading-tight xl:leading-[62px] text-[#252525] max-w-[620px] mb-4">
            Học Data Analytics từ <br className="hidden sm:inline" />
            tư duy đến thực hành.
          </h1>

          {/* Subtitle */}
          <p className="text-[#676767] text-base sm:text-lg max-w-[540px] xl:max-w-[580px] font-normal leading-relaxed">
            Đồng hành cùng mentor có hơn 5 năm kinh nghiệm tại MoMo, Tiki, từ kiến thức nền tảng đến thực hành giải quyết bài toán dữ liệu
          </p>
        </div>

        {/* 4-Stage RoadMap Component with Running Line & Primary Aura Glow */}
        <div
          ref={roadmapSectionRef}
          id="roadmap"
          className="w-full max-w-[1100px] mb-8 sm:mb-10 scroll-mt-20 sm:scroll-mt-24"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* RoadMap Header */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF2F4] text-[#AF445A] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A] animate-pulse" />
            LỘ TRÌNH HỌC DATA ANALYTICS
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#252525] tracking-tight mb-1.5">
            Học từ nền tảng đến ứng dụng thực tế
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-[580px] mx-auto mb-5 sm:mb-6 font-normal">
            Lộ trình 4 giai đoạn, xây dựng đầy đủ kiến thức và kỹ năng để làm Data Analyst.
          </p>

          {/* Connected Timeline Bar with Transition Line & Aura Nodes */}
          <div className="relative w-full max-w-[880px] mx-auto mb-10 sm:mb-12 lg:mb-14 px-3 sm:px-6">
            {/* Background Track Line */}
            <div className="absolute top-1/2 left-[12%] right-[12%] h-[3px] -translate-y-1/2 bg-[#F3D8DF] rounded-full" />

            {/* Active Colored Running Progress Line with Primary Gradient */}
            <div className="absolute top-1/2 left-[12%] right-[12%] h-[3px] -translate-y-1/2 pointer-events-none overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#784080] via-[#AF445A] to-[#AF445A] rounded-full transition-all duration-700 ease-in-out shadow-[0_0_8px_rgba(175,68,90,0.6)]"
                style={{ width: linePercentage }}
              />
            </div>

            {/* 4 Stage Icon Nodes */}
            <div className="relative flex items-center justify-between">
              {ROADMAP_STAGES.map((stage, idx) => {
                const isActive = activeStage === idx;
                const isPassed = idx < activeStage;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStage(idx)}
                    className="flex flex-col items-center focus:outline-none cursor-pointer group"
                    aria-label={`Chuyển sang giai đoạn ${stage.step}: ${stage.title}`}
                  >
                    <div
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-500 ${isActive
                        ? "bg-gradient-to-tr from-[#784080] to-[#AF445A] text-white shadow-[0_0_24px_6px_rgba(175,68,90,0.55)] ring-4 ring-[#FAD2DA] scale-110 z-20"
                        : isPassed
                          ? "bg-[#8B1D2C] text-white shadow-md ring-4 ring-white z-10 hover:scale-105"
                          : "bg-white border-2 border-neutral-300 text-neutral-400 shadow-xs ring-4 ring-white z-10 group-hover:border-[#AF445A]/60 hover:scale-105"
                        }`}
                    >
                      {stage.icon && stage.icon(isActive || isPassed)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Stage Cards Grid / Mobile Horizontal Snap Slider */}
          <div
            ref={mobileSliderRef}
            onTouchStart={() => setIsAutoPlaying(false)}
            onTouchEnd={() => {
              setTimeout(() => setIsAutoPlaying(true), 3000);
            }}
            className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-3.5 w-full items-stretch justify-start sm:justify-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-6 sm:px-0 pt-2 sm:pt-3 pb-3 scroll-smooth"
          >
            {ROADMAP_STAGES.map((stage, idx) => (
              <RoadmapCard
                key={stage.id}
                stage={stage}
                isActive={activeStage === idx}
                onClick={() => setActiveStage(idx)}
                className="w-[260px] xs:w-[270px] shrink-0 snap-center sm:w-auto sm:shrink"
              />
            ))}
          </div>

          {/* RoadMap CTA Button */}
          <div className="mt-6 sm:mt-7 flex justify-center">
            <button
              type="button"
              onClick={() => openLeadModal({ ctaLocation: "hero_roadmap" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[12px] font-bold text-white shadow-md hover:shadow-xl transition-all duration-200 text-sm sm:text-base cursor-pointer bg-gradient-to-r from-[#784080] to-[#AF445A] hover:opacity-95 active:scale-[0.98]"
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
