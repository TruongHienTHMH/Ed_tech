"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "@/components/common/Icons";

interface AnnouncementBarProps {
  initialTitle?: string;
  initialSubtitle?: string;
  initialDiscount?: string;
  countdownTarget?: string;
}

export default function AnnouncementBar({
  initialTitle = "Level Up Week: Learn More, Save 75%!",
  initialSubtitle = "Đăng ký hôm nay để nhận trọn bộ tài liệu và ưu đãi đặc quyền",
  initialDiscount = "75%",
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 6,
    minutes: 13,
    seconds: 5,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative w-full bg-announcement-gradient text-white overflow-hidden z-50">
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Star Discount Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center relative w-12 h-12 shrink-0">
            <Image
              src="/assets/figma/9f1a96eecae4b4f084d165577ecbd536619faec6.svg"
              alt="Star Badge"
              width={48}
              height={48}
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="relative text-center font-bold text-[10px] leading-tight text-white drop-shadow">
              <span>{initialDiscount}</span>
              <br />
              <span className="text-[8px] tracking-wider">OFF</span>
            </div>
          </div>

          {/* Text Message */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 font-medium">
            <span className="font-bold">{initialTitle}</span>
            <span className="hidden md:inline text-white/90">—</span>
            <span className="hidden md:inline bg-[#FFC934] text-[#2E2E2E] font-bold text-[11px] px-2 py-0.5 rounded-full">
              4 days only!
            </span>
            <span className="hidden lg:inline text-white/90">{initialSubtitle}</span>
          </div>
        </div>

        {/* Right: Countdown & Close */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-md px-2.5 py-1 font-mono font-semibold text-xs sm:text-sm text-[#FFC934] tracking-wider">
            {timeLeft.days}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
          </div>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Đóng thông báo"
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
