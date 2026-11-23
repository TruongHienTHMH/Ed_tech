/**
 * Global Sync State Tracker (In-Memory Timestamp for ISR Revalidations)
 * Giữ mốc thời gian revalidation mới nhất để client-side polling phát hiện thay đổi tức thì.
 */

declare global {
  var __lastRevalidatedTimestamp: number | undefined;
}

export function recordRevalidation(): number {
  const now = Date.now();
  globalThis.__lastRevalidatedTimestamp = now;
  return now;
}

export function getLastRevalidatedTimestamp(): number {
  if (!globalThis.__lastRevalidatedTimestamp) {
    globalThis.__lastRevalidatedTimestamp = Date.now();
  }
  return globalThis.__lastRevalidatedTimestamp;
}
