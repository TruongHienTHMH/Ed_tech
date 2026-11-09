"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, X } from "@/components/common/Icons";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { StudentProject } from "@/lib/cms/types";
import { seedStudentProjects } from "@/data/seed-data";

interface StudentProjectsSectionProps {
  projects?: StudentProject[];
}

export default function StudentProjectsSection({ projects = seedStudentProjects }: StudentProjectsSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const activeProjects = (projects && projects.length >= 6 ? projects : seedStudentProjects).slice(0, 9);
  const displayProjects = activeProjects.map((p, idx) => ({
    id: p.id || `p-${idx}`,
    title: p.title,
    studentName: p.authorName,
    image: p.imageUrl || "/assets/figma/2643f19ffd20e9e83bc82fe8862b51f3796c7604.png",
    aspect: idx >= 6 ? "tall" : "normal",
  }));

  return (
    <section id="projects" className="relative w-full bg-[#1F242F] py-16 lg:py-24 text-white overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#AF445A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Eyebrow Pill (Figma Node 12:873) */}
        <div className="mb-4">
          <Badge variant="tag" size="md">
            PROJECT HỌC VIÊN
          </Badge>
        </div>

        {/* Title */}
        <h2 className="font-heading font-bold text-2xl sm:text-3xl lg:text-[40px] leading-tight text-center text-white mb-12 max-w-[700px]">
          Dự án của học viên qua các khóa học tại Lydata
        </h2>

        {/* 3x3 Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {displayProjects.map((project, idx) => {
            const isTall = idx >= 6;
            return (
              <div
                key={project.id}
                onClick={() => setSelectedImage(project.image)}
                className={`group relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg bg-neutral-900 cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 ${
                  isTall ? "h-[290px] sm:h-[320px]" : "h-[200px] sm:h-[216px]"
                }`}
              >
                <Image
                  src={project.image}
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

        {/* "Xem thêm" Button */}
        <div>
          <Button
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="lg"
            className="border-2 border-[#AF445A] text-white hover:bg-white/10 font-bold px-10 shadow-md transition-all hover:scale-105"
          >
            Xem thêm dự án trên Cộng đồng
          </Button>
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
    </section>
  );
}
