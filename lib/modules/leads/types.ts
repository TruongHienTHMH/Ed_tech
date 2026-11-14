/**
 * Lead Domain Models and DTOs
 */

import { FlatAttributionPayload } from "@/lib/analytics/attribution";

export interface LeadInputDto extends Partial<FlatAttributionPayload> {
  submission_id?: string;
  client_submitted_at?: string;
  name?: string;
  phone?: string;
  email?: string;
  course_id?: string;
  course_name?: string;
  coaching_course?: string;
  preferred_date?: string;
  preferred_time_slot?: string;
  target_or_goal?: string;
  attendance_commitment?: string;
  message?: string;
  form_id?: string;
  cta_id?: string;
  page_url?: string;
  _hp?: string; // Anti-bot honeypot
}

export interface LeadValidationResult {
  isValid: boolean;
  isBot?: boolean;
  errorCode?: string;
  errorMessage?: string;
  cleanData?: {
    submission_id: string;
    name: string;
    phone: string;
    email: string;
    course_id: string;
    course_name: string;
    message: string;
    form_id: string;
    cta_id: string;
    page_url: string;
    client_submitted_at: string;
  };
}

export interface LeadServiceResult {
  ok: boolean;
  submissionId: string;
  status?: "stored" | "duplicate";
  error?: {
    code: string;
    message: string;
  };
  note?: string;
}
