"use client";

import React, { useState } from "react";
import { ChevronDown } from "@/components/common/Icons";
import LeadForm from "@/components/forms/LeadForm";

interface FaqItem {
  q: string;
  a: string;
}

interface CourseFaqProps {
  courseId: string;
  courseTitle: string;
}

export default function CourseFaq({ courseId, courseTitle }: CourseFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: "Khóa học có cam kết 'bao đỗ việc làm' tại các tập đoàn lớn không?",
      a: "DataWithLy không đưa ra những lời hứa ảo như 'cam kết 100% bao đỗ Google/Grab/Shopee'. Việc trúng tuyển phụ thuộc vào nỗ lực, kỷ luật rèn luyện và kỹ năng của chính bạn. Chúng tôi cam kết đem lại kiến thức thực chiến chuẩn doanh nghiệp, trực tiếp Mentor Hứa Thảo Ly sửa CV 1-on-1, luyện phỏng vấn thử và kết nối cơ hội tuyển dụng trong mạng lưới đối tác đến khi bạn tự tin ứng tuyển.",
    },
    {
      q: "Nếu bận đột xuất có được xem lại video bài giảng không?",
      a: "Có! 100% các buổi học qua Zoom đều được ghi hình chất lượng cao (Full HD). Video recording và slide bài giảng sẽ được cập nhật lên hệ thống ngay sau buổi học để bạn xem lại bất cứ lúc nào và lưu trữ trọn đời.",
    },
    {
      q: "Người chưa từng học lập trình hay toán cao cấp có theo kịp không?",
      a: "Hoàn toàn theo kịp! Lộ trình được thiết kế đặc thù cho cả người mới bắt đầu từ số 0. Thay vì dạy cú pháp phức tạp hàn lâm, Mentor hướng dẫn tư duy phân tích bằng các câu hỏi thực tế trong kinh doanh, sau đó từng bước hướng dẫn cách gõ câu lệnh để lấy ra dữ liệu mong muốn.",
    },
    {
      q: "Chính sách 'Học lại miễn phí' được áp dụng như thế nào?",
      a: "Nếu vì lý do công việc đột xuất hoặc chưa nắm vững kiến thức sau khi kết thúc khóa học, bạn hoàn toàn có thể đăng ký học lại khóa tiếp theo hoàn toàn MIỄN PHÍ trong vòng 1 năm kể từ ngày khai giảng.",
    },
    {
      q: "Lớp học tương tác ra sao và nếu gặp bài khó thì hỏi ai?",
      a: "Lớp học trực tiếp qua Zoom với sĩ số giới hạn để đảm bảo Mentor có thể tương tác với từng học viên. Ngoài giờ học, bạn có nhóm hỗ trợ học tập riêng cùng Mentor và Trợ giảng, giải đáp bài tập và thắc mắc kỹ thuật 24/7.",
    },
    {
      q: "Có chính sách chia nhỏ đợt thanh toán học phí không?",
      a: "Có, DataWithLy hỗ trợ chia nhỏ học phí làm 2 đợt hoặc thanh toán qua thẻ tín dụng trả góp 0% lãi suất nhằm tạo điều kiện thuận lợi nhất cho học viên tham gia học tập.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full bg-white py-14 lg:py-20 border-t border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7">
            <div>
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#AF445A]/10 text-xs font-bold text-[#AF445A] uppercase tracking-wider mb-2.5">
                Hỏi Đáp Thường Gặp
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#252525] tracking-tight">
                Giải Đáp Thắc Mắc Trước Khi Đăng Ký
              </h2>
              <p className="mt-2 text-sm sm:text-base text-neutral-600 leading-relaxed">
                Những điều học viên thường băn khoăn về lịch học, phương pháp đào tạo và quyền lợi hỗ trợ.
              </p>
            </div>

            <div className="space-y-3.5 mt-8">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-[#AF445A]/40 bg-[#FAF7F8]/80 shadow-xs ring-1 ring-[#AF445A]/20"
                        : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                      className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF445A]/30 rounded-2xl"
                    >
                      <span
                        className={`font-heading font-bold text-sm sm:text-base leading-snug transition-colors ${
                          isOpen ? "text-[#8B1D2C]" : "text-[#252525]"
                        }`}
                      >
                        {faq.q}
                      </span>
                      <div
                        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isOpen
                            ? "rotate-180 bg-[#8B1D2C] text-white shadow-xs"
                            : "bg-neutral-100 text-neutral-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-700 leading-relaxed border-t border-neutral-100 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Helper Note */}
            <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/70 flex items-center gap-3 text-xs sm:text-sm text-neutral-600">
              <span className="text-base shrink-0">💬</span>
              <span>
                Bạn còn câu hỏi khác? Hãy điền biểu mẫu tư vấn bên cạnh hoặc liên hệ qua Hotline/Zalo để được Mentor giải đáp trực tiếp.
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Lead Consultation Form (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#FAF7F8] to-white border border-[#EFE5E7] rounded-3xl p-6 sm:p-8 shadow-sm lg:sticky lg:top-24">
            <div className="mb-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#8B1D2C]/10 text-xs font-bold text-[#8B1D2C] uppercase tracking-wider mb-2">
                Tư Vấn Miễn Phí 1:1
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#252525]">
                Nhận Lộ Trình Học Phù Hợp
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
                Điền thông tin để Mentor Hứa Thảo Ly tư vấn chi tiết về khóa học{" "}
                <strong className="text-neutral-900 font-semibold">{courseTitle}</strong>.
              </p>
            </div>

            {/* Value Props Row */}
            <div className="grid grid-cols-3 gap-2 py-3 px-2 mb-5 rounded-xl bg-white border border-[#EFE5E7] text-center text-[11px] sm:text-xs font-medium text-neutral-700">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs">⚡</span>
                <span>Tư vấn trong 15p</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 border-x border-neutral-200/60">
                <span className="text-xs">🎯</span>
                <span>Đúng năng lực</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-xs">🔒</span>
                <span>Bảo mật 100%</span>
              </div>
            </div>

            <LeadForm
              formId={`course_detail_embedded_${courseId}`}
              ctaId={`btn_submit_embedded_${courseId}`}
              defaultCourseId={courseId}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

