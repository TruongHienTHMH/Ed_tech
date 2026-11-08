"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "@/components/common/Icons";
import { openLeadModal } from "@/components/forms/LeadModalManager";

interface NavbarProps {
  onRegisterClick?: () => void;
}

export default function Navbar({ onRegisterClick }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#2E2E2E] border-b border-white/10 text-white shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[76px] sm:h-[82px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none">
          <Image
            src="/assets/figma/14feb7923d10e1372397793711962f265e88f9a9.svg"
            alt="DataWithLy Logo"
            width={140}
            height={46}
            className="h-9 sm:h-11 w-auto object-contain"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-white/90">
          <Link
            href="/"
            className="text-white font-semibold transition-colors hover:text-[#AF445A]"
          >
            Trang chủ
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCourseDropdownOpen(true)}
            onMouseLeave={() => setCourseDropdownOpen(false)}
          >
            <button className="flex items-center gap-1.5 py-2 hover:text-white transition-colors focus:outline-none">
              <span>Khóa học</span>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>

            {courseDropdownOpen && (
              <div className="absolute top-full left-0 w-72 bg-[#252525] border border-white/10 rounded-xl shadow-2xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1">
                <Link
                  href="/courses/sql-for-data-analytics"
                  className="block px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                >
                  <p className="font-semibold text-white">Khóa SQL for Data Analytics</p>
                  <p className="text-xs text-white/60">Truy vấn & xử lý dữ liệu thực chiến (12 buổi)</p>
                </Link>
                <Link
                  href="/courses/analytical-thinking-dashboard-design"
                  className="block px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                >
                  <p className="font-semibold text-white">Analytical Thinking & Dashboard</p>
                  <p className="text-xs text-white/60">Tư duy phân tích số liệu & BI (15 buổi)</p>
                </Link>
                <div className="h-px bg-white/10 my-1" />
                <Link
                  href="/courses/end-to-end-analytics"
                  className="block px-4 py-2.5 text-sm text-[#FFC934] font-semibold hover:bg-white/10 transition-colors"
                >
                  <p className="font-semibold text-[#FFC934]">Combo End-to-End Analytics</p>
                  <p className="text-xs text-white/70">Trọn gói 27 buổi - Tiết kiệm 16% →</p>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/#projects"
            className="hover:text-white transition-colors"
          >
            Dự án học viên
          </Link>

          <Link
            href="/#testimonials"
            className="hover:text-white transition-colors"
          >
            Đánh giá
          </Link>

          <Link
            href="/blog"
            className="hover:text-white transition-colors"
          >
            Blog
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              if (onRegisterClick) onRegisterClick();
              else openLeadModal({ ctaLocation: "navbar_cta" });
            }}
            className="bg-brand-gradient hover:opacity-95 text-white font-semibold text-sm sm:text-[15px] px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Đăng kí ngay
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/90 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#252525] border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-white"
          >
            Trang chủ
          </Link>
          <div className="py-2 space-y-2 border-y border-white/10">
            <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Khóa học</p>
            <Link
              href="/courses/sql-for-data-analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-2 text-sm text-white/80 hover:text-white"
            >
              • SQL for Data Analytics (12 buổi)
            </Link>
            <Link
              href="/courses/analytical-thinking-dashboard-design"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-2 text-sm text-white/80 hover:text-white"
            >
              • Analytical Thinking & Dashboard (15 buổi)
            </Link>
            <Link
              href="/courses/end-to-end-analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-2 text-sm text-[#FFC934] font-semibold"
            >
              • Combo End-to-End Analytics (27 buổi)
            </Link>
          </div>
          <Link
            href="/#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base text-white/80 hover:text-white"
          >
            Dự án học viên
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base text-white/80 hover:text-white"
          >
            Đánh giá
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base text-white/80 hover:text-white"
          >
            Blog
          </Link>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onRegisterClick) onRegisterClick();
                else openLeadModal({ ctaLocation: "navbar_mobile_drawer" });
              }}
              className="block w-full text-center bg-brand-gradient text-white font-semibold py-3 rounded-lg shadow-md cursor-pointer"
            >
              Đăng kí ngay
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
