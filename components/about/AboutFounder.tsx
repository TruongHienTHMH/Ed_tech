import React from "react";
import Image from "next/image";

interface SocialLink {
  name: string;
  url: string;
  handle: string;
  iconPath: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@datawithly",
    handle: "@datawithly",
    iconPath: "/assets/icons/tiktok.svg",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/datawithly/",
    handle: "@datawithly",
    iconPath: "/assets/icons/instagram.svg",
  },
  {
    name: "Threads",
    url: "https://www.threads.com/@datawithly",
    handle: "@datawithly",
    iconPath: "/assets/icons/threads.svg",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61594436940087",
    handle: "Ly Data",
    iconPath: "/assets/icons/facebook.svg",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/huathaoly",
    handle: "Hứa Thảo Lý",
    iconPath: "/assets/icons/linkedin.svg",
  },
];

const CAREER_MILESTONES = [
  {
    role: "Lead Data Analyst",
    company: "MoMo (M_Service)",
    period: "Fintech & Payments",
    highlight: "",
  },
  {
    role: "Data Analyst",
    company: "Tiki Corporation",
    period: "E-Commerce",
    highlight: "",
  },
  {
    role: "Business & Data Analyst",
    company: "ACB (Ngân hàng Á Châu)",
    period: "Banking & Financial Services",
    highlight: "",
  },
];

export default function AboutFounder() {
  return (
    <section id="story" className="py-16 md:py-24 bg-[#FAF7F8]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-2.5 h-6 bg-[#AF445A] rounded-full shrink-0" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1B1D] tracking-tight">
            Founder &amp; Giảng viên hướng dẫn
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Social Card */}
          <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
            <div className="w-full max-w-md bg-white border border-[#EFE5E7] rounded-3xl p-6 shadow-sm">
              {/* Photo Frame */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-b from-[#AF445A]/10 to-[#784080]/10 border border-[#EFE5E7]">
                <Image
                  src="/assets/mentor/ly.png"
                  alt="Hứa Thảo Lý - Founder LYDATA"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                {/* Brand Logo Floating Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#EFE5E7] shadow-sm flex items-center gap-2">
                  <Image
                    src="/assets/mentor/logo-lydata-red.svg"
                    alt="LYDATA Logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="text-xs font-bold text-[#8B1D2C] tracking-wide uppercase">
                    LYDATA Official
                  </span>
                </div>
              </div>

              {/* Founder Info */}
              <div className="mt-6 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-heading text-2xl font-bold text-[#1C1B1D]">
                    Hứa Thảo Lý
                  </h3>
                  {/* Verified Icon SVG */}
                  <svg
                    className="w-5 h-5 text-[#8B1D2C]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Verified Instructor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[#AF445A] mt-1">
                  Founder &amp; Mentor tại LYDATA
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  5+ năm kinh nghiệm trong lĩnh vực Data Analytics - Senior Data Analyst tại MoMo
                </p>

                {/* Social Connect Icons */}
                <div className="mt-6 pt-5 border-t border-[#EFE5E7]">
                  <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-3">
                    Kênh chia sẻ kiến thức
                  </p>
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {SOCIAL_LINKS.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Theo dõi ${item.name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F8] border border-[#EFE5E7] hover:border-[#AF445A] hover:bg-[#FFF5F6] transition-colors text-xs font-medium text-neutral-700 hover:text-[#8B1D2C]"
                      >
                        <Image
                          src={item.iconPath}
                          alt={item.name}
                          width={16}
                          height={16}
                          className="w-4 h-4 object-contain"
                        />
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Founder Story & Career Milestones */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Story Prose */}
            <div className="bg-white border border-[#EFE5E7] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1C1B1D] mb-4">
                &ldquo;Dữ liệu chỉ thực sự có giá trị khi nó thúc đẩy hành động kinh doanh.&rdquo;
              </h3>
              <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Xuất phát điểm từ sinh viên chuyên ngành Tài chính Quốc tế tại trường Đại học Ngoại Thương (FTU2),
                  mình hiểu rõ rào cản lớn nhất của những bạn học kinh tế, marketing hay tài chính khi bước chân vào
                  thế giới Data: <strong className="text-[#1C1B1D]">sợ toán, sợ code và không biết bắt đầu từ đâu.</strong>
                </p>
                <p>
                  Trong suốt 5 năm lăn lộn thực tế qua các môi trường dữ liệu quy mô hàng đầu Việt Nam như
                  <strong className="text-[#8B1D2C]"> MoMo, Tiki, ACB</strong>, mình nhận ra rằng các doanh nghiệp
                  không chỉ tìm một người biết gõ SQL hay kéo thả biểu đồ. Họ khao khát những Data Analyst có
                  <strong className="text-[#8B1D2C]"> tư duy bản chất (Business Mindset)</strong> — biết cách bóc tách bài toán kinh doanh,
                  truy vấn chuẩn xác và <strong className="text-[#8B1D2C]">kể câu chuyện số liệu (Data Storytelling)</strong> để giúp high level ra quyết định.
                </p>
                <p>
                  Đó là lý do <strong className="text-[#8B1D2C]">LYDATA</strong> ra đời. Với giáo trình chuẩn hóa từ
                  Production Data thực chiến và phương pháp kèm cặp 1-on-1 sát sao, mình muốn rút ngắn con đường
                  chuyển ngành của bạn từ vài năm xuống còn vài tháng với sự tự tin vững chắc nhất.
                </p>
              </div>
            </div>

            {/* Career Milestones Timeline */}
            <div className="bg-white border border-[#EFE5E7] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h4 className="font-heading text-lg font-bold text-[#1C1B1D] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#AF445A]" />
                Kinh nghiệm làm việc &amp; Nền tảng chuyên môn
              </h4>

              <div className="space-y-6">
                {CAREER_MILESTONES.map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-[#EFE5E7] hover:border-[#AF445A] transition-colors group">
                    <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#AF445A] group-hover:scale-125 transition-transform" />
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-semibold text-sm sm:text-base text-[#1C1B1D]">
                        {item.role}
                      </span>
                      <span className="text-xs font-semibold text-[#8B1D2C] bg-[#AF445A]/10 px-2 py-0.5 rounded-md">
                        {item.company}
                      </span>
                      <span className="text-xs text-neutral-400">
                        • {item.period}
                      </span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                      {item.highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
