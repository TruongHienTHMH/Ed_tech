"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "@/components/common/Icons";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-2 border-neutral-200 text-[#252525] pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-200">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/figma/14feb7923d10e1372397793711962f265e88f9a9.svg"
                alt="DataWithLy Logo"
                width={140}
                height={46}
                className="h-10 w-auto object-contain"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              DataWithLy - Nền tảng đào tạo Data Analytics thực chiến từ cơ bản đến nâng cao. Đồng hành cùng học viên từ tư duy, truy vấn dữ liệu đến xây dựng Portfolio chuyên nghiệp.
            </p>
            <div className="pt-2 text-xs text-neutral-400">
              Mentor: Hứa Thảo Ly (Ex-Senior Data Analyst tại MoMo, Tiki, ACB)
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-base text-[#1C1B1D] tracking-tight">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="#courses" className="hover:text-[#AF445A] transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="#why-choose-us" className="hover:text-[#AF445A] transition-colors">
                  Lộ trình học tập
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-[#AF445A] transition-colors">
                  Dự án học viên
                </Link>
              </li>
              <li>
                <Link href="#blogs" className="hover:text-[#AF445A] transition-colors">
                  Kiến thức & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Courses (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-base text-[#1C1B1D] tracking-tight">
              Khóa học
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li>
                <Link href="#courses" className="hover:text-[#AF445A] transition-colors">
                  SQL for Analytics
                </Link>
              </li>
              <li>
                <Link href="#courses" className="hover:text-[#AF445A] transition-colors">
                  Analytical Thinking
                </Link>
              </li>
              <li>
                <Link href="#combo-pricing" className="hover:text-[#AF445A] transition-colors font-medium text-[#784080]">
                  Combo 2 Khóa (16% OFF)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-heading font-semibold text-base text-[#1C1B1D] tracking-tight">
              Liên hệ
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-600">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>(+84) 934 938 431</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>vietds@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#AF445A] shrink-0" />
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-1.5 flex items-center justify-center transition-colors"
              >
                <Image
                  src="/assets/figma/5d3dc012b6a90ac35f204a321ac874ed53b35e81.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-1.5 flex items-center justify-center transition-colors"
              >
                <Image
                  src="/assets/figma/b5e37fb98f29c6fe09b28906ad379fd1e22d5abf.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-1.5 flex items-center justify-center transition-colors"
              >
                <Image
                  src="/assets/figma/fb2492c1b7d7c65a104edaa8e809cc8a5a19315f.png"
                  alt="TikTok"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Ly Data. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
