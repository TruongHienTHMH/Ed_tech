/**
 * Google Tag Manager & GA4 Event Tracking Helper
 * Strictly enforces Privacy & Security by stripping any personally identifiable information (PII).
 */

import { getFlatAttribution } from "./attribution";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// Blocklist of keys that must NEVER enter dataLayer
const PII_KEYS = new Set([
  "name",
  "full_name",
  "first_name",
  "last_name",
  "phone",
  "telephone",
  "mobile",
  "email",
  "message",
  "note",
  "content",
  "address",
  "ip",
]);

/**
 * Pushes clean event payload into window.dataLayer
 */
export function pushToDataLayer(event: string, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  // Filter out any accidental PII
  const cleanPayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (!PII_KEYS.has(key.toLowerCase()) && value !== undefined) {
      cleanPayload[key] = value;
    }
  }

  // Include current page path & attribution context
  const attr = getFlatAttribution();
  const eventData = {
    event,
    page_path: window.location.pathname,
    page_url: window.location.href,
    utm_source: attr.last_utm_source,
    utm_medium: attr.last_utm_medium,
    utm_campaign: attr.last_utm_campaign,
    ...cleanPayload,
  };

  window.dataLayer.push(eventData);

  if (process.env.NODE_ENV === "development") {
    console.log(`[GTM/GA4 Event] ${event}`, eventData);
  }
}

// 1. view_course
export function trackViewCourse(params: {
  course_id: string;
  course_slug?: string;
  course_name?: string;
}): void {
  pushToDataLayer("view_course", {
    course_id: params.course_id,
    course_slug: params.course_slug || params.course_id,
    course_name: params.course_name,
  });
}

// 2. click_course_cta
export function trackClickCourseCta(params: {
  course_id?: string;
  course_slug?: string;
  cta_id: string;
  cta_location: string;
}): void {
  pushToDataLayer("click_course_cta", {
    course_id: params.course_id || "general",
    course_slug: params.course_slug || params.course_id || "general",
    cta_id: params.cta_id,
    cta_location: params.cta_location,
  });
}

// 3. click_roadmap_cta
export function trackClickRoadmapCta(params: {
  cta_id: string;
  cta_location: string;
}): void {
  pushToDataLayer("click_roadmap_cta", {
    cta_id: params.cta_id,
    cta_location: params.cta_location,
  });
}

// 4. click_zalo
export function trackClickZalo(params: {
  cta_location: string;
}): void {
  pushToDataLayer("click_zalo", {
    cta_id: "zalo_contact_button",
    cta_location: params.cta_location,
  });
}

// 5. form_start
export function trackFormStart(params: {
  form_id: string;
  course_id?: string;
}): void {
  pushToDataLayer("form_start", {
    form_id: params.form_id,
    course_id: params.course_id || "general",
  });
}

// 6. form_submit_attempt
export function trackFormSubmitAttempt(params: {
  form_id: string;
  submission_id: string;
  course_id?: string;
}): void {
  pushToDataLayer("form_submit_attempt", {
    form_id: params.form_id,
    submission_id: params.submission_id,
    course_id: params.course_id || "general",
  });
}

// 7. generate_lead (EMITTED ONLY AFTER SERVER CONFIRMATION)
export function trackGenerateLead(params: {
  form_id: string;
  submission_id: string;
  course_id?: string;
  status: "stored" | "duplicate";
}): void {
  pushToDataLayer("generate_lead", {
    form_id: params.form_id,
    submission_id: params.submission_id,
    course_id: params.course_id || "general",
    lead_status: params.status,
  });
}

// 8. form_submit_error
export function trackFormSubmitError(params: {
  form_id: string;
  submission_id: string;
  error_type: string;
}): void {
  pushToDataLayer("form_submit_error", {
    form_id: params.form_id,
    submission_id: params.submission_id,
    error_type: params.error_type,
  });
}

// 9. form_retry
export function trackFormRetry(params: {
  form_id: string;
  submission_id: string;
  retry_count: number;
}): void {
  pushToDataLayer("form_retry", {
    form_id: params.form_id,
    submission_id: params.submission_id,
    retry_count: params.retry_count,
  });
}
