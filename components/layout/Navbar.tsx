"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { openLeadModal } from "@/components/forms/LeadModalManager";

export interface NavbarProps {
  variant?: "dark" | "light";
  onRegisterClick?: () => void;
}

export default function Navbar({
  variant = "dark",
  onRegisterClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);

  const isLight = variant === "light";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLight
          ? "bg-white border-b border-neutral-200/80 text-[#252525] shadow-sm"
          : "bg-[#2E2E2E] border-b border-white/10 text-white shadow-md"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[76px] sm:h-[82px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none">
          <Image
            src="/assets/figma/14feb7923d10e1372397793711962f265e88f9a9.svg"
            alt="DataWithLy Logo"
            width={140}
            height={46}
            className={`h-9 sm:h-11 w-auto object-contain transition-all ${
              isLight ? "brightness-0" : ""
            }`}
            style={{ width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-8 text-[15px] font-medium ${
            isLight ? "text-[#252525]" : "text-white/90"
          }`}
        >
          <Link
            href="/"
            className={`font-semibold transition-colors ${
              isLight ? "text-[#AF445A]" : "text-white hover:text-[#AF445A]"
            }`}
          >
            Trang chủ
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCourseDropdownOpen(true)}
            onMouseLeave={() => setCourseDropdownOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 py-2 transition-colors focus:outline-none cursor-pointer ${
                isLight ? "hover:text-[#AF445A]" : "hover:text-white"
              }`}
            >
              <span>Khóa học</span>
              <ChevronDown className="w-4 h-4 opacity-80" />
            </button>

            {courseDropdownOpen && (
              <div
                className={`absolute top-full left-0 w-72 rounded-xl shadow-xl py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1 ${
                  isLight
                    ? "bg-white border border-neutral-200 text-[#252525]"
                    : "bg-[#252525] border border-white/10 text-white shadow-2xl"
                }`}
              >
                <Link
                  href="/courses/sql-for-data-analytics"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isLight ? "hover:bg-neutral-50" : "hover:bg-white/10"
                  }`}
                >
                  <p className={`font-semibold ${isLight ? "text-[#252525]" : "text-white"}`}>
                    Khóa SQL for Data Analytics
                  </p>
                  <p className={`text-xs ${isLight ? "text-neutral-500" : "text-white/60"}`}>
                    Truy vấn & xử lý dữ liệu thực chiến (12 buổi)
                  </p>
                </Link>
                <Link
                  href="/courses/analytical-thinking-dashboard-design"
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    isLight ? "hover:bg-neutral-50" : "hover:bg-white/10"
                  }`}
                >
                  <p className={`font-semibold ${isLight ? "text-[#252525]" : "text-white"}`}>
                    Analytical Thinking & Dashboard
                  </p>
                  <p className={`text-xs ${isLight ? "text-neutral-500" : "text-white/60"}`}>
                    Tư duy phân tích số liệu & BI (15 buổi)
                  </p>
                </Link>
                <div
                  className={`h-px my-1 ${
                    isLight ? "bg-neutral-200/80" : "bg-white/10"
                  }`}
                />
                <Link
                  href="/courses/end-to-end-analytics"
                  className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isLight
                      ? "text-[#AF445A] hover:bg-neutral-50"
                      : "text-[#FFC934] hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">Combo End-to-End Analytics</p>
                  <p className={`text-xs ${isLight ? "text-neutral-500" : "text-white/70"}`}>
                    Trọn gói 27 buổi - Tiết kiệm 16% →
                  </p>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/#projects"
            className={`transition-colors ${
              isLight ? "hover:text-[#AF445A]" : "hover:text-white"
            }`}
          >
            Dự án học viên
          </Link>

          <Link
            href="/#testimonials"
            className={`transition-colors ${
              isLight ? "hover:text-[#AF445A]" : "hover:text-white"
            }`}
          >
            Đánh giá
          </Link>

          <Link
            href="/blog"
            className={`transition-colors ${
              isLight ? "hover:text-[#AF445A]" : "hover:text-white"
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* Right CTA Button */}
        <div className="hidden sm:flex items-center gap-4">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (onRegisterClick) onRegisterClick();
              else openLeadModal({ ctaLocation: "navbar_cta" });
            }}
            className="font-semibold text-sm sm:text-[15px]"
          >
            Đăng kí ngay
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none ${
            isLight
              ? "text-neutral-800 hover:text-[#AF445A]"
              : "text-white/90 hover:text-white"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-4 pt-3 pb-6 space-y-3 ${
            isLight
              ? "bg-white border-t border-neutral-200 shadow-xl"
              : "bg-[#252525] border-t border-white/10"
          }`}
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base font-semibold ${
              isLight ? "text-[#AF445A]" : "text-white"
            }`}
          >
            Trang chủ
          </Link>
          <div
            className={`py-2 space-y-2 border-y ${
              isLight ? "border-neutral-200" : "border-white/10"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider ${
                isLight ? "text-neutral-400" : "text-white/50"
              }`}
            >
              Khóa học
            </p>
            <Link
              href="/courses/sql-for-data-analytics"
              onClick={() => setMobileMenuOpen(false)}
              className={`block pl-2 text-sm ${
                isLight ? "text-neutral-700 hover:text-[#AF445A]" : "text-white/80 hover:text-white"
              }`}
            >
              • SQL for Data Analytics (12 buổi)
            </Link>
            <Link
              href="/courses/analytical-thinking-dashboard-design"
              onClick={() => setMobileMenuOpen(false)}
              className={`block pl-2 text-sm ${
                isLight ? "text-neutral-700 hover:text-[#AF445A]" : "text-white/80 hover:text-white"
              }`}
            >
              • Analytical Thinking & Dashboard (15 buổi)
            </Link>
            <Link
              href="/courses/end-to-end-analytics"
              onClick={() => setMobileMenuOpen(false)}
              className={`block pl-2 text-sm font-semibold ${
                isLight ? "text-[#AF445A]" : "text-[#FFC934]"
              }`}
            >
              • Combo End-to-End Analytics (27 buổi)
            </Link>
          </div>
          <Link
            href="/#projects"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base ${
              isLight ? "text-neutral-700 hover:text-[#AF445A]" : "text-white/80 hover:text-white"
            }`}
          >
            Dự án học viên
          </Link>
          <Link
            href="/#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base ${
              isLight ? "text-neutral-700 hover:text-[#AF445A]" : "text-white/80 hover:text-white"
            }`}
          >
            Đánh giá
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className={`block py-2 text-base ${
              isLight ? "text-neutral-700 hover:text-[#AF445A]" : "text-white/80 hover:text-white"
            }`}
          >
            Blog
          </Link>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                if (onRegisterClick) onRegisterClick();
                else openLeadModal({ ctaLocation: "navbar_mobile_drawer" });
              }}
              className="font-semibold text-base py-3 shadow-md"
            >
              Đăng kí ngay
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
