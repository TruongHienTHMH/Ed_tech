"use client";

import React from "react";

export interface BlogCategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export default function BlogCategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  className = "",
}: BlogCategoryTabsProps) {
  const allCategories = ["Tất cả", ...categories.filter((c) => c !== "Tất cả")];

  return (
    <div
      role="tablist"
      aria-label="Phân loại bài viết blog"
      className={`flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none ${className}`}
    >
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none active:scale-95 ${isActive
              ? "bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] text-white shadow-md shadow-[#8B1D2C]/20"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
              }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

