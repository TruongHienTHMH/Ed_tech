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

interface DisplayBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
}

export default function BlogSection({ blogs = seedBlogPosts }: BlogSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Chỉ kích hoạt infinite auto-scroll marquee nếu có trên 3 bài viết
  const isSlider = Boolean(blogs && blogs.length > 3);

  const rawBlogs = blogs && blogs.length > 0 ? blogs : seedBlogPosts;
  const displayBlogs: DisplayBlog[] = rawBlogs.map((b, idx) => ({
    id: b.id || `b-${idx}`,
    title: b.title,
    slug: b.slug || `post-${idx}`,
    excerpt: b.excerpt || b.title,
    coverImage: b.coverImageUrl || "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
  }));

  const renderBlogCard = (blog: DisplayBlog, keyPrefix: string, isMarquee: boolean) => {
    const isHovered = hoveredId === `${keyPrefix}-${blog.id}`;

    return (
      <article
        key={`${keyPrefix}-${blog.id}`}
        onMouseEnter={() => setHoveredId(`${keyPrefix}-${blog.id}`)}
        onMouseLeave={() => setHoveredId(null)}
        className={`rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transform transition-all duration-300 ${
          isMarquee ? "w-[340px] sm:w-[360px] lg:w-[380px] shrink-0" : ""
        } ${
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
                className={`font-heading font-semibold text-xl leading-snug mb-3 transition-colors duration-300 line-clamp-2 ${
                  isHovered ? "text-white" : "text-[#252525]"
                }`}
              >
                {blog.title}
              </h3>
              <p
                className={`text-sm leading-relaxed mb-6 transition-colors duration-300 line-clamp-3 ${
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
  };

  return (
    <section id="blogs" className="relative w-full bg-white py-16 lg:py-24 overflow-hidden">
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

        {/* Blog Showcase: Infinite Marquee if > 3 blogs, otherwise 3-column static grid */}
        {isSlider ? (
          <div className="w-full overflow-hidden mask-marquee-edges group py-4">
            <div className="animate-marquee group-hover:[animation-play-state:paused] flex items-stretch gap-8 py-2">
              {/* Track 1 */}
              <div className="flex items-stretch gap-8 shrink-0">
                {displayBlogs.map((blog, idx) => renderBlogCard(blog, `t1-${idx}`, true))}
              </div>
              {/* Track 2 (Duplicate for Seamless Infinite Marquee Loop) */}
              <div className="flex items-stretch gap-8 shrink-0" aria-hidden="true">
                {displayBlogs.map((blog, idx) => renderBlogCard(blog, `t2-${idx}`, true))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayBlogs.slice(0, 3).map((blog, idx) => renderBlogCard(blog, `grid-${idx}`, false))}
          </div>
        )}

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
