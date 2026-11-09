"use client";

import React from "react";
import Image from "next/image";

const COMPANY_LOGOS = [
  { name: "Tokopedia", src: "/assets/figma/b748b0ab9014b6a1cbd85bf1b193c9df632e3a0e.svg", width: 150, height: 42 },
  { name: "Partner Tech", src: "/assets/figma/3205cfb73b9637bd76f7bc3def62832768ee22f2.svg", width: 130, height: 38 },
  { name: "Enterprise Co", src: "/assets/figma/75956f03862fa0debc17f2d607e9b960a43b1a28.svg", width: 140, height: 38 },
  { name: "Finance Group", src: "/assets/figma/075eba8302418813840095c4bf8c181d5f6b1dd2.svg", width: 44, height: 44 },
  { name: "Global Systems", src: "/assets/figma/87684c46342ae29eb4c1281729f85f5cfc562efc.svg", width: 44, height: 44 },
  { name: "Analytics Inc", src: "/assets/figma/480d74d474dae2a29b22a63a3d76ce3805a2b88c.svg", width: 44, height: 44 },
  { name: "Retail Hub", src: "/assets/figma/e6061a5a605064b9a3a73cce0f922e71fc6af1fe.svg", width: 44, height: 44 },
  { name: "Tech Corporation", src: "/assets/figma/15a7d65e2db97a2b937dc4548b1d089b55920fae.svg", width: 140, height: 38 },
];

export default function AlumniCompaniesSection() {
  return (
    <section className="relative w-full bg-[#1F242F] py-16 lg:py-20 overflow-hidden text-white border-y border-white/5">
      {/* Decorative Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#AF445A]/10 via-[#784080]/15 to-[#AF445A]/10 pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[38px] leading-snug text-center text-white mb-10 sm:mb-12 max-w-[680px]">
          Học viên đã trúng tuyển tại các công ty hàng đầu
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
    </section>
  );
}
