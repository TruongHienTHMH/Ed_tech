/**
 * Image Storage Factory (Strategy Pattern)
 * Instantiates the appropriate storage provider based on STORAGE_PROVIDER environment variable
 */

import { CloudflareR2Provider } from "./providers/cloudflare-r2.provider";
import { LocalStorageProvider } from "./providers/local.provider";
import { ImageStorageProvider } from "./types";

let cachedProvider: ImageStorageProvider | null = null;

export function getStorageProvider(): ImageStorageProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const providerType = (process.env.STORAGE_PROVIDER || "").toLowerCase().trim();

  switch (providerType) {
    case "cloudflare_r2":
    case "r2":
      cachedProvider = new CloudflareR2Provider();
      break;

    case "local":
    default:
      // If R2 credentials exist, default to R2, otherwise fallback to local
      if (
        process.env.CLOUDFLARE_ACCOUNT_ID &&
        process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
        process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
      ) {
        cachedProvider = new CloudflareR2Provider();
      } else {
        cachedProvider = new LocalStorageProvider();
      }
      break;
  }

  return cachedProvider;
}

export * from "./types";

