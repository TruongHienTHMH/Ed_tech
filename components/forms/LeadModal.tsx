"use client";

import { useEffect } from "react";
import LeadForm from "./LeadForm";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
  ctaLocation?: string;
  initialEmail?: string;
}

export default function LeadModal({
  isOpen,
  onClose,
  defaultCourseId = "sql-for-data-analytics",
  ctaLocation = "modal_trigger",
  initialEmail = "",
}: LeadModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal_title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[564px] max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Đóng popup"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header Frame matching Figma Node 12:3320 */}
        <div className="text-center mb-6 pr-8">
          <h2
            id="modal_title"
            className="font-heading font-bold text-2xl sm:text-[28px] text-gray-900 leading-tight"
          >
            Đăng Kí Tư Vấn Ngay
          </h2>
          <p className="text-gray-500 text-sm mt-1.5 font-normal leading-relaxed">
            Chúng tôi sẽ ngưng nhận tư vấn khi đủ số lượng đăng ký!
          </p>
        </div>

        {/* Modal Form Body */}
        <LeadForm
          formId={`modal_form_${ctaLocation}`}
          ctaId={`modal_submit_${ctaLocation}`}
          defaultCourseId={defaultCourseId}
          initialEmail={initialEmail}
          onSuccess={() => {
            setTimeout(() => onClose(), 3500);
          }}
        />
      </div>
    </div>
  );
}
