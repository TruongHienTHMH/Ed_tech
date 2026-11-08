"use client";

import React from "react";
import Image from "next/image";
import { Course } from "@/lib/cms/types";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface CourseFigmaStickySidebarProps {
  course: Course;
}

export default function CourseFigmaStickySidebar({ course }: CourseFigmaStickySidebarProps) {
  // Format VND currency
  const formatVnd = (amount?: number) => {
    if (!amount) return "5.699.000";
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const handleRegisterClick = () => {
    openLeadModal({
      courseId: course.id,
      ctaLocation: "sticky_sidebar_cta",
    });
  };

  const handleConsultClick = () => {
    openLeadModal({
      courseId: course.id,
      ctaLocation: "sticky_sidebar_consult",
    });
  };

  return (
    <aside className="w-full lg:w-[384px] shrink-0">
      <div className="sticky top-24 bg-white border border-[#EFE5E7] rounded-3xl p-6 shadow-lg shadow-gray-200/50 overflow-hidden">
        {/* Course Thumbnail */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 bg-gray-100 border border-gray-100">
          <Image
            src={course.coverImageUrl || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png"}
            alt={course.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 384px"
            priority
          />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            {course.tag || "Chuyên sâu"}
          </div>
        </div>

        {/* Price & Rating Header */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#8B1D2C] tracking-tight">
                {formatVnd(course.tuitionVnd)}
              </span>
              <span className="text-sm font-bold text-[#8B1D2C]">VND</span>
            </div>
            {course.originalTuitionVnd && (
              <span className="text-xs text-gray-400 line-through">
                {formatVnd(course.originalTuitionVnd)} VND
              </span>
            )}
          </div>

          {/* Star Rating from Figma */}
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
            <span className="text-amber-500 text-sm">⭐</span>
            <span className="text-xs font-bold text-gray-900">4.8</span>
            <span className="text-[11px] text-gray-500">(143)</span>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleRegisterClick}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white text-base font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Đăng kí ngay</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleConsultClick}
            className="w-full py-3 px-6 bg-[#FAF7F8] hover:bg-[#F3EEF1] text-gray-800 text-sm font-semibold rounded-2xl border border-[#EFE5E7] transition-colors cursor-pointer text-center"
          >
            Nhận tư vấn lộ trình 1-on-1
          </button>
        </div>

        {/* Key Course Inclusions & Metadata */}
        <div className="border-t border-gray-100 pt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-2 text-gray-500">
              <span>📅</span> Ngày bắt đầu:
            </span>
            <span className="font-bold text-gray-900">26 tháng 10, 2026</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-2 text-gray-500">
              <span>⏱️</span> Thời lượng:
            </span>
            <span className="font-bold text-gray-900">{course.duration || "12 buổi (6 tuần)"}</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <span className="flex items-center gap-2 text-gray-500">
              <span>👥</span> Hình thức:
            </span>
            <span className="font-bold text-gray-900">Zoom Meeting</span>
          </div>

          {/* Inclusions List */}
          <div className="pt-2">
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Khóa học bao gồm:
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>12 Buổi học Live tương tác trực tiếp cùng Mentor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>2 Bài thực hành lớn (Hands-on Labs) có chấm điểm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>1 Dự án tốt nghiệp Capstone đa chiều cho Portfolio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Mentor trực tiếp sửa code & tư vấn CV 1-on-1</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Xem lại video record chất lượng cao trọn đời</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safe Guarantee Note */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
          <span>🛡️</span>
          <span>Bảo lưu tối đa 6 tháng • Hoàn tiền 100% nếu không hài lòng sau 2 buổi</span>
        </div>
      </div>
    </aside>
  );
}

