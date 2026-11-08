"use client";

import { useEffect, useState } from "react";
import LeadModal from "./LeadModal";

export interface OpenLeadModalOptions {
  courseId?: string;
  ctaLocation?: string;
  initialEmail?: string;
}

export function openLeadModal(options?: OpenLeadModalOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-lead-modal", { detail: options || {} })
    );
  }
}

export default function LeadModalManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [courseId, setCourseId] = useState("sql-for-data-analytics");
  const [ctaLocation, setCtaLocation] = useState("page_cta");
  const [initialEmail, setInitialEmail] = useState("");

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<OpenLeadModalOptions>;
      if (customEvent.detail?.courseId) {
        setCourseId(customEvent.detail.courseId);
      }
      if (customEvent.detail?.ctaLocation) {
        setCtaLocation(customEvent.detail.ctaLocation);
      }
      if (customEvent.detail?.initialEmail) {
        setInitialEmail(customEvent.detail.initialEmail);
      }
      setIsOpen(true);
    };

    window.addEventListener("open-lead-modal", handleOpen);
    return () => {
      window.removeEventListener("open-lead-modal", handleOpen);
    };
  }, []);

  return (
    <LeadModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      defaultCourseId={courseId}
      ctaLocation={ctaLocation}
      initialEmail={initialEmail}
    />
  );
}
