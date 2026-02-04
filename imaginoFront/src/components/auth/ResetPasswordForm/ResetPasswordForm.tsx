'use client';

import { useRouteLang } from '@/hooks/useLang';
import { resetPassword } from '@/services/Auth.service';
import { getCookie, removeCookie } from '@/services/ClientCookies.service';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY, RESET_EMAIL_COOKIE_KEY } from '@/utils/Cookies.keys';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface ResetPasswordValues {
  otp: string;
  password: string;
  confirm: string;
}

export function ResetPasswordForm({ defEmail }: { defEmail?: string }) {
  const lang = useRouteLang();
  const pathname = usePathname();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    defaultValues: {
      otp: '',
      password: '',
      confirm: '',
    },
  });

  const passwordValue = useWatch({ control, name: 'password' });
  const email = defEmail ? defEmail : getCookie(RESET_EMAIL_COOKIE_KEY);

  async function onSubmit(values: ResetPasswordValues) {
    if (!email) {
      toast.error('Reset session expired. Please request a new reset link.');
      router.push(`/${lang}/auth/change-password`);
      return;
    }

    const { ok } = await resetPassword({
      email,
      otp: values.otp,
      newPassword: values.password,
    });

    if (!ok) return;

    removeCookie(RESET_EMAIL_COOKIE_KEY);
    if (await getServerCookies(ACCESS_TOKEN_COOKIE_KEY)) router.push(`/${lang}/dashboard/profile`);
    else router.push(`/${lang}/auth/login`);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Reset Password</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Enter the code sent to your email and choose a new password
          </p>
        </header>

        <div className="mt-2 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reset-email"
              className="text-xs font-medium text-foreground dark:text-card-foreground"
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              value={email || ''}
              disabled
              className="h-11 w-full rounded-lg border px-3 text-sm
                       bg-[#F5F5F7] border-[#E4E4E7] text-foreground
                       dark:bg-input dark:border-border dark:text-card-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reset-otp"
              className="text-xs font-medium text-foreground dark:text-card-foreground"
            >
              Verification code (OTP)
            </label>
            <input
              id="reset-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="h-11 w-full rounded-lg border px-3 text-sm tracking-[0.4em]
                       bg-[#F5F5F7] border-[#E4E4E7] text-foreground placeholder:text-muted-foreground/70
                       focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent
                       dark:bg-input dark:border-border dark:text-card-foreground dark:placeholder:text-muted-foreground"
              aria-invalid={!!errors.otp || undefined}
              {...register('otp', {
                required: 'Code is required',
                minLength: { value: 6, message: 'Code must be 6 digits' },
                maxLength: { value: 6, message: 'Code must be 6 digits' },
              })}
            />
            {errors.otp && (
              <p className="text-[11px] font-medium text-red-500" role="alert">
                {errors.otp.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reset-password"
              className="text-xs font-medium text-foreground dark:text-card-foreground"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 characters"
                className="h-11 w-full rounded-lg border px-3 pr-10 text-sm
                         bg-[#F5F5F7] border-[#E4E4E7] text-foreground placeholder:text-muted-foreground/70
                         focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent
                         dark:bg-input dark:border-border dark:text-card-foreground dark:placeholder:text-muted-foreground"
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

          <div className="space-y-1.5">
            <label
              htmlFor="reset-confirm-password"
              className="text-xs font-medium text-foreground dark:text-card-foreground"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                className="h-11 w-full rounded-lg border px-3 pr-10 text-sm
                         bg-[#F5F5F7] border-[#E4E4E7] text-foreground placeholder:text-muted-foreground/70
                         focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent
                         dark:bg-input dark:border-border dark:text-card-foreground dark:placeholder:text-muted-foreground"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm || undefined}
                {...register('confirm', {
                  required: 'Please confirm your password',
                  validate: (value) => value === passwordValue || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute inset-y-0 right-2 flex items-center rounded-full p-1.5 text-muted-foreground hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#8b5cf6] dark:text-muted-foreground"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirm && (
              <p className="text-[11px] font-medium text-red-500" role="alert">
                {errors.confirm.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 cursor-pointer h-11 w-full rounded-full bg-main text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.45)] transition hover:bg-main-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </button>
        </div>

        {!pathname.includes('/dashboard') && (
          <div className="mt-4">
            <Link
              href={`/${lang}/auth/login`}
              className="h-11 w-full rounded-full border bg-white text-center text-sm font-semibold text-foreground hover:bg-[#F5F5F7] transition inline-flex items-center justify-center dark:bg-card dark:border-border dark:text-card-foreground dark:hover:bg-card"
            >
              Back to login
            </Link>
          </div>
        )}
      </form>
    </>
  );
}
