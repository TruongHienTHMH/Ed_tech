"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Course } from "@/lib/cms/types";
import { openLeadModal } from "@/components/forms/LeadModalManager";
import { Button } from "@/components/common/Button";
import { SafeImage } from "@/components/common/SafeImage";
import { resolveImageUrl, getFigmaFallback } from "@/lib/constants/image-fallbacks";

interface CourseFigmaStickySidebarProps {
  course: Course;
  allCourses?: Course[];
}

export default function CourseFigmaStickySidebar({
  course,
  allCourses = [],
}: CourseFigmaStickySidebarProps) {
  // Đặt course hiện tại lên đầu danh sách (Slide 01), các khóa học khác nối theo sau
  const courseList = React.useMemo(() => {
    if (!allCourses || allCourses.length === 0) return [course];
    const others = allCourses.filter(
      (c) => c.id !== course.id && c.slug?.toLowerCase() !== course.slug?.toLowerCase()
    );
    return [course, ...others];
  }, [course, allCourses]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeCourse = courseList[currentIndex] || course;
  const hasMultipleCourses = courseList.length > 1;

  // Thời gian tự động trượt: 5000ms (5 giây)
  const AUTOPLAY_INTERVAL = 5000;

  // Autoplay Effect: Tự động trượt sang khóa học tiếp theo (Tạm dừng khi rê chuột)
  useEffect(() => {
    if (!hasMultipleCourses || isPaused) return;

    const timer = setInterval(() => {
      setSlideDirection("next");
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev < courseList.length - 1 ? prev + 1 : 0));
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [hasMultipleCourses, isPaused, courseList.length]);

  // Reset cờ transition sau animation
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isTransitioning]);

  // Format VND currency
  const formatVnd = (amount?: number) => {
    if (!amount) return "5.690.000";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Format ngày tháng năm tiếng Việt chuẩn
  const formatVietnameseDate = (rawDate?: string) => {
    if (!rawDate) return "Liên hệ để có thêm thông tin nhé";
    if (rawDate.includes("tháng")) return rawDate;

    const isoParts = rawDate.trim().split("-");
    if (isoParts.length === 3 && isoParts[0].length === 4) {
      const year = isoParts[0];
      const month = parseInt(isoParts[1], 10);
      const day = parseInt(isoParts[2], 10);
      if (!isNaN(day) && !isNaN(month)) {
        return `${day} tháng ${month}, ${year}`;
      }
    }

    const slashParts = rawDate.trim().split("/");
    if (slashParts.length === 3) {
      const day = parseInt(slashParts[0], 10);
      const month = parseInt(slashParts[1], 10);
      const year = slashParts[2];
      if (!isNaN(day) && !isNaN(month)) {
        return `${day} tháng ${month}, ${year}`;
      }
    }

    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        return `${d.getDate()} tháng ${d.getMonth() + 1}, ${d.getFullYear()}`;
      }
    } catch {
      // Fallback
    }

    return rawDate;
  };

  const handleRegisterClick = () => {
    openLeadModal({
      courseId: activeCourse.id,
      ctaLocation: "sticky_sidebar_cta",
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection("prev");
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : courseList.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideDirection("next");
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev < courseList.length - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setSlideDirection(idx > currentIndex ? "next" : "prev");
    setIsTransitioning(true);
    setCurrentIndex(idx);
  };

  return (
    <aside className="w-full lg:w-[384px] shrink-0">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative sticky top-24 bg-white border border-[#EFE5E7] rounded-3xl p-6 shadow-lg shadow-gray-200/50 overflow-hidden group hover:shadow-xl hover:border-[#AF445A]/30 transition-all duration-300"
      >
        {/* Animated Progress Bar: Thanh chỉ báo tự động trượt mượt mà trên cùng */}
        {hasMultipleCourses && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
            <div
              key={currentIndex}
              style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
              className={`h-full bg-gradient-to-r from-[#AF445A] to-[#784080] ${
                isPaused ? "animate-none w-full opacity-30" : "animate-progress-bar"
              }`}
            />
          </div>
        )}

        {/* Slider Navigation Bar (Khi có nhiều hơn 1 khóa học) */}
        {hasMultipleCourses && (
          <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-gray-100 pt-1">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPaused ? "bg-amber-400" : "bg-[#AF445A] animate-pulse"}`} />
              <span className="text-xs font-bold text-gray-700 tracking-tight">
                {currentIndex === 0 ? "Khóa học đang xem" : "Khóa học nổi bật khác"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-400 tabular-nums">
                {String(currentIndex + 1).padStart(2, "0")} / {String(courseList.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#AF445A]/10 hover:text-[#AF445A] text-gray-600 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                  title="Khóa học trước"
                  aria-label="Khóa học trước"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#AF445A]/10 hover:text-[#AF445A] text-gray-600 flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                  title="Khóa học tiếp theo"
                  aria-label="Khóa học tiếp theo"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Animated Content Body with smooth horizontal slide */}
        <div
          key={`${activeCourse.id}-${currentIndex}`}
          className={`transition-all duration-300 ease-out ${
            slideDirection === "next" ? "animate-slide-in-right" : "animate-slide-in-left"
          }`}
        >
          {/* Course Thumbnail */}
          <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100 border border-gray-100 group-hover:scale-[1.01] transition-transform duration-300">
            <SafeImage
              src={resolveImageUrl(activeCourse.coverImageUrl, "course", activeCourse.slug || activeCourse.id)}
              fallbackSrc={getFigmaFallback("course", activeCourse.slug || activeCourse.id)}
              alt={activeCourse.title}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 1024px) 100vw, 384px"
              priority
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full z-10 shadow-xs">
              {activeCourse.tag || "Chuyên sâu"}
            </div>

            {activeCourse.courseKind && (
              <div className="absolute top-3 right-3 bg-[#AF445A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-xs">
                {activeCourse.courseKind}
              </div>
            )}
          </div>

          {/* Course Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-3 min-h-[44px]">
            {activeCourse.title}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#8B1D2C] tracking-tight">
                  {formatVnd(activeCourse.tuitionVnd)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#8B1D2C]">VND</span>
              </div>
              {activeCourse.originalTuitionVnd && (
                <span className="text-xs text-gray-400 line-through">
                  {formatVnd(activeCourse.originalTuitionVnd)} VND
                </span>
              )}
            </div>

            {activeCourse.originalTuitionVnd && activeCourse.tuitionVnd && (
              <span className="text-xs font-bold text-[#AF445A] bg-[#AF445A]/10 px-2 py-1 rounded-lg">
                Tiết kiệm {Math.round((1 - activeCourse.tuitionVnd / activeCourse.originalTuitionVnd) * 100)}%
              </span>
            )}
          </div>

          {/* Primary CTA Button */}
          <div className="space-y-2 mb-5">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleRegisterClick}
              className="bg-gradient-to-r from-[#AF445A] to-[#784080] hover:opacity-95 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base active:scale-[0.98]"
            >
              Nhận tư vấn 1 : 1
            </Button>
          </div>

          {/* Key Course Metadata */}
          <div className="space-y-3.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2 text-gray-500">
                <span>📅</span> Khai giảng:
              </span>
              <span className="font-bold text-gray-900">
                {formatVietnameseDate(activeCourse.curriculumModules?.[0]?.startDate)}
              </span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2 text-gray-500">
                <span>⏱️</span> Thời lượng:
              </span>
              <span className="font-bold text-gray-900">{activeCourse.totalSessions || 12} buổi học</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2 text-gray-500">
                <span>👥</span> Hình thức:
              </span>
              <span className="font-bold text-gray-900">{activeCourse.studyStyle || "Live Class"}</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center gap-2 text-gray-500">
                <span>🎯</span> Trình độ:
              </span>
              <span className="font-bold text-gray-900">{activeCourse.level || "Beginner"}</span>
            </div>

            {/* Inclusions List */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2.5">
                Khóa học bao gồm:
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <Image
                    src="/assets/decorations/verify.svg"
                    alt="✓"
                    width={15}
                    height={15}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>{activeCourse.totalSessions || 12} Buổi học Live tương tác trực tiếp cùng Mentor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src="/assets/decorations/verify.svg"
                    alt="✓"
                    width={15}
                    height={15}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>{activeCourse.practiceCount || 4} Bài thực hành lớn (Hands-on Labs) có chấm điểm</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src="/assets/decorations/verify.svg"
                    alt="✓"
                    width={15}
                    height={15}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>{activeCourse.capstoneCount || 1} Dự án tốt nghiệp Capstone đa chiều cho Portfolio</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src="/assets/decorations/verify.svg"
                    alt="✓"
                    width={15}
                    height={15}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>Mentor trực tiếp sửa code & tư vấn CV 1-on-1</span>
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src="/assets/decorations/verify.svg"
                    alt="✓"
                    width={15}
                    height={15}
                    className="w-3.5 h-3.5 shrink-0"
                  />
                  <span>Xem lại video record chất lượng cao trọn đời</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pagination Dots (Khi có nhiều hơn 1 khóa học) */}
        {hasMultipleCourses && (
          <div className="flex items-center justify-center gap-1.5 pt-4 mt-3 border-t border-gray-100">
            {courseList.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleDotClick(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? "w-6 h-1.5 bg-[#AF445A]"
                    : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300"
                }`}
                title={`Chuyển đến: ${c.title}`}
                aria-label={`Chuyển đến: ${c.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

