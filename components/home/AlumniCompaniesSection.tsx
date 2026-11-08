"use client";

import React from "react";
import Image from "next/image";

export default function AlumniCompaniesSection() {
  return (
    <section className="relative w-full bg-[#1F242F] py-16 lg:py-20 overflow-hidden text-white">
      {/* Decorative Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#AF445A]/10 via-[#784080]/15 to-[#AF445A]/10 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[40px] leading-snug text-center text-white mb-10 max-w-[650px]">
          Học viên đã trúng tuyển tại các công ty hàng đầu
        </h2>

        {/* Logos Container */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-16 opacity-90 grayscale hover:grayscale-0 transition-all duration-300">
          {/* Tokopedia */}
          <div className="h-10 sm:h-12 w-auto flex items-center justify-center">
            <Image
              src="/assets/figma/b748b0ab9014b6a1cbd85bf1b193c9df632e3a0e.svg"
              alt="Tokopedia"
              width={160}
              height={44}
              className="h-9 sm:h-11 w-auto object-contain filter invert brightness-200"
              style={{ width: "auto" }}
            />
          </div>

          {/* Company 2 */}
          <div className="h-10 sm:h-12 w-auto flex items-center justify-center">
            <Image
              src="/assets/figma/3205cfb73b9637bd76f7bc3def62832768ee22f2.svg"
              alt="Company Partner"
              width={140}
              height={44}
              className="h-8 sm:h-10 w-auto object-contain filter invert brightness-200"
              style={{ width: "auto" }}
            />
          </div>

          {/* Company 3 */}
          <div className="h-10 sm:h-12 w-auto flex items-center justify-center">
            <Image
              src="/assets/figma/15a7d65e2db97a2b937dc4548b1d089b55920fae.svg"
              alt="Tech Corporation"
              width={160}
              height={44}
              className="h-8 sm:h-10 w-auto object-contain filter invert brightness-200"
              style={{ width: "auto" }}
            />
          </div>

          {/* Partner Badges */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider">
            <span>MOMO</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider">
            <span>TIKI</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 border border-white/10 text-white font-bold text-sm tracking-wider">
            <span>SHOPEE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

