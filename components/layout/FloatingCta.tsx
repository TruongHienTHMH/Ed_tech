"use client";

import React from "react";
import Image from "next/image";
import { seedSettings } from "@/data/seed-data";
import { SystemSettings } from "@/lib/cms/types";

interface FloatingCtaProps {
  settings?: SystemSettings;
}

export default function FloatingCta({ settings = seedSettings }: FloatingCtaProps) {
  const currentSettings = settings || seedSettings;
  const instagramUrl = currentSettings.instagramUrl || "https://www.instagram.com/datawithly/";
  const facebookUrl = currentSettings.facebookUrl || "https://www.facebook.com/profile.php?id=61594436940087";
  const zaloUrl = currentSettings.zaloUrl || "https://zalo.me/0769361960";

  return (
    <aside
      aria-label="Kênh liên hệ hỗ trợ trực tuyến"
      className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3"
    >
      <div className="flex flex-col items-center gap-2.5">
        {/* Instagram Support */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Theo dõi qua Instagram"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2.5 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/icons/instagram.svg"
            alt="Instagram"
            width={26}
            height={26}
            className="w-6 h-6 object-contain"
          />
        </a>

        {/* Messenger */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin qua Facebook"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl border border-[#AF445A]/20 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 group"
        >
          <Image
            src="/assets/figma/5b4b011e79a58bd7bf7adc73dcbec0c01705d59d.png"
            alt="Facebook Messenger"
            width={30}
            height={30}
            className="object-contain"
          />
        </a>

        {/* Zalo */}
        <a
          href={zaloUrl}
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
