/**
 * Lead Application Service (Business Orchestrator)
 */

import { GoogleSheetsClient } from "@/lib/google-sheets/client";
import { sanitizeSpreadsheetValue, maskSensitivePhone } from "@/lib/google-sheets/sanitizer";
import { LeadInputDto, LeadServiceResult } from "./types";
import { LeadValidator } from "./validator";

export class LeadService {
  private static targetSheetName = "Leads";

  /**
   * Process a new lead submission
   */
  public static async processLead(dto: LeadInputDto): Promise<LeadServiceResult> {
    const submissionId = dto.submission_id?.trim() || "unknown";

    // 1. Validate payload
    const validation = LeadValidator.validate(dto);

    if (!validation.isValid) {
      return {
        ok: false,
        submissionId,
        error: {
          code: validation.errorCode || "VALIDATION_FAILED",
          message: validation.errorMessage || "Dữ liệu không hợp lệ.",
        },
      };
    }

    // 2. Anti-bot honeypot trap
    if (validation.isBot) {
      console.warn(`[LeadService AntiBot] Bot trap triggered for submission ${submissionId}`);
      return {
        ok: true,
        submissionId,
        status: "stored",
      };
    }

    const clean = validation.cleanData!;

    // 3. Construct sanitized payload for Sheets
    const rowPayload = {
      submission_id: sanitizeSpreadsheetValue(clean.submission_id),
      client_submitted_at: clean.client_submitted_at,
      name: sanitizeSpreadsheetValue(clean.name),
      phone: sanitizeSpreadsheetValue(clean.phone),
      email: sanitizeSpreadsheetValue(clean.email),
      course_id: sanitizeSpreadsheetValue(clean.course_id),
      course_name: sanitizeSpreadsheetValue(clean.course_name),
      message: sanitizeSpreadsheetValue(clean.message),
      first_utm_source: sanitizeSpreadsheetValue(dto.first_utm_source || "direct"),
      first_utm_medium: sanitizeSpreadsheetValue(dto.first_utm_medium || "none"),
      first_utm_campaign: sanitizeSpreadsheetValue(dto.first_utm_campaign || ""),
      first_utm_content: sanitizeSpreadsheetValue(dto.first_utm_content || ""),
      first_utm_term: sanitizeSpreadsheetValue(dto.first_utm_term || ""),
      first_referrer: sanitizeSpreadsheetValue(dto.first_referrer || ""),
      first_landing_page: sanitizeSpreadsheetValue(dto.first_landing_page || "/"),
      first_seen_at: sanitizeSpreadsheetValue(dto.first_seen_at || ""),
      last_utm_source: sanitizeSpreadsheetValue(dto.last_utm_source || "direct"),
      last_utm_medium: sanitizeSpreadsheetValue(dto.last_utm_medium || "none"),
      last_utm_campaign: sanitizeSpreadsheetValue(dto.last_utm_campaign || ""),
      last_utm_content: sanitizeSpreadsheetValue(dto.last_utm_content || ""),
      last_utm_term: sanitizeSpreadsheetValue(dto.last_utm_term || ""),
      last_referrer: sanitizeSpreadsheetValue(dto.last_referrer || ""),
      last_landing_page: sanitizeSpreadsheetValue(dto.last_landing_page || "/"),
      last_seen_at: sanitizeSpreadsheetValue(dto.last_seen_at || ""),
      gclid: sanitizeSpreadsheetValue(dto.gclid || ""),
      fbclid: sanitizeSpreadsheetValue(dto.fbclid || ""),
      form_id: sanitizeSpreadsheetValue(clean.form_id),
      cta_id: sanitizeSpreadsheetValue(clean.cta_id),
      page_url: sanitizeSpreadsheetValue(clean.page_url),
      status: "NEW",
    };

    console.log(
      `[LeadService] Ingesting lead id=${clean.submission_id}, phone=${maskSensitivePhone(clean.phone)}, course=${clean.course_id}`
    );

    // 4. Save to Google Sheets via Generic Client (Prioritizing Leads-specific ENV)
    const leadsUrl = process.env.GOOGLE_APPS_SCRIPT_LEADS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;
    const leadsSecret = process.env.GOOGLE_APPS_SCRIPT_LEADS_SECRET || process.env.GOOGLE_APPS_SCRIPT_SECRET;

    const sheetsResult = await GoogleSheetsClient.appendRow(this.targetSheetName, rowPayload, {
      url: leadsUrl,
      secret: leadsSecret,
    });

    if (sheetsResult.ok) {
      return {
        ok: true,
        submissionId: clean.submission_id,
        status: sheetsResult.status,
        note: sheetsResult.note,
      };
    }

    return {
      ok: false,
      submissionId: clean.submission_id,
      error: sheetsResult.error,
    };
  }
}
