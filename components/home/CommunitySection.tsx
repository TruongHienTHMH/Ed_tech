import React from "react";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";

const COMMUNITY_URL = "https://community-lydata.vercel.app/";

export default function CommunitySection() {
  return (
    <section
      id="community"
      className="relative w-full overflow-hidden bg-white scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Absolute Background SVG (Figma Group 473 / Node 434:1375):
          Top diagonal gradient wedge, dark #2E2E2E body, bottom diagonal gradient wedge */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src="/assets/decorations/community-bg.svg"
          alt="LYDATA Community E-Learning Background"
          fill
          className="object-fill"
          priority={false}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-24 lg:py-26 flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <div className="mb-3.5">
          <Badge variant="outlinePrimary" size="md">
            CỘNG ĐỒNG &amp; E-LEARNING
          </Badge>
        </div>

        {/* Heading */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[40px] leading-tight text-white max-w-[780px] mb-3.5">
          Khám phá nền tảng E-Learning &amp; Cộng đồng LYDATA
        </h2>

        {/* Description */}
        <p className="text-white/80 text-sm sm:text-base font-normal leading-relaxed max-w-[660px] mb-6 sm:mb-7">
          Không gian học tập trực tuyến dành riêng cho học viên: thực hành bài tập SQL, Case Study dữ liệu thực tế, cập nhật tài liệu chuyên ngành và trao đổi trực tiếp cùng Mentor.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-7 sm:mb-8">
          {[
            "Kho tài liệu & Case Study",
            "Bài tập thực hành tương tác",
            "Kết nối Mentor & Học viên",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs sm:text-sm font-medium backdrop-blur-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A]" />
              {item}
            </span>
          ))}
        </div>

        {/* CTA Link to Community E-Learning Platform */}
        <a
          href={COMMUNITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 rounded-[12px] font-bold text-white shadow-[0_8px_24px_rgba(175,68,90,0.35)] hover:shadow-[0_12px_28px_rgba(175,68,90,0.48)] transition-all duration-200 text-sm sm:text-base bg-gradient-to-r from-[#AF445A] to-[#784080] hover:opacity-95 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <span>Khám phá Community ngay</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
