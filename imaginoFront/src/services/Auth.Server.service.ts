'use server';

import { cookies } from 'next/headers';
import { clearServerCookies, setServerCookies } from '@/services/ServerCookies.service';
import { resShape } from '@/utils/fetchApi';
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { decodeJwtPayload } from '@/utils/JWT';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export async function loginAction(credentials: {
  email: string;
  password: string;
}): Promise<resShape> {
  const URL = `${baseUrl.replace(/\/$/, '')}/auth/login`;

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credentials),
      cache: 'no-cache',
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON login response:', {
        url: URL,
        status: res.status,
        body: text,
      });

      return {
        status: res.status,
        message: 'Unexpected response from server',
        errMsg: 'Unexpected response from server',
        errors: {},
        data: { accessToken: '', refreshToken: '' },
      };
    }

    const data = await res.json();

    const accessToken =
      data?.result?.accessToken ??
      data?.data?.accessToken ??
      data?.accessToken ??
      data?.token ??
      '';

    const refreshToken =
      data?.result?.refreshToken ?? data?.data?.refreshToken ?? data?.refreshToken ?? '';

    if (res.ok && accessToken && refreshToken) {
      await setServerCookies(accessToken, refreshToken);
    }

    return {
      status: res.status,
      message: data?.message ?? '',
      errMsg: data?.errMsg ?? '',
      errors: data?.errors ?? {},
      data: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error('loginAction error:', error);
    return {
      status: 500,
      message: 'Failed to login. Please try again later.',
      errMsg: 'Failed to login. Please try again later.',
      errors: {},
      data: { accessToken: '', refreshToken: '' },
    };
  }
}

export async function logoutAction() {
  await clearServerCookies();
}

export interface User {
  name: string;
  email: string;
  fullName: string;
  exp: number;
}

export type AuthState = {
  isAuthenticated: boolean;
  user?: User | null;
};

async function callRefreshTokenApi(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const url = `${baseUrl.replace(/\/$/, '')}/auth/refresh-token`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `hamada ${refreshToken}`, // <<<<<< important line
    },
    cache: 'no-cache',
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    console.error('Non-JSON refresh-token response:', {
      url,
      status: res.status,
      body: text,
    });
    return null;
  }

  const data = await res.json();

  const newAccessToken =
    data?.result?.accessToken ?? data?.data?.accessToken ?? data?.accessToken ?? data?.token ?? '';

  const newRefreshToken =
    data?.result?.refreshToken ?? data?.data?.refreshToken ?? data?.refreshToken ?? refreshToken;

  if (!res.ok || !newAccessToken) return null;

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function refreshTokensFromCookie(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value || '';

  if (!refreshToken) return null;

  const refreshed = await callRefreshTokenApi(refreshToken);

  if (!refreshed) {
    await clearServerCookies();
    return null;
  }

  await setServerCookies(refreshed.accessToken, refreshed.refreshToken);

  return refreshed;
}

export async function getAuthState(): Promise<AuthState> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_KEY)?.value || '';
  const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_KEY)?.value || '';

  if (!accessToken || !refreshToken) {
    return { isAuthenticated: false };
  }

  const payload = decodeJwtPayload<User>(accessToken);
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const exp = payload?.exp as number | undefined;

  if (!exp) {
    return { isAuthenticated: true, user: payload };
  }

  const skew = 30;
  const isExpired = exp <= nowInSeconds + skew;

  if (!isExpired) {
    return { isAuthenticated: true, user: payload };
  }

  const refreshed = await refreshTokensFromCookie();

  if (!refreshed) {
    await clearServerCookies();
    return { isAuthenticated: false };
  }

  const newPayload = decodeJwtPayload<User>(refreshed.accessToken);

  return {
    isAuthenticated: true,
    user: newPayload,
  };
}

export async function registerAction(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<resShape> {
  const URL = `${baseUrl.replace(/\/$/, '')}/auth/register`;

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-cache',
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON register response:', {
        url: URL,
        status: res.status,
        body: text,
      });

      return {
        status: res.status,
        message: 'Unexpected response from server',
        errMsg: 'Unexpected response from server',
        errors: {},
        data: { accessToken: '', refreshToken: '' },
      };
    }

    const data = await res.json();

    const accessToken = data?.result?.accessToken ?? '';
    const refreshToken = data?.result?.refreshToken ?? '';

    if (res.ok && accessToken && refreshToken) {
      await setServerCookies(accessToken, refreshToken);
    }

    return {
      status: data?.status ?? res.status,
      message: data?.message ?? '',
      errMsg: data?.errMsg ?? '',
      errors: data?.errors ?? {},
      data: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error('registerAction error:', error);
    return {
      status: 500,
      message: 'Failed to register. Please try again later.',
      errMsg: 'Failed to register. Please try again later.',
      errors: {},
      data: { accessToken: '', refreshToken: '' },
    };
  }
}
