"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { openLeadModal } from "@/components/forms/LeadModalManager";
import { seedCourses } from "@/data/seed-data";
import { Course } from "@/lib/cms/types";

export interface NavbarProps {
  variant?: "dark" | "light";
  onRegisterClick?: () => void;
  courses?: Course[];
}

interface NavItem {
  label: string;
  href: string;
  exact?: boolean;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/", exact: true },
  { label: "Giới thiệu", href: "/about", exact: false },
  { label: "Khóa học", href: "/courses", hasDropdown: true },
  { label: "Dự án học viên", href: "/#projects", exact: false },
  { label: "Đánh giá", href: "/#testimonials", exact: false },
  { label: "Blog", href: "/blog", exact: false },
];

export default function Navbar({
  variant = "dark",
  onRegisterClick,
  courses = seedCourses,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const pathname = usePathname();

  const isLight = variant === "light";

  // Danh sách khóa học thường và khóa combo từ Database
  const regularCourses = courses.filter(
    (c) => !c.isFeatured && c.slug !== "end-to-end-analytics"
  );
  const comboCourses = courses.filter(
    (c) => c.isFeatured || c.slug === "end-to-end-analytics"
  );

  // Helper hàm xác định class linh hoạt, chống giật layout (CLS)
  const getLinkClass = (href: string, exact = false) => {
    const isAnchor = href.includes("#");
    const isActive = isAnchor
      ? false
      : exact
        ? pathname === href
        : href !== "/" && pathname.startsWith(href);

    const baseClass = "pb-1 border-b-2 transition-all duration-200 cursor-pointer";

    if (isLight) {
      return `${baseClass} ${
        isActive
          ? "text-[#AF445A] font-bold border-[#AF445A]"
          : "text-[#252525] font-medium border-transparent hover:text-[#AF445A] hover:border-[#AF445A]/40"
      }`;
    }

    return `${baseClass} ${
      isActive
        ? "text-[#AF445A] font-bold border-[#AF445A]"
        : "text-white/85 font-medium border-transparent hover:text-[#AF445A] hover:border-[#AF445A]/40"
    }`;
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${isLight
        ? "bg-white border-b border-neutral-200/80 text-[#252525] shadow-sm"
        : "bg-[#2E2E2E] border-b border-white/10 text-white shadow-md"
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[76px] sm:h-[82px] flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 focus:outline-none">
          <Image
            src={
              isLight
                ? "/assets/mentor/logo-lydata-red.svg"
                : "/assets/figma/14feb7923d10e1372397793711962f265e88f9a9.svg"
            }
            alt="LYDATA Logo"
            width={140}
            height={46}
            className="h-9 sm:h-11 w-auto object-contain transition-all"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px]">
          {NAV_ITEMS.map((item) => {
            if (item.hasDropdown) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setCourseDropdownOpen(true)}
                  onMouseLeave={() => setCourseDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setCourseDropdownOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 focus:outline-none ${getLinkClass(
                      item.href,
                      item.exact
                    )}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 opacity-80" />
                  </button>

                  {courseDropdownOpen && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div
                        className={`w-80 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-1 ${isLight
                          ? "bg-white border border-neutral-200 text-[#252525]"
                          : "bg-[#252525] border border-white/10 text-white shadow-2xl"
                          }`}
                      >
                        {regularCourses.map((course) => (
                          <Link
                            key={course.id || course.slug}
                            href={`/courses/${course.slug}`}
                            onClick={() => setCourseDropdownOpen(false)}
                            className={`block px-4 py-2.5 text-sm transition-colors ${isLight ? "hover:bg-neutral-50" : "hover:bg-white/10"
                              }`}
                          >
                            <p
                              className={`font-semibold ${isLight ? "text-[#252525]" : "text-white"
                                }`}
                            >
                              {course.title}
                            </p>
                            <p
                              className={`text-xs ${isLight ? "text-neutral-500" : "text-white/60"
                                }`}
                            >
                              {course.totalSessions ? `${course.totalSessions} buổi` : "Khóa học thực chiến"}
                            </p>
                          </Link>
                        ))}

                        {comboCourses.length > 0 && (
                          <>
                            <div
                              className={`h-px my-1 ${isLight ? "bg-neutral-200/80" : "bg-white/10"
                                }`}
                            />
                            {comboCourses.map((combo) => (
                              <Link
                                key={combo.id || combo.slug}
                                href={`/courses/${combo.slug}`}
                                onClick={() => setCourseDropdownOpen(false)}
                                className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${isLight
                                  ? "text-[#AF445A] hover:bg-neutral-50"
                                  : "text-[#AF445A] hover:bg-white/10"
                                  }`}
                              >
                                <p className="font-semibold">{combo.title}</p>
                                <p
                                  className={`text-xs ${isLight ? "text-neutral-500" : "text-white/70"
                                    }`}
                                >
                                  {combo.totalSessions ? `${combo.totalSessions} buổi` : "25 buổi"} — Trọn gói tiết kiệm &rarr;
                                </p>
                              </Link>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={getLinkClass(item.href, item.exact)}
              >
                {item.label}
              </Link>
            );
          })}
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
              : "text-white/90 hover:text-[#AF445A]"
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
          {NAV_ITEMS.map((item) => {
            if (item.hasDropdown) {
              return (
                <div
                  key={item.label}
                  className={`py-2 space-y-2 border-y ${
                    isLight ? "border-neutral-200" : "border-white/10"
                  }`}
                >
                  <p
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isLight ? "text-neutral-400" : "text-white/50"
                    }`}
                  >
                    {item.label}
                  </p>
                  {regularCourses.map((c) => (
                    <Link
                      key={c.id || c.slug}
                      href={`/courses/${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block pl-2 text-sm ${
                        isLight
                          ? "text-neutral-700 hover:text-[#AF445A]"
                          : "text-white/80 hover:text-[#AF445A]"
                      }`}
                    >
                      • {c.title} ({c.totalSessions || 12} buổi)
                    </Link>
                  ))}
                  {comboCourses.map((c) => (
                    <Link
                      key={c.id || c.slug}
                      href={`/courses/${c.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block pl-2 text-sm font-semibold text-[#AF445A]"
                    >
                      • {c.title} ({c.totalSessions || 25} buổi)
                    </Link>
                  ))}
                </div>
              );
            }

            const isAnchor = item.href.includes("#");
            const isActive = isAnchor
              ? false
              : item.exact
              ? pathname === item.href
              : item.href !== "/" && pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base transition-colors ${
                  isLight
                    ? isActive
                      ? "text-[#AF445A] font-bold"
                      : "text-neutral-700 hover:text-[#AF445A]"
                    : isActive
                    ? "text-[#AF445A] font-bold"
                    : "text-white/80 hover:text-[#AF445A]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

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
