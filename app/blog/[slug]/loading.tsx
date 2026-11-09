import React from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar variant="light" />

      <main className="flex-1 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="bg-[#FAF7F8] border-b border-neutral-100 py-4">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="h-4 w-48 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* 2-Column Skeleton */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-6 w-24 bg-neutral-200 rounded-full" />
              <div className="h-10 w-full bg-neutral-200 rounded-xl" />
              <div className="h-6 w-3/4 bg-neutral-200 rounded-lg" />
              <div className="w-full aspect-[16/9] bg-neutral-200 rounded-2xl" />
              <div className="space-y-3 pt-4">
                <div className="h-4 w-full bg-neutral-200 rounded" />
                <div className="h-4 w-5/6 bg-neutral-200 rounded" />
                <div className="h-4 w-4/6 bg-neutral-200 rounded" />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="h-48 w-full bg-neutral-100 rounded-2xl border border-neutral-200" />
              <div className="h-36 w-full bg-neutral-100 rounded-2xl border border-neutral-200" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

