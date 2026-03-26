import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children?: React.ReactNode;
}

type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

interface LinkButtonProps extends BaseProps {
  href: string;
}

type Props = ButtonProps | LinkButtonProps;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500",
  secondary:
    "bg-white text-primary-700 border border-primary-300 hover:bg-primary-50 active:bg-primary-100 focus-visible:ring-primary-500",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-400",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-2 text-sm min-h-[36px]",
  md: "px-5 py-3 text-base min-h-[44px]",
  lg: "px-7 py-4 text-lg min-h-[52px]",
};

function buildClasses(variant: Variant, size: Size, fullWidth: boolean, extra = ""): string {
  return [
    "inline-flex items-center justify-center font-semibold rounded-lg",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  href,
  ...rest
}: Props) {
  const classes = buildClasses(variant, size, fullWidth, className);

  if (href !== undefined) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
