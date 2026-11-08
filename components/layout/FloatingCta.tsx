"use client";

import React from "react";
import Image from "next/image";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export default function FloatingCta() {
  return (
    <aside
      aria-label="Kênh hỗ trợ và đăng ký tư vấn trực tuyến"
      className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3"
    >
      {/* Quick Consultation Bubble Pill */}
      <button
        type="button"
        onClick={() => openLeadModal({ ctaLocation: "floating_pill_cta" })}
        className="flex items-center gap-2 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="Đăng ký tư vấn 1-on-1"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Đăng Ký Tư Vấn</span>
      </button>

      <div className="flex flex-col items-center gap-2.5">
        {/* Hotline Support */}
        <a
          href="tel:0934938431"
          aria-label="Gọi hotline hỗ trợ"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2.5 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/8fe9a4f9a84f57b0ad7f6050d87f9e45e18d5902.svg"
            alt="Hỗ trợ hotline"
            width={26}
            height={26}
            className="object-contain"
          />
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/datawithly"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin qua Messenger"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/5b4b011e79a58bd7bf7adc73dcbec0c01705d59d.png"
            alt="Messenger"
            width={30}
            height={30}
            className="object-contain"
          />
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/0934938431"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tư vấn qua Zalo"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/08742fdf977fc095f72d070c8238ee5aa891910d.png"
            alt="Zalo"
            width={30}
            height={30}
            className="object-contain"
          />
        </a>
      </div>
    </aside>
  );
}
