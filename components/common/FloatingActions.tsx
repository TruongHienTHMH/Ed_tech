"use client";

import { trackClickZalo } from "@/lib/analytics/gtm";

export default function FloatingActions() {
  return (
    <div className="fixed right-4 sm:right-6 bottom-6 z-50 flex flex-col gap-3 items-center">
      {/* Support Headset */}
      <a
        href="#contact"
        onClick={() => trackClickZalo({ cta_location: "floating_support_headset" })}
        className="w-12 h-12 rounded-full bg-white text-primary-600 shadow-xl border border-neutral-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all hover:bg-primary-50 cursor-pointer"
        aria-label="Tư vấn trực tuyến"
        title="Tư vấn trực tuyến"
      >
        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      </a>

      {/* Messenger */}
      <a
        href="https://m.me"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClickZalo({ cta_location: "floating_messenger" })}
        className="w-12 h-12 rounded-full bg-[#0084FF] text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"
        aria-label="Chat qua Messenger"
        title="Messenger"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.455 5.513 3.735 7.185V22l3.42-1.876c.915.253 1.884.39 2.845.39 5.523 0 10-4.145 10-9.256C22 6.145 17.523 2 12 2zm1.066 12.443l-2.72-2.9-5.305 2.9 5.834-6.195 2.784 2.9 5.242-2.9-5.835 6.195z" />
        </svg>
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClickZalo({ cta_location: "floating_zalo" })}
        className="w-12 h-12 rounded-full bg-[#0068FF] text-white font-bold text-xs shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all tracking-tighter cursor-pointer"
        aria-label="Chat qua Zalo"
        title="Zalo"
      >
        Zalo
      </a>
    </div>
  );
}
