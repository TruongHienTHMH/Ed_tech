"use client";

import React, { useState } from "react";
import { CurriculumModule } from "@/lib/cms/types";
import { ChevronDown, Check, Clock } from "@/components/common/Icons";

interface CourseCurriculumAccordionProps {
  modules: CurriculumModule[];
  courseTitle?: string;
}

export default function CourseCurriculumAccordion({
  modules,
}: CourseCurriculumAccordionProps) {
  // Initially expand the first 2 modules for quick preview
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (modules.length > 0) initial.add(modules[0].id);
    if (modules.length > 1) initial.add(modules[1].id);
    return initial;
  });

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

  const expandAll = () => {
    const all = new Set(modules.map((m) => m.id));
    setExpandedIds(all);
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Helper to parse bullets from string or array and handle multiline Alt+Enter (\n)
  const parseBulletPoints = (bullets: string[] | string | unknown): string[] => {
    if (!bullets) return [];
    if (Array.isArray(bullets)) {
      const flattened: string[] = [];
      for (const item of bullets) {
        if (typeof item === "string") {
          const lines = item
            .split(/\r?\n/)
            .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
            .filter(Boolean);
          flattened.push(...lines);
        }
      }
      return flattened;
    }
    if (typeof bullets === "string") {
      return bullets
        .split(/\r?\n/)
        .map((l) => l.trim().replace(/^[-*•]\s*/, ""))
        .filter(Boolean);
    }
    return [];
  };

  // Helper to detect milestone session
  const isMilestoneSession = (module: CurriculumModule): boolean => {
    const text = `${module.title} ${module.summary}`.toLowerCase();
    return (
      text.includes("midterm") ||
      text.includes("giữa kỳ") ||
      text.includes("final") ||
      text.includes("capstone") ||
      text.includes("portfolio") ||
      text.includes("cột mốc") ||
      text.includes("tốt nghiệp")
    );
  };

  return (
    <section id="curriculum" className="w-full bg-white py-14 lg:py-20 scroll-mt-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full bg-[#AF445A]/10 text-xs font-bold text-[#AF445A] uppercase tracking-wider">
                Giáo Trình Chi Tiết
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {modules.length} buổi học thực chiến
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#252525] tracking-tight">
              Đề Cương Môn Học Chi Tiết
            </h2>
            <p className="mt-2 text-neutral-600 text-sm sm:text-base">
              Lộ trình được thiết kế bài bản từ cơ bản đến chuyên sâu, bám sát các dự án thực tế trong doanh nghiệp.
            </p>
          </div>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            >
              Mở rộng tất cả
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            >
              Thu gọn tất cả
            </button>
          </div>
        </div>

        {/* Modules Accordion List */}
        <div className="space-y-3.5">
          {modules.map((module, index) => {
            const isExpanded = expandedIds.has(module.id);
            const bullets = parseBulletPoints(module.bulletPoints);
            const isMilestone = isMilestoneSession(module);

            return (
              <div
                key={module.id || `module-${index}`}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isMilestone
                  ? "border-amber-300 bg-amber-50/30"
                  : isExpanded
                    ? "border-[#AF445A]/40 bg-neutral-50/50 shadow-xs"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Session Number Pill */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-sm ${isMilestone
                        ? "bg-amber-500 text-white shadow-xs"
                        : isExpanded
                          ? "bg-brand-gradient text-white"
                          : "bg-neutral-100 text-neutral-700"
                        }`}
                    >
                      {String(module.moduleNumber || index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {isMilestone && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold">
                            ⭐ Cột mốc quan trọng
                          </span>
                        )}
                        <span className="text-xs text-neutral-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          {module.durationHours ? `${module.durationHours} giờ` : "2.5 - 3 giờ"}
                        </span>
                      </div>

                      <h3
                        className={`font-heading font-bold text-base sm:text-lg transition-colors leading-snug ${isExpanded ? "text-[#AF445A]" : "text-[#252525]"
                          }`}
                      >
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle Chevron */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${isExpanded ? "rotate-180 bg-neutral-200/70 text-[#AF445A]" : "bg-neutral-100 text-neutral-500"
                      }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Body Content */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-neutral-100 animate-in fade-in duration-200">
                    {/* Module Summary */}
                    {module.summary && (
                      <p className="text-sm font-medium text-neutral-700 bg-white p-3.5 rounded-xl border border-neutral-150 mb-4 leading-relaxed">
                        {module.summary}
                      </p>
                    )}

                    {/* Detailed Bullets List */}
                    {bullets.length > 0 && (
                      <ul className="space-y-2.5">
                        {bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-sm text-neutral-700 leading-relaxed"
                          >
                            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                            <span className="flex-1">{bullet}</span>
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
    </section>
  );
}

