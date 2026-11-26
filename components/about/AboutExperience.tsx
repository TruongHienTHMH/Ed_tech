"use client";

import React from "react";
import Image from "next/image";

export interface ExperienceBullet {
  id: string;
  content: React.ReactNode;
}

export interface ExperienceItem {
  id: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  titleNode: React.ReactNode;
  description?: string;
  bulletPoints?: ExperienceBullet[];
  logos?: {
    name: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
}

/**
 * Data cấu trúc mảng độc lập dễ quản trị nội dung
 */
const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "years-of-experience",
    image: "/assets/about/experience-1.png",
    imageAlt: "Kinh nghiệm làm việc thực chiến Data Analyst",
    imagePosition: "left",
    titleNode: (
      <>
        <span>Hơn </span>
        <span className="bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] bg-clip-text text-transparent">
          5 năm
        </span>
        <span> kinh nghiệm</span>
      </>
    ),
    description:
      "Từng làm Senior Data Analyst tại MoMo, Tiki & ACB. Hiểu rõ cách doanh nghiệp lớn vận hành dữ liệu và các bài toán thực tế",
    logos: [
      {
        name: "MoMo",
        src: "/assets/companies/momo.svg",
        alt: "MoMo Logo",
        width: 44,
        height: 44,
      },
      {
        name: "Tiki",
        src: "/assets/icons/tiki.svg",
        alt: "Tiki Logo",
        width: 56,
        height: 36,
      },
      {
        name: "ACB",
        src: "/assets/companies/acb.svg",
        alt: "Asia Commercial Bank Logo",
        width: 68,
        height: 26,
      },
    ],
  },
  {
    id: "awards-and-achievements",
    image: "/assets/about/experience-2.png",
    imageAlt: "Giải thưởng và thành tích chuyên môn",
    imagePosition: "right",
    titleNode: (
      <>
        <span className="bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] bg-clip-text text-transparent">
          Giải thưởng
        </span>
        <span> &amp; </span>
        <span className="bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent">
          Thành tích
        </span>
      </>
    ),
    bulletPoints: [
      {
        id: "ftu-econtest",
        content: "Quán quân E!Contest 7.0 do YEC FTU2 tổ chức",
      },
      {
        id: "rmit-ba",
        content: "Top 17 RMIT Business Analyst Champion Competition Season 1",
      },
      {
        id: "momo-innovation",
        content: "Á quân Innovation Contest tại MoMo",
      },
      {
        id: "momo-genai",
        content: "Á quân GenAI MiMir Master 2024 tại MoMo",
      },
    ],
  },
  {
    id: "mentorship-and-community",
    image: "/assets/about/experience-3.png",
    imageAlt: "Đồng hành và truyền cảm hứng cộng đồng Data",
    imagePosition: "left",
    titleNode: (
      <>
        <span className="bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] bg-clip-text text-transparent">
          Đồng hành
        </span>
        <span> &amp; </span>
        <span className="bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent">
          Truyền cảm hứng
        </span>
      </>
    ),
    bulletPoints: [
      {
        id: "mentor-talent",
        content: (
          <span>
            Mentor tại <strong className="text-[#8B1D2C] font-semibold">Data Got Talent 2023</strong> và Ban Giám Khảo chương trình <strong className="text-[#8B1D2C] font-semibold">Heading for the future: Data Analysis</strong>.
          </span>
        ),
      },
      {
        id: "mentees-count",
        content: (
          <span>
            Đã đồng hành cùng <strong className="text-[#8B1D2C] font-semibold">200+ học viên</strong> trên hành trình trở thành Data Analyst thực chiến.
          </span>
        ),
      },
    ],
  },
];

export default function AboutExperience() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Figma 313:1189) */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-[32px] text-[#1C1B1D] tracking-tight leading-tight">
            Kinh nghiệm &amp; chuyên môn
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#4C4C57] font-normal max-w-xl mx-auto leading-relaxed">
            Những cột mốc nổi bật trong quá trình học tập, làm việc và tham gia các cuộc thi chuyên môn.
          </p>
        </div>

        {/* 3 Alternating Feature Blocks (Figma 313:1192) */}
        <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
          {EXPERIENCE_DATA.map((item) => {
            const isImageLeft = item.imagePosition === "left";

            return (
              <div
                key={item.id}
                className={`flex flex-col ${
                  isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center justify-between gap-8 md:gap-12 lg:gap-16`}
              >
                {/* Visual Image Block */}
                <div className="w-full lg:w-[60%] shrink-0">
                  <div className="relative aspect-[16/10] sm:aspect-[720/450] w-full rounded-[24px] overflow-hidden border border-[#E8E7E9] bg-[#FAF7F8] shadow-sm group">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      priority={item.id === "years-of-experience"}
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Sub-Card Content Box (Figma 313:1198 / 1209 / 1224) */}
                <div className="w-full lg:w-[40%] flex justify-center relative">
                  {/* Gradient hình tròn / Ellipse làm shadow & ambient glow phía sau card theo màu primary */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[400px] lg:w-[440px] h-[320px] sm:h-[400px] lg:h-[440px] rounded-full bg-gradient-to-tr from-[#8B1D2C]/20 via-[#AF445A]/15 to-[#784080]/15 blur-3xl opacity-80 sm:opacity-95 z-0"
                  />

                  <div className="relative z-10 w-full max-w-[500px] bg-white border border-[#E8E7E9] rounded-[24px] p-5 sm:p-7 md:p-[33px] shadow-[0px_4px_20px_rgba(139,29,44,0.06)] hover:border-[#AF445A]/35 hover:shadow-[0px_10px_30px_rgba(139,29,44,0.12)] transition-all duration-300 flex flex-col gap-5 sm:gap-6">
                    
                    {/* Card Title: Luôn nằm trên cùng 1 hàng, font size tối ưu fit trọn vẹn */}
                    <h3 className="font-heading font-extrabold text-[19px] xs:text-xl sm:text-2xl md:text-[26px] lg:text-[27px] xl:text-[28px] text-[#1C1B1D] leading-tight tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.titleNode}
                    </h3>

                    {/* Divider Line */}
                    <div className="w-[68px] h-1 bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-transparent rounded-full" />

                    {/* Description Paragraph */}
                    {item.description && (
                      <p className="text-base sm:text-lg text-[#564244] leading-relaxed font-medium">
                        {item.description}
                      </p>
                    )}

                    {/* Bullet Points List */}
                    {item.bulletPoints && item.bulletPoints.length > 0 && (
                      <ul className="flex flex-col gap-3 sm:gap-3.5 list-disc list-inside text-base sm:text-lg text-[#564244] leading-relaxed font-medium marker:text-[#8B1D2C]">
                        {item.bulletPoints.map((point) => (
                          <li key={point.id} className="pl-1">
                            {point.content}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Partner / Company Logos: Căn giữa, giữ màu mặc định không đổi hiệu ứng */}
                    {item.logos && item.logos.length > 0 && (
                      <div className="pt-3 flex items-center justify-center flex-wrap gap-7 sm:gap-9 border-t border-[#EFE5E7]/80">
                        {item.logos.map((logo) => (
                          <div
                            key={logo.name}
                            className="relative flex items-center justify-center"
                          >
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              width={logo.width}
                              height={logo.height}
                              className="object-contain max-h-[38px] w-auto"
                              style={{ width: "auto", height: "auto" }}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
