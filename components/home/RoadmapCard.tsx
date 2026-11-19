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
}

export default function RoadmapCard({ stage, isActive, onClick }: RoadmapCardProps) {
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
      className={`rounded-[36px] sm:rounded-[42px] px-5 py-7 sm:py-8 sm:px-6 transition-all duration-300 cursor-pointer flex flex-col justify-between items-center text-center w-full min-h-[300px] ${
        isActive
          ? "bg-gradient-to-b from-[#FFF5F7] via-white to-[#FDF0F3] border-[2px] border-[#AF445A] shadow-[0_12px_36px_rgba(175,68,90,0.22)] ring-4 ring-[#AF445A]/15 -translate-y-2 relative z-20"
          : "bg-white border border-neutral-200/90 hover:border-[#AF445A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 relative z-10"
      }`}
    >
      {/* Top Header & Content - Căn Giữa */}
      <div className="flex flex-col items-center text-center w-full">
        {/* Step Capsule Badge */}
        <span
          className={`inline-flex items-center justify-center px-3.5 py-1 rounded-full text-xs font-bold mb-4 transition-colors ${
            isActive
              ? "bg-[#AF445A] text-white shadow-xs"
              : "bg-[#FAF3F5] text-[#AF445A]"
          }`}
        >
          Giai đoạn {stage.step}
        </span>

        {/* Title */}
        <h3 className="font-heading font-bold text-[17px] sm:text-[18px] text-[#1E1E1E] leading-snug mb-2 text-center">
          {stage.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed mb-4 font-normal text-center max-w-[220px]">
          {stage.desc}
        </p>
      </div>

      {/* Skill Tags - Căn Giữa */}
      <div className="flex flex-wrap justify-center gap-1.5 pt-3 border-t border-neutral-100/90 w-full">
        {stage.tags.map((tag, tIdx) => (
          <span
            key={tIdx}
            className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${
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
  );
}
