/**
 * Generic Google Sheets Integration Types
 */

export interface GoogleSheetsRequestPayload {
  sheet_name?: string;
  secret?: string;
  submission_id: string;
  [key: string]: unknown;
}

export interface GoogleSheetsSuccessResponse {
  ok: true;
  submissionId: string;
  status: "stored" | "duplicate";
  note?: string;
}

export interface GoogleSheetsErrorResponse {
  ok: false;
  submissionId?: string;
  error: {
    code: string;
    message: string;
  };
}

export type GoogleSheetsResponse = GoogleSheetsSuccessResponse | GoogleSheetsErrorResponse;
