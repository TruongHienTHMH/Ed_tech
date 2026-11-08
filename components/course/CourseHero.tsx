"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/cms/types";
import { Clock, Video, CheckCircle2, ChevronRight, User } from "@/components/common/Icons";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
  // Format currency in Vietnamese format (VND)
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const discountPercent =
    course.originalTuitionVnd && course.originalTuitionVnd > course.tuitionVnd
      ? Math.round(((course.originalTuitionVnd - course.tuitionVnd) / course.originalTuitionVnd) * 100)
      : null;

  return (
    <section className="relative w-full bg-[#1F242F] text-white pt-8 pb-14 lg:pt-10 lg:pb-20 overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#AF445A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#784080]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumbs Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-white/70 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <Link href="/#courses" className="hover:text-white transition-colors">
            Khóa học
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="text-white font-medium truncate max-w-[280px] sm:max-w-md">
            {course.title}
          </span>
        </nav>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Meta & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tag Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#AF445A] bg-[#AF445A]/10 text-xs sm:text-sm font-bold text-[#FFC934] tracking-wide uppercase">
                {course.tag || "Data Analytics"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs sm:text-sm text-white/90 font-medium">
                {course.level || "Người mới bắt đầu"}
              </span>
            </div>

            {/* H1 Heading */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-[42px] leading-tight sm:leading-[1.2] text-white tracking-tight">
              {course.title}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
              {course.description || course.tagline}
            </p>

            {/* Badges: Format, Duration, Schedule */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-[#FFC934] shrink-0" />
                <span>{course.duration || "12 buổi học"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <Video className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>Live Online qua Zoom</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mentor Hứa Thảo Ly trực tiếp kèm</span>
              </div>
            </div>

            {/* Tuition Price Display */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-xs uppercase font-semibold text-white/60 tracking-wider">
                  Học phí ưu đãi:
                </span>
                <span className="text-3xl sm:text-4xl font-heading font-extrabold text-[#AF445A] drop-shadow-sm">
                  {formatPrice(course.tuitionVnd)}
                </span>
              </div>
              {course.originalTuitionVnd && course.originalTuitionVnd > course.tuitionVnd && (
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="line-through text-slate-400 font-normal">
                    {formatPrice(course.originalTuitionVnd)}
                  </span>
                  {discountPercent && (
                    <span className="bg-[#AF445A] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  openLeadModal({
                    courseId: course.id,
                    ctaLocation: "course_hero_primary",
                  })
                }
                className="inline-flex items-center justify-center bg-brand-gradient hover:opacity-95 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Đăng ký tư vấn ngay
              </button>

              <a
                href="#curriculum"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-base px-6 py-3.5 rounded-xl transition-colors cursor-pointer text-center"
              >
                Xem đề cương chi tiết ↓
              </a>
            </div>

            {/* Trust Proof Bullets */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm text-white/80 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Học lại miễn phí nếu chưa vững</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hỗ trợ bài tập 1:1 trọn đời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Video record lưu trữ xem lại</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#252525]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={course.coverImageUrl || "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F242F] via-transparent to-transparent opacity-80" />
              </div>

              {/* Card Footer Information */}
              <div className="p-5 sm:p-6 bg-[#252525]/90 backdrop-blur-md border-t border-white/10 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60">Mentor đứng lớp</p>
                    <p className="text-base font-bold text-white">Hứa Thảo Ly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60">Kinh nghiệm thực chiến</p>
                    <p className="text-sm font-semibold text-[#FFC934]">Ex-Senior DA MoMo, Tiki</p>
                  </div>
                </div>
                <p className="text-xs text-white/70 leading-relaxed italic">
                  “Khóa học tập trung rèn luyện tư duy đặt câu hỏi đúng với số liệu trước khi gõ dòng lệnh đầu tiên.”
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

