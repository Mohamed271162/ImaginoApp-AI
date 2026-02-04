'use client';

import { useRouteLang } from '@/hooks/useLang';
import { confirmEmailForReset, resendEmailOtp } from '@/services/Auth.service';
import { getCookie } from '@/services/ClientCookies.service';
import { RESET_EMAIL_COOKIE_KEY } from '@/utils/Cookies.keys';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface VerifyEmailValues {
  firstOtp: string;
}

export function VerifyEmailForResetForm() {
  const lang = useRouteLang();
  const router = useRouter();
  const email = getCookie(RESET_EMAIL_COOKIE_KEY);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailValues>({
    defaultValues: { firstOtp: '' },
  });

  async function onSubmit(values: VerifyEmailValues) {
    if (!email) {
      toast.error('Email not found. Please restart the reset process.');
      router.push(`/${lang}/auth/forgot-password`);
      return;
    }

    const { ok } = await confirmEmailForReset({
      code: values.firstOtp,
      email,
    });

    if (!ok) return;

    router.push(`/${lang}/auth/reset-password`);
  }

  async function handleResend() {
    if (!email) {
      toast.error('Email not found. Please restart the reset process.');
      router.push(`/${lang}/auth/forgot-password`);
      return;
    }

    const { ok } = await resendEmailOtp(email);

    if (!ok) return;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Verify Email</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Enter the code sent to your email
          </p>
        </header>

        <div className="mt-2 space-y-4">
          <div
            className="rounded-2xl px-4 py-5 text-center text-xs sm:text-sm
                        bg-[#F5F5F7] text-muted-foreground
                        dark:bg-card dark:text-card-foreground dark:border dark:border-border"
          >
            <p>We&apos;ve sent a 6-digit code to</p>
            <p className="mt-1 font-semibold text-foreground dark:text-card-foreground">
              {email || 'email-name@gmail.com'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="reset-verification-code"
              className="text-xs font-medium text-foreground dark:text-card-foreground"
            >
              Verification code
            </label>
            <input
              id="reset-verification-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="h-11 w-full rounded-lg border px-3 text-center text-sm tracking-[0.4em]
                       bg-[#F5F5F7] border-[#E4E4E7] text-foreground placeholder:text-muted-foreground/70
                       focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent
                       dark:bg-input dark:border-border dark:text-card-foreground dark:placeholder:text-muted-foreground"
              aria-invalid={!!errors.firstOtp || undefined}
              {...register('firstOtp', {
                required: 'Code is required',
                minLength: { value: 6, message: 'Code must be 6 digits' },
                maxLength: { value: 6, message: 'Code must be 6 digits' },
              })}
            />
            {errors.firstOtp && (
              <p className="text-[11px] font-medium text-red-500" role="alert">
                {errors.firstOtp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 cursor-pointer w-full rounded-full bg-main text-sm font-semibold text-white
                     shadow-[0_6px_18px_rgba(124,58,237,0.45)] transition hover:bg-main-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Verifying…' : 'Verify'}
          </button>

          <button
            type="button"
            onClick={handleResend}
            className="mt-1 cursor-pointer text-center text-xs font-semibold text-foreground hover:underline dark:text-card-foreground"
          >
            Resend OTP
          </button>
        </div>

        <div className="mt-4">
          <Link
            href={`/${lang}/auth/login`}
            className="h-11 w-full rounded-full border bg-white text-center text-sm font-semibold text-foreground
                     hover:bg-[#F5F5F7] transition inline-flex items-center justify-center
                     dark:bg-card dark:border-border dark:text-card-foreground dark:hover:bg-card"
          >
            Back to login
          </Link>
        </div>
      </form>
    </>
  );
}
