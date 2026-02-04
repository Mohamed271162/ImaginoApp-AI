'use server';

import { fetchApi } from '@/utils/fetchApi';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import type { HistoryItem, JobType, JobStatus } from '@/types/history';


type ApiGalleryItem = {
  _id: string;
  imageUrl: string;
  createdAt: string;
  type?: string;
  status?: string;
  inputNotes?: string;
  resultNotes?: string;
  variationCount?: number;
};

type GetUserGalleryResponse = {
  message: string;
  status: number;
  errMsg: string;
  errors: Record<string, string>;
  result?: {
    gallery?: ApiGalleryItem[];
  };
};

function mapApiToHistoryItem(item: ApiGalleryItem): HistoryItem {
  return {
    id: item._id,
    type: (item.type as JobType) || 'generate-bg',
    status: (item.status as JobStatus) || 'done',
    createdAt: item.createdAt,
    imageSrc: item.imageUrl,
    inputNotes: item.inputNotes,
    resultNotes: item.resultNotes,
    variationCount: item.variationCount,
  };
}

export async function getUserGallery(): Promise<HistoryItem[]> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const response = await fetchApi<GetUserGalleryResponse>('user/get-user-gallery', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `hamada ${token || ''}`,
    },
  });

  const gallery = response?.result?.gallery ?? [];
  return gallery.map(mapApiToHistoryItem);
}
