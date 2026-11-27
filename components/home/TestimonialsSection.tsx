"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";
import { Testimonial } from "@/lib/cms/types";
import { seedTestimonials } from "@/data/seed-data";
import TestimonialDetailModal, { TestimonialModalItem } from "@/components/home/TestimonialDetailModal";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Repeats items enough times so the base set covers wide desktop viewports,
 * then duplicates the base set once for a pixel-exact seamless 0% -> -50% loop.
 */
function buildSeamlessTrack(items: TestimonialModalItem[], minBaseCount = 6): {
  trackItems: TestimonialModalItem[];
  baseCount: number;
} {
  if (items.length === 0) return { trackItems: [], baseCount: 0 };
  const base: TestimonialModalItem[] = [];
  while (base.length < minBaseCount) {
    base.push(...items);
  }
  return {
    trackItems: [...base, ...base],
    baseCount: base.length,
  };
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials = seedTestimonials,
}: TestimonialsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialModalItem | null>(null);
  const [isTouchPaused, setIsTouchPaused] = useState<boolean>(false);

  // Lấy toàn bộ danh sách testimonials từ Google Sheets / seed fallback
  const activeTestimonials = testimonials && testimonials.length > 0 ? testimonials : seedTestimonials;

  const displayList: TestimonialModalItem[] = activeTestimonials.map((t, idx) => ({
    id: t.id || `t-${idx}`,
    name: t.studentName,
    role: t.role || t.studentRole || "Khóa SQL for Data Analytics",
    quote: t.comment || t.reviewText || "Khóa học rất thực chiến.",
    rating: t.rating || 5,
    avatar: "/assets/mentor/icon-student-primary.svg",
  }));

  // Chia dữ liệu thành 2 hàng xen kẽ; nếu dữ liệu ít (< 2) thì fallback dùng chung displayList
  const rawRow1 = displayList.filter((_, idx) => idx % 2 === 0);
  const rawRow2 = displayList.filter((_, idx) => idx % 2 === 1);

  const rowsConfig = [
    {
      key: "row-1",
      direction: "left" as const,
      ...buildSeamlessTrack(rawRow1.length > 0 ? rawRow1 : displayList, 6),
    },
    {
      key: "row-2",
      direction: "right" as const,
      ...buildSeamlessTrack(rawRow2.length > 0 ? rawRow2 : displayList, 6),
    },
  ];

  const isGlobalPaused = isTouchPaused || selectedTestimonial !== null;

  return (
    <section
      id="testimonials"
      className="relative w-full bg-white py-10 sm:py-12 lg:py-14 overflow-hidden border-t border-neutral-100 scroll-mt-20 sm:scroll-mt-24"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header (Figma Node 12:892) */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-6 sm:mb-8">
          <div className="mb-2">
            <Badge variant="primary" size="md">
              ĐÁNH GIÁ THỰC TẾ
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[36px] leading-tight text-[#252525] mb-1.5">
            Đánh giá của học viên
          </h2>
          <p className="text-[#676767] text-sm sm:text-base font-normal max-w-[650px]">
            Cùng lắng nghe cảm nhận thực tế từ những học viên đã tham gia các khóa học tại LYDATA. Nhấp vào từng thẻ để đọc toàn bộ đánh giá.
          </p>
        </div>

        {/* 2-Row Alternating Infinite Marquee Tracks inside 1240px Safezone (Row 1: Left, Row 2: Right) */}
        <div
          className="relative w-full mask-marquee-edges space-y-1 sm:space-y-2"
          onTouchStart={() => setIsTouchPaused(true)}
          onTouchEnd={() => setIsTouchPaused(false)}
          onTouchCancel={() => setIsTouchPaused(false)}
        >
        {rowsConfig.map((row) => {
          const durationSec = Math.max(36, row.baseCount * 8);

          return (
            <div key={row.key} className="w-full overflow-hidden py-2">
              <div
                className={
                  row.direction === "left"
                    ? "animate-marquee-item"
                    : "animate-marquee-item-reverse"
                }
                style={{
                  ["--marquee-duration" as string]: `${durationSec}s`,
                  animationPlayState: isGlobalPaused ? "paused" : undefined,
                }}
              >
                {row.trackItems.map((item, idx) => {
                  const uniqueKey = `${row.key}-${item.id}-${idx}`;
                  const isHovered = hoveredId === uniqueKey;

                  return (
                    <div
                      key={uniqueKey}
                      onClick={() => setSelectedTestimonial(item)}
                      onMouseEnter={() => setHoveredId(uniqueKey)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={cn(
                        "group relative w-[270px] sm:w-[320px] lg:w-[360px] min-h-[190px] sm:min-h-[210px] shrink-0 mr-4 sm:mr-5 p-4 sm:p-5 rounded-[16px] flex flex-col justify-between transition-all duration-300 cursor-pointer select-none",
                        isHovered
                          ? "bg-gradient-to-r from-[#784080] to-[#AF445A] drop-shadow-[0px_0px_20px_rgba(175,68,90,0.25)] -translate-y-1 z-20"
                          : "bg-white border border-neutral-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#AF445A]/30"
                      )}
                    >
                      {/* Upper Section: 5 Golden Stars & Review Quote (giới hạn đúng 3 dòng) */}
                      <div className="flex flex-col gap-2.5">
                        {/* 5 Stars */}
                        <div className="flex items-center gap-[2px]">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-[#FFC934] fill-current shrink-0"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review Text - Giới hạn 3 dòng */}
                        <p
                          className={cn(
                            "font-medium text-[14px] sm:text-[15px] leading-[22px] line-clamp-3 transition-colors duration-200",
                            isHovered ? "text-white" : "text-[#686868]"
                          )}
                        >
                          “{item.quote}”
                        </p>
                      </div>

                      {/* Footer Section: Avatar + Student Meta */}
                      <div className="flex items-center gap-2.5 pt-3 mt-1.5">
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={
                              isHovered
                                ? "/assets/mentor/icon-student-white.svg"
                                : "/assets/mentor/icon-student-primary.svg"
                            }
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <h3
                            className={cn(
                              "font-bold text-[15px] sm:text-[16px] leading-[20px] tracking-[-0.02em] truncate transition-colors duration-200",
                              isHovered ? "text-white" : "text-[#2E2E2E]"
                            )}
                          >
                            {item.name}
                          </h3>
                          <p
                            className={cn(
                              "text-[12px] sm:text-[13px] leading-[18px] font-normal truncate transition-colors duration-200",
                              isHovered ? "text-white/85" : "text-[#686868]"
                            )}
                          >
                            {item.role}
                          </p>
                        </div>

                        <span
                          className={cn(
                            "text-[11px] sm:text-xs font-medium px-2 py-1 rounded transition-colors duration-200 shrink-0",
                            isHovered ? "bg-white/20 text-white" : "text-neutral-400 group-hover:text-[#AF445A]"
                          )}
                        >
                          Xem chi tiết
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Testimonial Detail Modal (Card) */}
      <TestimonialDetailModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </section>
  );
}
