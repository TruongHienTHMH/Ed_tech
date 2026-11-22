"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";
import { Testimonial } from "@/lib/cms/types";
import { seedTestimonials } from "@/data/seed-data";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials = seedTestimonials,
}: TestimonialsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeTestimonials = (
    testimonials && testimonials.length > 0 ? testimonials : seedTestimonials
  ).slice(0, 9);

  const displayList = activeTestimonials.map((t, idx) => ({
    id: t.id || `t-${idx}`,
    name: t.studentName,
    role: t.role || t.studentRole || "Khóa SQL for Data Analytics",
    quote: t.comment || t.reviewText || "Khóa học rất thực chiến.",
    rating: t.rating || 5,
  }));

  return (
    <section
      id="testimonials"
      className="relative w-full bg-white py-16 lg:py-24 overflow-hidden border-t border-neutral-100"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header (Figma Node 12:892) */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-12">
          <div className="mb-3">
            <Badge variant="primary" size="md">
              ĐÁNH GIÁ THỰC TẾ
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#252525] mb-2">
            Đánh giá của học viên
          </h2>
          <p className="text-[#676767] text-base font-normal max-w-[650px]">
            Cùng lắng nghe cảm nhận thực tế từ những học viên đã tham gia các khóa học tại LYDATA.
          </p>
        </div>

        {/* Testimonials 3x3 Grid (Figma Node 12:898) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "group relative min-h-[272px] p-6 rounded-[16px] flex flex-col justify-between transition-all duration-300 cursor-pointer select-none",
                  isHovered
                    ? "bg-gradient-to-r from-[#784080] to-[#AF445A] drop-shadow-[0px_0px_20px_rgba(175,68,90,0.25)] -translate-y-1.5"
                    : "bg-white border border-neutral-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#AF445A]/30"
                )}
              >
                {/* Upper Section: 5 Golden Stars & Review Quote */}
                <div className="flex flex-col gap-3">
                  {/* 5 Stars (Figma Node 12:902 - 20x20 gap 2px #FFC934) */}
                  <div className="flex items-center gap-[2px]">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-[#FFC934] fill-current shrink-0"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p
                    className={cn(
                      "font-medium text-[16px] sm:text-[17px] leading-[26px] line-clamp-4 transition-colors duration-200",
                      isHovered ? "text-white" : "text-[#686868]"
                    )}
                  >
                    “{item.quote}”
                  </p>
                </div>

                {/* Footer Section: Avatar + Student Meta */}
                <div className="flex items-center gap-3 pt-4 mt-2">
                  {/* Dynamic Avatar based on Hover State */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={
                        isHovered
                          ? "/assets/mentor/icon-student-white.svg"
                          : "/assets/mentor/icon-student-primary.svg"
                      }
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Name & Course / Role */}
                  <div className="flex flex-col min-w-0">
                    <h3
                      className={cn(
                        "font-bold text-[17px] sm:text-[18px] leading-[24px] tracking-[-0.02em] truncate transition-colors duration-200",
                        isHovered ? "text-white" : "text-[#2E2E2E]"
                      )}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={cn(
                        "text-[14px] sm:text-[15px] leading-[20px] font-normal truncate transition-colors duration-200",
                        isHovered ? "text-white/85" : "text-[#686868]"
                      )}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
