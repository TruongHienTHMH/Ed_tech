"use client";

import React from "react";
import { Course } from "@/lib/cms/types";

interface CourseFigmaOverviewProps {
  course: Course;
}

export default function CourseFigmaOverview({ course }: CourseFigmaOverviewProps) {
  return (
    <section className="mb-12" id="overview">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Chi tiết khóa học
        </h2>
      </div>

      {/* Main Description */}
      <div className="prose prose-gray max-w-none mb-8">
        <p className="text-base text-gray-700 leading-relaxed">
          {course.description ||
            "Xây dựng nền tảng Data Analytics toàn diện, từ truy vấn và xử lý dữ liệu với SQL đến tư duy phân tích, trực quan hóa và thiết kế Dashboard hoàn chỉnh cho doanh nghiệp."}
        </p>
      </div>

      {/* 2-Column Info Grid: Who it is for & What you will achieve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Box 1: Khóa học dành cho ai? */}
        <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-2xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>👥</span> Khóa học này dành cho ai?
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Người mới bắt đầu chưa có kiến thức về lập trình hay cơ sở dữ liệu.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Nhân sự Marketing, Vận hành, Tài chính muốn tự động hóa việc làm báo cáo.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Sinh viên hoặc người đi làm muốn chuyển ngành sang vị trí Data Analyst.</span>
            </li>
          </ul>
        </div>

        {/* Box 2: Sau khóa học làm được gì? */}
        <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-2xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🚀</span> Sau khóa học bạn có thể làm được gì?
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Tự tin viết câu lệnh SQL phức tạp (JOINs, Window Functions, CTE).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Tối ưu hóa tốc độ truy vấn trên hệ thống dữ liệu lớn của doanh nghiệp.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#AF445A] font-bold">✓</span>
              <span>Sở hữu Portfolio đồ án Capstone thực chiến để gây ấn tượng với nhà tuyển dụng.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Input Requirement */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center gap-3 text-sm text-emerald-900">
        <span className="text-xl">💡</span>
        <div>
          <span className="font-bold">Yêu cầu đầu vào: </span>
          <span>
            Không yêu cầu kiến thức lập trình hay toán cao cấp từ trước. Bạn chỉ cần chuẩn bị máy tính cá nhân (Windows hoặc macOS) và tinh thần học hỏi nghiêm túc.
          </span>
        </div>
      </div>
    </section>
  );
}

