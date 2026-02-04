'use client';

import { fetchApi, resShape } from '@/utils/fetchApi';
import { handleApiResponse } from '@/utils/RequestHelpers';
import { toast } from 'sonner';

export async function forgotPassword(email: string) {
  try {
    const response = await fetchApi<resShape>('auth/forget-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-cache',
    });

    const ok = handleApiResponse(response, {
      successMessage: 'Verification code sent to your email!',
    });


    return { ok, response };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong! Please try again.';

    toast.error(message);
    console.error('Forgot password error:', err);

    return { ok: false as const, response: null as unknown as resShape };
  }
}

export async function confirmEmailForReset(params: { code: string; email?: string }) {
  const { code, email } = params;

  try {
    const response = await fetchApi<resShape>('auth/confirm-email', {
      method: 'POST',
      body: JSON.stringify({
        firstOtp: code,
        email,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-cache',
    });

    const ok = handleApiResponse(response, {
      successMessage: 'Code verified successfully!',
    });


    return { ok, response };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong! Please try again.';

    toast.error(message);
    console.error('Confirm email (reset) error:', err);

    return { ok: false as const, response: null as unknown as resShape };
  }
}

export async function resendEmailOtp(email: string) {
  try {
    const response = await fetchApi<resShape>('auth/resend-email-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-cache',
    });

    const ok = handleApiResponse(response, {
      successMessage: 'Verification code resent to your email!',
    });


    return { ok, response };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong! Please try again.';

    toast.error(message);
    console.error('Resend OTP error:', err);

    return { ok: false as const, response: null as unknown as resShape };
  }
}

export async function resetPassword(params: { email: string; otp: string; newPassword: string }) {
  const { email, otp, newPassword } = params;

  try {
    const response = await fetchApi<resShape>('auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ email, otp, newPassword }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      cache: 'no-cache',
    });

    const ok = handleApiResponse(response, {
      successMessage: 'Password updated successfully!',
    });

    return { ok, response };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong! Please try again.';
    toast.error(message);
    console.error('Reset password error:', err);
    return { ok: false as const, response: null as unknown as resShape };
  }
}
