'use client';

import { useRouteLang } from '@/hooks/useLang';
import Link from 'next/link';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { AuthInput } from '../Fields/AuthInput';
import { registerAction } from '@/services/Auth.Server.service';
import { handleApiResponse } from '@/utils/RequestHelpers';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const lang = useRouteLang();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    
  });

  const passwordValue = useWatch({ control, name: 'password' });

  async function onSubmit(values: RegisterFormValues) {
    try {
      const response = await registerAction({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      const ok = handleApiResponse(response, {
        successMessage: 'User created successfully',
      });

      if (!ok) return;

      useAuthStore.getState().refreshAuth();
      router.push(`/${lang}/auth/verify-account`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong! Please try again.';
      toast.error(message);
      console.error('Register error:', err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 register-form">
        <header className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl dark:text-card-foreground">
            Create Account
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm dark:text-muted-foreground">
            Fill in your details to get started
          </p>
        </header>

        <AuthInput
          label="First Name"
          placeholder="John"
          autoComplete="given-name"
          required
          error={errors.firstName?.message}
          {...register('firstName', {
            required: 'First name is required',
          })}
        />

        <AuthInput
          label="Last Name"
          placeholder="Doe"
          autoComplete="family-name"
          required
          error={errors.lastName?.message}
          {...register('lastName', {
            required: 'Last name is required',
          })}
        />

        {/* Email */}
        <AuthInput
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
          })}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="text-xs font-medium text-foreground dark:text-card-foreground"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className="h-11 w-full rounded-lg border border-[#E4E4E7] dark:border-border
                         bg-[#F5F5F7] dark:bg-input px-3 pr-10 text-sm text-foreground
                         dark:text-card-foreground placeholder:text-muted-foreground/70
                         dark:placeholder:text-muted-foreground focus:outline-none
                         focus:ring-2 focus:ring-main focus:border-transparent"
              autoComplete="new-password"
              aria-invalid={!!errors.password || undefined}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center rounded-full p-1.5
                         text-muted-foreground hover:bg-black/5 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6]
                         dark:text-muted-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground dark:text-muted-foreground">
            Must include 1 uppercase, 1 lowercase, and 1 number
          </p>

          {errors.password && (
            <p className="text-[11px] font-medium text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="register-confirm-password"
            className="text-xs font-medium text-foreground dark:text-card-foreground"
          >
            Re-enter Password
          </label>

          <div className="relative">
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="h-11 w-full rounded-lg border border-[#E4E4E7] dark:border-border
                         bg-[#F5F5F7] dark:bg-input px-3 pr-10 text-sm text-foreground
                         dark:text-card-foreground placeholder:text-muted-foreground/70
                         dark:placeholder:text-muted-foreground focus:outline-none
                         focus:ring-2 focus:ring-main focus:border-transparent"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword || undefined}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === passwordValue || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute cursor-pointer inset-y-0 right-2 flex items-center rounded-full p-1.5
                         text-muted-foreground hover:bg-black/5 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6]
                         dark:text-muted-foreground"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-[11px] font-medium text-red-500" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 cursor-pointer h-11 w-full rounded-full bg-main text-sm font-semibold
                     text-white shadow-[0_6px_18px_rgba(124,58,237,0.45)] transition hover:bg-main-hover
                     disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Signing up…' : 'Sign Up'}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground dark:text-muted-foreground">
          <span className="h-px flex-1 bg-[#E4E4E7] dark:bg-border" />
          <span className="font-semibold tracking-wide">ALREADY HAVE AN ACCOUNT?</span>
          <span className="h-px flex-1 bg-[#E4E4E7] dark:bg-border" />
        </div>

        <Link
          href={`/${lang}/auth/login`}
          className="h-11 w-full rounded-full border border-[#E4E4E7] dark:border-border
                     bg-white dark:bg-card text-center text-sm font-semibold
                     text-foreground dark:text-card-foreground
                     hover:bg-[#F5F5F7] dark:hover:bg-card transition inline-flex
                     items-center justify-center"
        >
          Login
        </Link>
      </form>
    </>
  );
}
