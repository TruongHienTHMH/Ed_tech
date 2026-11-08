import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "primary" | "white";
}

export default function Logo({ className = "", variant = "primary" }: LogoProps) {
  const isWhite = variant === "white";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1 font-extrabold tracking-tight select-none ${className}`}
      aria-label="Lý Data Homepage"
    >
      <span
        className={`text-2xl sm:text-3xl font-black ${
          isWhite ? "text-white" : "text-primary-500"
        }`}
        style={{
          fontFamily:
            "ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, var(--font-sans), sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        Ly Data
      </span>
    </Link>
  );
}
