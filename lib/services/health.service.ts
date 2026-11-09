/**
 * System Health & Observability Service
 * Tracks Google Sheets connectivity latency, Node.js V8 Heap memory, and Cloudflare Storage status
 */

import { getStorageProvider } from "@/lib/storage";

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "down";
  timestamp: string;
  uptimeSeconds: number;
  environment: string;
  services: {
    googleSheets: {
      status: "connected" | "degraded" | "down" | "mock";
      latencyMs: number;
      targetUrl?: string;
      message?: string;
    };
    imageStorage: {
      provider: string;
      status: "connected" | "unconfigured" | "error";
      bucketName?: string;
      message?: string;
    };
  };
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
    externalMb: number;
  };
}

export class HealthService {
  private static startTime = Date.now();

  /**
   * Perform comprehensive system health check
   */
  public static async checkHealth(): Promise<HealthCheckResult> {
    const startPing = Date.now();
    let sheetsStatus: "connected" | "degraded" | "down" | "mock" = "connected";
    let latencyMs = 0;
    let sheetsMessage = "Kết nối Google Apps Script thành công.";

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_CMS_URL || process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl) {
      sheetsStatus = "mock";
      latencyMs = 0;
      sheetsMessage = "Môi trường phát triển: GOOGLE_APPS_SCRIPT_CMS_URL / GOOGLE_APPS_SCRIPT_URL chưa được cấu hình, đang dùng Mock Mode.";
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        // Send a lightweight GET or HEAD to the Apps Script URL
        const res = await fetch(appsScriptUrl, {
          method: "GET",
          signal: controller.signal,
          redirect: "follow",
        });

        clearTimeout(timeoutId);
        latencyMs = Date.now() - startPing;

        if (res.ok || res.status === 302 || res.status === 200) {
          sheetsStatus = latencyMs > 1500 ? "degraded" : "connected";
        } else {
          sheetsStatus = "degraded";
          sheetsMessage = `Google Apps Script phản hồi HTTP ${res.status}`;
        }
      } catch (err: unknown) {
        latencyMs = Date.now() - startPing;
        sheetsStatus = "down";
        sheetsMessage = (err as Error)?.message || "Không thể gửi ping tới Google Apps Script";
      }
    }

    // Check Cloudflare Storage Status
    const storageProvider = getStorageProvider();
    const storageStatus = await storageProvider.checkStatus();

    // Node.js Memory Metrics (MB)
    const mem = process.memoryUsage();
    const heapUsedMb = Math.round((mem.heapUsed / (1024 * 1024)) * 100) / 100;
    const heapTotalMb = Math.round((mem.heapTotal / (1024 * 1024)) * 100) / 100;
    const rssMb = Math.round((mem.rss / (1024 * 1024)) * 100) / 100;
    const externalMb = Math.round((mem.external / (1024 * 1024)) * 100) / 100;

    // Overall status assessment
    let overallStatus: "healthy" | "degraded" | "down" = "healthy";
    if (sheetsStatus === "down") {
      overallStatus = "down";
    } else if (sheetsStatus === "degraded" || storageStatus.status === "error" || heapUsedMb > 300) {
      overallStatus = "degraded";
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      environment: process.env.NODE_ENV || "development",
      services: {
        googleSheets: {
          status: sheetsStatus,
          latencyMs,
          message: sheetsMessage,
        },
        imageStorage: {
          provider: storageStatus.provider,
          status: storageStatus.status,
          bucketName: storageStatus.bucketName,
          message: storageStatus.message,
        },
      },
      memory: {
        heapUsedMb,
        heapTotalMb,
        rssMb,
        externalMb,
      },
    };
  }
}

