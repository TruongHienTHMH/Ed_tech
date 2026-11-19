"use client";

import React, { useState } from "react";
import Image from "next/image";

interface WhyChooseUsItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

const WHY_CHOOSE_US_ITEMS: WhyChooseUsItem[] = [
  {
    id: "structured-path",
    title: "Lộ trình bài bản",
    desc: "Học từ nền tảng SQL đến Data Visualization theo lộ trình rõ ràng, phù hợp cho cả người mới bắt đầu.",
    icon: "/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png",
  },
  {
    id: "real-projects",
    title: "Dự án thực tế",
    desc: "Làm việc với dataset và case study từ doanh nghiệp để rèn luyện tư duy phân tích và giải quyết vấn đề.",
    icon: "/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png",
  },
  {
    id: "dedicated-mentor",
    title: "Mentor đồng hành",
    desc: "Được mentor hỗ trợ xuyên suốt quá trình học, giải đáp thắc mắc và góp ý bài làm để tiến bộ nhanh hơn.",
    icon: "/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png",
  },
];

export default function WhyChooseUsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[48px] text-[#252525] max-w-[560px]">
            Tại sao nên học Data Analyst tại <span className="text-brand-gradient">LYDATA?</span>
          </h2>
        </div>

        {/* 3 Value Cards Grid with Dynamic Hover Gradient */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {WHY_CHOOSE_US_ITEMS.map((item, index) => {
            const isActive = hoveredIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`rounded-2xl p-6 lg:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between transform ${
                  isActive
                    ? "bg-gradient-to-br from-[#AF445A] via-[#974C86] to-[#8054B3] text-white shadow-[0px_10px_30px_rgba(175,68,90,0.28)] -translate-y-2 border-transparent"
                    : "bg-white border border-neutral-200/90 text-[#34343C] shadow-md hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div>
                  {/* Icon Box */}
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center p-3 mb-6 transition-all duration-300 ${
                      isActive
                        ? "bg-white shadow-md"
                        : "bg-gradient-to-br from-[#AF445A]/10 via-[#974C86]/10 to-[#8054B3]/10 border border-[#AF445A]/15"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={38}
                      height={38}
                      className="object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`font-heading font-semibold text-2xl tracking-tight mb-3 transition-colors duration-300 ${
                      isActive ? "text-white" : "text-[#252525]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-base lg:text-[17px] leading-relaxed font-normal transition-colors duration-300 ${
                      isActive ? "text-white/90" : "text-[#646473]"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

