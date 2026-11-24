"use client";

import React from "react";
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
}: CourseFigmaStickySidebarProps) {
  // Format VND currency deterministic across Server and Client (no ICU whitespace mismatch)
  const formatVnd = (amount?: number) => {
    if (!amount) return "5.690.000";
    return Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Format ngày tháng năm tiếng Việt chuẩn (deterministic string parser, không phụ thuộc múi giờ Server UTC vs Client GMT+7)
  const formatVietnameseDate = (rawDate?: string) => {
    if (!rawDate) return "Liên hệ để có thêm thông tin nhé";
    if (rawDate.includes("tháng")) return rawDate;

    const cleanDate = rawDate.split("T")[0].trim();
    const isoParts = cleanDate.split("-");
    if (isoParts.length === 3 && isoParts[0].length === 4) {
      const year = isoParts[0];
      const month = parseInt(isoParts[1], 10);
      const day = parseInt(isoParts[2], 10);
      if (!isNaN(day) && !isNaN(month)) {
        return `${day} tháng ${month}, ${year}`;
      }
    }

    const slashParts = cleanDate.split("/");
    if (slashParts.length === 3) {
      const day = parseInt(slashParts[0], 10);
      const month = parseInt(slashParts[1], 10);
      const year = slashParts[2];
      if (!isNaN(day) && !isNaN(month)) {
        return `${day} tháng ${month}, ${year}`;
      }
    }

    return rawDate;
  };

  const handleRegisterClick = () => {
    openLeadModal({
      courseId: course.id,
      ctaLocation: "sticky_sidebar_cta",
    });
  };

  return (
    <aside className="w-full lg:w-[384px] shrink-0 lg:sticky lg:top-24 lg:self-start z-20">
      {/* Khung Sidebar chuẩn 4-point grid: p-5 (20px), rounded-2xl (16px), loại bỏ hoàn toàn scrollbar */}
      <div className="bg-white border border-[#EFE5E7] rounded-2xl p-5 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:border-[#AF445A]/30 transition-all duration-300">
        {/* 1. Course Thumbnail: h-40 (160px = 40*4px), rounded-xl (12px), mb-3 (12px) */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-gray-100 border border-gray-100 group-hover:scale-[1.01] transition-transform duration-300">
          <SafeImage
            src={resolveImageUrl(course.coverImageUrl, "course", course.slug || course.id)}
            fallbackSrc={getFigmaFallback("course", course.slug || course.id)}
            alt={course.title}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 384px"
          />
          <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-xs">
            {course.tag || "Chuyên sâu"}
          </div>

          {course.courseKind && (
            <div className="absolute top-2.5 right-2.5 bg-[#AF445A] text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-10 shadow-xs">
              {course.courseKind}
            </div>
          )}
        </div>

        {/* 2. Course Title: text-base (16px), mb-2 (8px = 2*4px) */}
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
          {course.title}
        </h3>

        {/* 3. Price Section: mb-3 (12px), pb-3 (12px), gap-2 (8px) */}
        <div className="flex items-baseline justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span suppressHydrationWarning className="text-2xl font-black text-[#8B1D2C] tracking-tight">
                {formatVnd(course.tuitionVnd)}
              </span>
              <span className="text-xs font-bold text-[#8B1D2C]">VND</span>
            </div>
            {course.originalTuitionVnd && (
              <span suppressHydrationWarning className="text-[11px] text-gray-400 line-through">
                {formatVnd(course.originalTuitionVnd)} VND
              </span>
            )}
          </div>

          {course.originalTuitionVnd && course.tuitionVnd && (
            <span suppressHydrationWarning className="text-[11px] font-bold text-[#AF445A] bg-[#AF445A]/10 px-2 py-0.5 rounded-md">
              Tiết kiệm {Math.round((1 - course.tuitionVnd / course.originalTuitionVnd) * 100)}%
            </span>
          )}
        </div>

        {/* 4. Primary CTA Button: mb-4 (16px = 4*4px) */}
        <div className="mb-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleRegisterClick}
            className="bg-gradient-to-r from-[#AF445A] to-[#784080] hover:opacity-95 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base active:scale-[0.98]"
          >
            Nhận tư vấn 1 : 1
          </Button>
        </div>

        {/* 5. Key Course Metadata: space-y-2 (8px = 2*4px) */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span>📅</span> Khai giảng:
            </span>
            <span suppressHydrationWarning className="font-bold text-gray-900">
              {formatVietnameseDate(course.curriculumModules?.[0]?.startDate)}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span>⏱️</span> Thời lượng:
            </span>
            <span className="font-bold text-gray-900">{course.totalSessions || 12} buổi học</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span>👥</span> Hình thức:
            </span>
            <span className="font-bold text-gray-900">{course.studyStyle || "Live Class"}</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span>🎯</span> Trình độ:
            </span>
            <span className="font-bold text-gray-900">{course.level || "Beginner"}</span>
          </div>

          {/* 6. Inclusions List: pt-3 (12px), mt-3 (12px), space-y-2 (8px) */}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-2">
              Khóa học bao gồm:
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-2">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="✓"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>{course.totalSessions || 12} Buổi Live trực tiếp cùng Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="✓"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>{course.practiceCount || 4} Bài thực hành Hands-on Labs chấm điểm</span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="✓"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>{course.capstoneCount || 1} Dự án Capstone thực tế cho Portfolio</span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="✓"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>Mentor trực tiếp sửa code & tư vấn CV 1-on-1</span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="✓"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 shrink-0"
                />
                <span>Xem lại video record chất lượng cao trọn đời</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
