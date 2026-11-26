"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "@/components/common/Icons";
import { seedSettings } from "@/data/seed-data";
import { SystemSettings } from "@/lib/cms/types";

interface FooterProps {
  settings?: SystemSettings;
}

export default function Footer({ settings = seedSettings }: FooterProps) {
  const currentSettings = settings || seedSettings;
  const hotline = currentSettings.hotline || "(+84) 769 361 960";
  const contactEmail = currentSettings.contactEmail || "lyhuathithao@gmail.com";
  const tiktokUrl = currentSettings.tiktokUrl || "https://www.tiktok.com/@datawithly";
  const facebookUrl = currentSettings.facebookUrl || "https://www.facebook.com/datawithly.official1";
  const instagramUrl = currentSettings.instagramUrl || "https://www.instagram.com/datawithly/";
  const threadsUrl = currentSettings.threadsUrl || "https://www.threads.com/@datawithly";
  return (
    <footer className="w-full bg-white border-t-2 border-neutral-200 text-[#252525] pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-0 pb-12 border-b border-neutral-200">
          {/* Col 1: Brand Info (Cố định bên trái, giữ nguyên nội dung) */}
          <div className="w-full md:col-span-2 lg:w-auto lg:max-w-md flex flex-col items-start text-left gap-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/mentor/logo-lydata-red.svg"
                alt="DataWithLy Logo"
                width={140}
                height={46}
                className="h-10 w-auto object-contain"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-md text-left">
              LYDATA - Nền tảng đào tạo Data Analytics thực chiến từ cơ bản đến nâng cao. Đồng hành cùng học viên từ tư duy, truy vấn dữ liệu đến xây dựng Portfolio chuyên nghiệp.
            </p>
            <div className="pt-2 text-xs text-neutral-400 text-left">
              Mentor: Hứa Thảo Lý (Senior Data Analyst tại MoMo, Tiki, ACB)
            </div>
          </div>

          {/* Col 2: Navigation Links (Di chuyển ra chính giữa, cách đều Cột 1 và Cột 3 bằng lg:mx-auto) */}
          <div className="w-full md:col-span-1 lg:w-auto lg:mx-auto flex flex-col items-start text-left gap-3">
            <h4 className="font-heading font-semibold text-base text-[#1C1B1D] tracking-tight text-left">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600 text-left w-full">
              <li>
                <Link href="/about" className="hover:text-[#AF445A] transition-colors inline-block">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/#why-choose-us" className="hover:text-[#AF445A] transition-colors inline-block whitespace-nowrap">
                  Lộ trình học tập
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="hover:text-[#AF445A] transition-colors inline-block whitespace-nowrap">
                  Dự án học viên
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#AF445A] transition-colors inline-block whitespace-nowrap">
                  Kiến thức & Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info (Cố định bên phải, giữ nguyên nội dung) */}
          <div className="w-full md:col-span-1 lg:w-auto flex flex-col items-start text-left gap-3">
            <h4 className="font-heading font-semibold text-base text-[#1C1B1D] tracking-tight text-left">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm text-neutral-600 text-left w-full">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#AF445A] shrink-0" />
                <a href={`tel:${hotline.replace(/[^0-9+]/g, "")}`} className="hover:text-[#AF445A] transition-colors whitespace-nowrap">
                  {hotline}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#AF445A] shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-[#AF445A] transition-colors text-xs sm:text-sm break-all">
                  {contactEmail}
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-2 flex items-center justify-center transition-all hover:scale-105 text-neutral-800"
              >
                <Image
                  src="/assets/icons/tiktok.svg"
                  alt="TikTok"
                  width={20}
                  height={20}
                  className="w-4 h-4 object-contain"
                />
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-2 flex items-center justify-center transition-all hover:scale-105 text-neutral-800"
              >
                <Image
                  src="/assets/icons/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                  className="w-4 h-4 object-contain"
                />
              </a>

              <a
                href={threadsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-2 flex items-center justify-center transition-all hover:scale-105 text-neutral-800"
              >
                <Image
                  src="/assets/icons/threads.svg"
                  alt="Threads"
                  width={20}
                  height={20}
                  className="w-4 h-4 object-contain"
                />
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 p-2 flex items-center justify-center transition-all hover:scale-105 text-neutral-800"
              >
                <Image
                  src="/assets/icons/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="w-4 h-4 object-contain"
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
