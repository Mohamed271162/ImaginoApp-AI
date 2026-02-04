'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, error, containerClassName, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-foreground dark:text-[color:var(--card-foreground)]"
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'h-11 w-full rounded-lg border border-[#E4E4E7] bg-[#ffffff] px-3 text-sm text-foreground',
            'placeholder:text-muted-foreground/70',
            'focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent',
            'transition-shadow',
            error && 'border-red-500 focus:ring-red-500',
            'dark:bg-[color:var(--input)] dark:border-[color:var(--border)] dark:text-[color:var(--card-foreground)] dark:placeholder:text-[color:var(--muted-foreground)]',
            className
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-[11px] font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
