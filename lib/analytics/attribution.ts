/**
 * Attribution tracking module
 * Captures First-touch and Last-touch attribution parameters (UTM, Click IDs, Referrer, Landing Page)
 * Features a 30-day configurable attribution window and SSR-safe localStorage persistence.
 */

export const ATTRIBUTION_WINDOW_DAYS = 30;
export const ATTRIBUTION_STORAGE_KEY = "ed_da_attribution_v1";

export interface TouchData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page: string;
  seen_at: string;
}

export interface AttributionRecord {
  first_touch: TouchData;
  last_touch: TouchData;
  expires_at: number; // timestamp in ms
}

export interface FlatAttributionPayload {
  first_utm_source: string;
  first_utm_medium: string;
  first_utm_campaign: string;
  first_utm_content: string;
  first_utm_term: string;
  first_referrer: string;
  first_landing_page: string;
  first_seen_at: string;
  last_utm_source: string;
  last_utm_medium: string;
  last_utm_campaign: string;
  last_utm_content: string;
  last_utm_term: string;
  last_referrer: string;
  last_landing_page: string;
  last_seen_at: string;
  gclid: string;
  fbclid: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function parseUrlParams(urlStr: string): Record<string, string> {
  try {
    const url = new URL(urlStr);
    const params: Record<string, string> = {};
    url.searchParams.forEach((val, key) => {
      params[key.toLowerCase()] = val;
    });
    return params;
  } catch {
    return {};
  }
}

function isInternalReferrer(referrer: string): boolean {
  if (!referrer) return false;
  try {
    const refUrl = new URL(referrer);
    return refUrl.hostname === window.location.hostname;
  } catch {
    return false;
  }
}

function getReferrerSource(referrer: string): { source: string; medium: string } {
  if (!referrer || isInternalReferrer(referrer)) {
    return { source: "direct", medium: "none" };
  }
  try {
    const refUrl = new URL(referrer);
    const host = refUrl.hostname.replace(/^www\./, "");
    if (host.includes("google.")) return { source: "google", medium: "organic" };
    if (host.includes("facebook.") || host.includes("fb.com")) return { source: "facebook", medium: "social" };
    if (host.includes("zalo.")) return { source: "zalo", medium: "social" };
    if (host.includes("tiktok.")) return { source: "tiktok", medium: "social" };
    if (host.includes("youtube.")) return { source: "youtube", medium: "social" };
    return { source: host, medium: "referral" };
  } catch {
    return { source: "referral", medium: "referral" };
  }
}

export function initializeAttribution(): AttributionRecord | null {
  if (!isBrowser()) return null;

  try {
    const now = Date.now();
    const isoNow = new Date().toISOString();
    const currentUrl = window.location.href;
    const currentPath = window.location.pathname + window.location.search;
    const params = parseUrlParams(currentUrl);
    const rawReferrer = document.referrer || "";

    const hasUtm = Boolean(
      params.utm_source ||
      params.utm_medium ||
      params.utm_campaign ||
      params.utm_content ||
      params.utm_term ||
      params.gclid ||
      params.fbclid
    );

    const isExternalRef = Boolean(rawReferrer && !isInternalReferrer(rawReferrer));
    const refMeta = getReferrerSource(rawReferrer);

    // Current incoming touch details
    const currentTouch: TouchData = {
      utm_source: params.utm_source || (hasUtm ? undefined : refMeta.source),
      utm_medium: params.utm_medium || (hasUtm ? undefined : refMeta.medium),
      utm_campaign: params.utm_campaign,
      utm_content: params.utm_content,
      utm_term: params.utm_term,
      gclid: params.gclid,
      fbclid: params.fbclid,
      referrer: isExternalRef ? rawReferrer : (hasUtm ? rawReferrer : ""),
      landing_page: currentPath,
      seen_at: isoNow,
    };

    // Read stored record
    let record: AttributionRecord | null = null;
    const stored = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: AttributionRecord = JSON.parse(stored);
        if (parsed.expires_at && parsed.expires_at > now) {
          record = parsed;
        }
      } catch {
        record = null;
      }
    }

    const expirationMs = now + ATTRIBUTION_WINDOW_DAYS * 24 * 60 * 60 * 1000;

    if (!record) {
      // First visit ever or expired: initialize first-touch and last-touch identically
      record = {
        first_touch: currentTouch,
        last_touch: currentTouch,
        expires_at: expirationMs,
      };
    } else {
      // Already has first-touch: update last-touch ONLY if new incoming source (has UTM or external referrer)
      if (hasUtm || isExternalRef) {
        record.last_touch = currentTouch;
        record.expires_at = expirationMs;
      } else {
        // Just refresh landing_page and timestamp without destroying marketing attribution
        record.last_touch.landing_page = currentPath;
        record.last_touch.seen_at = isoNow;
      }
    }

    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record));
    return record;
  } catch (err) {
    console.warn("[Attribution] Failed to save attribution:", err);
    return null;
  }
}

export function getFlatAttribution(): FlatAttributionPayload {
  const fallback: FlatAttributionPayload = {
    first_utm_source: "direct",
    first_utm_medium: "none",
    first_utm_campaign: "",
    first_utm_content: "",
    first_utm_term: "",
    first_referrer: "",
    first_landing_page: isBrowser() ? window.location.pathname : "/",
    first_seen_at: new Date().toISOString(),
    last_utm_source: "direct",
    last_utm_medium: "none",
    last_utm_campaign: "",
    last_utm_content: "",
    last_utm_term: "",
    last_referrer: "",
    last_landing_page: isBrowser() ? window.location.pathname : "/",
    last_seen_at: new Date().toISOString(),
    gclid: "",
    fbclid: "",
  };

  if (!isBrowser()) return fallback;

  try {
    const stored = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!stored) {
      const initialized = initializeAttribution();
      if (!initialized) return fallback;
      return mapRecordToFlat(initialized);
    }
    const parsed: AttributionRecord = JSON.parse(stored);
    if (parsed.expires_at && parsed.expires_at < Date.now()) {
      localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
      const reinit = initializeAttribution();
      return reinit ? mapRecordToFlat(reinit) : fallback;
    }
    return mapRecordToFlat(parsed);
  } catch {
    return fallback;
  }
}

function mapRecordToFlat(rec: AttributionRecord): FlatAttributionPayload {
  const first = rec.first_touch;
  const last = rec.last_touch;

  return {
    first_utm_source: first.utm_source || "direct",
    first_utm_medium: first.utm_medium || "none",
    first_utm_campaign: first.utm_campaign || "",
    first_utm_content: first.utm_content || "",
    first_utm_term: first.utm_term || "",
    first_referrer: first.referrer || "",
    first_landing_page: first.landing_page || "/",
    first_seen_at: first.seen_at || "",
    last_utm_source: last.utm_source || "direct",
    last_utm_medium: last.utm_medium || "none",
    last_utm_campaign: last.utm_campaign || "",
    last_utm_content: last.utm_content || "",
    last_utm_term: last.utm_term || "",
    last_referrer: last.referrer || "",
    last_landing_page: last.landing_page || "/",
    last_seen_at: last.seen_at || "",
    gclid: last.gclid || first.gclid || "",
    fbclid: last.fbclid || first.fbclid || "",
  };
}
