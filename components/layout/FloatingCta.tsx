"use client";

import React from "react";
import Image from "next/image";

export default function FloatingCta() {
  return (
    <aside
      aria-label="Kênh liên hệ hỗ trợ trực tuyến"
      className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3"
    >
      <div className="flex flex-col items-center gap-2.5">
        {/* Hotline Support */}
        <a
          href="tel:0934938431"
          aria-label="Gọi hotline hỗ trợ"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2.5 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/8fe9a4f9a84f57b0ad7f6050d87f9e45e18d5902.svg"
            alt="Hỗ trợ hotline"
            width={26}
            height={26}
            className="object-contain"
          />
        </a>

        {/* Messenger */}
        <a
          href="https://m.me/datawithly"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin qua Messenger"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/5b4b011e79a58bd7bf7adc73dcbec0c01705d59d.png"
            alt="Messenger"
            width={30}
            height={30}
            className="object-contain"
          />
        </a>

        {/* Zalo */}
        <a
          href="https://zalo.me/0934938431"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tư vấn qua Zalo"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/08742fdf977fc095f72d070c8238ee5aa891910d.png"
            alt="Zalo"
            width={30}
            height={30}
            className="object-contain"
          />
        </a>
      </div>
    </aside>
  );
}
