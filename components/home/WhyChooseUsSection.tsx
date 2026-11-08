"use client";

import React from "react";
import Image from "next/image";

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[48px] text-[#252525] max-w-[560px]">
            Tại sao nên học Data Analyst tại <span className="text-brand-gradient">LYDATA?</span>
          </h2>
        </div>

        {/* 3 Value Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: Featured Gradient Card */}
          <div className="bg-card-gradient rounded-xl p-6 lg:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center p-3 mb-6 shadow-md">
                <Image
                  src="/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png"
                  alt="Lộ trình bài bản"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>

              <h3 className="font-heading font-semibold text-2xl tracking-tight mb-3">
                Lộ trình bài bản
              </h3>

              <p className="text-white/90 text-base lg:text-[17px] leading-relaxed font-normal">
                Học từ nền tảng SQL đến Data Visualization theo lộ trình rõ ràng, phù hợp cho cả người mới bắt đầu.
              </p>
            </div>
          </div>

          {/* Card 2: Dự án thực tế */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 lg:p-8 text-[#34343C] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#AF445A]/10 via-[#974C86]/10 to-[#8054B3]/10 flex items-center justify-center p-3 mb-6 border border-[#AF445A]/15">
                <Image
                  src="/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png"
                  alt="Dự án thực tế"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>

              <h3 className="font-heading font-semibold text-2xl tracking-tight mb-3 text-[#252525]">
                Dự án thực tế
              </h3>

              <p className="text-[#646473] text-base lg:text-[17px] leading-relaxed font-normal">
                Làm việc với dataset và case study từ doanh nghiệp để rèn luyện tư duy phân tích và giải quyết vấn đề.
              </p>
            </div>
          </div>

          {/* Card 3: Mentor đồng hành */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 lg:p-8 text-[#34343C] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-1">
            <div>
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#AF445A]/10 via-[#974C86]/10 to-[#8054B3]/10 flex items-center justify-center p-3 mb-6 border border-[#AF445A]/15">
                <Image
                  src="/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png"
                  alt="Mentor đồng hành"
                  width={38}
                  height={38}
                  className="object-contain"
                />
              </div>

              <h3 className="font-heading font-semibold text-2xl tracking-tight mb-3 text-[#252525]">
                Mentor đồng hành
              </h3>

              <p className="text-[#646473] text-base lg:text-[17px] leading-relaxed font-normal">
                Được mentor hỗ trợ xuyên suốt quá trình học, giải đáp thắc mắc và góp ý bài làm để tiến bộ nhanh hơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

