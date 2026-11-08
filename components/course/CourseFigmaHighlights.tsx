"use client";

import React from "react";

interface HighlightItem {
  icon: string;
  badge: string;
  title: string;
  description: string;
}

const HIGHLIGHTS: HighlightItem[] = [
  {
    icon: "🌱",
    badge: "Người mới bắt đầu",
    title: "Lộ trình từ con số 0",
    description: "Không yêu cầu nền tảng IT hay toán chuyên sâu. Học từng bước từ tư duy dữ liệu đến viết truy vấn mượt mà.",
  },
  {
    icon: "💼",
    badge: "Ứng dụng doanh nghiệp",
    title: "Dữ liệu & Case Study thật",
    description: "Thực hành trên bộ dữ liệu lớn thực tế từ E-commerce, Fintech và Ngân hàng hàng đầu Việt Nam.",
  },
  {
    icon: "🎯",
    badge: "Đồng hành 1-on-1",
    title: "Mentor sửa bài & Phỏng vấn",
    description: "Mentor Hứa Thảo Ly trực tiếp review code, góp ý bài tập hàng tuần và sửa CV/Portfolio 1:1 sát tuyển dụng.",
  },
];

export default function CourseFigmaHighlights() {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Điểm nổi bật của khóa học
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HIGHLIGHTS.map((item, index) => (
          <div
            key={index}
            className="group relative bg-[#FBF9FA] hover:bg-white border border-[#EFE5E7] hover:border-[#AF445A]/40 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl p-3 bg-white rounded-xl shadow-xs border border-gray-100 group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#AF445A]/10 text-[#AF445A]">
                {item.badge}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#AF445A] transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

