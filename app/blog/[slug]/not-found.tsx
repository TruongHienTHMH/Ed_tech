import React from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Navbar variant="light" />

      <main className="flex-1 flex items-center justify-center py-20 px-4 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-[#8B1D2C] flex items-center justify-center text-4xl mx-auto shadow-sm">
            🔍
          </div>
          <div className="space-y-2">
            <h1 className="font-heading font-extrabold text-3xl text-neutral-900">
              Không Tìm Thấy Bài Viết
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Bài viết bạn đang tìm kiếm có thể đã được thay đổi đường dẫn hoặc tạm thời ẩn khỏi hệ thống.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/blog"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Về Danh Sách Blog
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold transition-all"
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

