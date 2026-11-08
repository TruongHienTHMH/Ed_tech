"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Video } from "@/components/common/Icons";
import { Course } from "@/lib/cms/types";
import { seedCourses } from "@/data/seed-data";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface CoursesSectionProps {
  courses?: Course[];
}

export default function CoursesSection({ courses = seedCourses }: CoursesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeCourses = (courses && courses.length > 0 ? courses : seedCourses).map((c, i) => ({
    id: c.id || `course-${i}`,
    title: c.title,
    slug: c.slug || `course-${i}`,
    description: c.description || c.title,
    duration: c.duration || "27 buổi",
    level: c.level || "Live class",
    rating: "5.0",
    studentsCount: 250 + i * 50,
    badge: c.isFeatured ? "Khóa học mới" : "Nổi bật",
    thumbnail: c.coverImageUrl || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
  }));

  const currentCourse = activeCourses[currentIndex] || activeCourses[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeCourses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < activeCourses.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="courses" className="relative w-full bg-white py-12 lg:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Course Card Showcase with Navigation Controls */}
        <div className="relative">
          {/* Main Dark Card Container */}
          <div className="bg-[#1F242F] rounded-[24px] lg:rounded-[32px] p-6 sm:p-10 lg:p-14 text-white shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Course Details */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Badge */}
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full border border-[#AF445A] bg-white font-bold text-sm text-brand-gradient shadow-sm">
                    {currentCourse.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-snug lg:leading-[42px] tracking-tight text-white">
                  {currentCourse.title}
                </h2>

                {/* Description */}
                <p className="text-white/80 text-base sm:text-lg leading-relaxed font-normal">
                  {currentCourse.description}
                </p>

                {/* Badges: Sessions & Format */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10">
                    <Clock className="w-4 h-4 text-[#FFC934]" />
                    <span>{currentCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-lg border border-white/10">
                    <Video className="w-4 h-4 text-[#AF445A]" />
                    <span>{currentCourse.level}</span>
                  </div>
                </div>

                {/* CTA & Review Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link
                    href={`/courses/${currentCourse.slug}`}
                    className="inline-flex items-center justify-center bg-brand-gradient hover:opacity-95 text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Chi tiết khóa học
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      openLeadModal({
                        courseId: currentCourse.id,
                        ctaLocation: "course_section_slider",
                      })
                    }
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-6 py-3.5 rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    Đăng ký tư vấn
                  </button>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-[#FFC934]">
                        {"★".repeat(5)}
                      </div>
                      <span className="font-bold text-sm text-white">({currentCourse.rating})</span>
                    </div>
                    <span className="text-xs text-white/70">
                      {currentCourse.studentsCount}+ học viên đã tham gia
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Thumbnail Showcase */}
              <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-square max-h-[380px] rounded-2xl overflow-hidden shadow-xl border-2 border-white/10">
                <Image
                  src={currentCourse.thumbnail}
                  alt={currentCourse.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Slider Prev / Next Controls (Desktop Floated, Mobile Inline) */}
          <div className="flex items-center justify-between mt-6 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-full lg:left-0 lg:pointer-events-none px-2 lg:-px-4">
            <button
              onClick={handlePrev}
              aria-label="Khóa học trước"
              className="lg:pointer-events-auto w-11 h-11 rounded-full bg-white text-[#252525] shadow-lg hover:bg-neutral-50 flex items-center justify-center border border-neutral-200 transition-all hover:scale-105 active:scale-95 lg:-ml-6"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Khóa học tiếp theo"
              className="lg:pointer-events-auto w-11 h-11 rounded-full bg-white text-[#252525] shadow-lg hover:bg-neutral-50 flex items-center justify-center border border-neutral-200 transition-all hover:scale-105 active:scale-95 lg:-mr-6"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {activeCourses.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển tới slide ${idx + 1}`}
                className={`h-2 transition-all rounded-full ${
                  idx === currentIndex ? "w-8 bg-brand-gradient" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
