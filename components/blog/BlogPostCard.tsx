"use client";

import React from "react";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";
import { BlogPost } from "@/lib/cms/types";
import { Clock } from "@/components/common/Icons";

export interface BlogPostCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogPostCard({ post, className = "" }: BlogPostCardProps) {
  const formattedDate = (() => {
    try {
      const d = new Date(post.publishedAt);
      if (isNaN(d.getTime())) return post.publishedAt;
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return post.publishedAt;
    }
  })();

  const readTime = post.readTimeMinutes || 5;

  return (
    <article
      className={`group bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <Link href={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
        {/* Cover Image 16:9 */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100">
          <SafeImage
            src={
              post.coverImageUrl ||
              "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png"
            }
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            containerClassName="w-full h-full"
          />
          {/* Category Badge overlay */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-[#8B1D2C] shadow-sm border border-[#8B1D2C]/20">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Meta info: Read time */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#8B1D2C]" />
              <span>{readTime} phút đọc</span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-bold text-lg sm:text-xl text-neutral-900 group-hover:text-[#8B1D2C] transition-colors line-clamp-2 mb-2 leading-snug">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4">
              {post.excerpt}
            </p>
          </div>

          {/* Author & Published Date */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B1D2C] to-[#AF445A] text-white flex items-center justify-center font-bold text-[11px] shadow-xs">
                Ly
              </div>
              <span className="font-semibold text-neutral-800">
                {post.authorName || "Hứa Thảo Ly"}
              </span>
            </div>
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

