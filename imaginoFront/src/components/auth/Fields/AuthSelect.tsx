"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const AuthSelect = React.forwardRef<HTMLSelectElement, AuthSelectProps>(
  ({ id, label, error, containerClassName, className, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        <label htmlFor={selectId} className="text-xs font-medium text-foreground dark:text-[color:var(--card-foreground)]">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-11 w-full rounded-lg border border-[#E4E4E7] bg-[#ffffff] px-3 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent appearance-none",
            error && "border-red-500 focus:ring-red-500",
            "dark:bg-[color:var(--input)] dark:border-[color:var(--border)] dark:text-[color:var(--card-foreground)]",
            className
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p id={errorId} className="text-[11px] font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthSelect.displayName = "AuthSelect";
