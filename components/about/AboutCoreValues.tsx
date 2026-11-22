import React from "react";

interface CoreValue {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
}

export default function AboutCoreValues() {
  const values: CoreValue[] = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#8B1D2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Business-First Mindset",
      subtitle: "Tư duy bản chất bài toán kinh doanh",
      description: "Không chỉ dạy cú pháp câu lệnh vô hồn, LYDATA rèn luyện bạn cách đặt câu hỏi phản biện, xác định đúng chỉ số North Star Metrics và phân tích nguyên nhân gốc rễ (Root Cause Analysis).",
      points: [
        "Hiểu cội nguồn mô hình kinh doanh Fintech, E-commerce, Banking",
        "Biết cách làm việc với Stakeholders và giải quyết bài toán thực tế",
        "Khung tư duy bóc tách vấn đề MECE & Hypothesis-driven",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#8B1D2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Production Real Data",
      subtitle: "Dữ liệu lớn từ môi trường thật",
      description: "Nói không với các bảng dữ liệu đồ chơi vài chục dòng. Học viên được trực tiếp truy vấn trên Big Data Warehouse với hàng triệu bản ghi, đối mặt với dữ liệu bẩn và bài toán tối ưu hiệu năng.",
      points: [
        "Mô hình hóa dữ liệu sao / bông tuyết (Star / Snowflake Schema)",
        "Xử lý Data Dirty, Duplicate, Missing Values thực tế",
        "Tối ưu chi phí truy vấn và tốc độ thực thi SQL nâng cao",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#8B1D2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      ),
      title: "1-on-1 Mentorship",
      subtitle: "Kèm cặp sát sao & Chỉnh sửa chi tiết",
      description: "Mỗi học viên có tốc độ tiếp thu và mục tiêu chuyển ngành riêng. Đội ngũ Mentor sẽ review từng bài tập, sửa từng dòng code và luyện tập phỏng vấn Mock Interview 1-1 trước khi nộp hồ sơ.",
      points: [
        "Code review chi tiết giải thích vì sao nên viết như vậy",
        "Sửa CV chuẩn ATS và hướng dẫn xây dựng Portfolio trên GitHub/Tableau",
        "Đồng hành trọn đời qua cộng đồng cựu học viên và đối tác tuyển dụng",
      ],
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#AF445A]/10 border border-[#AF445A]/20 text-[#8B1D2C] text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-[#AF445A]" />
            <span>Triết lý giáo dục</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1C1B1D] tracking-tight">
            Vì sao học viên chọn{" "}
            <span className="bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] bg-clip-text text-transparent">
              LYDATA
            </span>
            ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600">
            3 trụ cột tạo nên sự khác biệt vượt trội trong chất lượng đầu ra của học viên LYDATA.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F8] border border-[#EFE5E7] rounded-3xl p-8 hover:border-[#AF445A]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Icon Circle */}
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFE5E7] flex items-center justify-center shadow-xs mb-6 group-hover:scale-110 group-hover:bg-[#FFF5F6] transition-all">
                  {item.icon}
                </div>

                <h3 className="font-heading text-xl font-bold text-[#1C1B1D]">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-[#AF445A] uppercase tracking-wider mt-1">
                  {item.subtitle}
                </p>

                <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#EFE5E7]">
                <ul className="space-y-2.5">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B1D2C] mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
