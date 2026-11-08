import React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "gold" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#8B1D2C] to-[#AF445A] hover:from-[#731422] hover:to-[#96374C] text-white shadow-md hover:shadow-lg border border-transparent",
  secondary:
    "bg-[#2E2E2E] hover:bg-[#3D3D3D] text-white border border-white/10 shadow-sm",
  gold:
    "bg-[#FFC934] hover:bg-[#F0BB2B] text-[#252525] font-bold shadow-md hover:shadow-lg border border-transparent",
  outline:
    "bg-transparent border border-[#AF445A] text-[#AF445A] hover:bg-[#AF445A]/10",
  ghost:
    "bg-transparent text-white/90 hover:text-white hover:bg-white/10 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm font-semibold rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base font-bold rounded-xl gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#AF445A]/40 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100";

  const computedClasses = [
    baseClasses,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? "w-full" : "",
    isLoading ? "cursor-wait opacity-80" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {!isLoading && iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
    </>
  );

  if (href !== undefined) {
    const { ...linkProps } = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        href={href}
        className={computedClasses}
        aria-disabled={isLoading || undefined}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const { type = "button", disabled, ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={computedClasses}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export default Button;

