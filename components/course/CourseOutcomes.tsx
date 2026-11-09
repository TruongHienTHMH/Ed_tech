import React from "react";
import Image from "next/image";
import { StudentProject } from "@/lib/cms/types";
import { CheckCircle2 } from "@/components/common/Icons";

interface CourseOutcomesProps {
  projects?: StudentProject[];
}

export default function CourseOutcomes({ projects = [] }: CourseOutcomesProps) {
  const outcomes = [
    {
      title: "Làm chủ kỹ thuật truy vấn SQL thực chiến",
      desc: "Tự tin viết các câu lệnh phức tạp (Window Functions, CTE, Recursive Queries, Subquery) trên các hệ quản trị CSDL lớn, tối ưu hóa tốc độ xử lý.",
      icon: "⚡",
    },
    {
      title: "Xây dựng Cây chỉ số Business Metrics",
      desc: "Biết cách bóc tách bài toán kinh doanh thành cây chỉ số đo lường (Driver Tree) cho các ngành E-commerce, Fintech, SaaS và F&B.",
      icon: "📈",
    },
    {
      title: "Thiết kế Dashboard Quản trị Chuẩn 5 Giây",
      desc: "Thành thạo công cụ BI (Power BI/Tableau), áp dụng nguyên lý thị giác Gestalt để thiết kế báo cáo trực quan cho ban lãnh đạo C-Level.",
      icon: "📊",
    },
    {
      title: "Sở hữu Portfolio dự án chuẩn chỉnh trên CV",
      desc: "Tự tay hoàn thiện ít nhất 1-2 dự án phân tích thực tế từ A-Z, đóng gói chuyên nghiệp trên GitHub / Notion để gửi trực tiếp cho nhà tuyển dụng.",
      icon: "💼",
    },
  ];

  // Fallback demo projects if none passed (2 items for balanced 2-column grid in 792px container)
  const displayProjects =
    projects && projects.length > 0
      ? projects.slice(0, projects.length >= 4 ? 4 : 2)
      : [
          {
            id: "proj-ecommerce-retention",
            title: "E-Commerce Cohort Retention Analysis",
            category: "E-commerce",
            authorName: "Trần Minh Đức (K7)",
            tools: ["SQL", "Cohort Analysis", "Power BI"],
            metrics: "Tối ưu hóa tỷ lệ giữ chân khách hàng (Retention Rate) tăng 18% sau 30 ngày",
            imageUrl: "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
          },
          {
            id: "proj-fintech-churn",
            title: "Fintech Customer Churn & Early Warning Dashboard",
            category: "Fintech",
            authorName: "Lê Phương Thảo (K8)",
            tools: ["SQL", "Data Studio", "Metrics Tree"],
            metrics: "Dự báo sớm 85% nhóm người dùng có nguy cơ rời bỏ ứng dụng ví điện tử",
            imageUrl: "/assets/figma/973e833b234c55daebe419eefe02eb6e80f7d86d.png",
          },
        ];

  return (
    <section className="mb-12" id="outcomes">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Bạn Sẽ Làm Được Gì Sau Khóa Học?
        </h2>
      </div>
      <p className="text-sm sm:text-base text-neutral-600 mb-6 leading-relaxed">
        Không chỉ là lý thuyết, đây là những năng lực thực chiến giúp học viên DataWithLy tự tin ứng tuyển vị trí Data Analyst.
      </p>

      {/* 4 Outcome Pillars Grid (2x2 Balanced Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
        {outcomes.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#FAF7F8] rounded-2xl p-5 sm:p-6 border border-[#EFE5E7] hover:border-[#AF445A]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-white border border-[#EFE5E7] shadow-xs flex items-center justify-center text-xl mb-3">
                {item.icon}
              </div>
              <h3 className="font-heading font-bold text-base text-[#252525] mb-2 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Cam kết đạt được</span>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Showcase Sub-section (2-Column Grid) */}
      <div className="bg-[#1F242F] rounded-3xl p-5 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-[#FFC934] uppercase tracking-wider">
              Sản Phẩm Tốt Nghiệp Mẫu
            </span>
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white mt-1">
              Portfolio Thực Tế Của Học Viên DataWithLy
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-white/70 max-w-sm">
            Học viên hoàn thiện sản phẩm trực tiếp từ dataset doanh nghiệp mô phỏng, có dashboard tương tác trực quan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {displayProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#2A303C] rounded-2xl overflow-hidden border border-white/10 hover:border-[#AF445A]/50 transition-all group flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={proj.imageUrl || "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png"}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 380px"
                />
                <div className="absolute top-3 left-3 bg-[#1F242F]/90 backdrop-blur-sm text-[11px] font-bold px-2.5 py-1 rounded-md text-[#FFC934] border border-white/10">
                  {proj.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white mb-2 leading-snug group-hover:text-[#FFC934] transition-colors line-clamp-2">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-white/70 mb-3 line-clamp-2 leading-relaxed">
                    {proj.metrics}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <span>Tác giả: <strong className="text-white/90">{proj.authorName}</strong></span>
                  <div className="flex gap-1.5">
                    {Array.isArray(proj.tools) &&
                      proj.tools.slice(0, 2).map((t, i) => (
                        <span key={i} className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white/80">
                          {t}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

