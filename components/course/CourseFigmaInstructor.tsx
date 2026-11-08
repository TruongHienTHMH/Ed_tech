"use client";

import React from "react";
import Image from "next/image";

interface CourseFigmaInstructorProps {
  onOpenConsult?: () => void;
}

export default function CourseFigmaInstructor({ onOpenConsult }: CourseFigmaInstructorProps) {
  const handleContactClick = () => {
    if (onOpenConsult) {
      onOpenConsult();
    } else {
      // Trigger global lead modal event
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-lead-modal", {
            detail: { courseId: "sql-for-data-analytics", source: "instructor_card" },
          })
        );
      }
    }
  };

  return (
    <section className="mb-12" id="instructor">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Giảng viên của bạn
        </h2>
      </div>

      <div className="bg-white border border-[#EFE5E7] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Column: Avatar & Quick Actions */}
          <div className="flex flex-col items-center sm:items-start shrink-0 w-full md:w-52">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-md border-4 border-[#FAF7F8] mb-4 bg-gray-100">
              <Image
                src="/assets/figma/da527ba5696d5b94f6f71aebe984b901fc46d929.png"
                alt="Mentor Hứa Thảo Ly"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 176px, 176px"
                priority
              />
            </div>

            <button
              type="button"
              onClick={handleContactClick}
              className="w-full py-2.5 px-4 bg-[#8B1D2C] hover:bg-[#721522] text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer text-center mb-4"
            >
              Liên hệ tư vấn
            </button>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-3 w-full text-gray-500">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B1D2C]/10 hover:text-[#8B1D2C] flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B1D2C]/10 hover:text-[#8B1D2C] flex items-center justify-center transition-colors"
                title="TikTok"
              >
                <span className="text-xs font-bold">TT</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#8B1D2C]/10 hover:text-[#8B1D2C] flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            </div>
          </div>

          {/* Right Column: Bio & Experience */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-2xl font-bold text-gray-900">Hứa Thảo Ly</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#AF445A]/10 text-[#AF445A]">
                Founder Lydata
              </span>
            </div>

            <p className="text-sm font-medium text-gray-600 mb-4">
              Cựu Senior Data Analyst tại các kỳ lân & tập đoàn công nghệ
            </p>

            {/* Past Companies Badges (Figma matched) */}
            <div className="flex items-center gap-2.5 mb-5 flex-wrap">
              <span className="text-xs text-gray-500 font-medium">Đã từng làm việc tại:</span>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 font-bold text-xs rounded-lg border border-pink-200">
                MoMo
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200">
                Tiki
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">
                ACB Bank
              </span>
            </div>

            {/* Bio Paragraph */}
            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              Xin chào, mình là Lý - Founder của Lydata. Với hơn 6+ năm kinh nghiệm làm việc trong lĩnh vực Data Analytics tại các tập đoàn và kỳ lân công nghệ hàng đầu như MoMo, Tiki, ACB Bank, mình đã đồng hành cùng hơn 1,000+ học viên chuyển ngành và nâng cao năng lực phân tích dữ liệu ứng dụng thực chiến.
            </p>

            {/* Key Accomplishments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-[#AF445A] font-bold">✓</span>
                <span>Phương pháp dạy bám sát bài toán kinh doanh thật</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#AF445A] font-bold">✓</span>
                <span>Mentor trực tiếp sửa bài & giải đáp 1-on-1</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#AF445A] font-bold">✓</span>
                <span>Hỗ trợ kết nối phỏng vấn vào mạng lưới đối tác</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#AF445A] font-bold">✓</span>
                <span>Review và tối ưu hồ sơ Portfolio/CV trọn đời</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

