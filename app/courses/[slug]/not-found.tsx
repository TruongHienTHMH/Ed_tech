import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#252525]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 shadow-xl text-center space-y-6">
          {/* Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-[#AF445A]/10 text-[#AF445A] flex items-center justify-center text-4xl mx-auto shadow-inner">
            📚
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AF445A] bg-[#AF445A]/10 px-3 py-1 rounded-full">
              Mã lỗi 404: Không tìm thấy khóa học
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#252525] pt-2">
              Khóa Học Không Tồn Tại
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Khóa học bạn đang tìm kiếm hiện không tồn tại trên hệ thống hoặc đã tạm dừng tuyển sinh để cập nhật giáo trình mới.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/#courses"
              className="flex-1 inline-flex items-center justify-center bg-brand-gradient hover:opacity-95 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md transition-all duration-200"
            >
              Về danh sách khóa học
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm px-5 py-3 rounded-xl transition-colors"
            >
              Về trang chủ
            </Link>
          </div>

          <p className="text-xs text-neutral-400 pt-2">
            Cần hỗ trợ tư vấn trực tiếp? Liên hệ hotline/Zalo của Mentor tại góc phải màn hình.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

