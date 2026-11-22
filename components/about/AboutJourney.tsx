import React from "react";

interface Step {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  tag: string;
}

const JOURNEY_STEPS: Step[] = [
  {
    step: "01",
    title: "Định vị & Khai phóng tư duy",
    subtitle: "Analytical Mindset",
    desc: "Xác định rõ xuất phát điểm, mục tiêu nghề nghiệp và trang bị tư duy phản biện, cách đặt câu hỏi bản chất trước khi chạm vào dữ liệu.",
    tag: "Tuần 1 - 2",
  },
  {
    step: "02",
    title: "Làm chủ SQL & Data Modeling",
    subtitle: "Production SQL",
    desc: "Thực hành truy vấn trên Big Data (Fintech/E-com), thiết kế lược đồ quan hệ Star Schema, Window Functions và tối ưu hóa câu lệnh.",
    tag: "Tuần 3 - 6",
  },
  {
    step: "03",
    title: "Trực quan hóa & Kể chuyện số liệu",
    subtitle: "Dashboard & Storytelling",
    desc: "Thiết kế Dashboard trực quan trên Tableau/PowerBI, kết nối insight dữ liệu với bài toán tăng trưởng doanh thu và cắt giảm chi phí.",
    tag: "Tuần 7 - 9",
  },
  {
    step: "04",
    title: "Portfolio thực chiến & Mock Interview",
    subtitle: "Job-Ready DA",
    desc: "Hoàn thiện đồ án tốt nghiệp chuẩn Portfolio doanh nghiệp, chuẩn hóa CV cá nhân và tham gia phỏng vấn thử 1-1 trước khi apply.",
    tag: "Tuần 10 - 12",
  },
];

export default function AboutJourney() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF7F8]/60 border-t border-b border-[#EFE5E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#AF445A]/10 border border-[#AF445A]/20 text-[#8B1D2C] text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-[#AF445A]" />
            <span>Lộ trình chuyển mình</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1C1B1D] tracking-tight">
            Hành trình từ Newbie đến{" "}
            <span className="bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] bg-clip-text text-transparent">
              Data Analyst tự tin
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600">
            Lộ trình 4 giai đoạn được tinh gọn và kiểm chứng qua hơn 1,000 học viên đã ứng tuyển thành công.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOURNEY_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#EFE5E7] rounded-3xl p-6 relative hover:border-[#AF445A]/50 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading text-3xl font-extrabold text-[#AF445A]/30 group-hover:text-[#8B1D2C] transition-colors">
                    {item.step}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F8] border border-[#EFE5E7] text-neutral-600">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-[#1C1B1D]">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider mt-0.5">
                  {item.subtitle}
                </p>

                <p className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EFE5E7]/60 flex items-center gap-1.5 text-xs text-[#8B1D2C] font-semibold">
                <span>Khám phá chi tiết</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
