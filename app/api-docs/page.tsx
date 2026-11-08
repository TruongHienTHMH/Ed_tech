"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function ApiDocsPage() {
  useEffect(() => {
    // Dynamically load Swagger UI CSS and JavaScript from CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/swagger-ui-dist@5/swagger-ui.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      // @ts-expect-error SwaggerUIBundle is loaded dynamically via CDN script
      if (window.SwaggerUIBundle) {
        // @ts-expect-error SwaggerUIBundle is loaded dynamically via CDN script
        window.SwaggerUIBundle({
          url: "/api-docs/openapi.json",
          dom_id: "#swagger-ui",
          deepLinking: true,
          presets: [
            // @ts-expect-error SwaggerUIBundle preset loaded
            window.SwaggerUIBundle.presets.apis,
            // @ts-expect-error SwaggerUIBundle preset loaded
            window.SwaggerUIBundle.SwaggerUIStandalonePreset,
          ],
          layout: "BaseLayout",
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Brand Header */}
      <div className="bg-[#1F242F] border-b border-[#2D3342] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[#8B1D2C] flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">DataWithLy API Documentation</h1>
            <p className="text-gray-400 text-xs">OpenAPI 3.0.3 Interactive Testing Explorer</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-300">
          <span className="px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
            ● Hệ thống đang hoạt động
          </span>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors underline"
          >
            /api/health
          </a>
          <Link
            href="/"
            className="px-3 py-1.5 rounded bg-[#8B1D2C] hover:bg-[#A32435] text-white font-medium transition-colors"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div id="swagger-ui" />
      </div>
    </div>
  );
}
