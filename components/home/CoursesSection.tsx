"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Video } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
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
    level: c.level || "Live Class",
    rating: "5.0",
    studentsCount: 250 + i * 50,
    badge: c.isFeatured ? "Khóa học nổi bật" : "Live Class",
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
    <section id="courses" className="relative w-full bg-white py-14 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Upper Transition Header & Badge (Figma Node 12:779) */}
        <div className="flex flex-col items-center text-center mb-10 lg:mb-14">
          <div className="mb-3">
            <Badge variant="tag" size="md">
              KHÓA HỌC TẠI LYDATA
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-4xl lg:text-[40px] text-[#252525] tracking-tight mb-3 max-w-[700px]">
            Lựa chọn lộ trình phù hợp với mục tiêu của bạn
          </h2>
          <p className="text-[#676767] text-sm sm:text-base max-w-[620px] leading-relaxed">
            Học thực chiến cùng Mentor với các dự án thực tế, trang bị trọn bộ kỹ năng từ truy vấn cơ sở dữ liệu đến thiết kế báo cáo quản trị.
          </p>
        </div>

        {/* Course Card Showcase with Navigation Controls (Figma Node 12:778) */}
        <div className="relative">
          {/* Main Dark Card Container */}
          <div className="bg-[#1F242F] rounded-[24px] lg:rounded-[32px] p-6 sm:p-10 lg:p-12 text-white shadow-2xl overflow-hidden border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Course Details */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Badge Status */}
                <div className="flex items-center gap-2.5">
                  <Badge variant="gold" size="md">
                    {currentCourse.badge}
                  </Badge>
                  <Badge variant="liveClass" size="md">
                    Zoom Live 1:1 Support
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[34px] leading-snug lg:leading-[42px] tracking-tight text-white">
                  {currentCourse.title}
                </h3>

                {/* Description */}
                <p className="text-white/80 text-base sm:text-lg leading-relaxed font-normal">
                  {currentCourse.description}
                </p>

                {/* Badges: Sessions & Format */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-medium text-white/90">
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
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Button
                    href={`/courses/${currentCourse.slug}`}
                    variant="primary"
                    size="md"
                    className="font-semibold text-sm sm:text-base px-7"
                  >
                    Chi tiết khóa học
                  </Button>

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() =>
                      openLeadModal({
                        courseId: currentCourse.id,
                        ctaLocation: "course_section_slider",
                      })
                    }
                    className="border-white/20 hover:bg-white/10 font-semibold text-sm sm:text-base px-6"
                  >
                    Đăng ký tư vấn
                  </Button>

                  <div className="flex flex-col gap-1 sm:pl-2">
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
              className="lg:pointer-events-auto w-11 h-11 rounded-full bg-white text-[#252525] shadow-lg hover:bg-neutral-50 flex items-center justify-center border border-neutral-200 transition-all hover:scale-105 active:scale-95 lg:-ml-6 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Khóa học tiếp theo"
              className="lg:pointer-events-auto w-11 h-11 rounded-full bg-white text-[#252525] shadow-lg hover:bg-neutral-50 flex items-center justify-center border border-neutral-200 transition-all hover:scale-105 active:scale-95 lg:-mr-6 cursor-pointer"
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
                className={`h-2 transition-all rounded-full cursor-pointer ${
                  idx === currentIndex ? "w-8 bg-brand-gradient" : "w-2 bg-neutral-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lower Transition Highlights & Trust Badges (Figma Node 12:781) */}
        <div className="mt-12 pt-8 border-t border-neutral-100 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-neutral-600 font-medium">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AF445A]" />
            <span>12 - 15 buổi thực chiến / khóa</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC934]" />
            <span>Mentor 1:1 kèm trực tiếp cùng Founder</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Review CV & Hỗ trợ việc làm trọn đời</span>
          </div>
        </div>
      </div>
    </section>
  );
}
