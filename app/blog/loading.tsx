import React from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar variant="light" />

      <main className="flex-1 animate-pulse">
        {/* Hero Skeleton */}
        <section className="py-12 lg:py-16 bg-[#FAF7F8] border-b border-neutral-100">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-4">
            <div className="h-6 w-36 bg-neutral-200 rounded-full mx-auto" />
            <div className="h-10 w-3/4 max-w-xl bg-neutral-200 rounded-xl mx-auto" />
            <div className="h-4 w-2/3 max-w-md bg-neutral-200 rounded mx-auto" />
          </div>
        </section>

        {/* Grid Skeleton */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
            {/* Tabs Skeleton */}
            <div className="flex gap-3 pb-4 border-b border-neutral-200">
              <div className="h-9 w-20 bg-neutral-200 rounded-full" />
              <div className="h-9 w-24 bg-neutral-200 rounded-full" />
              <div className="h-9 w-28 bg-neutral-200 rounded-full" />
              <div className="h-9 w-24 bg-neutral-200 rounded-full" />
            </div>

            {/* 3x Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs space-y-4"
                >
                  <div className="w-full aspect-[16/9] bg-neutral-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 w-20 bg-neutral-200 rounded" />
                    <div className="h-6 w-5/6 bg-neutral-200 rounded" />
                    <div className="h-4 w-full bg-neutral-200 rounded" />
                    <div className="h-4 w-4/5 bg-neutral-200 rounded" />
                    <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
                      <div className="h-4 w-24 bg-neutral-200 rounded" />
                      <div className="h-4 w-16 bg-neutral-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

