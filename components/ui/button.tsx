"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "secondary" | "link" | "dark";
type Size = "sm" | "md" | "lg" | "icon";

const variantStyles: Record<Variant, string> = {
  default: "bg-neutral-900 text-white hover:bg-neutral-800",
  outline: "border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white",
  ghost: "text-neutral-900 hover:bg-neutral-100",
  secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200",
  link: "text-neutral-900 underline-offset-4 hover:underline",
  dark: "bg-white text-neutral-900 hover:bg-neutral-200",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-10 text-base tracking-wide",
  icon: "h-10 w-10",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

interface ButtonAsButton extends CommonProps {
  as?: "button";
  href?: undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsLink extends CommonProps {
  as?: "link";
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "default",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ("href" in rest && rest.href) {
    const { href, variant: _v, size: _s, className: _c, as: _a, ...anchorRest } = rest as any;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, as: _a, ...btnRest } = rest as any;
  return (
    <button className={classes} {...btnRest}>
      {children}
    </button>
  );
}
