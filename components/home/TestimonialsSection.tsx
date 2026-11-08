"use client";

import React from "react";
import { User } from "@/components/common/Icons";
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
    <section id="testimonials" className="relative w-full bg-white py-16 lg:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-12">
          <div className="mb-3">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#AF445A] bg-white font-bold text-xs tracking-wider uppercase text-brand-gradient">
              ĐÁNH GIÁ THỰC TẾ
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#252525] mb-2">
            Đánh giá của học viên
          </h2>
          <p className="text-[#676767] text-base font-normal">
            Cùng lắng nghe cảm nhận thực tế từ những học viên đã tham gia các khóa học tại Lydata.
          </p>
        </div>

        {/* Testimonials 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
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
                  {item.quote}
                </p>
              </div>

              {/* Student Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#AF445A]/15 to-[#784080]/15 flex items-center justify-center shrink-0 border border-[#AF445A]/20">
                  <User className="w-5 h-5 text-[#AF445A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#252525]">{item.name}</h3>
                  <p className="text-xs text-[#784080] font-medium">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
