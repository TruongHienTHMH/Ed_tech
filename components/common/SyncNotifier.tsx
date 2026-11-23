"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SyncNotifier() {
  const mountTimeRef = useRef<number>(Date.now());
  const lastSeenRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Hàm kiểm tra trạng thái cập nhật từ server
    const checkSyncStatus = async () => {
      try {
        const res = await fetch("/api/revalidate/status", {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        if (!res.ok) return;

        const data = await res.json();
        const serverTimestamp = Number(data.lastRevalidatedAt);

        // Nếu server có revalidation diễn ra SAU khi component được mount
        // và KHÁC với timestamp đã thông báo trước đó
        if (
          serverTimestamp &&
          serverTimestamp > mountTimeRef.current &&
          serverTimestamp !== lastSeenRef.current
        ) {
          lastSeenRef.current = serverTimestamp;

          // Thông báo Sonner (Chỉ thông báo, không cần nút action theo yêu cầu)
          toast.info("LYDATA Vừa cập nhật nội dung mới, bạn refresh trang để theo dõi nội dung mới nhất.", {
            duration: 12000,
          });
        }
      } catch {
        // Bỏ qua lỗi mạng ngầm
      }
    };

    // 2. Kiểm tra định kỳ mỗi 8 giây
    const intervalId = setInterval(checkSyncStatus, 8000);

    // 3. Kiểm tra ngay khi người dùng chuyển lại tab (Tab Visibility Change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSyncStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
