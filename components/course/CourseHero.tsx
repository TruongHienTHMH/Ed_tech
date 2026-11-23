"use client";

import React from "react";
import Link from "next/link";
import { Course } from "@/lib/cms/types";
import { Clock, Video, ChevronRight } from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { openLeadModal } from "@/components/forms/LeadModalManager";
import { SafeImage } from "@/components/common/SafeImage";
import { resolveImageUrl, getFigmaFallback } from "@/lib/constants/image-fallbacks";

interface CourseHeroProps {
  course: Course;
}

export default function CourseHero({ course }: CourseHeroProps) {
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
              <Badge variant="primary" size="sm">
                {course.courseKind || "Khóa học nổi bật"}
              </Badge>
              {course.tag && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
                  {course.tag}
                </span>
              )}
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
            <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base font-normal text-white">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white/90 shrink-0" />
                <span>{course.totalSessions || 12} buổi học</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-white/90 shrink-0" />
                <span>{course.studyStyle || "Live Class"}</span>
              </div>
            </div>

            {/* Single CTA & Student Enrollment Badge (Figma Node 12:1427) */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  openLeadModal({
                    courseId: course.id,
                    ctaLocation: "course_hero_primary",
                  })
                }
                className="font-medium text-sm sm:text-base px-8 py-3.5 rounded-[8px] bg-gradient-to-r from-[#AF445A] to-[#784080] text-white hover:opacity-95 shadow-md cursor-pointer"
              >
                Đăng ký tư vấn ngay
              </Button>

              <div className="flex flex-col gap-1 justify-center">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center text-[#FFC934] text-base tracking-wider"
                    aria-label="5 sao"
                  >
                    {"★".repeat(5)}
                  </div>
                  <span className="text-white text-sm sm:text-base font-normal">
                    (5.0)
                  </span>
                </div>
                <span className="text-white/75 text-xs sm:text-sm font-normal">
                  {course.studentEnrollment || 250}+ học viên đã đăng ký
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#252525]">
              <div className="relative aspect-[4/3] w-full">
                <SafeImage
                  src={resolveImageUrl(course.coverImageUrl, "course", course.slug || course.id)}
                  fallbackSrc={getFigmaFallback("course", course.slug || course.id)}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F242F] via-transparent to-transparent opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

