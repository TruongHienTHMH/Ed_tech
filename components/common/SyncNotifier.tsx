"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function SyncNotifier() {
  const isInitializedRef = useRef<boolean>(false);
  const lastSeenTimestampRef = useRef<number>(0);

  useEffect(() => {
    // Hàm kiểm tra trạng thái cập nhật từ server (chỉ gọi khi cần, không dùng polling định kỳ)
    const checkSyncStatus = async () => {
      try {
        const res = await fetch("/api/revalidate/status", {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        if (!res.ok) return;

        const data = await res.json();
        const serverTimestamp = Number(data.lastRevalidatedAt) || 0;

        // Lần đầu tiên chạy: Ghi nhận mốc ban đầu (baseline) từ server, không bắn toast
        if (!isInitializedRef.current) {
          isInitializedRef.current = true;
          lastSeenTimestampRef.current = serverTimestamp;
          return;
        }

        // Các lần kiểm tra sau (khi chuyển tab):
        // Chỉ thông báo khi server có lượt đồng bộ thực tế mới hơn mốc đã thấy
        if (
          serverTimestamp > 0 &&
          serverTimestamp > lastSeenTimestampRef.current
        ) {
          lastSeenTimestampRef.current = serverTimestamp;

          toast.info("LYDATA vừa cập nhật nội dung mới, bạn tải lại trang để theo dõi nội dung mới nhất.", {
            duration: 8000,
          });
        }
      } catch {
        // Bỏ qua lỗi mạng ngầm
      }
    };

    // 1. Kiểm tra mốc ban đầu khi nạp trang
    checkSyncStatus();

    // 2. Chỉ kiểm tra khi người dùng chuyển lại tab trang web (Tab Visibility Change)
    // Hoàn toàn không dùng setInterval polling chạy nền định kỳ để tránh spam log và tốn tài nguyên
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSyncStatus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
