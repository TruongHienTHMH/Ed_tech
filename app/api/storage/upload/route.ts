import { NextRequest, NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/storage";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

export async function POST(request: NextRequest) {
  try {
    // 0. Authorization check
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-secret");
    const adminSecret = process.env.ADMIN_SECRET || process.env.REVALIDATE_SECRET || "datawithly_secret_2026";
    if (process.env.NODE_ENV === "production") {
      const token = authHeader?.replace(/^Bearer\s+/i, "");
      if (!token || token !== adminSecret) {
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "UNAUTHORIZED",
              message: "Bạn không có quyền thực hiện tải lên tài nguyên.",
            },
          },
          { status: 401 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "MISSING_FILE",
            message: "Không tìm thấy file ảnh tải lên trong yêu cầu.",
          },
        },
        { status: 400 }
      );
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "FILE_TOO_LARGE",
            message: `Kích thước file (${(file.size / (1024 * 1024)).toFixed(2)}MB) vượt quá giới hạn cho phép (5MB).`,
          },
        },
        { status: 400 }
      );
    }

    // 2. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNSUPPORTED_MEDIA_TYPE",
            message: `Định dạng '${file.type}' không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WEBP, AVIF hoặc SVG.`,
          },
        },
        { status: 415 }
      );
    }

    // 3. Process buffer and upload via Storage Provider
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const storageProvider = getStorageProvider();

    const uploadResult = await storageProvider.upload(buffer, file.name, file.type, {
      folder,
      cacheControl: "public, max-age=31536000, immutable", // 1-year Cloudflare Edge CDN cache
    });

    if (!uploadResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "STORAGE_UPLOAD_FAILED",
            message: uploadResult.error || "Không thể tải ảnh lên kho lưu trữ đám mây.",
          },
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        data: {
          url: uploadResult.url,
          key: uploadResult.key,
          sizeBytes: uploadResult.sizeBytes,
          mimeType: uploadResult.mimeType,
          cached: true,
          cacheControl: "public, max-age=31536000, immutable",
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("[Route Error /api/storage/upload]:", (err as Error)?.message);
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Lỗi máy chủ khi xử lý tải ảnh lên.",
        },
      },
      { status: 500 }
    );
  }
}

