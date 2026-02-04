'use server';
import { PROFILE } from '@/app/[lang]/dashboard/profile/page';
import { getServerCookies, setServerCookies } from '@/services/ServerCookies.service';
import { REFRESH_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';

const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL as string;

// ========================= Main Function =========================

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: FetchServerDataOptions = {},
  tags: string[] = []
): Promise<T> {
  const URL = buildUrl(endpoint);

  const apiOptions: FetchServerDataOptions = {
    cache: 'force-cache',
    next: {
      revalidate: 1,
      tags: tags,
    },
    ...options,
  };

  const baseHeaders = new Headers(apiOptions.headers || {});

  const doFetch = async (authTokenOverride?: string) => {
    const mergedHeaders = new Headers(baseHeaders);
    if (authTokenOverride) {
      mergedHeaders.set('Authorization', `hamada ${authTokenOverride}`);
    }

    const res = await fetch(URL, { ...apiOptions, headers: mergedHeaders });
    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      // keep json as null if parsing fails
    }
    return { res, json };
  };

  try {
    const { res, json } = await doFetch();
    console.log('fetchApi response: 🎉🎉', { url: URL, status: res.status, body: json });
    if (res.ok) return json as T;

    // Attempt refresh on JWT expiry and retry once.
    if (isJwtExpiredResponse(res.status, json)) {
      try {
        const newAccessToken = await refreshAccessToken();
        console.log('Token refreshed successfully. 🚀🚀', newAccessToken);
        const retry = await doFetch(newAccessToken);
        if (retry.res.ok) return retry.json as T;
      } catch (refreshErr) {
        console.error('Token refresh failed:', refreshErr);
      }

      // If we got here, it was truly auth-expired and refresh failed.
      const authError = new Error('AUTH_EXPIRED') as Error & { status?: number; body?: unknown };
      authError.status = res.status;
      authError.body = json;
      throw authError;
    }

    // Non-auth errors propagate with status/body for caller-specific handling.
    const apiError = new Error('API_ERROR') as Error & { status?: number; body?: unknown };
    apiError.status = res.status;
    apiError.body = json;
    throw apiError;
  } catch (error) {
    console.error('fetchApi error:❌', error);
    throw error;
  }
}

// ========================= Helper Functions =========================

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getServerCookies(REFRESH_TOKEN_COOKIE_KEY);
  if (!refreshToken) {
    throw new Error('REFRESH_TOKEN_MISSING');
  }

  const refreshUrl = `${baseUrl.replace(/\/$/, '')}/auth/refresh-token`;
  const res = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      Authorization: `hamada ${refreshToken}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('REFRESH_TOKEN_FAILED');
  }

  const json: RefreshResponse = await res.json();
  const accessToken = json?.result?.accessToken;
  if (!accessToken) {
    throw new Error('REFRESH_TOKEN_FAILED');
  }

  // Persist new access token while keeping existing refresh token.
  await setServerCookies(accessToken, refreshToken);
  return accessToken;
}

function buildUrl(endpoint: string) {
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
  }
  return `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
}

function isJwtExpiredResponse(status: number, body: unknown) {
  if (status === 401) return true;
  if (body && typeof body === 'object' && 'errMsg' in body) {
    const errMsg = (body as { errMsg?: unknown }).errMsg;
    if (typeof errMsg === 'string') {
      console.log('Error message from API:🧧🧧', errMsg, '🧧🧧');
      return (
        errMsg.toLowerCase().includes('jwt expired') ||
        errMsg.toLowerCase().includes('invalid authorization')
      );
    }
  }
  return false;
}

// ========================= Types Definitions =========================

interface FetchServerDataOptions extends RequestInit {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

type RefreshResponse = {
  message?: string;
  status?: number;
  result?: { accessToken?: string; refreshToken?: string };
  errMsg?: string;
};

export interface resShape {
  message: string;
  data: { accessToken: string; refreshToken: string };
  status: number;
  errors: { [key: string]: string };
  errMsg: string;
  result?: {
    imageUrl?: string;
    profileImage?: string;
    profileImageUrl?: string;
    user?: PROFILE;
  };
}
