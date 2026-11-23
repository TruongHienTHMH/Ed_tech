"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { StudentProject } from "@/lib/cms/types";
import { seedStudentProjects } from "@/data/seed-data";
import { SafeImage } from "@/components/common/SafeImage";
import { resolveImageUrl, getFigmaFallback } from "@/lib/constants/image-fallbacks";
import { STUDENT_PROJECT_IMAGES } from "@/lib/constants/section-images";

interface StudentProjectsSectionProps {
  projects?: StudentProject[];
}

interface DisplayProject {
  id: string;
  image: string;
  aspect: string;
}

export default function StudentProjectsSection({ projects = seedStudentProjects }: StudentProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);

  // Khóa cuộn trang khi mở popup modal và hỗ trợ phím Escape
  useEffect(() => {
    if (!selectedProject) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProject]);

  const activeProjects = (projects && projects.length >= 6 ? projects : seedStudentProjects).slice(0, 9);
  const displayProjects: DisplayProject[] = activeProjects.map((p, idx) => {
    const registryItem = STUDENT_PROJECT_IMAGES[idx];
    return {
      id: p.id || registryItem?.id || `p-${idx}`,

      image: resolveImageUrl(p.imageUrl || registryItem?.filePath, "project", idx),
      aspect: registryItem?.aspect || (idx >= 6 ? "tall" : "normal"),
    };
  });

  return (
    <section id="projects" className="relative w-full bg-white overflow-hidden">
      {/* Absolute Background SVG (Figma Group 472 / 12:834):
          Contains top wave (y=0..50), dark zone (y=50..532), and middle wave (y=532..582) */}
      <div className="absolute -top-[0] left-1/2 -translate-x-1/2 min-w-[1920px] w-full h-[582px] pointer-events-none select-none z-0">
        <Image
          src="/assets/decorations/stu-project-background.svg"
          alt="Student Projects Background"
          width={1920}
          height={582}
          className="w-full h-full object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 pt-22 sm:pt-26 pb-12 sm:pb-16 flex flex-col items-center">
        {/* Badge (Figma Node 12:875) */}
        <div className="mb-3.5">
          <Badge variant="outlinePrimary" size="md">
            PROJECT HỌC VIÊN
          </Badge>
        </div>

        {/* Section Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[40px] leading-tight text-center text-white mb-8 sm:mb-10 max-w-[680px]">
          Dự án của học viên qua các khóa học tại LYDATA
        </h2>

        {/* 3x3 Showcase Grid:
            Row 1 sits inside the dark zone (#2E2E2E) of the background SVG.
            Middle wave ribbon runs through the gap between Row 1 and Row 2.
            Row 2 & Row 3 sit on the crisp white background below. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10 sm:mb-12">
          {displayProjects.map((project, idx) => {
            const isTall = idx >= 6;
            return (
              <div key={project.id} className="relative group">
                {/* Aura Glow Effect: Hào quang chuyển sắc thương hiệu khi hover */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#AF445A] via-[#FFC934]/60 to-[#784080] opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 pointer-events-none" />

                {/* Main Project Card */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className={`relative rounded-2xl overflow-hidden border-4 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] group-hover:shadow-[0_16px_36px_rgba(175,68,90,0.3)] bg-neutral-900 cursor-pointer transform group-hover:-translate-y-1.5 transition-all duration-300 ${
                    isTall ? "h-[300px] sm:h-[330px]" : "h-[200px] sm:h-[216px]"
                  }`}
                >
                  <SafeImage
                    src={project.image}
                    fallbackSrc={getFigmaFallback("project", idx)}
                    alt="project"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Overlay: Aura Glow & Popup Zoom Trigger (Không còn phần tác giả) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5">
                    {/* Centered Zoom Icon */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300 group-hover:bg-[#AF445A]">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* "Xem thêm" Button (Figma Node 12:888) */}
        <div>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-[#AF445A] bg-white rounded-[8px] px-10 py-3 hover:bg-neutral-50 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
          >
            <span className="font-bold text-base sm:text-[18px] bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent">
              Xem thêm
            </span>
          </a>
        </div>
      </div>

      {/* Lightbox / Popup Preview Modal */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 cursor-zoom-out animate-in fade-in duration-200"
        >
          {/* Header Bar của Popup */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl flex items-center justify-between pb-3 text-white cursor-default"
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng xem trước"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Khung hiển thị ảnh Dashboard phóng to */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[80vh] w-full h-[75vh] rounded-2xl overflow-hidden border-2 border-white/20 bg-neutral-950/80 shadow-2xl cursor-default"
          >
            <Image
              src={selectedProject.image}
              alt="project"
              fill
              sizes="(max-width: 1280px) 95vw, 1200px"
              className="object-contain"
              priority
            />
          </div>

          <p className="text-white/60 text-xs mt-3 flex items-center gap-1 select-none">
            <span>Nhấn phím <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">Esc</kbd> hoặc bấm ra ngoài để đóng</span>
          </p>
        </div>
      )}

      {/* Lower Transition Wave Banner (Figma Node 12:837 & 12:890 / Rectangle 1575 & 1578) */}
      <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
        <Image
          src="/assets/decorations/banner-lower.svg"
          alt="Transition Lower Wave Banner"
          width={1920}
          height={40}
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
}
