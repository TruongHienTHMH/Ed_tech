/**
 * Lead Validator Module
 */

import { LeadInputDto, LeadValidationResult } from "./types";

export class LeadValidator {
  private static phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  public static validate(dto: LeadInputDto): LeadValidationResult {
    const submissionId = typeof dto.submission_id === "string" ? dto.submission_id.trim() : "";
    if (!submissionId) {
      return {
        isValid: false,
        errorCode: "MISSING_SUBMISSION_ID",
        errorMessage: "Mã định danh submission_id không hợp lệ.",
      };
    }

    // 1. Anti-bot honeypot check
    if (dto._hp && typeof dto._hp === "string" && dto._hp.trim() !== "") {
      return {
        isValid: true,
        isBot: true,
      };
    }

    // 2. Name validation
    const rawName = typeof dto.name === "string" ? dto.name.trim() : "";
    if (!rawName || rawName.length < 2 || rawName.length > 100) {
      return {
        isValid: false,
        errorCode: "INVALID_NAME",
        errorMessage: "Họ tên phải từ 2 đến 100 ký tự.",
      };
    }

    // 3. Phone validation
    const rawPhone = typeof dto.phone === "string" ? dto.phone.trim() : "";
    const phoneClean = rawPhone.replace(/\s+/g, "");
    if (!this.phoneRegex.test(phoneClean)) {
      return {
        isValid: false,
        errorCode: "INVALID_PHONE",
        errorMessage: "Số điện thoại không đúng định dạng.",
      };
    }

    // 4. Email validation (optional)
    const rawEmail = typeof dto.email === "string" ? dto.email.trim() : "";
    if (rawEmail && (rawEmail.length > 150 || !this.emailRegex.test(rawEmail))) {
      return {
        isValid: false,
        errorCode: "INVALID_EMAIL",
        errorMessage: "Địa chỉ email không hợp lệ.",
      };
    }

    // 5. Message length check
    const rawMessage = typeof dto.message === "string" ? dto.message.trim() : "";
    if (rawMessage.length > 2000) {
      return {
        isValid: false,
        errorCode: "MESSAGE_TOO_LONG",
        errorMessage: "Tin nhắn không được vượt quá 2000 ký tự.",
      };
    }

    return {
      isValid: true,
      isBot: false,
      cleanData: {
        submission_id: submissionId,
        name: rawName,
        phone: phoneClean,
        email: rawEmail,
        course_id: dto.course_id?.trim() || "general",
        course_name: dto.course_name?.trim() || "Tư vấn chung",
        message: rawMessage,
        form_id: dto.form_id?.trim() || "default_form",
        cta_id: dto.cta_id?.trim() || "default_cta",
        page_url: dto.page_url?.trim() || "",
        client_submitted_at: dto.client_submitted_at || new Date().toISOString(),
      },
    };
  }
}
