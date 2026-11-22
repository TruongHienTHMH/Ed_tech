"use client";

import React from "react";
import Link from "next/link";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F6] via-[#FAF7F8]/80 to-white pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Background Decorative Blur Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#AF445A]/15 to-[#784080]/15 blur-3xl rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#AF445A]/10 border border-[#AF445A]/20 text-[#8B1D2C] text-xs sm:text-sm font-semibold tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-[#AF445A] animate-pulse" />
            <span>Về LyData &amp; Founder</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1B1D] tracking-tight leading-[1.15]">
            Xin chào, mình là{" "}
            <span className="bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] bg-clip-text text-transparent">
              Lý Data
            </span>{" "}
            <span className="inline-block hover:rotate-12 transition-transform duration-300 origin-bottom-right">
              👋
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-600 leading-relaxed font-normal">
            Mình đồng hành giúp các bạn mới bắt đầu chuyển ngành và nâng tầm kỹ năng trở thành{" "}
            <strong className="text-[#8B1D2C] font-semibold">Data Analyst thực chiến</strong> bằng phương pháp
            học bản chất tư duy kinh doanh, dữ liệu Production thực tế và lộ trình kèm cặp 1-on-1 sát sao.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openLeadModal({ ctaLocation: "about_hero_cta" })}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-[#8B1D2C] hover:bg-[#701622] shadow-md shadow-[#8B1D2C]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Nhận tư vấn lộ trình 1-on-1
            </button>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-[#8B1D2C] bg-white border border-[#EFE5E7] hover:bg-[#FAF7F8] hover:border-[#AF445A]/30 transition-all shadow-sm"
            >
              Khám phá các khóa học
            </Link>
          </div>

          {/* Micro trust indicators */}
          <div className="mt-10 pt-8 border-t border-[#EFE5E7]/80 flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A]" />
              <span>Cựu Lead Data Analyst (MoMo, Tiki, ACB)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A]" />
              <span>Cử nhân Ngoại Thương (FTU2)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AF445A]" />
              <span>Giáo trình chuẩn hóa tuyển dụng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
