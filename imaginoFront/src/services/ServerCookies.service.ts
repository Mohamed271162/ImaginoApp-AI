'use server';

import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { cookies } from 'next/headers';

export async function setServerCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === 'production';

  const accessTokenMaxAge = 60 * 60 * 24;
  const refreshTokenMaxAge = 60 * 60 * 24 * 30;

  cookieStore.set(ACCESS_TOKEN_COOKIE_KEY, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: accessTokenMaxAge,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: refreshTokenMaxAge,
  });
}

export async function getServerCookies(key: string): Promise<string | undefined> {
  const cookiesStore = await cookies();
  return cookiesStore.get(key)?.value;
}

export async function clearServerCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE_KEY);
  cookieStore.delete(REFRESH_TOKEN_COOKIE_KEY);
}
