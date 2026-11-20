import React from "react";

export type BadgeVariant =
  | "primary"
  | "outlinePrimary"
  | "tag"
  | "level"
  | "liveClass"
  | "discount"
  | "gold";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  // Primary Badge (Figma Node 12:894 - Button 6): Gradient #AF445A -> #784080 with bold white uppercase text
  primary:
    "bg-gradient-to-r from-[#AF445A] to-[#784080] text-white font-bold tracking-[0.96px] uppercase shadow-xs",
  // Outline Primary Badge (Figma Node 12:875): White pill with pink border and gradient text
  outlinePrimary:
    "bg-white border-[1.5px] border-[#AF445A] font-bold tracking-[0.96px] uppercase shadow-xs",
  tag:
    "bg-gradient-to-r from-[#AF445A] to-[#784080] text-white font-bold tracking-[0.96px] uppercase shadow-xs",
  level: "border border-white/10 bg-white/10 text-white/90 font-medium",
  liveClass: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-semibold",
  discount: "border border-rose-500/40 bg-rose-500/20 text-rose-300 font-bold tracking-wide",
  gold: "border border-[#FFC934]/40 bg-[#FFC934]/15 text-[#FFC934] font-bold",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-3.5 py-1 text-xs rounded-full gap-1.5",
  md: "px-5 py-2 text-sm sm:text-base rounded-[35px] gap-2 leading-tight",
  lg: "px-6 py-2.5 text-base sm:text-lg rounded-[35px] gap-2.5 leading-tight",
};

export function Badge({
  variant = "primary",
  size = "md",
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseClasses = "inline-flex items-center justify-center select-none text-center whitespace-nowrap";

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
      {variant === "outlinePrimary" ? (
        <span className="bg-gradient-to-r from-[#AF445A] to-[#784080] bg-clip-text text-transparent">
          {children}
        </span>
      ) : (
        <span>{children}</span>
      )}
    </span>
  );
}

export default Badge;
