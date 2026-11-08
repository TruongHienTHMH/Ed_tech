"use client";

import React, { useState } from "react";
import { CurriculumModule } from "@/lib/cms/types";

interface CourseFigmaWeekAccordionProps {
  modules: CurriculumModule[];
  courseTitle?: string;
}

export default function CourseFigmaWeekAccordion({
  modules,
}: CourseFigmaWeekAccordionProps) {
  // Group modules by weekNumber or weekLabel
  const groupedWeeks = React.useMemo(() => {
    const map = new Map<string, { label: string; modules: CurriculumModule[] }>();

    modules.forEach((mod, idx) => {
      const weekNum = mod.weekNumber || Math.ceil((idx + 1) / 2);
      const weekKey = `week-${weekNum}`;
      const weekLabel = mod.weekLabel || `Tuần ${weekNum}`;

      if (!map.has(weekKey)) {
        map.set(weekKey, { label: weekLabel, modules: [] });
      }
      map.get(weekKey)!.modules.push(mod);
    });

    return Array.from(map.entries()).map(([key, data]) => ({
      key,
      label: data.label,
      modules: data.modules.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }));
  }, [modules]);

  // State: expanded module IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Default open the first 2 modules
    const initial = new Set<string>();
    if (modules.length > 0) initial.add(modules[0].id);
    if (modules.length > 1) initial.add(modules[1].id);
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

  // Helper to parse date badge (e.g. "TH10 03" -> month: "TH10", day: "03")
  const parseDateBadge = (badge?: string, idx: number = 0) => {
    if (badge && badge.includes(" ")) {
      const parts = badge.split(" ");
      return { month: parts[0], day: parts[1] };
    }
    // Fallback date badge simulation for realistic look
    const days = ["03", "05", "26", "28", "01", "03", "05", "07", "10", "12", "15", "17"];
    const month = idx < 4 ? "TH10" : "TH11";
    const day = days[idx % days.length];
    return { month, day };
  };

  return (
    <section className="mb-12" id="curriculum">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Chương trình giảng dạy
            </h2>
          </div>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span>{modules.length || 12} Buổi học</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span>2 Bài thực hành lớn</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            <span>1 Dự án Capstone</span>
          </p>
        </div>

        <button
          onClick={toggleExpandAll}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#AF445A] bg-[#AF445A]/10 hover:bg-[#AF445A]/15 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          {isAllExpanded ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span>Thu gọn tất cả</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>Expand all lessons</span>
            </>
          )}
        </button>
      </div>

      {/* Week Accordion Groups */}
      <div className="space-y-6">
        {groupedWeeks.map((week, weekIndex) => (
          <div key={week.key} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            {/* Week Label Header */}
            <div className="bg-[#FAF7F8] px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#AF445A]" />
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {week.label}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {week.modules.length} buổi học
              </span>
            </div>

            {/* List of Sessions in Week */}
            <div className="divide-y divide-gray-100">
              {week.modules.map((mod, modIndex) => {
                const globalIndex = weekIndex * 2 + modIndex;
                const isExpanded = expandedIds.has(mod.id);
                const dateBadge = parseDateBadge(mod.sessionDateBadge, globalIndex);

                return (
                  <div key={mod.id} className="transition-colors hover:bg-gray-50/50">
                    {/* Session Row Header (Clickable) */}
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer gap-4"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Figma Square Date Badge */}
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-[#F5EFF2] border border-[#E9DFE4] flex flex-col items-center justify-center text-[#8B1D2C] leading-none">
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            {dateBadge.month}
                          </span>
                          <span className="text-base font-black mt-0.5">
                            {dateBadge.day}
                          </span>
                        </div>

                        {/* Title & Milestone Tag */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-xs font-semibold text-gray-500">
                              Buổi {mod.moduleNumber}:
                            </span>
                            {mod.isMilestone && (
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                                🌟 {mod.milestoneBadge || "Thực hành"}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-gray-900 truncate">
                            {mod.title.replace(/^Buổi\s*\d+:\s*/i, "")}
                          </h4>
                        </div>
                      </div>

                      {/* Right Chevron & Time Indicator */}
                      <div className="shrink-0 flex items-center gap-3">
                        <span className="hidden sm:inline-block text-xs text-gray-400 font-medium">
                          {mod.durationHours ? `${mod.durationHours}h` : "3 giờ"}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                            isExpanded ? "rotate-180 bg-[#AF445A]/10 text-[#AF445A]" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 pl-[4.5rem]">
                        {mod.summary && (
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed bg-[#FAF9FA] p-3 rounded-xl border border-gray-100">
                            {mod.summary}
                          </p>
                        )}

                        {mod.bulletPoints && mod.bulletPoints.length > 0 && (
                          <ul className="space-y-2">
                            {mod.bulletPoints.map((point, pIndex) => (
                              <li key={pIndex} className="text-sm text-gray-700 flex items-start gap-2.5">
                                <span className="text-[#AF445A] mt-0.5 font-bold">•</span>
                                <span className="flex-1">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
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

