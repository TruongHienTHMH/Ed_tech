/**
 * Spreadsheet Formula Sanitizer & Data Privacy Helpers
 */

/**
 * Escape dangerous characters that trigger formula execution in Excel/Google Sheets
 * (=, +, -, @, Tab, Carriage Return)
 */
export function sanitizeSpreadsheetValue(val: unknown): string {
  if (typeof val !== "string") return "";
  if (/^[\t\r]/.test(val)) {
    return "'" + val;
  }
  const trimmed = val.trim();
  if (!trimmed) return "";
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return "'" + trimmed;
  }
  return trimmed;
}

/**
 * Mask phone numbers for logging (e.g. 0912345678 -> 091****678)
 */
export function maskSensitivePhone(phone: string): string {
  if (!phone || phone.length < 6) return "***";
  return phone.slice(0, 3) + "****" + phone.slice(-3);
}
