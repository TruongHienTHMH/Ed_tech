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
      className={`rounded-[22px] p-5 sm:p-6 transition-all duration-400 cursor-pointer flex flex-col justify-between text-left ${
        isActive
          ? "bg-white border-[1.8px] border-[#784080] shadow-[0_6px_28px_rgba(120,64,128,0.16)] ring-2 ring-[#784080]/15 -translate-y-1.5 relative z-20"
          : "bg-white border border-neutral-200/90 hover:border-[#784080]/40 shadow-xs hover:shadow-md hover:-translate-y-0.5 relative z-10"
      }`}
    >
      <div>
        {/* Step Pill */}
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3F5] text-[#AF445A] mb-3">
          {stage.step}
        </span>

        {/* Title */}
        <h3 className="font-heading font-bold text-[17px] sm:text-[18px] text-[#1E1E1E] leading-snug mb-1.5">
          {stage.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[#555555] leading-relaxed mb-4 font-normal">
          {stage.desc}
        </p>
      </div>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {stage.tags.map((tag, tIdx) => (
          <span
            key={tIdx}
            className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${
              isActive
                ? "bg-[#FAF3F5] text-[#784080] font-semibold border border-[#AF445A]/20"
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
