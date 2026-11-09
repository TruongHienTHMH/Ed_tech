"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface DevSyncButtonProps {
  className?: string;
  secretToken?: string;
}

export function DevSyncButton({
  className = "",
  secretToken = "datawithly_secure_reval_token_2026",
}: DevSyncButtonProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setStatusMessage("Đang đồng bộ...");
    setStatusType(null);

    try {
      const res = await fetch(`/api/revalidate?secret=${encodeURIComponent(secretToken)}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Mã lỗi HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.revalidated) {
        setStatusType("success");
        setStatusMessage("Đã làm mới dữ liệu!");
        // Refresh Next.js server components cache
        router.refresh();
      } else {
        throw new Error(data.error?.message || "Không thể đồng bộ cache");
      }
    } catch (err: unknown) {
      console.error("[DevSyncButton Error]:", err);
      setStatusType("error");
      setStatusMessage("Lỗi đồng bộ");
    } finally {
      setIsSyncing(false);
      setTimeout(() => {
        setStatusMessage(null);
        setStatusType(null);
      }, 3500);
    }
  };

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 flex items-center gap-2 group print:hidden ${className}`}
    >
      <button
        onClick={handleSync}
        disabled={isSyncing}
        title="Đồng bộ dữ liệu mới nhất từ Google Sheets và xóa cache"
        aria-label="Đồng bộ dữ liệu từ Google Sheets"
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full shadow-lg text-xs font-semibold backdrop-blur-md transition-all duration-300 border cursor-pointer ${
          statusType === "success"
            ? "bg-emerald-600/90 text-white border-emerald-400/50 scale-105"
            : statusType === "error"
            ? "bg-rose-600/90 text-white border-rose-400/50"
            : isSyncing
            ? "bg-[#1F242F]/90 text-amber-300 border-amber-400/40 animate-pulse"
            : "bg-[#1F242F]/90 text-white/90 hover:text-white border-white/15 hover:border-[#AF445A]/60 hover:bg-[#1F242F] hover:shadow-xl hover:scale-105"
        }`}
      >
        <span
          className={`inline-block transition-transform duration-500 ${
            isSyncing ? "animate-spin" : "group-hover:rotate-12"
          }`}
        >
          {isSyncing ? "⏳" : statusType === "success" ? "✅" : statusType === "error" ? "❌" : "⚡"}
        </span>

        <span>
          {statusMessage ? statusMessage : isSyncing ? "Đang đồng bộ..." : "Đồng bộ CMS"}
        </span>
      </button>
    </div>
  );
}

export default DevSyncButton;
