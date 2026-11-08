import React from "react";
import { CheckCircle2 } from "@/components/common/Icons";

interface CourseAudienceProps {
  courseLevel?: string;
}

export default function CourseAudience({ courseLevel }: CourseAudienceProps) {
  const targetAudiences = [
    {
      title: "Sinh viên năm 3, năm cuối",
      desc: "Sinh viên các khối ngành Kinh tế, Tài chính, QTKD, Marketing, Hệ thống thông tin muốn có Portfolio thực chiến và kỹ năng làm việc thực tế để apply Fresher/Junior DA ngay khi ra trường.",
    },
    {
      title: "Người đi làm muốn chuyển ngành Data Analyst",
      desc: "Anh/chị đang làm trong các bộ phận Sales, Marketing, Kế toán, Ngân hàng, Vận hành muốn chuyển hướng sang công việc có mức đãi ngộ tốt và lộ trình thăng tiến rõ ràng.",
    },
    {
      title: "Nhân sự muốn nâng cấp từ Excel lên SQL & BI",
      desc: "Những người thường xuyên làm việc với báo cáo bằng Excel thủ công, file nặng và chậm, muốn tự động hóa việc truy vấn và trực quan hóa dữ liệu theo chuẩn doanh nghiệp.",
    },
  ];

  const requirements = [
    {
      title: "Thiết bị học tập",
      desc: "Laptop hoặc máy tính cá nhân (Windows hoặc macOS) có micro và camera hoạt động tốt để tham gia các buổi học tương tác trực tiếp qua Zoom.",
    },
    {
      title: "Phần mềm & Công cụ",
      desc: "Cài đặt DBeaver, PostgreSQL và Power BI (hoàn toàn miễn phí). Mentor sẽ gửi tài liệu và video hướng dẫn cài đặt chi tiết trước ngày khai giảng.",
    },
    {
      title: "Nền tảng đầu vào",
      desc: "Không yêu cầu nền tảng lập trình hay toán học phức tạp từ trước. Toàn bộ giáo trình được thiết kế bài bản từ bản chất tư duy kinh doanh đến cú pháp thực chiến.",
    },
    {
      title: "Thời gian & Tinh thần cam kết",
      desc: "Dành ra tối thiểu 2 - 3 giờ mỗi tuần để thực hành bài tập trên bộ dữ liệu doanh nghiệp và chủ động thảo luận cùng Mentor trên nhóm học tập.",
    },
  ];

  return (
    <section className="w-full bg-[#F8F9FA] py-14 lg:py-20 border-t border-neutral-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#AF445A]/30 bg-white font-bold text-xs sm:text-sm text-brand-gradient shadow-xs uppercase tracking-wider mb-2">
            Đối Tượng & Điều Kiện
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#252525] tracking-tight">
            Khóa Học Này Có Phù Hợp Với Bạn?
          </h2>
        </div>

        {/* 2-Column Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Column 1: Khóa học này dành cho ai? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#AF445A]/10 text-[#AF445A] flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#252525]">
                    Khóa học này dành cho ai?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Phù hợp từ người bắt đầu từ số 0 đến người muốn hệ thống hóa kiến thức
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {targetAudiences.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-150">
                    <CheckCircle2 className="w-5 h-5 text-[#AF445A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-[#252525] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
              <span>Cấp độ đào tạo:</span>
              <span className="font-bold text-[#AF445A] bg-[#AF445A]/10 px-2 py-0.5 rounded-md">
                {courseLevel || "Beginner Friendly"}
              </span>
            </div>
          </div>

          {/* Column 2: Yêu cầu cần chuẩn bị gì? */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#784080]/10 text-[#784080] flex items-center justify-center text-2xl">
                  🛠️
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#252525]">
                    Yêu cầu cần chuẩn bị gì?
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500">
                    Mọi thứ đều được chuẩn bị kỹ lưỡng trước khi bắt đầu
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {requirements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-150">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-heading font-bold text-sm sm:text-base text-[#252525] mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500 italic">
              * Có đội ngũ trợ giảng hỗ trợ kỹ thuật cài đặt phần mềm 1-on-1 trước buổi học đầu tiên.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

