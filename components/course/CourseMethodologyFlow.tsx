import React from "react";

interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

const METHODOLOGY_STEPS: StepItem[] = [
  {
    step: "01",
    title: "Business Problem",
    subtitle: "Xác định bản chất bài toán",
    description:
      "Làm rõ mục tiêu kinh doanh và vấn đề cốt lõi (doanh thu sụt giảm, tỷ lệ rời bỏ tăng) trước khi chạm tay vào dữ liệu.",
    icon: "🎯",
  },
  {
    step: "02",
    title: "Metrics Definition",
    subtitle: "Thiết lập cây chỉ số",
    description:
      "Xây dựng Driver Tree chuẩn xác, bóc tách chỉ số đầu ra thành các yếu tố tác động, loại bỏ hoàn toàn các chỉ số ảo.",
    icon: "📐",
  },
  {
    step: "03",
    title: "Data Extraction",
    subtitle: "Trích xuất & Xử lý (SQL)",
    description:
      "Tối ưu câu lệnh SQL truy vấn hàng triệu dòng dữ liệu từ hệ thống cơ sở dữ liệu thực tế, làm sạch và chuẩn hóa số liệu.",
    icon: "⚡",
  },
  {
    step: "04",
    title: "Deep-dive Insight",
    subtitle: "Đào sâu tìm nguyên nhân",
    description:
      "Phân tích đa chiều (Cohort, Funnel, RFM) để tìm ra Root Cause của vấn đề thay vì chỉ mô tả lại những con số quá khứ.",
    icon: "🔍",
  },
  {
    step: "05",
    title: "Actionable Dashboard",
    subtitle: "Trực quan & Đề xuất hành động",
    description:
      "Thiết kế Dashboard trực quan theo chuẩn 5 giây phục vụ C-Level, chuyển hóa insight thành hành động tăng trưởng cụ thể.",
    icon: "📊",
  },
];

export default function CourseMethodologyFlow() {
  return (
    <section className="w-full bg-[#F8F9FA] py-14 lg:py-20 border-b border-neutral-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#AF445A]/30 bg-white font-bold text-xs sm:text-sm text-brand-gradient shadow-xs uppercase tracking-wider mb-3">
            Phương Pháp Đào Tạo Thực Chiến
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#252525] tracking-tight">
            Sơ Đồ 5 Bước Tư Duy Phân Tích Thực Chiến
          </h2>
          <p className="mt-3 text-neutral-600 text-base sm:text-lg leading-relaxed">
            Tại sao Mentor Hứa Thảo Ly luôn bắt đầu từ bài toán kinh doanh? Bởi một câu lệnh SQL dù chạy nhanh đến mấy cũng vô nghĩa nếu trả lời sai câu hỏi của doanh nghiệp.
          </p>
        </div>

        {/* 5-Step Process Flow (Desktop horizontal grid, Mobile vertical timeline) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5 relative">
          {METHODOLOGY_STEPS.map((item, index) => {
            const isLast = index === METHODOLOGY_STEPS.length - 1;

            return (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-5 lg:p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-heading font-extrabold text-xs px-2.5 py-1 rounded-md bg-[#AF445A]/10 text-[#AF445A]">
                      BƯỚC {item.step}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#252525] mb-1 group-hover:text-[#AF445A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#784080] mb-3">
                    {item.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Arrow Connector for Desktop (between cards) */}
                {!isLast && (
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[#AF445A] text-white items-center justify-center text-xs shadow-md">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Highlight Callout Footer */}
        <div className="mt-10 max-w-2xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-dashed border-[#AF445A]/40 text-center shadow-xs">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <span className="font-bold text-[#AF445A]">💡 Triết lý đào tạo của DataWithLy:</span>{" "}
            Không đào tạo thợ gõ code hay vẽ chart vu vơ. Chúng tôi rèn luyện tư duy phản biện sắc bén để bạn tự tin đối thoại cùng Ban Giám Đốc.
          </p>
        </div>
      </div>
    </section>
  );
}

