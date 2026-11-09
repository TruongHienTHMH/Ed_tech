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
    <section className="mb-12" id="methodology">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2.5 h-6 bg-[#AF445A] rounded-full inline-block" />
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Sơ Đồ 5 Bước Tư Duy Phân Tích Thực Chiến
        </h2>
      </div>
      <p className="text-sm sm:text-base text-neutral-600 mb-6 leading-relaxed">
        Tại sao Mentor Hứa Thảo Ly luôn bắt đầu từ bài toán kinh doanh? Bởi một câu lệnh SQL dù chạy nhanh đến mấy cũng vô nghĩa nếu trả lời sai câu hỏi của doanh nghiệp.
      </p>

      {/* 5-Step Process Flow: 2-column balanced grid on desktop, single column vertical on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {METHODOLOGY_STEPS.map((item, index) => {
          const isLast = index === METHODOLOGY_STEPS.length - 1;

          return (
            <div
              key={item.step}
              className={`bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 ${
                isLast ? "sm:col-span-2" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-heading font-extrabold text-xs px-2.5 py-1 rounded-md bg-[#AF445A]/10 text-[#AF445A]">
                    BƯỚC {item.step}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-[#252525] mb-1 group-hover:text-[#AF445A] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#784080] mb-2">
                  {item.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Highlight Callout Footer */}
      <div className="mt-6 bg-[#FAF7F8] rounded-2xl p-4 sm:p-5 border border-dashed border-[#AF445A]/40 shadow-xs">
        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
          <span className="font-bold text-[#AF445A]">💡 Triết lý đào tạo của DataWithLy:</span>{" "}
          Không đào tạo thợ gõ code hay vẽ chart vu vơ. Chúng tôi rèn luyện tư duy phản biện sắc bén để bạn tự tin đối thoại cùng Ban Giám Đốc.
        </p>
      </div>
    </section>
  );
}

