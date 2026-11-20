"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/common/Icons";
import { BlogPost } from "@/lib/cms/types";
import { seedBlogPosts } from "@/data/seed-data";

interface BlogSectionProps {
  blogs?: BlogPost[];
}

export default function BlogSection({ blogs = seedBlogPosts }: BlogSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeBlogs = (blogs && blogs.length >= 3 ? blogs : seedBlogPosts).slice(0, 3);
  const displayBlogs = activeBlogs.map((b, idx) => ({
    id: b.id || `b-${idx}`,
    title: b.title,
    slug: b.slug || `post-${idx}`,
    excerpt: b.excerpt || b.title,
    coverImage: b.coverImageUrl || "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
  }));

  return (
    <section id="blogs" className="relative w-full bg-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#2E2E2E] mb-2">
            Blogs về Data Analytics
          </h2>
          <p className="text-[#676767] font-medium text-base tracking-wide uppercase">
            Chia sẻ kiến thức &amp; case study miễn phí
          </p>
        </div>

        {/* 3 Blog Cards with Dynamic Hover Activation */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {displayBlogs.map((blog, idx) => {
            const isHovered = hoveredIndex === idx;

            return (
              <article
                key={blog.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={`rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transform transition-all duration-300 ${
                  isHovered
                    ? "bg-card-gradient text-white shadow-2xl -translate-y-2 border-transparent"
                    : "bg-white border border-neutral-200 text-[#2E2E2E] shadow-sm hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                <Link href={`/blog/${blog.slug}`} className="block flex-1 flex flex-col justify-between">
                  <div className="relative w-full h-[220px] overflow-hidden">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className={`font-heading font-semibold text-xl leading-snug mb-3 transition-colors duration-300 ${
                          isHovered ? "text-white" : "text-[#252525]"
                        }`}
                      >
                        {blog.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed mb-6 transition-colors duration-300 ${
                          isHovered ? "text-white/85" : "text-[#646473]"
                        }`}
                      >
                        {blog.excerpt}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-2 font-semibold text-sm transition-colors duration-300 ${
                        isHovered ? "text-white" : "text-brand-gradient"
                      }`}
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight className={`w-4 h-4 ${isHovered ? "text-white" : "text-[#AF445A]"}`} />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* View All Blogs CTA Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#8B1D2C] text-[#8B1D2C] hover:bg-[#8B1D2C] hover:text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>Khám phá tất cả bài viết trên Blog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
    </section>
    
  );
}
