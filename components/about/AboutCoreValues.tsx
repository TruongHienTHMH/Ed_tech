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
        <svg className="w-6 h-6 text-[#8B1D2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
        </svg>
      ),
      title: "Analytical Thinking",
      subtitle: "Tư duy phân tích từ bản chất",
      description: "Không chỉ học cách sử dụng công cụ, bạn sẽ được rèn luyện cách đặt câu hỏi, xác định vấn đề và khai thác dữ liệu để hỗ trợ ra quyết định",
      points: [
        "Hiểu bản chất thay vì học thuộc công thức",
        "Kết nối Business Problem với Data & Metrics",
        "Phát triển tư duy phân tích và giải quyết vấn đề",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#8B1D2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Learning by Doing",
      subtitle: "Học đi đôi với thực hành",
      description: "Kiến thức được củng cố thông qua bài tập, Case Study và Project mô phỏng những bài toán thường gặp trong công việc Data Analyst",
      points: [
        "Lộ trình bài bản từ nền tảng đến ứng dụng",
        "Thực hành với Dataset và Business Case",
        "Vận dụng kiến thức qua Capstone Project",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#8B1D2C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: "Expert Mentorship",
      subtitle: "Đồng hành cùng mentor thực chiến",
      description: "Được trực tiếp hướng dẫn bởi mentor có hơn 5 năm kinh nghiệm Data Analytics, kết hợp kiến thức chuyên môn và kinh nghiệm làm việc tại MoMo, Tiki",
      points: [
        "Học trực tiếp và giải đáp trong quá trình học",
        "Nhận góp ý để hoàn thiện bài tập và Project",
        "Hỗ trợ định hướng nghề nghiệp và Review CV",
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
            Không chỉ học công cụ, LYDATA giúp bạn xây dựng tư duy, phát triển kỹ năng và từng bước ứng dụng dữ liệu vào công việc thực tế
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
