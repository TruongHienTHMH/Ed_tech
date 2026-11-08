import React from "react";

export type BadgeVariant = "tag" | "level" | "liveClass" | "discount" | "gold";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  tag: "border border-[#AF445A]/50 bg-[#AF445A]/15 text-[#FFC934] font-bold tracking-wide uppercase",
  level: "border border-white/10 bg-white/10 text-white/90 font-medium",
  liveClass: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold",
  discount: "border border-rose-500/40 bg-rose-500/20 text-rose-300 font-bold tracking-wide",
  gold: "border border-[#FFC934]/40 bg-[#FFC934]/15 text-[#FFC934] font-bold",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-0.5 text-xs rounded-full gap-1.5",
  md: "px-3.5 py-1 text-xs sm:text-sm rounded-full gap-2",
};

export function Badge({
  variant = "tag",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseClasses = "inline-flex items-center select-none";

  const computedClasses = [
    baseClasses,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={computedClasses} {...props}>
      {variant === "liveClass" && !icon && (
        <span className="relative flex h-2 w-2 shrink-0 mr-1" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;

