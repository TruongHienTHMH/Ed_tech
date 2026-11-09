"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "@/lib/cms/types";
import { Clock, Video, ChevronRight, Calendar } from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
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
            {/* Badges (Figma Node 12:1427) */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="tag">
                {course.tag || "Data Analytics"}
              </Badge>
              <Badge variant="level">
                {course.level || "Người mới bắt đầu"}
              </Badge>
              <Badge variant="liveClass">
                Live Class
              </Badge>
            </div>

            {/* H1 Heading */}
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-[42px] leading-tight sm:leading-[1.2] text-white tracking-tight">
              {course.title}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
              {course.description || course.tagline}
            </p>

            {/* Course Specifications (Figma Node 12:1430) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-[#FFC934] shrink-0" />
                <span>{course.duration || "12 buổi học (24 giờ)"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-white/10">
                <Calendar className="w-4 h-4 text-[#FFC934] shrink-0" />
                <span>Tối Thứ 3 & Thứ 5 (19:30 - 21:30)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-white/10">
                <Calendar className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>Khai giảng: 15 hàng tháng</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3.5 py-2.5 rounded-xl border border-white/10">
                <Video className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>Live Class Zoom 100%</span>
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
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  openLeadModal({
                    courseId: course.id,
                    ctaLocation: "course_hero_primary",
                  })
                }
              >
                Đăng ký tư vấn ngay
              </Button>

              <Button
                variant="outline"
                size="lg"
                href="#curriculum"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white hover:border-white/40"
              >
                Xem đề cương chi tiết
              </Button>
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

