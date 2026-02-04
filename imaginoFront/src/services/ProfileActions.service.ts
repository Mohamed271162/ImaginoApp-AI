'use server';

import { refreshTokensFromCookie } from '@/services/Auth.Server.service';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { fetchApi, type resShape } from '@/utils/fetchApi';
import type { BasicInfoFormValues } from '@/validation/ProfileSchema';

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

async function authRequest(endpoint: string, options: FetchOptions): Promise<resShape> {
  const accessToken = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const headers: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `hamada ${accessToken || ''}`,
  };

  const res = await fetchApi<resShape>(endpoint, { ...options, headers });

  const isJwtExpired =
    (res.status === 401 || res.status === 403 || res.status === 500) &&
    typeof res.errMsg === 'string' &&
    res.errMsg.toLowerCase().includes('jwt expired');

  if (!isJwtExpired) {
    return res;
  }

  const refreshed = await refreshTokensFromCookie();

  if (!refreshed) {
    return res;
  }

  const retryHeaders: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `hamada ${refreshed.accessToken}`,
  };

  const retryRes = await fetchApi<resShape>(endpoint, {
    ...options,
    headers: retryHeaders,
  });

  return retryRes;
}

export async function updateBasicInfoAction(values: BasicInfoFormValues): Promise<resShape> {
  return authRequest('user/update-basic-info', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
    credentials: 'include',
  });
}

export async function uploadProfileImageAction(file: File): Promise<resShape> {
  const formData = new FormData();
  formData.append('profileImage', file);

  return authRequest('user/upload-profile-image', {
    method: 'PATCH',
    body: formData,
    headers: {
      Accept: 'application/json',
      Authorization: `hamada ${await getServerCookies(ACCESS_TOKEN_COOKIE_KEY)}`,
    },
    credentials: 'include',
  });
}

export async function deleteProfileImageAction(): Promise<resShape> {
  return authRequest('user/delete-profile-image', {
    method: 'DELETE',
    credentials: 'include',
  });
}
