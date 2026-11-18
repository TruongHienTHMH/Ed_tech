/**
 * Standardized High-Definition (4K) Image Fallbacks & Resolver
 * Authoritative Figma Desktop Assets (Node 12:682 & Node 12:1277)
 * Eliminates phantom /uploads/... and /images/... broken paths across the entire platform.
 */

export const FIGMA_IMAGE_FALLBACKS = {
  courses: {
    combo: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
    default: "/assets/figma/c4ad4d89a999588201cc5ccd2a39ca7dd43febe3.png",
    sql: "/assets/figma/05ab7dcc030820120da8f65c6b464967f554e0d8.png",
    thinking: "/assets/figma/b1c9fe6fd2d3dafb5b4b32d30320f68d7cde1f5c.png",
  },
  mentors: {
    "hua-thao-ly": "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
    default: "/assets/figma/00d85e9072dd2031d3c61249ae87330dd98d7556.png",
  },
  testimonials: [
    "/assets/figma/e40866062bc7c3587c903859bd52be66623217cc.png",
    "/assets/figma/2fc0a1c70056162f5d32de1029e4b71d620e97c4.png",
    "/assets/figma/2a57d0c1a2a65bb9e121f9545459faf7c1b50587.png",
    "/assets/figma/b2b53a3cd8b4e6f2cfcc039b89d51637f8421060.png",
    "/assets/figma/fb2492c1b7d7c65a104edaa8e809cc8a5a19315f.png",
    "/assets/figma/74b9c4a05863014e829874effcdb4e101a4bfaea.png",
  ],
  projects: [
    "/assets/student-project/stu-project-1.png",
    "/assets/student-project/stu-project-2.png",
    "/assets/student-project/stu-project-3.png",
    "/assets/student-project/stu-project-4.png",
    "/assets/student-project/stu-project-5.png",
    "/assets/student-project/stu-project-6.png",
    "/assets/student-project/stu-project-7.png",
    "/assets/student-project/stu-project-8.png",
    "/assets/student-project/stu-project-9.png",
  ],
  blogs: {
    default: "/assets/figma/c0aae3c5c5404ee626ce858087d79649de2e3dc1.png",
  },
} as const;

export type ImageFallbackCategory = "course" | "mentor" | "avatar" | "project" | "blog";

/**
 * Helper to compute an integer index from string or number identifier
 */
function getIndexFromIdentifier(identifier?: string | number, max: number = 6): number {
  if (typeof identifier === "number") {
    return Math.abs(identifier) % max;
  }
  if (typeof identifier === "string" && identifier.trim()) {
    // Check if ends with number
    const numMatch = identifier.match(/\d+$/);
    if (numMatch) {
      const parsed = parseInt(numMatch[0], 10);
      return Math.abs(parsed - 1) % max;
    }
    // Simple hash sum
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = (hash << 5) - hash + identifier.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % max;
  }
  return 0;
}

/**
 * Returns the exact fallback image URL according to the entity type and identifier.
 */
export function getFigmaFallback(
  type: ImageFallbackCategory = "course",
  identifier?: string | number
): string {
  switch (type) {
    case "course": {
      const idStr = String(identifier || "").toLowerCase();
      if (idStr.includes("sql")) {
        return FIGMA_IMAGE_FALLBACKS.courses.sql;
      }
      if (idStr.includes("think") || idStr.includes("dashboard")) {
        return FIGMA_IMAGE_FALLBACKS.courses.thinking;
      }
      return FIGMA_IMAGE_FALLBACKS.courses.default;
    }

    case "mentor":
      return FIGMA_IMAGE_FALLBACKS.mentors["hua-thao-ly"];

    case "avatar": {
      const idx = getIndexFromIdentifier(identifier, FIGMA_IMAGE_FALLBACKS.testimonials.length);
      return FIGMA_IMAGE_FALLBACKS.testimonials[idx];
    }

    case "project": {
      const idx = getIndexFromIdentifier(identifier, FIGMA_IMAGE_FALLBACKS.projects.length);
      return FIGMA_IMAGE_FALLBACKS.projects[idx];
    }

    case "blog":
      return FIGMA_IMAGE_FALLBACKS.blogs.default;

    default:
      return FIGMA_IMAGE_FALLBACKS.courses.default;
  }
}

/**
 * Detects if a URL is empty or points to a non-existent phantom path
 */
export function isInvalidOrPhantomPath(src?: string | null): boolean {
  if (!src || typeof src !== "string") return true;
  const trimmed = src.trim();
  if (!trimmed) return true;

  // Check for phantom placeholder paths that don't exist in the project
  if (
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("/images/") ||
    trimmed.includes("/uploads/projects/") ||
    trimmed.includes("/uploads/avatars/") ||
    trimmed.includes("/uploads/mentors/") ||
    trimmed.includes("default-cover.webp") ||
    trimmed.includes("default.jpg") ||
    trimmed.includes("ly-hua.jpg") ||
    trimmed.includes("placeholder")
  ) {
    return true;
  }

  return false;
}

/**
 * Normalizes Google Drive preview/view URLs into direct image stream links
 */
export function normalizeGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== "string") return url;
  const trimmed = url.trim();
  if (trimmed.includes("drive.google.com")) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  return trimmed;
}

/**
 * Resolves an image URL: if valid external or local path, returns it;
 * otherwise automatically returns the standardized 4K Figma fallback.
 */
export function resolveImageUrl(
  src?: string | null,
  type: ImageFallbackCategory = "course",
  identifier?: string | number
): string {
  if (isInvalidOrPhantomPath(src)) {
    return getFigmaFallback(type, identifier);
  }

  const clean = normalizeGoogleDriveUrl((src as string).trim());
  // Valid http/https URL, valid data URI, or valid asset path
  return clean;
}
