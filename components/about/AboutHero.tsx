"use client";

import React from "react";
import Image from "next/image";

interface SocialLink {
  name: string;
  url: string;
  iconSrc: string;
  ariaLabel: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@datawithly",
    ariaLabel: "TikTok @datawithly",
    iconSrc: "/assets/icons/tiktok.svg",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/datawithly/",
    ariaLabel: "Instagram @datawithly",
    iconSrc: "/assets/icons/instagram.svg",
  },
  {
    name: "Threads",
    url: "https://www.threads.com/@datawithly",
    ariaLabel: "Threads @datawithly",
    iconSrc: "/assets/icons/threads.svg",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61594436940087",
    ariaLabel: "Facebook Mentor Hứa Thảo Lý",
    iconSrc: "/assets/icons/facebook.svg",
  },
  {
    name: "Zalo",
    url: "https://zalo.me/0769361960",
    ariaLabel: "Zalo Mentor Hứa Thảo Lý (0769 361 960)",
    iconSrc: "/assets/figma/08742fdf977fc095f72d070c8238ee5aa891910d.png",
  },
];

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-12 md:pt-36 md:pb-16">
      {/* Wave hand animation keyframes */}
      <style jsx>{`
        @keyframes waveAnimation {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(16deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-hand-wave {
          display: inline-block;
          transform-origin: 75% 75%;
          animation: waveAnimation 2.4s infinite ease-in-out;
        }
      `}</style>

      {/* Decorative radial background glow tỏa đều từ tâm component */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] lg:w-[1200px] h-[350px] sm:h-[500px] lg:h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#AF445A]/20 via-[#8B1D2C]/10 to-transparent blur-3xl rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative">
          {/* Lớp bóng Gradient (Ambient Glow) tỏa lớn, rõ ràng phía sau toàn bộ Card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 sm:-inset-8 lg:-inset-12 rounded-[36px] bg-gradient-to-tr from-[#8B1D2C]/25 via-[#AF445A]/30 to-[#784080]/25 blur-2xl sm:blur-3xl -z-10"
          />

          {/* Figma 313:1161 Main Container Card */}
          <div className="relative z-10 bg-[#FAF7F8] border border-[#EFE5E7] rounded-[24px] p-6 sm:p-10 lg:p-[60px] shadow-[0px_16px_50px_rgba(139,29,44,0.08)] flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-[60px]">
          
          {/* Left Column: Greeting, Headline, Subtitle, Socials */}
          <div className="w-full lg:max-w-[620px] flex flex-col items-start gap-6 sm:gap-8">
            
            {/* Wave Hand & Heading Section */}
            <div className="flex flex-col items-start gap-4 sm:gap-5 w-full">
              {/* Wave Hand Icon với hiệu ứng vẫy tay chân thực */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 animate-hand-wave cursor-pointer">
                <Image
                  src="/assets/icons/hand-wave.svg"
                  alt="Wave Hand"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>

              {/* Main Headline */}
              <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight lg:leading-[54px] text-[#1C1B1D] tracking-tight">
                Xin chào, mình là{" "}
                <span className="bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-[#784080] bg-clip-text text-transparent">
                  Lý
                </span>
              </h1>

              {/* Subheading / Description */}
              <p className="text-base sm:text-lg lg:text-[18px] leading-relaxed lg:leading-[30px] text-[#4C4C57] font-normal">
                Mình giúp người mới bắt đầu trở thành Data Analyst bằng phương pháp học thực chiến và dễ hiểu nhất.
              </p>
            </div>

            {/* Divider Line */}
            <div className="w-16 h-1 bg-gradient-to-r from-[#8B1D2C] via-[#AF445A] to-transparent rounded-full" />

            {/* Social Icons Row (Kích thước chuẩn 4-point / 8-point grid: 48px - 56px) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full pt-1">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#EFE5E7] flex items-center justify-center p-3 sm:p-3.5 hover:border-[#AF445A]/50 hover:bg-[#FFF5F6] hover:scale-105 active:scale-95 transition-all shadow-[0px_2px_8px_rgba(0,0,0,0.04)]"
                  >
                    <Image
                      src={social.iconSrc}
                      alt={social.name}
                      width={28}
                      height={28}
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      style={{ width: "auto", height: "auto" }}
                    />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Portrait of Founder */}
          <div className="w-full sm:w-[420px] lg:w-[472px] shrink-0">
            <div className="relative aspect-[472/446] w-full rounded-[24px] overflow-hidden bg-gradient-to-br from-[#FFF5F6] via-[#FAF7F8] to-[#F3EBED] border border-[#EFE5E7] shadow-sm group">
              <Image
                src="/assets/mentor/ly.png"
                alt="Founder Hứa Thảo Lý - LYDATA"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 450px, 472px"
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
  );
}
