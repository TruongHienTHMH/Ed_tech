import React from "react";

export default function CourseLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar Placeholder */}
      <div className="h-[76px] sm:h-[82px] bg-[#2E2E2E] border-b border-white/10" />

      {/* Hero Skeleton (CLS-optimized) */}
      <div className="bg-[#1F242F] py-12 lg:py-20 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5 animate-pulse">
              {/* Breadcrumb skeleton */}
              <div className="h-4 w-48 bg-white/15 rounded-md" />

              {/* Tag & Level */}
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-white/20 rounded-full" />
                <div className="h-6 w-32 bg-white/15 rounded-full" />
              </div>

              {/* Title */}
              <div className="h-10 sm:h-12 w-4/5 bg-white/20 rounded-xl" />
              <div className="h-6 w-3/5 bg-white/15 rounded-lg" />

              {/* Description */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full bg-white/10 rounded" />
                <div className="h-4 w-5/6 bg-white/10 rounded" />
              </div>

              {/* Badges row */}
              <div className="flex gap-3 pt-2">
                <div className="h-9 w-28 bg-white/15 rounded-xl" />
                <div className="h-9 w-36 bg-white/15 rounded-xl" />
                <div className="h-9 w-40 bg-white/15 rounded-xl" />
              </div>

              {/* Price box */}
              <div className="h-20 w-80 bg-white/10 rounded-2xl" />

              {/* CTA buttons */}
              <div className="flex gap-4 pt-2">
                <div className="h-12 w-48 bg-[#AF445A]/60 rounded-xl" />
                <div className="h-12 w-44 bg-white/15 rounded-xl" />
              </div>
            </div>

            {/* Right Column: Visual Card */}
            <div className="lg:col-span-5 animate-pulse">
              <div className="aspect-[4/3] rounded-3xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section Skeleton */}
      <div className="py-14 bg-[#F8F9FA] border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-6">
          <div className="h-8 w-64 bg-neutral-200 rounded-lg mx-auto animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl border border-neutral-200 p-4 animate-pulse space-y-3">
                <div className="h-8 w-8 bg-neutral-200 rounded-lg" />
                <div className="h-4 w-3/4 bg-neutral-200 rounded" />
                <div className="h-3 w-full bg-neutral-100 rounded" />
                <div className="h-3 w-5/6 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Accordion Shimmer Bars */}
      <div className="py-14 max-w-[1000px] mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex justify-between items-end mb-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-neutral-200 rounded" />
            <div className="h-8 w-72 bg-neutral-300 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-neutral-200 rounded-lg" />
            <div className="h-8 w-28 bg-neutral-200 rounded-lg" />
          </div>
        </div>

        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-20 bg-neutral-50 rounded-2xl border border-neutral-200 animate-pulse flex items-center px-6 justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-4 w-60 sm:w-80 bg-neutral-300 rounded" />
                <div className="h-3 w-36 bg-neutral-200 rounded" />
              </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

