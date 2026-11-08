"use client";

import React from "react";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export interface BlogSidebarMiniCardProps {
  courseId?: string;
  className?: string;
}

export default function BlogSidebarMiniCard({
  courseId = "sql-for-data-analytics",
  className = "",
}: BlogSidebarMiniCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-[#FAF7F8] to-[#F5ECEF] border border-[#EFE5E7] rounded-2xl p-6 text-center space-y-4 shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white text-[#8B1D2C] shadow-xs flex items-center justify-center mx-auto text-xl font-bold">
        💡
      </div>
      <div>
        <h3 className="font-heading font-bold text-base text-neutral-900">
          Cần tư vấn lộ trình học Data?
        </h3>
        <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
          Mentor Hứa Thảo Ly sẽ trao đổi trực tiếp 1-on-1 để định hướng khóa học phù hợp với năng lực và mục tiêu của bạn.
        </p>
      </div>
      <button
        type="button"
        onClick={() =>
          openLeadModal({
            courseId,
            ctaLocation: "blog_sidebar_mini_card",
          })
        }
        className="block w-full py-2.5 px-4 bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-center cursor-pointer active:scale-98"
      >
        Đăng Ký Nhận Tư Vấn
      </button>
    </div>
  );
}

