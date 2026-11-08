"use client";

import React from "react";
import Link from "next/link";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export interface BlogRelatedCourseBannerProps {
  category?: string;
  className?: string;
}

export default function BlogRelatedCourseBanner({
  category = "SQL",
  className = "",
}: BlogRelatedCourseBannerProps) {
  const isSql = category.toUpperCase().includes("SQL");
  const isDashboard = category.toUpperCase().includes("DASHBOARD");

  const courseConfig = isSql
    ? {
      id: "sql-for-data-analytics",
      slug: "sql-for-data-analytics",
      title: "Khóa Coaching: SQL for Data Analytics",
      desc: "Làm chủ tư duy truy vấn, tối ưu dữ liệu lớn và giải quyết bài toán nghiệp vụ doanh nghiệp thực tế chỉ trong 12 buổi cùng Mentor.",
      badge: "Khóa học thực chiến",
    }
    : isDashboard
      ? {
        id: "data-analytical-thinking",
        slug: "analytical-thinking-dashboard-design",
        title: "Analytical Thinking & Dashboard Design",
        desc: "Phát triển tư duy phân tích sắc bén, làm chủ chỉ số kinh doanh và thiết kế Dashboard trực quan thuyết phục ban lãnh đạo.",
        badge: "Khóa học nổi bật",
      }
      : {
        id: "end-to-end-analytics",
        slug: "end-to-end-analytics",
        title: "Combo Toàn Diện: End-to-End Analytics",
        desc: "Lộ trình chuyển ngành bài bản trọn gói 27 buổi từ SQL đến BI Dashboard, coaching 1-on-1 và hỗ trợ hoàn thiện Portfolio chuẩn tuyển dụng.",
        badge: "Ưu đãi trọn gói 16%",
      };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1F242F] to-[#2D1B24] p-6 sm:p-8 text-white shadow-2xl border border-white/10 ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#8B1D2C]/30 via-[#AF445A]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#8B1D2C] text-white shadow-xs">
            {courseConfig.badge}
          </span>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-white leading-snug">
            {courseConfig.title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {courseConfig.desc}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                courseId: courseConfig.id,
                ctaLocation: "blog_related_course_banner",
              })
            }
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 cursor-pointer text-center"
          >
            Đăng Ký Tư Vấn Ngay
          </button>
          <Link
            href={`/courses/${courseConfig.slug}`}
            className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-all text-center"
          >
            Xem chi tiết lộ trình &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

