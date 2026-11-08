/**
 * Local Storage Provider (Development Fallback)
 * Saves uploads directly to public/uploads/ for zero-friction local development
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ImageStorageProvider, UploadOptions, UploadResult, StorageStatus } from "../types";

export class LocalStorageProvider implements ImageStorageProvider {
  private uploadsDir: string;
  private publicBaseUrl: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "public", "uploads");
    this.publicBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  }

  public async checkStatus(): Promise<StorageStatus> {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        fs.mkdirSync(this.uploadsDir, { recursive: true });
      }
      return {
        provider: "local",
        status: "connected",
        bucketName: "local_filesystem",
        publicDomain: this.publicBaseUrl || "http://localhost:3000",
        message: "Lưu trữ cục bộ (Local Disk) hoạt động bình thường.",
      };
    } catch (err: unknown) {
      return {
        provider: "local",
        status: "error",
        message: (err as Error)?.message || "Không thể tạo thư mục public/uploads",
      };
    }
  }

  public async upload(
    fileBuffer: Buffer | Uint8Array,
    originalFileName: string,
    mimeType: string,
    options?: UploadOptions
  ): Promise<UploadResult> {
    try {
      // Chống Path Traversal trong folder
      const rawFolder = options?.folder || "general";
      const sanitizedFolder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, "");
      const folder = sanitizedFolder || "general";
      const targetDir = path.resolve(this.uploadsDir, folder);

      if (!targetDir.startsWith(this.uploadsDir)) {
        throw new Error("Phát hiện hành vi Path Traversal không hợp lệ.");
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const ext = this.getFileExtension(originalFileName, mimeType);
      const randomUuid = crypto.randomUUID().slice(0, 8);
      const sanitizedBase = originalFileName
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-z0-9_-]/g, "-")
        .slice(0, 30);
      const fileName = `${Date.now()}-${sanitizedBase}-${randomUuid}.${ext}`;
      const filePath = path.join(targetDir, fileName);

      fs.writeFileSync(filePath, Buffer.from(fileBuffer));

      const relativeKey = `${folder}/${fileName}`;
      const publicUrl = this.getPublicUrl(relativeKey);

      return {
        ok: true,
        url: publicUrl,
        key: relativeKey,
        sizeBytes: fileBuffer.length,
        mimeType,
      };
    } catch (err: unknown) {
      console.error("[LocalStorageProvider Error]:", (err as Error)?.message);
      return {
        ok: false,
        url: "",
        key: "",
        sizeBytes: fileBuffer.length,
        mimeType,
        error: (err as Error)?.message || "Lỗi lưu file vào ổ đĩa cục bộ",
      };
    }
  }

  public async delete(fileKey: string): Promise<boolean> {
    try {
      // Chống Path Traversal khi xóa file
      const cleanKey = fileKey.replace(/^\/+/, "");
      const resolvedPath = path.resolve(this.uploadsDir, cleanKey);
      if (!resolvedPath.startsWith(this.uploadsDir)) {
        console.warn(`[LocalStorageProvider] Blocked path traversal attempt in delete: ${fileKey}`);
        return false;
      }

      if (fs.existsSync(resolvedPath)) {
        fs.unlinkSync(resolvedPath);
        return true;
      }
      return false;
    } catch (err: unknown) {
      console.error("[LocalStorageProvider Delete Error]:", (err as Error)?.message);
      return false;
    }
  }

  public getPublicUrl(fileKey: string): string {
    const cleanKey = fileKey.replace(/^\/+/, "");
    const base = this.publicBaseUrl ? this.publicBaseUrl.replace(/\/+$/, "") : "";
    return `${base}/uploads/${cleanKey}`;
  }

  private getFileExtension(filename: string, mimeType: string): string {
    const mimeMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
      "image/svg+xml": "svg",
    };

    // Chỉ chấp nhận phần mở rộng an toàn khớp chặt chẽ với MIME type
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

