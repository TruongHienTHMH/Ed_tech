"use client";

import React from "react";
import Link from "next/link";
import { Course } from "@/lib/cms/types";
import { Check, CheckCircle2 } from "@/components/common/Icons";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface CourseComboUpsellProps {
  course: Course;
}

export default function CourseComboUpsell({ course }: CourseComboUpsellProps) {
  const isCombo =
    course.id.toLowerCase().includes("end-to-end") ||
    course.slug.toLowerCase().includes("end-to-end");

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="pricing" className="w-full bg-[#F8F9FA] py-14 lg:py-20 border-b border-neutral-200">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#AF445A]/30 bg-white font-bold text-xs sm:text-sm text-brand-gradient shadow-xs uppercase tracking-wider mb-2">
            Học Phí & Gói Tiết Kiệm
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#252525] tracking-tight">
            Đầu Tư Thông Minh Cho Sự Nghiệp Data
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base">
            Học phí minh bạch, không phát sinh phụ phí. Chính sách hỗ trợ tối đa quyền lợi cho học viên.
          </p>
        </div>

        {/* Comparison / Upsell Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Khóa hiện tại */}
          <div
            className={`bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between ${isCombo ? "lg:col-span-12 max-w-2xl mx-auto" : "lg:col-span-6"
              }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
                  {isCombo ? "Gói Đào Tạo Trọn Gói" : "Khóa Lẻ Hiện Tại"}
                </span>
                <span className="text-xs font-semibold text-neutral-500">
                  {course.duration || "12 buổi"}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#252525] mb-2">
                {course.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 font-normal">
                {course.tagline || course.description}
              </p>

              {/* Price display */}
              <div className="mb-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-150">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-heading font-extrabold text-[#AF445A]">
                    {formatPrice(course.tuitionVnd)}
                  </span>
                  {course.originalTuitionVnd && (
                    <span className="line-through text-slate-400 text-base">
                      {formatPrice(course.originalTuitionVnd)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Đã bao gồm toàn bộ học liệu, tài khoản bài tập và video recording trọn đời.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                  Quyền lợi bao gồm:
                </p>
                <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Học tương tác trực tiếp qua Zoom cùng Mentor Hứa Thảo Ly</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Sửa bài tập và code review 1-on-1 hàng tuần</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Cam kết học lại miễn phí</strong> nếu chưa nắm vững kiến thức
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Tham gia cộng đồng Alumnus DataWithLy 1.200+ thành viên hỗ trợ trọn đời</span>
                </div>
                {isCombo && (
                  <>
                    <div className="flex items-start gap-2.5 text-sm font-semibold text-[#AF445A]">
                      <Check className="w-4 h-4 text-[#AF445A] mt-0.5 shrink-0" />
                      <span>Tặng kèm 01 buổi Review CV 1-on-1 chuyên sâu cùng Mentor</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-sm font-semibold text-[#AF445A]">
                      <Check className="w-4 h-4 text-[#AF445A] mt-0.5 shrink-0" />
                      <span>Tặng kèm Mock Interview luyện phỏng vấn thử thực tế</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                openLeadModal({
                  courseId: course.id,
                  ctaLocation: "course_pricing_single",
                })
              }
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-base transition-all duration-200 cursor-pointer text-center ${isCombo
                ? "bg-brand-gradient text-white hover:opacity-95 shadow-lg"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
            >
              Đăng ký khóa học này
            </button>
          </div>

          {/* Card 2: Upsell Combo End-to-End (Only show if not already on Combo page) */}
          {!isCombo && (
            <div className="lg:col-span-6 relative bg-gradient-to-b from-[#1F242F] to-[#171A21] rounded-3xl p-6 sm:p-8 text-white border-2 border-[#AF445A] shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Highlight ribbon */}
              <div className="absolute top-4 right-4 bg-brand-gradient text-white font-bold text-xs px-3.5 py-1 rounded-full shadow-md">
                TIẾT KIỆM 1.090.000 VNĐ
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#AF445A]/20 text-[#FFC934] border border-[#AF445A]/30">
                    Lộ Trình Đề Xuất
                  </span>
                  <span className="text-xs font-semibold text-white/60">
                    27 buổi (12 tuần)
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">
                  Combo End-to-End Analytics with SQL & Dashboard
                </h3>
                <p className="text-xs sm:text-sm text-white/80 mb-6 font-normal">
                  Trọn bộ từ truy vấn trích xuất dữ liệu nâng cao (SQL) đến tư duy phân rã bài toán và trực quan hóa Dashboard hoàn chỉnh cho C-Level.
                </p>

                {/* Price display */}
                <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-heading font-extrabold text-[#FFC934]">
                      5.690.000 đ
                    </span>
                    <span className="line-through text-white/50 text-base">
                      6.780.000 đ
                    </span>
                  </div>
                  <p className="text-xs text-[#FFC934] mt-1 font-semibold">
                    Đăng ký trọn gói tiết kiệm ngay 1.090.000 VNĐ so với mua lẻ từng môn!
                  </p>
                </div>

                {/* Special Combo Benefits */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-bold uppercase text-white/70 tracking-wider">
                    Đặc quyền chỉ có ở Combo:
                  </p>
                  <div className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC934] mt-0.5 shrink-0" />
                    <span>Lộ trình liền mạch từ A-Z không bị đứt đoạn kiến thức</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC934] mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-[#FFC934]">Tặng 01 buổi Review CV 1:1</strong> tối ưu chuẩn ATS cùng Mentor Hứa Thảo Ly
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC934] mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-[#FFC934]">Tặng Mock Interview</strong> luyện trả lời phỏng vấn các tình huống hóc búa
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/90">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC934] mt-0.5 shrink-0" />
                    <span>Hoàn thiện trọn vẹn 02 sản phẩm Portfolio thực tế vào hồ sơ</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      courseId: "end-to-end-analytics",
                      ctaLocation: "course_pricing_combo_upsell",
                    })
                  }
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-base bg-brand-gradient hover:opacity-95 text-white shadow-xl transition-all duration-200 cursor-pointer text-center block"
                >
                  Nhận ưu đãi Combo End-to-End →
                </button>

                <div className="text-center">
                  <Link
                    href="/courses/end-to-end-analytics"
                    className="text-xs text-white/70 hover:text-white underline transition-colors"
                  >
                    Xem chi tiết giáo trình Combo 27 buổi
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

