/**
 * Cloudflare R2 Storage Provider (S3-Compatible Object Storage)
 * Zero Egress Fees + Cloudflare Global Edge CDN Caching
 */

import crypto from "crypto";
import { ImageStorageProvider, UploadOptions, UploadResult, StorageStatus } from "../types";

export class CloudflareR2Provider implements ImageStorageProvider {
  private accountId: string;
  private accessKeyId: string;
  private secretAccessKey: string;
  private bucketName: string;
  private publicDomain: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
    this.accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
    this.secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
    this.bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "datawithly-assets";
    this.publicDomain = (process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || "").replace(/\/+$/, "");
  }

  public async checkStatus(): Promise<StorageStatus> {
    if (!this.accountId || !this.accessKeyId || !this.secretAccessKey) {
      return {
        provider: "cloudflare_r2",
        status: "unconfigured",
        bucketName: this.bucketName,
        publicDomain: this.publicDomain,
        message: "Chưa cấu hình CLOUDFLARE_ACCOUNT_ID hoặc Access Key trong biến môi trường.",
      };
    }

    try {
      // Test HEAD bucket request
      const endpoint = `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}`;
      const now = new Date();
      const dateStamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 8);
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");

      const headers: Record<string, string> = {
        host: `${this.accountId}.r2.cloudflarestorage.com`,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": crypto.createHash("sha256").update("").digest("hex"),
      };

      const authHeader = this.generateAuthorizationHeader("HEAD", `/${this.bucketName}`, headers, amzDate, dateStamp, "");
      headers["Authorization"] = authHeader;

      const response = await fetch(endpoint, {
        method: "HEAD",
        headers,
      });

      if (response.ok || response.status === 404 || response.status === 200) {
        return {
          provider: "cloudflare_r2",
          status: "connected",
          bucketName: this.bucketName,
          publicDomain: this.publicDomain,
          message: "Kết nối Cloudflare R2 thành công.",
        };
      }

      return {
        provider: "cloudflare_r2",
        status: "error",
        bucketName: this.bucketName,
        publicDomain: this.publicDomain,
        message: `Cloudflare R2 trả về mã lỗi HTTP ${response.status}`,
      };
    } catch (err: unknown) {
      return {
        provider: "cloudflare_r2",
        status: "error",
        bucketName: this.bucketName,
        publicDomain: this.publicDomain,
        message: (err as Error)?.message || "Không thể kết nối Cloudflare R2",
      };
    }
  }

  public async upload(
    fileBuffer: Buffer | Uint8Array,
    originalFileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    const isConfigured = this.accountId && this.accessKeyId && this.secretAccessKey;
    if (!isConfigured) {
      return {
        ok: false,
        url: "",
        key: "",
        sizeBytes: fileBuffer.length,
        mimeType,
        error: "CLOUDFLARE_R2_CREDENTIALS_MISSING: Chưa cấu hình biến môi trường kết nối Cloudflare R2.",
      };
    }

    try {
      // 1. Generate unique sanitized file key
      const rawFolder = options?.folder || "general";
      const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, "") || "general";
      const ext = this.getFileExtension(originalFileName, mimeType);
      const randomUuid = crypto.randomUUID();
      const sanitizedBase = originalFileName
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 30);
      const fileKey = `${folder}/${Date.now()}-${sanitizedBase}-${randomUuid.slice(0, 8)}.${ext}`;

      // 2. Prepare request with 1-Year Global Edge CDN Cache-Control
      const endpoint = `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}/${fileKey}`;
      const now = new Date();
      const dateStamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 8);
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
      
      const payloadHash = crypto.createHash("sha256").update(Buffer.from(fileBuffer)).digest("hex");
      const cacheControl = options?.cacheControl || "public, max-age=31536000, immutable";

      const headers: Record<string, string> = {
        host: `${this.accountId}.r2.cloudflarestorage.com`,
        "content-type": mimeType,
        "content-length": fileBuffer.length.toString(),
        "cache-control": cacheControl,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
      };

      const path = `/${this.bucketName}/${fileKey}`;
      const authHeader = this.generateAuthorizationHeader("PUT", path, headers, amzDate, dateStamp, payloadHash);
      headers["Authorization"] = authHeader;

      // 3. Dispatch PUT request to Cloudflare R2
      const response = await fetch(endpoint, {
        method: "PUT",
        headers,
        body: Buffer.from(fileBuffer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`R2 upload failed with HTTP ${response.status}: ${errorText}`);
      }

      const publicUrl = this.getPublicUrl(fileKey);

      return {
        ok: true,
        url: publicUrl,
        key: fileKey,
        sizeBytes: fileBuffer.length,
        mimeType,
      };
    } catch (err: unknown) {
      console.error("[CloudflareR2Provider Error]:", (err as Error)?.message);
      return {
        ok: false,
        url: "",
        key: "",
        sizeBytes: fileBuffer.length,
        mimeType,
        error: (err as Error)?.message || "Lỗi tải ảnh lên Cloudflare R2",
      };
    }
  }

  public async delete(fileKey: string): Promise<boolean> {
    if (!this.accountId || !this.accessKeyId || !this.secretAccessKey) return false;

    try {
      const endpoint = `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucketName}/${fileKey}`;
      const now = new Date();
      const dateStamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 8);
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
      const payloadHash = crypto.createHash("sha256").update("").digest("hex");

      const headers: Record<string, string> = {
        host: `${this.accountId}.r2.cloudflarestorage.com`,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
      };

      const path = `/${this.bucketName}/${fileKey}`;
      const authHeader = this.generateAuthorizationHeader("DELETE", path, headers, amzDate, dateStamp, payloadHash);
      headers["Authorization"] = authHeader;

      const response = await fetch(endpoint, {
        method: "DELETE",
        headers,
      });

      return response.ok || response.status === 204;
    } catch (err: unknown) {
      console.error("[CloudflareR2Provider Delete Error]:", (err as Error)?.message);
      return false;
    }
  }

  public getPublicUrl(fileKey: string): string {
    if (this.publicDomain) {
      return `${this.publicDomain}/${fileKey}`;
    }
    // Fallback URL directly via bucket domain or worker
    return `https://${this.bucketName}.${this.accountId}.r2.dev/${fileKey}`;
  }

  /**
   * Helper: AWS SigV4 Signing for Cloudflare R2 S3 compatibility
   */
  private generateAuthorizationHeader(
    method: string,
    uri: string,
    headers: Record<string, string>,
    amzDate: string,
    dateStamp: string,
    payloadHash: string
  ): string {
    const region = "auto";
    const service = "s3";

    // 1. Canonical Headers & Signed Headers
    const sortedHeaderKeys = Object.keys(headers).map((k) => k.toLowerCase()).sort();
    const canonicalHeaders = sortedHeaderKeys.map((k) => `${k}:${headers[k].trim()}\n`).join("");
    const signedHeaders = sortedHeaderKeys.join(";");

    // 2. Canonical Request
    const canonicalRequest = [
      method,
      uri,
      "", // query string
      canonicalHeaders,
      signedHeaders,
      payloadHash || headers["x-amz-content-sha256"],
    ].join("\n");

    // 3. String to Sign
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const hashedCanonicalRequest = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
    const stringToSign = [algorithm, amzDate, credentialScope, hashedCanonicalRequest].join("\n");

    // 4. Calculate Signature
    const kDate = crypto.createHmac("sha256", "AWS4" + this.secretAccessKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
    const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    return `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  }

  private getFileExtension(filename: string, mimeType: string): string {
    const mimeMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/svg+xml": "svg",
    };

    const safeExtFromMime = mimeMap[mimeType];
    if (safeExtFromMime) {
      const extMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
      const userExt = extMatch ? extMatch[1].toLowerCase() : "";
      if (userExt === "jpeg" && safeExtFromMime === "jpg") return "jpg";
      if (userExt === safeExtFromMime) return safeExtFromMime;
      return safeExtFromMime;
    }
    return "bin";
  }
}

