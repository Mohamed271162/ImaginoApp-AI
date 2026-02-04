'use client';

import { useRouteLang } from '@/hooks/useLang';
import { loginAction } from '@/services/Auth.Server.service';
import { useAuthStore } from '@/store/authStore';
import { handleApiResponse } from '@/utils/RequestHelpers';
import { Eye, EyeOff, LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {  toast } from 'sonner';

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  authExpired?: boolean;
}

export default function LoginForm({ authExpired }: LoginFormProps) {
  const lang = useRouteLang();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = useWatch({ control, name: 'email' });
  const isDisabled = isSubmitting || !emailValue;

  useEffect(() => {
    if (authExpired) {
      toast.error('Your session expired. Please log in again.');
    }
  }, [authExpired]);

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await loginAction(values);

      const ok = handleApiResponse(response, {
        successMessage: 'Login successful!',
      });

      if (!ok) return;
      useAuthStore.getState().refreshAuth();
      router.push(`/${lang}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong! Please try again.';
      toast.error(message);
      console.error('Login error:', err);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-sm login-form">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold text-foreground dark:text-card-foreground">
            Log in or sign up
          </h1>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground">
            Generate 40 images for free every month!
          </p>
        </header>

        <div className="flex items-center gap-3 text-muted-foreground dark:text-muted-foreground">
          <span className="h-px flex-1 bg-[#E4E4E7] dark:bg-border" />
          <span>or</span>
          <span className="h-px flex-1 bg-[#E4E4E7] dark:bg-border" />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="text-xs font-medium text-foreground dark:text-card-foreground"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="user@example.com"
            className="email-input h-11 w-full rounded-md border border-[#E4E4E7] dark:border-border
                       bg-white dark:bg-input px-3 text-sm text-foreground dark:text-card-foreground
                       placeholder:text-muted-foreground/70 dark:placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email', {
              required: 'Please enter your email',
            })}
          />
          {errors.email && (
            <p id="login-email-error" className="text-[11px] font-medium text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="loginpassword"
            className="text-xs font-medium text-foreground dark:text-card-foreground"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="loginpassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              className="h-11 w-full rounded-lg border px-3 pr-10 text-sm
                         bg-[#F5F5F7] border-[#E4E4E7] text-foreground placeholder:text-muted-foreground/70
                         focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent
                         dark:bg-input dark:border-border dark:text-card-foreground dark:placeholder:text-muted-foreground"
              autoComplete="current-password"
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
              onClick={() => setShowPassword((p) => !p)}
              className="absolute inset-y-0 right-2 flex items-center rounded-full p-1.5 text-muted-foreground hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6] dark:text-muted-foreground"
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
            Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number
          </p>
          {errors.password && (
            <p className="text-[11px] font-medium text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="-mt-2 text-right">
          <Link
            href={`/${lang}/auth/forgot-password`}
            className="text-[11px] font-semibold text-primary hover:underline dark:text-main"
          >
            Forget Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="submit-btn mt-1 h-11 w-full cursor-pointer rounded-md bg-main sm:text-lg font-semibold text-white transition shadow-sm hover:bg-main-hover
                     disabled:bg-[#E4E4E7] dark:disabled:bg-border disabled:text-[#A1A1AA] disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-[#E4E4E7]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              Login
              <LoaderIcon />
            </span>
          ) : (
            'Login'
          )}
        </button>

        <Link
          href={`/${lang}/auth/register`}
          className="signup-link h-11 w-full rounded-md border border-[#E4E4E7] dark:border-border
                     bg-white dark:bg-card text-center text-sm font-semibold text-foreground dark:text-card-foreground
                     hover:bg-[#eee] dark:hover:bg-card transition inline-flex items-center justify-center"
        >
          Sign Up
        </Link>

        {/* ... terms & policy text as before ... */}
      </form>
    </>
  );
}
