"use client";

import React from "react";
import Image from "next/image";
import { Course } from "@/lib/cms/types";

interface CourseFigmaOverviewProps {
  course: Course;
}

export default function CourseFigmaOverview({ course }: CourseFigmaOverviewProps) {
  // 1. Khóa học này dành cho ai
  const whoIsForList =
    course.whoIsFor && course.whoIsFor.length > 0
      ? course.whoIsFor
      : [
          "Người mới bắt đầu chưa có kiến thức về lập trình hay cơ sở dữ liệu.",
          "Nhân sự Marketing, Vận hành, Tài chính muốn tự động hóa việc làm báo cáo.",
          "Sinh viên hoặc người đi làm muốn chuyển ngành sang vị trí Data Analyst.",
        ];

  // 2. Yêu cầu đầu vào
  const inputRequirementText =
    course.inputRequirement ||
    (course.slug === "data-analytical-thinking"
      ? "Học viên cần có kiến thức SQL cơ bản, bao gồm truy vấn, lọc, tổng hợp và kết hợp dữ liệu."
      : "Không yêu cầu kiến thức lập trình hay toán cao cấp từ trước. Bạn chỉ cần chuẩn bị máy tính cá nhân (Windows hoặc macOS) và tinh thần học hỏi nghiêm túc.");

  return (
    <section className="mb-12" id="overview">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Chi tiết khóa học
        </h2>
      </div>

      {/* Khóa học dành cho ai? */}
      <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-2xl p-6 mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>👥</span> Khóa học này dành cho ai?
        </h3>
        <ul className="space-y-3 text-sm text-gray-700">
          {whoIsForList.map((item, idx) => (
            <li key={idx} className="flex items-center gap-4">
              <Image
                src="/assets/decorations/verify.svg"
                alt="check"
                width={18}
                height={18}
                className="w-4.5 h-4.5 shrink-0 mt-0.5 object-contain"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Input Requirement */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-sm text-emerald-900">
        <span className="text-xl shrink-0">💡</span>
        <div className="leading-relaxed">
          <span className="font-bold">Yêu cầu đầu vào: </span>
          <span>{inputRequirementText}</span>
        </div>
      </div>
    </section>
  );
}
