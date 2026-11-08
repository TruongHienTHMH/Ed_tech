/**
 * Generic Google Sheets Client for communicating with Google Apps Script Web App
 */

import { GoogleSheetsRequestPayload, GoogleSheetsResponse } from "./types";

export interface SendToSheetsOptions {
  timeoutMs?: number;
}

export class GoogleSheetsClient {
  private static defaultTimeoutMs = 12000;

  /**
   * Dispatch payload to Google Apps Script Web App
   */
  public static async appendRow(
    sheetName: string,
    payload: GoogleSheetsRequestPayload,
    options?: SendToSheetsOptions
  ): Promise<GoogleSheetsResponse> {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET || "";

    const requestPayload: GoogleSheetsRequestPayload = {
      ...payload,
      sheet_name: sheetName,
      secret,
    };

    // If no URL configured in local development, return mock success
    if (!appsScriptUrl) {
      console.warn(`[GoogleSheetsClient] GOOGLE_APPS_SCRIPT_URL not configured. Mocking success for sheet '${sheetName}'.`);
      return {
        ok: true,
        submissionId: payload.submission_id,
        status: "stored",
        note: "DEV_MOCK_STORED",
      };
    }

    const timeoutMs = options?.timeoutMs || this.defaultTimeoutMs;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(appsScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Google Apps Script responded with HTTP status ${response.status}`);
      }

      const result = (await response.json()) as GoogleSheetsResponse;
      return result;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort = (err as Error)?.name === "AbortError";
      console.error(
        `[GoogleSheetsClient Error] Failed sending row to sheet '${sheetName}':`,
        isAbort ? `Request timed out after ${timeoutMs}ms` : (err as Error)?.message
      );

      return {
        ok: false,
        submissionId: payload.submission_id,
        error: {
          code: isAbort ? "APPS_SCRIPT_TIMEOUT" : "SHEET_UNAVAILABLE",
          message: "Không thể lưu dữ liệu vào bảng tính lúc này. Vui lòng thử lại sau.",
        },
      };
    }
  }
}
