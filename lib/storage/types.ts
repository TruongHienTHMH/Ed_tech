/**
 * Image Storage Provider Interface & Types
 * Defines the contract for cloud storage adapters (Cloudflare R2, Cloudflare Images, Local)
 */

export interface UploadResult {
  ok: boolean;
  url: string;        // CDN public URL for rendering in web pages
  key: string;        // File path identifier within the storage bucket
  sizeBytes: number;
  mimeType: string;
  error?: string;
}

export interface UploadOptions {
  folder?: string;           // e.g. "courses", "avatars", "blog", "proofs"
  customFileName?: string;   // Optional custom filename override
  cacheControl?: string;     // HTTP Cache-Control header (default: 1 year immutable)
}

export interface StorageStatus {
  provider: "cloudflare_r2" | "cloudflare_images" | "local";
  status: "connected" | "unconfigured" | "error";
  bucketName?: string;
  publicDomain?: string;
  message?: string;
}

export interface ImageStorageProvider {
  /**
   * Upload an image file buffer to storage
   */
  upload(
    fileBuffer: Buffer | Uint8Array,
    originalFileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<UploadResult>;

  /**
   * Delete an image from storage by its key
   */
  delete(fileKey: string): Promise<boolean>;

  /**
   * Get the absolute public CDN URL for an image key
   */
  getPublicUrl(fileKey: string): string;

  /**
   * Check connection status
   */
  checkStatus(): Promise<StorageStatus>;
}

