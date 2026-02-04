'use client';

import { useRouteLang } from '@/hooks/useLang';
import { forgotPassword } from '@/services/Auth.service';
import { setCookie } from '@/services/ClientCookies.service';
import { RESET_EMAIL_COOKIE_KEY } from '@/utils/Cookies.keys';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { AuthInput } from '../Fields/AuthInput';

interface ForgotPasswordValues {
  email: string;
}

export function ForgotPasswordForm() {
  const lang = useRouteLang();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const { ok } = await forgotPassword(values.email);

    if (!ok) return;

    setCookie(RESET_EMAIL_COOKIE_KEY, values.email, 1);
    router.push(`/${lang}/auth/reset-password`);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Forgot Password</h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Enter your email to receive a verification code
          </p>
        </header>

        <div className="mt-2 space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 cursor-pointer w-full rounded-full bg-main text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.45)] transition hover:bg-main-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Sending…' : 'Send code'}
          </button>
        </div>

        <div className="mt-4">
          <Link
            href={`/${lang}/auth/login`}
            className="h-11 w-full rounded-full border bg-white text-center text-sm font-semibold text-foreground hover:bg-[#F5F5F7] transition inline-flex items-center justify-center dark:bg-card dark:border-border dark:text-card-foreground dark:hover:bg-card"
          >
            Back to login
          </Link>
        </div>
      </form>
    </>
  );
}
