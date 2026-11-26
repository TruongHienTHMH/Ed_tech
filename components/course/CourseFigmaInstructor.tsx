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

  // Social Links từ tab "Read me first"
  const socialLinks = [
    {
      name: "Tiktok",
      url: "https://www.tiktok.com/@datawithly",
      icon: "/assets/icons/tiktok.svg",
      hoverClass: "hover:bg-black/10 hover:text-black",
      color: "hover:border-black/30",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/datawithly/",
      icon: "/assets/icons/instagram.svg",
      hoverClass: "hover:bg-gradient-to-tr hover:from-amber-500/10 hover:to-pink-500/10 hover:text-[#E4405F]",
      color: "hover:border-[#E4405F]/30",
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@datawithly",
      icon: "/assets/icons/threads.svg",
      hoverClass: "hover:bg-black/10 hover:text-black",
      color: "hover:border-black/30",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/datawithly.official1",
      icon: "/assets/icons/facebook.svg",
      hoverClass: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
      color: "hover:border-[#1877F2]/30",
    },
  ];

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
          {/* Cột trái: Avatar, Nút tư vấn, Social Links */}
          <div className="flex flex-col items-center shrink-0 w-full md:w-56">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-md border-4 border-[#FAF7F8] mb-4 bg-gray-100">
              <Image
                src="/assets/mentor/ly.png"
                alt="Mentor Hứa Thảo Lý"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 192px"
              />
            </div>

            <button
              type="button"
              onClick={handleContactClick}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#AF445A] to-[#784080] hover:opacity-95 text-white text-sm font-semibold rounded-xl transition-all shadow-sm cursor-pointer text-center mb-4 active:scale-[0.98]"
            >
              Liên hệ tư vấn 1:1
            </button>

            {/* Social Links chính thức từ Sheet */}
            <div className="flex items-center justify-center gap-2.5 w-full text-gray-600">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center transition-all p-2 ${item.hoverClass} ${item.color} shadow-2xs hover:scale-105`}
                  title={item.name}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={18}
                    height={18}
                    className="w-4 h-4 object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Cột phải: Thông tin, Bio, Kinh nghiệm, Thành tích */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <h3 className="text-2xl font-bold text-gray-900">Hứa Thảo Lý</h3>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#AF445A]/10 text-[#AF445A] border border-[#AF445A]/20">
                Lead Mentor & Founder LYDATA
              </span>
            </div>

            <p className="text-sm font-medium text-gray-600 mb-4">
              Senior Data Analyst @ MoMo | Former Data Analyst @ Tiki, ACB Bank
            </p>

            {/* Badges Công ty đã từng làm việc */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-xs text-gray-500 font-medium mr-1">Đã từng làm việc tại:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 text-pink-700 font-semibold text-xs rounded-lg border border-pink-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A50064]" />
                MoMo
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005BFF]" />
                Tiki
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008855]" />
                ACB Bank
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold text-xs rounded-lg border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                ĐH Ngoại Thương (FTU2)
              </span>
            </div>

            {/* Mini Stat Cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-[#AF445A]">5+ Năm</div>
                <div className="text-xs text-gray-600 mt-0.5">Kinh nghiệm Data</div>
              </div>
              <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-[#AF445A]">200+</div>
                <div className="text-xs text-gray-600 mt-0.5">Học viên mentored</div>
              </div>
              <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-[#AF445A]">Top 1</div>
                <div className="text-xs text-gray-600 mt-0.5">Quán quân E!Contest</div>
              </div>
            </div>

            {/* Bio Paragraph từ Sheet Read me first */}
            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              Trong quá trình đào tạo và mentoring, mình nhận ra rằng khó khăn của nhiều bạn khi bắt đầu không nằm ở việc thiếu tài liệu, mà là làm thế nào để chuyển kiến thức thành khả năng giải quyết bài toán thực tế. LYDATA được xây dựng nhằm mang đến một lộ trình học Data Analytics có hệ thống – nơi bạn không chỉ thành thạo SQL hay Dashboard, mà còn rèn luyện tư duy tiếp cận vấn đề, phân tích dữ liệu và truyền tải insight để hỗ trợ quyết định kinh doanh.
            </p>

            {/* Key Accomplishments & Cam kết thực chiến */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="check"
                  width={16}
                  height={16}
                  className="w-4 h-4 shrink-0 mt-0.5 object-contain"
                />
                <span>Từng là BGK & Mentor các cuộc thi Data Analytics toàn quốc</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="check"
                  width={16}
                  height={16}
                  className="w-4 h-4 shrink-0 mt-0.5 object-contain"
                />
                <span>Á quân Innovation Contest & Á quân GenAI MiMir Master @ MoMo</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="check"
                  width={16}
                  height={16}
                  className="w-4 h-4 shrink-0 mt-0.5 object-contain"
                />
                <span>Phương pháp dạy thực chiến bám sát bài toán kinh doanh thật</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="check"
                  width={16}
                  height={16}
                  className="w-4 h-4 shrink-0 mt-0.5 object-contain"
                />
                <span>Mentor trực tiếp sửa bài, giải đáp 1-on-1 & tối ưu CV/Portfolio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
