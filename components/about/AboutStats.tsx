import React from "react";

interface StatItem {
  value: string;
  label: string;
  description: string;
}

const STATS: StatItem[] = [
  {
    value: "5+ Năm",
    label: "Kinh nghiệm thực chiến",
    description: "Từng giữ vị trí Lead Data Analyst tại các Tech Giants: MoMo, Tiki, ACB.",
  },
  {
    value: "1,000+",
    label: "Học viên & Mentee",
    description: "Được trang bị tư duy dữ liệu bản chất, tự tin ứng tuyển và làm việc độc lập.",
  },
  {
    value: "100%",
    label: "Production Data",
    description: "Học tập và giải quyết bài toán trên dữ liệu thật, không học vẹt cú pháp lý thuyết.",
  },
  {
    value: "92%",
    label: "Ứng dụng thành công",
    description: "Học viên nhận việc hoặc áp dụng trực tiếp nâng cao hiệu suất sau 3 tháng hoàn thành.",
  },
];

export default function AboutStats() {
  return (
    <section className="py-12 bg-white relative z-10 border-b border-[#EFE5E7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-2xl p-6 text-center hover:border-[#AF445A]/40 hover:shadow-md transition-all duration-300 group"
            >
              <div className="font-heading text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="mt-2 text-base font-semibold text-[#1C1B1D]">
                {stat.label}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
