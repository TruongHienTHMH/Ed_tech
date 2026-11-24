"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X } from "@/components/common/Icons";

export interface TestimonialModalItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
}

interface TestimonialDetailModalProps {
  testimonial: TestimonialModalItem | null;
  onClose: () => void;
}

export default function TestimonialDetailModal({
  testimonial,
  onClose,
}: TestimonialDetailModalProps) {
  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!testimonial) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [testimonial, onClose]);

  if (!testimonial) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="testimonial-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-neutral-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Đóng đánh giá"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header: 5 Stars Rating & Verified Badge */}
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-1">
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-[#FFC934] fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Full Review Text */}
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          <p className="font-normal text-[16px] sm:text-[17px] leading-[28px] text-[#2E2E2E] italic">
            “{testimonial.quote}”
          </p>
        </div>

        {/* Student Meta Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-200">
            <Image
              src={testimonial.avatar || "/assets/mentor/icon-student-primary.svg"}
              alt={testimonial.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h3
              id="testimonial-modal-title"
              className="font-bold text-lg text-[#252525] truncate"
            >
              {testimonial.name}
            </h3>
            <p className="text-sm font-medium text-[#784080] truncate">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
