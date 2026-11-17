"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Video } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Course } from "@/lib/cms/types";
import { seedCourses } from "@/data/seed-data";
import { SafeImage } from "@/components/common/SafeImage";
import { resolveImageUrl, getFigmaFallback } from "@/lib/constants/image-fallbacks";

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
    level: c.level || "Live Class",
    rating: "5.0",
    studentsCount: 250 + i * 50,
    courseKind:
      c.courseKind ||
      (c.slug === "end-to-end-analytics" || c.id === "end-to-end-analytics"
        ? "Khóa học nổi bật"
        : c.slug === "sql-for-data-analytics"
          ? "Khóa học nền tảng"
          : "Khóa học chuyên sâu"),
    thumbnail: resolveImageUrl(c.coverImageUrl, "course", c.slug || c.id),
  }));

  const currentCourse = activeCourses[currentIndex] || activeCourses[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeCourses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < activeCourses.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="courses" className="relative w-full bg-[#1F242F] text-white overflow-hidden">
      {/* Upper Transition Banner (Figma Node 12:779) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-upper.png"
          alt="Transition Upper Banner"
          width={3840}
          height={100}
          className="w-full h-auto max-h-[40px] sm:max-h-[60px] object-cover"
          priority
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-12 sm:pb-16 relative">
        {/* Course Card Showcase with Navigation Controls (Figma Node 157:847 / 157:858) */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mx-8 sm:mx-12 lg:mx-16">
            {/* Left Column: Course Details (Figma Frame 1000005346) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Badge Status (Figma Button 6) */}
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center bg-white border-[1.5px] border-[#AF445A] rounded-[35px] px-5 py-2 shrink-0 shadow-xs">
                  <span className="font-bold text-sm sm:text-base bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent tracking-tight">
                    {currentCourse.courseKind || "Khóa học mới"}
                  </span>
                </div>
              </div>

              {/* Title (Figma 1590:5038) */}
              <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-tight lg:leading-[42px] tracking-tight text-white">
                {currentCourse.title}
              </h3>

              {/* Description (Figma 1590:5039) */}
              <p className="text-white/85 text-base sm:text-[18px] leading-[26px] font-normal max-w-[580px]">
                {currentCourse.description}
              </p>

              {/* Badges: Sessions & Format (Figma Frame 8) */}
              <div className="flex items-center gap-6 text-sm sm:text-base font-normal text-white">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/90" />
                  <span>{currentCourse.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-white/90" />
                  <span>{currentCourse.level}</span>
                </div>
              </div>

              {/* CTA & Review Row (Figma Frame 1000007429) */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
                <Button
                  href={`/courses/${currentCourse.slug}`}
                  variant="primary"
                  size="md"
                  className="font-medium text-sm sm:text-base px-8 py-3.5 rounded-[8px] bg-gradient-to-r from-[#AF445A] to-[#784080] text-white hover:opacity-95 shadow-md"
                >
                  Chi tiết khóa học
                </Button>

                <div className="flex flex-col gap-1 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#FFC934] text-base tracking-wider" aria-label="5 sao">
                      {"★".repeat(5)}
                    </div>
                    <span className="text-white text-sm sm:text-base font-normal">({currentCourse.rating})</span>
                  </div>
                  <span className="text-white/75 text-xs sm:text-sm font-normal">
                    {currentCourse.studentsCount}+ học viên đã tham gia
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Thumbnail Showcase (Figma Node 157:858) */}
            <div className="lg:col-span-5 relative w-full h-[260px] sm:h-[320px] lg:h-[389px] rounded-[26px] overflow-hidden shadow-2xl border border-white/10 bg-[#151922]">
              <SafeImage
                src={currentCourse.thumbnail}
                fallbackSrc={getFigmaFallback("course", currentCourse.slug || currentCourse.id)}
                alt={currentCourse.title}
                fill
                containerClassName="w-full h-full"
                sizes="(max-width: 1024px) 100vw, 570px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Dots Indicator inside Section (Figma Frame 1000007430) */}
          <div className="flex items-center justify-center gap-2 pt-8 sm:pt-10">
            {activeCourses.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Chuyển tới khóa học ${idx + 1}`}
                className={`transition-all duration-300 cursor-pointer ${idx === currentIndex
                    ? "w-6 h-2 rounded-full bg-gradient-to-r from-[#AF445A] to-[#784080]"
                    : "w-2 h-2 rounded-full bg-white/40 hover:bg-white/70"
                  }`}
              />
            ))}
          </div>

          {/* Slider Prev / Next Controls (Figma Frame 1000007435 - Floating on Desktop sides) */}
          <div className="hidden lg:flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full left-0 pointer-events-none">
            <button
              onClick={handlePrev}
              aria-label="Khóa học trước"
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#FAF9F9] text-[#252525] shadow-xl hover:bg-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 -ml-4 xl:-ml-6 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Khóa học tiếp theo"
              className="pointer-events-auto w-12 h-12 rounded-full bg-[#FAF9F9] text-[#252525] shadow-xl hover:bg-white flex items-center justify-center border border-white/20 transition-all hover:scale-105 active:scale-95 -mr-4 xl:-mr-6 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Lower Transition Highlights & Trust Badges (Figma Node 12:781) */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-white/80 font-medium">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AF445A]" />
            <span>Học qua Case Study thực tế</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC934]" />
            <span>Học trực tiếp &amp; nhận Feedback</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Định hướng nghề nghiệp &amp; Review CV.</span>
          </div>
        </div>
      </div>

      {/* Lower Transition Banner (Figma Node 12:781 / 157:849) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-lower.png"
          alt="Transition Lower Banner"
          width={3840}
          height={100}
          className="w-full h-auto max-h-[40px] sm:max-h-[60px] object-cover"
        />
      </div>
    </section>
  );
}
