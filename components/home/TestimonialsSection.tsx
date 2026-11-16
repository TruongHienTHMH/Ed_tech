"use client";

import React from "react";
import { Badge } from "@/components/common/Badge";
import { Testimonial } from "@/lib/cms/types";
import { seedTestimonials } from "@/data/seed-data";

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials = seedTestimonials }: TestimonialsSectionProps) {
  const activeTestimonials = (testimonials && testimonials.length > 0 ? testimonials : seedTestimonials).slice(0, 6);
  const displayList = activeTestimonials.map((t, idx) => ({
    id: t.id || `t-${idx}`,
    name: t.studentName,
    role: t.studentRole || "Học viên DataWithLy",
    quote: t.comment || t.reviewText || "Khóa học rất thực chiến.",
    rating: t.rating || 5,
  }));

  return (
    <section id="testimonials" className="relative w-full bg-white py-16 lg:py-24 overflow-hidden border-t border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header (Figma Node 12:892) */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-12">
          <div className="mb-3">
            <Badge variant="tag" size="md">
              ĐÁNH GIÁ THỰC TẾ
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#252525] mb-2">
            Đánh giá của học viên
          </h2>
          <p className="text-[#676767] text-base font-normal max-w-[650px]">
            Cùng lắng nghe cảm nhận thực tế từ những học viên đã tham gia các khóa học tại Lydata.
          </p>
        </div>

        {/* Testimonials 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#FFC934] mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-neutral-700 text-sm sm:text-[15px] leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Student Info - Clean typography without avatar as requested */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div>
                  <h3 className="font-bold text-sm text-[#252525]">{item.name}</h3>
                  <p className="text-xs text-[#784080] font-medium mt-0.5">{item.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Học viên xác thực
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
