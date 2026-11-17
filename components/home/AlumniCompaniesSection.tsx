"use client";

import React from "react";
import Image from "next/image";

const COMPANY_LOGOS = [
  { name: "MoMo", src: "/assets/companies/momo.svg", width: 120, height: 38 },
  { name: "Shopee", src: "/assets/companies/shopee.svg", width: 135, height: 38 },
  { name: "GHN", src: "/assets/companies/ghn.svg", width: 130, height: 38 },
  { name: "ACB", src: "/assets/companies/acb.svg", width: 110, height: 38 },
  { name: "IRTech", src: "/assets/companies/irtech.svg", width: 130, height: 38 },
];

export default function AlumniCompaniesSection() {
  return (
    <section className="relative w-full bg-[#1F242F] overflow-hidden text-white border-y border-white/5">
      {/* Upper Transition Wave Banner (Figma Node 12:781 / Rectangle 1574) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-upper.png"
          alt="Transition Upper Wave Banner"
          width={3840}
          height={100}
          className="w-full h-auto max-h-[40px] sm:max-h-[50px] object-cover"
        />
      </div>

      {/* Decorative Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#AF445A]/10 via-[#784080]/15 to-[#AF445A]/10 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 flex flex-col items-center">
        {/* Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[38px] leading-snug text-center text-white mb-10 sm:mb-12 max-w-[680px]">
          Mentees đã trúng tuyển tại các công ty lớn
        </h2>

        {/* Infinite Horizontal Auto-Marquee Slider (Figma Node 12:782) */}
        <div className="w-full overflow-hidden mask-marquee-edges group">
          <div className="animate-marquee group-hover:[animation-play-state:paused] flex items-center gap-12 sm:gap-16 py-3">
            {/* Track 1 */}
            <div className="flex items-center gap-12 sm:gap-16 shrink-0">
              {COMPANY_LOGOS.map((company, index) => (
                <div
                  key={`c1-${index}`}
                  className="h-10 sm:h-12 w-auto flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Image
                    src={company.src}
                    alt={company.name}
                    width={company.width}
                    height={company.height}
                    className="h-7 sm:h-9 w-auto object-contain"
                    style={{ width: "auto" }}
                  />
                </div>
              ))}
            </div>

            {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
            <div className="flex items-center gap-12 sm:gap-16 shrink-0" aria-hidden="true">
              {COMPANY_LOGOS.map((company, index) => (
                <div
                  key={`c2-${index}`}
                  className="h-10 sm:h-12 w-auto flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Image
                    src={company.src}
                    alt={company.name}
                    width={company.width}
                    height={company.height}
                    className="h-7 sm:h-9 w-auto object-contain"
                    style={{ width: "auto" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Transition Wave Banner (Figma Node 12:783 / Rectangle 1575) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-lower.png"
          alt="Transition Lower Wave Banner"
          width={3840}
          height={100}
          className="w-full h-auto max-h-[40px] sm:max-h-[50px] object-cover"
        />
      </div>
    </section>
  );
}
