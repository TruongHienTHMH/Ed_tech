"use client";

import React from "react";
import Link from "next/link";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function AboutCta() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] p-8 sm:p-12 md:p-16 text-white text-center shadow-xl">
          {/* Subtle Background Glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6">
              Bắt đầu hành trình cùng LyData
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Sẵn sàng bứt phá sự nghiệp Data Analyst?
            </h2>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 leading-relaxed font-light">
              Đừng ngần ngại để lại thông tin để được chính Founder Hứa Thảo Ly và đội ngũ chuyên môn
              đánh giá hồ sơ và định hướng lộ trình học tập tối ưu nhất cho bạn.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openLeadModal({ ctaLocation: "about_bottom_cta" })}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-[#8B1D2C] bg-white hover:bg-neutral-100 shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Đăng ký tư vấn 1-on-1 miễn phí
              </button>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm transition-all shadow-sm"
              >
                Xem chi tiết các khóa học
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
