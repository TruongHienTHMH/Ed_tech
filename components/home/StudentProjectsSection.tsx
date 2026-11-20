"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, X } from "@/components/common/Icons";
import { Badge } from "@/components/common/Badge";
import { StudentProject } from "@/lib/cms/types";
import { seedStudentProjects } from "@/data/seed-data";
import { SafeImage } from "@/components/common/SafeImage";
import { resolveImageUrl, getFigmaFallback } from "@/lib/constants/image-fallbacks";
import { STUDENT_PROJECT_IMAGES } from "@/lib/constants/section-images";

interface StudentProjectsSectionProps {
  projects?: StudentProject[];
}

export default function StudentProjectsSection({ projects = seedStudentProjects }: StudentProjectsSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activeProjects = (projects && projects.length >= 6 ? projects : seedStudentProjects).slice(0, 9);
  const displayProjects = activeProjects.map((p, idx) => {
    const registryItem = STUDENT_PROJECT_IMAGES[idx];
    return {
      id: p.id || registryItem?.id || `p-${idx}`,
      title: p.title || registryItem?.title || `Dự án phân tích dữ liệu #${idx + 1}`,
      studentName: p.authorName || registryItem?.authorName || "Học viên Lydata",
      image: resolveImageUrl(p.imageUrl || registryItem?.filePath, "project", idx),
      aspect: registryItem?.aspect || (idx >= 6 ? "tall" : "normal"),
    };
  });

  return (
    <section id="projects" className="relative w-full bg-white overflow-hidden">
      {/* Absolute Background SVG (Figma Group 472 / 12:834):
          Contains top wave (y=0..50), dark zone (y=50..532), and middle wave (y=532..582) */}
      <div className="absolute -top-[0] left-1/2 -translate-x-1/2  min-w-[1920px] w-full h-[582px] pointer-events-none select-none z-0">
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
          Dự án của học viên qua các khóa học tại Lydata
        </h2>

        {/* 3x3 Showcase Grid:
            Row 1 sits inside the dark zone (#2E2E2E) of the background SVG.
            Middle wave ribbon runs through the gap between Row 1 and Row 2.
            Row 2 & Row 3 sit on the crisp white background below. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10 sm:mb-12">
          {displayProjects.map((project, idx) => {
            const isTall = idx >= 6;
            return (
              <div
                key={project.id}
                onClick={() => setSelectedImage(project.image)}
                className={`group relative rounded-2xl overflow-hidden border-4 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] bg-neutral-900 cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 ${
                  isTall ? "h-[300px] sm:h-[330px]" : "h-[200px] sm:h-[216px]"
                }`}
              >
                <SafeImage
                  src={project.image}
                  fallbackSrc={getFigmaFallback("project", idx)}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <p className="font-bold text-sm sm:text-base text-white leading-snug">
                    {project.title}
                  </p>
                  <p className="text-xs text-white/80 mt-1 flex items-center justify-between">
                    <span>Học viên: {project.studentName}</span>
                    <ExternalLink className="w-4 h-4 text-[#FFC934]" />
                  </p>
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Đóng xem trước"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-[80vh]">
            <Image
              src={selectedImage}
              alt="Project Showcase Fullscreen"
              fill
              sizes="(max-width: 1280px) 90vw, 1200px"
              className="object-contain"
            />
          </div>
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
