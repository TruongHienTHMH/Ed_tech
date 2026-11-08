"use client";

import React from "react";
import SafeImage from "@/components/common/SafeImage";

export interface BlogAuthorBoxProps {
  name?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  className?: string;
}

export default function BlogAuthorBox({
  name = "Hứa Thảo Ly",
  role = "Lead Instructor & Founder DataWithLy",
  bio = "Senior Data Analyst với hơn 7 năm kinh nghiệm thực chiến tại các tập đoàn và kỳ lân công nghệ (MoMo, Tiki, ACB Bank). Đã đồng hành và dẫn dắt 500+ học viên chuyển ngành và thăng tiến thành công trong lĩnh vực Phân tích dữ liệu.",
  avatarUrl = "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
  className = "",
}: BlogAuthorBoxProps) {
  return (
    <div
      className={`bg-neutral-50 border border-neutral-200/90 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 ${className}`}
    >
      {/* Avatar */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#8B1D2C]/30 shadow-md shrink-0 bg-neutral-200">
        <SafeImage
          src={avatarUrl}
          alt={name}
          fill
          sizes="96px"
          className="object-cover"
          containerClassName="w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="text-center sm:text-left space-y-2">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h4 className="font-heading font-bold text-lg sm:text-xl text-neutral-900">
            {name}
          </h4>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8B1D2C]/10 text-[#8B1D2C]">
            Tác giả & Giảng viên
          </span>
        </div>

        <p className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider">
          {role}
        </p>

        <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
          {bio}
        </p>

        {/* Credentials Tags */}
        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-neutral-500">
          <span className="bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
            ⭐ 7+ năm kinh nghiệm
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
            🎓 500+ học viên tốt nghiệp
          </span>
          <span className="bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
            🏢 Ex-MoMo, Tiki, ACB
          </span>
        </div>
      </div>
    </div>
  );
}

