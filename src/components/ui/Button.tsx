import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          {
            "bg-slate-900 text-white hover:bg-brand-700": variant === "primary",
            "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100":
              variant === "secondary",
            "border border-slate-300 text-slate-900 hover:border-slate-900":
              variant === "outline",
            "text-slate-700 hover:text-brand-600": variant === "ghost"
          },
          {
            "px-4 py-2 text-xs": size === "sm",
            "px-5 py-3 text-xs": size === "md",
            "px-6 py-4 text-sm": size === "lg"
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
