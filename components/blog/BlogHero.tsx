"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar } from "@/components/common/Icons";
import { BlogPost } from "@/lib/cms/types";

interface BlogHeroProps {
  post?: BlogPost;
  breadcrumbCurrent?: string;
  isDetailPage?: boolean;
}

export default function BlogHero({
  post,
  breadcrumbCurrent = "Chi tiết bài viết",
  isDetailPage = false,
}: BlogHeroProps) {
  // Tiêu đề & mô tả từ Figma Node 422:1149 hoặc bài viết truyền vào
  const title =
    post?.title || "Tổng Hợp 10 Câu Hỏi Phỏng Vấn SQL Thường Gặp Cho Data Analyst";

  const subtitle =
    post?.excerpt ||
    post?.description ||
    "SQL là kỹ năng gần như bắt buộc với mọi vị trí Data Analyst, và cũng là phần không thể thiếu trong các buổi phỏng vấn.";

  const authorName = post?.authorName || "Hứa Thảo Lý";
  const authorRole = "Founder Lydata";
  const authorAvatar =
    post?.authorAvatarUrl || "/assets/mentor/ly.png";

  const formattedDate = (() => {
    if (!post?.publishedAt) return "15 tháng 10, 2026";
    try {
      const d = new Date(post.publishedAt);
      if (isNaN(d.getTime())) return post.publishedAt;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return post.publishedAt;
    }
  })();

  return (
    <section className="relative w-full bg-[#1F242F] text-white overflow-hidden pt-6 sm:pt-8">
      {/* Background Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#AF445A]/15 via-[#784080]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột Trái: Breadcrumb + Title + Subtitle + Meta + Author (Figma Node 422:1153) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Breadcrumb Navigation (Figma Node 422:1155) */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/70 mb-4 sm:mb-5 flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                Homepage
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <Link
                href="/blog"
                className={`transition-colors duration-200 ${
                  isDetailPage
                    ? "hover:text-white"
                    : "text-white font-semibold"
                }`}
              >
                Blogs
              </Link>
              {isDetailPage && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white font-semibold truncate max-w-[200px] sm:max-w-[280px]">
                    {breadcrumbCurrent}
                  </span>
                </>
              )}
            </nav>

            {/* Tiêu đề chính (Figma Node 422:1162) */}
            <h1 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] leading-tight text-white tracking-tight mb-4">
              {title}
            </h1>

            {/* Mô tả phụ (Figma Node 422:1163) */}
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-6 max-w-[620px] font-normal">
              {subtitle}
            </p>

            {/* Metadata: Ngày xuất bản (Đã bỏ người xem theo yêu cầu) */}
            <div className="flex items-center gap-2 text-white/75 text-sm sm:text-base font-medium mb-8">
              <Calendar className="w-5 h-5 text-[#AF445A]" />
              <span>{formattedDate}</span>
            </div>

            {/* Author Box (Figma Node 422:1175) */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-white/10 w-full max-w-[420px]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0 shadow-sm bg-neutral-800">
                <Image
                  src={authorAvatar}
                  alt={authorName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-heading font-bold text-base sm:text-lg text-white leading-tight">
                  {authorName}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-normal">
                  {authorRole}
                </p>
              </div>
            </div>
          </div>

          {/* Cột Phải: Iconic Graphic Illustration (Figma Node 422:1196) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[400px] sm:max-w-[440px] lg:max-w-[480px] aspect-square flex items-center justify-center">
              <Image
                src="/assets/decorations/hero-left.svg"
                alt="Data Analytics Illustration"
                width={480}
                height={480}
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lower Transition Wave Banner kết nối mượt mà vào nội dung bên dưới */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-lower.svg"
          alt="Transition Lower Wave Banner"
          width={1920}
          height={40}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
