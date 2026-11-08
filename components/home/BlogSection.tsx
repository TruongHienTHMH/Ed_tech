"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/common/Icons";
import { BlogPost } from "@/lib/cms/types";
import { seedBlogPosts } from "@/data/seed-data";

interface BlogSectionProps {
  blogs?: BlogPost[];
}

export default function BlogSection({ blogs = seedBlogPosts }: BlogSectionProps) {
  const activeBlogs = (blogs && blogs.length >= 3 ? blogs : seedBlogPosts).slice(0, 3);
  const displayBlogs = activeBlogs.map((b, idx) => ({
    id: b.id || `b-${idx}`,
    title: b.title,
    slug: b.slug || `post-${idx}`,
    excerpt: b.excerpt || b.title,
    coverImage: b.coverImageUrl || "/assets/figma/71218f0038c8a9ce02ba0e6f6b102fbf63b6953b.png",
    featured: idx === 0,
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

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayBlogs.map((blog, idx) => {
            const isFeatured = idx === 0;

            if (isFeatured) {
              return (
                <article
                  key={blog.id}
                  className="bg-card-gradient rounded-2xl overflow-hidden shadow-2xl text-white flex flex-col justify-between transform hover:-translate-y-1.5 transition-all duration-300"
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
                        <h3 className="font-heading font-semibold text-xl leading-snug mb-3 text-white">
                          {blog.title}
                        </h3>
                        <p className="text-white/85 text-sm leading-relaxed mb-6">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-white font-semibold text-sm">
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </article>
              );
            }

            return (
              <article
                key={blog.id}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg text-[#2E2E2E] flex flex-col justify-between transform hover:-translate-y-1.5 transition-all duration-300"
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
                      <h3 className="font-heading font-semibold text-xl leading-snug mb-3 text-[#252525]">
                        {blog.title}
                      </h3>
                      <p className="text-[#646473] text-sm leading-relaxed mb-6">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-brand-gradient font-semibold text-sm">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-4 h-4 text-[#AF445A]" />
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
