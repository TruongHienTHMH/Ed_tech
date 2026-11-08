"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/lib/cms/types";
import BlogCategoryTabs from "./BlogCategoryTabs";
import BlogPostCard from "./BlogPostCard";

export interface BlogListContainerProps {
  initialPosts: BlogPost[];
  categories: string[];
}

export default function BlogListContainer({
  initialPosts,
  categories,
}: BlogListContainerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "Tất cả") {
      return initialPosts;
    }
    return initialPosts.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [initialPosts, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
        <BlogCategoryTabs
          categories={categories}
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="hidden sm:block text-xs font-medium text-neutral-500 whitespace-nowrap">
          Hiển thị <strong>{filteredPosts.length}</strong> bài viết
        </div>
      </div>

      {/* Grid of Posts or Empty State */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        /* Empty Category State */
        <div className="text-center py-16 px-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-2xl">
            📝
          </div>
          <h3 className="font-heading font-bold text-lg text-neutral-800">
            Chưa có bài viết nào trong danh mục &ldquo;{selectedCategory}&rdquo;
          </h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            Mentor Hứa Thảo Ly đang biên soạn các bài viết chất lượng cho chủ đề này. Bạn hãy quay lại sau hoặc khám phá các chủ đề khác nhé!
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("Tất cả")}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Xem tất cả bài viết
          </button>
        </div>
      )}
    </div>
  );
}

