"use client";

import React from "react";
import Image from "next/image";
import { StudentProject } from "@/lib/cms/types";

interface CourseOutcomesProps {
  outcomes?: string[];
  projects?: StudentProject[];
}

export default function CourseOutcomes({ outcomes }: CourseOutcomesProps) {
  // Lấy dữ liệu động từ Google Sheets / AppScript (course.outcomes)
  const outcomesList =
    outcomes && outcomes.length > 0
      ? outcomes
      : [
          "Tự tin viết câu lệnh SQL phức tạp (JOINs, Window Functions, CTE).",
          "Tối ưu hóa tốc độ truy vấn trên hệ thống dữ liệu lớn của doanh nghiệp.",
          "Sở hữu Portfolio đồ án Capstone thực chiến để gây ấn tượng với nhà tuyển dụng.",
        ];

  return (
    <section className="mb-12" id="outcomes">
      {/* Title Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Sau khóa học bạn có thể làm được gì?
        </h2>
      </div>

      {/* Outcome List Box - Chuẩn Design CourseFigmaOverview:L40-L58 */}
      <div className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-2xl p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>🚀</span> Mục tiêu và kết quả đầu ra
        </h3>
        <ul className="space-y-3.5 text-sm text-gray-700">
          {outcomesList.map((item, idx) => {
            const hasColon = item.includes(":");
            const hasDash = !hasColon && item.includes(" - ");
            let title = "";
            let desc = "";

            if (hasColon) {
              const parts = item.split(":");
              title = parts[0].trim();
              desc = parts.slice(1).join(":").trim();
            } else if (hasDash) {
              const parts = item.split(" - ");
              title = parts[0].trim();
              desc = parts.slice(1).join(" - ").trim();
            }

            return (
              <li key={idx} className="flex items-start gap-4">
                <Image
                  src="/assets/decorations/verify.svg"
                  alt="check"
                  width={18}
                  height={18}
                  className="w-4.5 h-4.5 shrink-0 mt-0.5 object-contain"
                />
                <div className="leading-relaxed">
                  {title && desc ? (
                    <>
                      <strong className="font-semibold text-gray-900">{title}: </strong>
                      <span>{desc}</span>
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
