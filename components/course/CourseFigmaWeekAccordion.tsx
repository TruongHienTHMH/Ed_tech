"use client";

import React, { useState } from "react";
import { CurriculumModule } from "@/lib/cms/types";

interface CourseFigmaWeekAccordionProps {
  modules: CurriculumModule[];
  courseTitle?: string;
  courseSubtitle?: string;
  totalSessions?: number;
  practiceCount?: number;
  capstoneCount?: number;
}

/**
 * Icon verify seal check chuẩn Figma node 381:2396
 */
function SealCheckIcon({ className = "w-5 h-5 shrink-0 text-[#BF687D]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.8331 7.57378V4.99878C15.8331 4.54045 15.4581 4.16545 14.9998 4.16545H12.4248L10.5831 2.32378C10.506 2.24653 10.4145 2.18524 10.3136 2.14342C10.2128 2.1016 10.1048 2.08008 9.99562 2.08008C9.88648 2.08008 9.77842 2.1016 9.6776 2.14342C9.57679 2.18524 9.48522 2.24653 9.40812 2.32378L7.56646 4.16545H4.99146C4.53312 4.16545 4.15812 4.54045 4.15812 4.99878V7.57378L2.31646 9.41545C2.2392 9.49254 2.17791 9.58412 2.1361 9.68493C2.09428 9.78574 2.07275 9.89381 2.07275 10.0029C2.07275 10.1121 2.09428 10.2202 2.1361 10.321C2.17791 10.4218 2.2392 10.5134 2.31646 10.5904L4.15812 12.4321V15.0071C4.15812 15.4654 4.53312 15.8404 4.99146 15.8404H7.56646L9.40812 17.6821C9.57479 17.8488 9.78312 17.9238 9.99979 17.9238C10.2165 17.9238 10.4248 17.8404 10.5915 17.6821L12.4331 15.8404H15.0081C15.4665 15.8404 15.8415 15.4654 15.8415 15.0071V12.4321L17.6831 10.5904C17.7604 10.5134 17.8217 10.4218 17.8635 10.321C17.9053 10.2202 17.9268 10.1121 17.9268 10.0029C17.9268 9.89381 17.9053 9.78574 17.8635 9.68493C17.8217 9.58412 17.7604 9.49254 17.6831 9.41545L15.8415 7.57378H15.8331ZM9.16646 12.8488L6.90812 10.5904L8.08312 9.41545L9.15812 10.4904L11.8998 7.74878L13.0748 8.92378L9.14979 12.8488H9.16646Z"
      />
    </svg>
  );
}

