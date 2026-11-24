"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/common/Badge";
import { Testimonial } from "@/lib/cms/types";
import { seedTestimonials } from "@/data/seed-data";
import TestimonialDetailModal, { TestimonialModalItem } from "@/components/home/TestimonialDetailModal";

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  testimonials = seedTestimonials,
}: TestimonialsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialModalItem | null>(null);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isUserInteractingRef = useRef(false);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Lấy toàn bộ danh sách testimonials
  const activeTestimonials = testimonials && testimonials.length > 0 ? testimonials : seedTestimonials;

  const displayList: TestimonialModalItem[] = activeTestimonials.map((t, idx) => ({
    id: t.id || `t-${idx}`,
    name: t.studentName,
    role: t.role || t.studentRole || "Khóa SQL for Data Analytics",
    quote: t.comment || t.reviewText || "Khóa học rất thực chiến.",
    rating: t.rating || 5,
    avatar: "/assets/mentor/icon-student-primary.svg",
  }));

  // Kích hoạt chế độ tự động cuộn mượt (Auto Smooth Scroll) nếu số lượng items > 9
  const shouldAutoScroll = displayList.length > 9;
  // Nhân đôi danh sách khi cuộn để tạo vòng lặp vô tận liền mạch (infinite loop)
  const renderItems = shouldAutoScroll ? [...displayList, ...displayList] : displayList;

  // Chuyển động cuộn trôi êm ái, liên tục và tự nhiên (Continuous Smooth Drift)
  useEffect(() => {
    if (!shouldAutoScroll) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let lastTime = performance.now();
    // Tốc độ trôi êm dịu tự nhiên: ~30px mỗi giây (0.5px mỗi frame ở 60fps)
    const speed = 0.5;

    const step = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isUserInteractingRef.current && container) {
        // Tự động điều chỉnh theo tần số quét màn hình (60Hz / 120Hz ProMotion)
        container.scrollTop += speed * (delta / 16.67);

        // Vòng lặp vô tận liền mạch khi cuộn qua phân nửa danh sách
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = container.scrollTop - container.scrollHeight / 2;
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    };
  }, [shouldAutoScroll]);

  // Xử lý song song tương tác chuột (Mouse Wheel / Touchpad / Hover)
  const handleWheel = () => {
    isUserInteractingRef.current = true;
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    // Khi người dùng dừng lăn chuột 2 giây, tiếp tục tự động trôi nhẹ nhàng
    userTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 2000);
  };

  const handleMouseEnter = () => {
    isUserInteractingRef.current = true;
  };

  const handleMouseLeave = () => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    // Khi rời chuột ra ngoài, sau 800ms tiếp tục trôi tự nhiên
    userTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 800);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || !shouldAutoScroll) return;
    // Đảm bảo cuộn bằng chuột cũng tự động loop vô tận không bị chạm đáy
    if (container.scrollTop >= container.scrollHeight / 2) {
      container.scrollTop = container.scrollTop - container.scrollHeight / 2;
    }
  };

  return (
    <section
      id="testimonials"
      className="relative w-full bg-white py-16 lg:py-24 overflow-hidden border-t border-neutral-100"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header (Figma Node 12:892) */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-12">
          <div className="mb-3">
            <Badge variant="primary" size="md">
              ĐÁNH GIÁ THỰC TẾ
            </Badge>
          </div>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#252525] mb-2">
            Đánh giá của học viên
          </h2>
          <p className="text-[#676767] text-base font-normal max-w-[650px]">
            Cùng lắng nghe cảm nhận thực tế từ những học viên đã tham gia các khóa học tại LYDATA. Nhấp vào từng thẻ để đọc toàn bộ đánh giá.
          </p>
        </div>

        {/* Testimonials Grid Container with 3D Depth Shadow Overlay on Row 3 */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          {/* Top smooth fade mask when scrolling */}
          {shouldAutoScroll && (
            <div className="pointer-events-none absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white to-transparent z-10" />
          )}

          {/* Scrollable Container (Hiện đúng 3 hàng, tự cuộn trôi êm tự nhiên nếu > 9 items & hỗ trợ cuộn chuột song song) */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={cn(
              "w-full",
              shouldAutoScroll && "max-h-[860px] overflow-y-auto no-scrollbar py-2"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderItems.map((item, idx) => {
                const uniqueKey = `${item.id}-${idx}`;
                const isHovered = hoveredId === uniqueKey;
                const isRow3 = !shouldAutoScroll && idx >= 6;

                return (
                  <div
                    key={uniqueKey}
                    onClick={() => setSelectedTestimonial(item)}
                    onMouseEnter={() => setHoveredId(uniqueKey)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={cn(
                      "group relative min-h-[260px] p-6 rounded-[16px] flex flex-col justify-between transition-all duration-300 cursor-pointer select-none",
                      isRow3 && "opacity-90",
                      isHovered
                        ? "bg-gradient-to-r from-[#784080] to-[#AF445A] drop-shadow-[0px_0px_20px_rgba(175,68,90,0.25)] -translate-y-1.5 z-20 opacity-100"
                        : "bg-white border border-neutral-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#AF445A]/30"
                    )}
                  >
                    {/* Upper Section: 5 Golden Stars & Review Quote (giới hạn đúng 3 dòng) */}
                    <div className="flex flex-col gap-3">
                      {/* 5 Stars */}
                      <div className="flex items-center gap-[2px]">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-[#FFC934] fill-current shrink-0"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review Text - Giới hạn 3 dòng */}
                      <p
                        className={cn(
                          "font-medium text-[16px] sm:text-[17px] leading-[26px] line-clamp-3 transition-colors duration-200",
                          isHovered ? "text-white" : "text-[#686868]"
                        )}
                      >
                        “{item.quote}”
                      </p>
                    </div>

                    {/* Footer Section: Avatar + Student Meta */}
                    <div className="flex items-center gap-3 pt-4 mt-2">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={
                            isHovered
                              ? "/assets/mentor/icon-student-white.svg"
                              : "/assets/mentor/icon-student-primary.svg"
                          }
                          alt={item.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <h3
                          className={cn(
                            "font-bold text-[17px] sm:text-[18px] leading-[24px] tracking-[-0.02em] truncate transition-colors duration-200",
                            isHovered ? "text-white" : "text-[#2E2E2E]"
                          )}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={cn(
                            "text-[14px] sm:text-[15px] leading-[20px] font-normal truncate transition-colors duration-200",
                            isHovered ? "text-white/85" : "text-[#686868]"
                          )}
                        >
                          {item.role}
                        </p>
                      </div>

                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-1 rounded transition-colors duration-200",
                          isHovered ? "bg-white/20 text-white" : "text-neutral-400 group-hover:text-[#AF445A]"
                        )}
                      >
                        Xem chi tiết
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D Depth Shadow Gradient Overlay on Row 3 */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
        </div>
      </div>

      {/* Testimonial Detail Modal (Card) */}
      <TestimonialDetailModal
        testimonial={selectedTestimonial}
        onClose={() => setSelectedTestimonial(null)}
      />
    </section>
  );
}
