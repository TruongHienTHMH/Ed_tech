"use client";

import React from "react";

export interface RoadmapStage {
  id: string;
  step: string;
  title: string;
  desc: string;
  tags: string[];
  icon?: (active: boolean) => React.ReactNode;
}

interface RoadmapCardProps {
  stage: RoadmapStage;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export default function RoadmapCard({ stage, isActive, onClick, className = "" }: RoadmapCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`rounded-[26px] sm:rounded-[30px] px-3 sm:px-3.5 py-4 sm:py-4.5 transition-all duration-300 cursor-pointer flex flex-col items-center text-center w-full select-none ${
        isActive
          ? "bg-gradient-to-b from-[#FFF5F7] via-white to-[#FDF0F3] border-[2px] border-[#AF445A] shadow-[0_12px_36px_rgba(175,68,90,0.22)] ring-4 ring-[#AF445A]/15 -translate-y-2 relative z-20"
          : "bg-white border border-neutral-200/90 hover:border-[#AF445A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 relative z-10"
      } ${className}`}
    >
      {/* Content Container - Gọn gàng, liền mạch, không còn khoảng trống thừa */}
      <div className="flex flex-col items-center text-center w-full">
        {/* Step Capsule Badge */}
        <span
          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 transition-colors ${
            isActive
              ? "bg-[#AF445A] text-white shadow-xs"
              : "bg-[#FAF3F5] text-[#AF445A]"
          }`}
        >
          Giai đoạn {stage.step}
        </span>

        {/* Title: 1 dòng trọn vẹn */}
        <h3
          title={stage.title}
          className="font-heading font-bold text-[13.5px] xs:text-[14px] sm:text-[14.5px] lg:text-[15px] xl:text-[16px] text-[#1E1E1E] tracking-tight leading-snug mb-1 text-center w-full whitespace-nowrap"
        >
          {stage.title}
        </h3>

        {/* Subtitle / Description: Cố định 2 dòng, ngay sát phía dưới title */}
        <p className="min-h-[36px] max-h-[38px] text-[11.5px] sm:text-[12.5px] text-[#555555] leading-[18px] sm:leading-[19px] mb-2 font-normal text-center w-full line-clamp-2 flex items-center justify-center">
          {stage.desc}
        </p>

        {/* Skill Tags: Nằm liền kề ngay dưới Subtitle, bỏ toàn bộ khoảng trắng rỗng thừa */}
        <div className="flex flex-wrap justify-center content-start gap-1 pt-2 border-t border-neutral-100/90 w-full min-h-[44px]">
          {stage.tags.map((tag, tIdx) => (
            <span
              key={tIdx}
              className={`px-2 py-0.5 rounded-full text-[10.5px] sm:text-[11px] leading-tight transition-colors duration-300 ${
                isActive
                  ? "bg-[#AF445A]/10 text-[#AF445A] font-semibold border border-[#AF445A]/25"
                  : "bg-[#FAF4F6] text-[#4A4A4A] font-medium"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