export default function CourseFigmaWeekAccordion({
  modules,
  courseSubtitle,
  totalSessions,
  practiceCount,
  capstoneCount,
}: CourseFigmaWeekAccordionProps) {
  // Group modules by week (Chuẩn Figma: Week 1, Week 2...)
  const groupedWeeks = React.useMemo(() => {
    const map = new Map<string, { label: string; weekNum: number; modules: CurriculumModule[] }>();

    modules.forEach((mod, idx) => {
      const weekVal = mod.week ?? mod.weekNumber ?? Math.ceil((idx + 1) / 2);
      const weekNum = typeof weekVal === "number" ? weekVal : (parseInt(String(weekVal), 10) || Math.ceil((idx + 1) / 2));
      const weekKey = `week-${weekNum}`;
      const weekLabel = typeof weekVal === "string" && isNaN(Number(weekVal)) ? weekVal : `Week ${weekNum}`;

      if (!map.has(weekKey)) {
        map.set(weekKey, { label: weekLabel, weekNum, modules: [] });
      }
      map.get(weekKey)!.modules.push(mod);
    });

    return Array.from(map.entries()).map(([key, data]) => ({
      key,
      label: data.label,
      weekNum: data.weekNum,
      modules: data.modules.sort((a, b) => {
        const orderA = a.sortOrder ?? a.day ?? a.moduleNumber ?? 0;
        const orderB = b.sortOrder ?? b.day ?? b.moduleNumber ?? 0;
        return orderA - orderB;
      }),
    }));
  }, [modules]);

  // State: expanded module IDs (mặc định mở buổi 1 để người dùng thấy cấu trúc)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (modules.length > 0) initial.add(modules[0].id);
    return initial;
  });

  const allModuleIds = modules.map((m) => m.id);
  const isAllExpanded = allModuleIds.length > 0 && allModuleIds.every((id) => expandedIds.has(id));

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(allModuleIds));
    }
  };

  const toggleModule = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const calculatedTotalSessions = totalSessions || modules.length || 12;
  const calculatedPractices = practiceCount !== undefined ? practiceCount : Math.max(1, Math.floor(calculatedTotalSessions / 4));
  const calculatedCapstones = capstoneCount !== undefined ? capstoneCount : (calculatedTotalSessions > 15 ? 2 : 1);

  return (
    <section className="mb-12" id="curriculum" data-node-id="380:1685">
      {/* 1. Section Header: Tiêu đề & Subtitle động từ Course */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight" data-node-id="380:1687">
            Chương trình giảng dạy
          </h2>
        </div>

        {courseSubtitle && (
          <p className="text-sm font-normal text-gray-600 leading-relaxed max-w-3xl pl-5" data-node-id="380:1688">
            {courseSubtitle}
          </p>
        )}
      </div>

      {/* 2. Metadata Toolbar: Buổi học, Thực hành, Capstone & Nút Expand All */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-6 border-b border-gray-100"
        data-node-id="380:1690"
      >
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-600 flex-wrap">
          <span className="font-semibold text-gray-800">{calculatedTotalSessions} Buổi học</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>{calculatedPractices} Bài thực hành</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          <span>{calculatedCapstones} dự án cuối khóa</span>
        </div>

        <button
          onClick={toggleExpandAll}
          type="button"
          className="text-xs sm:text-sm font-semibold text-[#AF445A] hover:text-[#8B1D2C] transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          data-node-id="380:1697"
        >
          {isAllExpanded ? (
            <>
              <span>Collapse all lessons</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Expand all lessons</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* 3. Danh sách các tuần theo chuẩn Figma 380:1502 */}
      <div className="space-y-6">
        {groupedWeeks.map((week, weekIndex) => (
          <div key={week.key} className="space-y-2.5" data-node-id={`week-group-${week.weekNum}`}>
            {/* Week Title Header */}
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                {week.label}
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {week.modules.length} buổi học
              </span>
            </div>

            {/* Khối các buổi học trong tuần */}
            <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs divide-y divide-gray-100">
              {week.modules.map((mod, modIndex) => {
                const isExpanded = expandedIds.has(mod.id);
                const dayNumber = mod.day ?? mod.moduleNumber ?? (weekIndex * 2 + modIndex + 1);
                const formattedNumber = String(dayNumber).padStart(2, "0");
                const rawTitle = (mod.sessionTitle || mod.title || "").trim();
                const sessionTitle = rawTitle.replace(/^Buổi\s*\d+:\s*/i, "").trim();
                const sessionDesc = mod.sessionDesc || mod.summary;
                const dots = (mod.subContent && mod.subContent.length > 0) ? mod.subContent : mod.bulletPoints;

                // Tự động nhận diện buổi thực hành (Practice) hoặc Capstone
                const isPractice = rawTitle.toLowerCase().includes("practice") || rawTitle.toLowerCase().includes("thực hành");
                const isCapstone = rawTitle.toLowerCase().includes("capstone") || rawTitle.toLowerCase().includes("đồ án") || mod.isMilestone;

                return (
                  <div key={mod.id} className="transition-colors">
                    {/* Hàng Session Header (Clickable) */}
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`w-full p-4 sm:p-4.5 flex items-center justify-between text-left cursor-pointer gap-3 sm:gap-4 transition-colors ${
                        isExpanded ? "bg-white" : "hover:bg-[#FAF7F8]/40"
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                        {/* Figma Session Number Badge */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm tracking-tight transition-colors ${
                            isCapstone
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : isPractice
                              ? "bg-pink-50 text-[#AF445A] border border-pink-200"
                              : "bg-white border border-[#EFE5E7] shadow-2xs"
                          }`}
                        >
                          {isCapstone || isPractice ? (
                            formattedNumber
                          ) : (
                            <span className="bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent font-extrabold">
                              {formattedNumber}
                            </span>
                          )}
                        </div>

                        {/* Title & Subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                              Buổi {dayNumber}: {sessionTitle}
                            </h4>

                            {isCapstone && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                                🏆 Capstone Project
                              </span>
                            )}
                            {isPractice && !isCapstone && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-pink-50 text-[#AF445A] border border-pink-200 shrink-0">
                                ⚡ Thực hành
                              </span>
                            )}
                          </div>

                          {sessionDesc && (
                            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5 line-clamp-1 leading-relaxed">
                              {sessionDesc}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Chevron Icon */}
                      <div className="shrink-0 flex items-center pl-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 text-gray-400 ${
                            isExpanded ? "rotate-180 text-[#AF445A]" : "group-hover:text-gray-600"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* 4. Dropdown Accordion Content (Chuẩn Figma node 381:2396) */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-white p-4 sm:p-5 pl-11 sm:pl-14 transition-all">
                        {dots && dots.length > 0 ? (
                          <div className="space-y-2.5">
                            {dots.map((point, pIndex) => (
                              <div key={pIndex} className="flex items-start gap-2.5 sm:gap-3">
                                {/* Verify SVG Icon từ node 381:2409 */}
                                <SealCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#BF687D] mt-0.5 shrink-0" />
                                <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed break-words flex-1">
                                  {point}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : sessionDesc ? (
                          <div className="flex items-start gap-2.5 sm:gap-3">
                            <SealCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#BF687D] mt-0.5 shrink-0" />
                            <p className="text-xs sm:text-sm text-[#4B5563] font-normal leading-relaxed break-words flex-1">
                              {sessionDesc}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
