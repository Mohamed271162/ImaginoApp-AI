'use server';
import { redirect } from 'next/navigation';
import { fetchApi } from '@/utils/fetchApi';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { defaultLang } from '@/i18n/settings';

import type {
  BackgroundsForImageResponse,
  EnhancedImageResponse,
  BlurredImageResponse,
  ImageResponse,
  ImageDocument,
  NewAngleImageResponse,
  ResizedImageResponse,
  NewBackgroundImageResponse,
  SelectedBackgroundImageResponse,
} from '@/types/images';
import type { GetAllImagesResponse, GetUserImagesResponse } from '@/types/images';

import { RemoveBgHistoryItem } from '@/types/removeBgHistory';

import type {
  SuitableBackgroundHistoryItem,
  SuitableBackgroundJobStatus,
} from '@/types/suitableBgHistory';
import { ChangeStyleHistoryItem } from '@/types/changeStyleAnimeHistory';
import { ExtractTextHistoryItem } from '@/types/extractTextFromBgHistory';
import { RecognizeItemsHistoryItem } from '@/types/RecognizeItemsHistory';

const ENHANCE_ENDPOINT = 'image/gen-inhanced-quality-img';
const NEW_DIMENSION_ENDPOINT = 'image/gen-img-with-new-dimension';
const GET_IMAGE_ENDPOINT = 'image/get-image';
const GET_BACKGROUND_VERSIONS_ENDPOINT = 'image/get-last-background-versions';
const BLUR_REGION_ENDPOINT = 'image/blur-image-region';
const RESIZE_IMAGE_ENDPOINT = 'image/gen-resize-img';
const NEW_BACKGROUND_ENDPOINT = 'image/gen-img-with-new-background';
const SELECTED_BACKGROUND_ENDPOINT = 'image/gen-img-with-selected-background';
const GET_USER_IMAGES_ENDPOINT = 'user/get-user-gallery';
const GET_ALL_IMAGES_ENDPOINT = 'image/getall';
const LOGIN_PATH_ON_AUTH_EXPIRED = `/${defaultLang}/auth/login?authExpired=1`;

function redirectOnAuthExpired(error: unknown) {
  if (
    error instanceof Error &&
    (error.message === 'AUTH_EXPIRED' || error.message === 'Invalid authorization')
  ) {
    console.warn('error msg', error.message, 'redirecting to login...');
    redirect(LOGIN_PATH_ON_AUTH_EXPIRED);
  }
}

export async function inhanceImageQuality(file: File): Promise<EnhancedImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const formData = new FormData();
  formData.append('image', file);
  try {
    const response = await fetchApi<EnhancedImageResponse>(ENHANCE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Enhance Image Quality API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Enhance Image Quality API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function genImageWithNewDimension(
  file: File,
  angle: string | number
): Promise<NewAngleImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const formData = new FormData();
  formData.append('image', file);
  formData.append('angle', String(angle));
  try {
    const response = await fetchApi<NewAngleImageResponse>(NEW_DIMENSION_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Gen Img with New-dimension API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Gen Img with New-dimension API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function getImage(imageId: string): Promise<ImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  try {
    const response = await fetchApi<ImageResponse>(
      `${GET_IMAGE_ENDPOINT}?imageId=${encodeURIComponent(imageId)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `hamada ${token || ''}`,
        },
        cache: 'no-cache',
      }
    );

    console.log('Get Image API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Get Image API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function getBackgroundVersions(
  imageId: string,
  options: { page?: number; size?: number } = {}
): Promise<BackgroundsForImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const params = new URLSearchParams();
  if (typeof options.page !== 'undefined') params.set('page', String(options.page));
  if (typeof options.size !== 'undefined') params.set('size', String(options.size));

  const queryString = params.toString();
  const endpoint = `${GET_BACKGROUND_VERSIONS_ENDPOINT}/${imageId}${
    queryString ? `?${queryString}` : ''
  }`;
  try {
    const response = await fetchApi<BackgroundsForImageResponse>(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Background Versions API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Background Versions API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function blurRegion(params: {
  file?: File;
  imageId?: string;
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  blurRadius?: number | string;
}): Promise<BlurredImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { file, imageId, x, y, width, height, blurRadius } = params;

  if (!file && !imageId) {
    throw new Error('Provide either a file or an imageId to blur.');
  }

  const formData = new FormData();
  if (file) formData.append('image', file);
  if (imageId) formData.append('imageId', imageId);
  formData.append('x', String(x));
  formData.append('y', String(y));
  formData.append('width', String(width));
  formData.append('height', String(height));
  if (typeof blurRadius !== 'undefined') {
    formData.append('blurRadius', String(blurRadius));
  }
  try {
    const response = await fetchApi<BlurredImageResponse>(BLUR_REGION_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Blur Region API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Blur Region API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function resizeImage(params: {
  file?: File;
  imageId?: string;
  width?: number | string;
  height?: number | string;
  fit?: string;
  background?: string;
  format?: string;
  quality?: number | string;
  allowUpscale?: boolean | string;
  position?: string;
}): Promise<ResizedImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { file, imageId, width, height, fit, background, format, quality, allowUpscale, position } =
    params;

  if (!file && !imageId) {
    throw new Error('Provide either a file or an imageId to resize.');
  }

  if (typeof width === 'undefined' && typeof height === 'undefined') {
    throw new Error('Provide at least one dimension: width or height.');
  }

  const formData = new FormData();
  if (file) formData.append('image', file);
  if (imageId) formData.append('imageId', imageId);
  if (typeof width !== 'undefined') formData.append('width', String(width));
  if (typeof height !== 'undefined') formData.append('height', String(height));
  if (typeof fit !== 'undefined') formData.append('fit', fit);
  if (typeof background !== 'undefined') formData.append('background', background);
  if (typeof format !== 'undefined') formData.append('format', format);
  if (typeof quality !== 'undefined') formData.append('quality', String(quality));
  if (typeof allowUpscale !== 'undefined') formData.append('allowUpscale', String(allowUpscale));
  if (typeof position !== 'undefined') formData.append('position', position);
  try {
    const response = await fetchApi<ResizedImageResponse>(RESIZE_IMAGE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Resize Image API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Resize Image API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function genImgWithNewBackground(params: {
  imageId: string;
  prompt?: string;
  negativePrompt?: string;
  stylePreset?: string;
  seed?: number | string;
  width?: number | string;
  height?: number | string;
}): Promise<NewBackgroundImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { imageId, prompt, negativePrompt, stylePreset, seed, width, height } = params;
  const payload: Record<string, unknown> = { imageId };
  console.log('imageId in genImgWithNewBackground:👉👉', imageId);
  if (typeof prompt !== 'undefined') payload.prompt = prompt;
  if (typeof negativePrompt !== 'undefined') payload.negativePrompt = negativePrompt;
  if (typeof stylePreset !== 'undefined') payload.stylePreset = stylePreset;
  if (typeof seed !== 'undefined') payload.seed = seed;
  if (typeof width !== 'undefined') payload.width = width;
  if (typeof height !== 'undefined') payload.height = height;
  try {
    const response = await fetchApi<NewBackgroundImageResponse>(NEW_BACKGROUND_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Gen Img with New-background API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Gen Img with New-background API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function genImgWithSelectedBackground(params: {
  productImageId: string;
  backgroundImageId?: string;
  backgroundImageFile?: File;
}): Promise<SelectedBackgroundImageResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { productImageId, backgroundImageId, backgroundImageFile } = params;

  if (!productImageId) {
    throw new Error('productImageId is required.');
  }

  if (!backgroundImageId && !backgroundImageFile) {
    throw new Error('Provide backgroundImageId or backgroundImageFile.');
  }

  const formData = new FormData();
  formData.append('productImageId', productImageId);
  if (backgroundImageId) formData.append('backgroundImageId', backgroundImageId);
  if (backgroundImageFile) formData.append('backgroundImage', backgroundImageFile);
  try {
    const response = await fetchApi<SelectedBackgroundImageResponse>(SELECTED_BACKGROUND_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      cache: 'no-cache',
    });

    console.log('Image with Selected-background API full response:👉👉', response);
    return response;
  } catch (error) {
    console.error('Error in Image with Selected-background API:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

// ---------------------- Ashraf ---------------------

type UploadImageNoBgResponse = {
  message: string;
  status: number;
  result: {
    _id: string;
    url: string;
    storageKey: string;
    aiEdits?: {
      operation: string;
      provider: string;
      timestamp: string;
      processingTime: number;
      cost: number;
      _id: string;
      id: string;
    }[];
  };
};

type SuitableBackgroundApiResponse = {
  message: string;
  status: number;
  errMsg?: string;
  errors?: Record<string, string>;
  result?: {
    sourceImage: {
      _id: string;
      url: string;
      // ...other fields as needed
    };
    backgroundImage: {
      _id: string;
      url: string;
      createdAt: string;
      status?: string;
      aiEdits?: { timestamp: string }[];
      // ...other fields as needed
    };
  };
};

type ExtractTextResponse = {
  message: string;
  status: number;
  result: {
    text: {
      containsText: boolean;
      extractedText: string;
    };
  };
};

export type RecognizeItemsResponse = {
  message: string;
  status: number;
  result: {
    text: {
      items: {
        item_name: string;
        category: string;
        count: number;
        description: string;
      }[];
      total_items_detected: number;
    };
  };
};

export async function mapApiToRemoveBgHistoryItem(
  data: UploadImageNoBgResponse['result']
): Promise<RemoveBgHistoryItem> {
  return {
    id: data._id,
    type: 'remove-bg',
    status: 'done',
    createdAt: new Date().toISOString(),
    imageSrc: data.url,
    originalImageSrc: data.url,
    enhancedImageSrc: data.url,
    storageKey: data.storageKey,
    tags: data.aiEdits?.map((edit) => edit.operation) ?? [],
    provider: data.aiEdits?.[0]?.provider || 'custom',
  };
}

export async function mapApiToSuitableBackgroundHistoryItem(
  result: SuitableBackgroundApiResponse['result']
): Promise<SuitableBackgroundHistoryItem> {
  return {
    id: result?.backgroundImage?._id || '',
    type: 'suitable-bg',
    status: (result?.backgroundImage?.status as SuitableBackgroundJobStatus) || 'done',
    createdAt:
      result?.backgroundImage?.aiEdits?.[0]?.timestamp ||
      result?.backgroundImage?.createdAt ||
      new Date().toISOString(),
    imageSrc: result?.backgroundImage?.url || '',
    sourceImageSrc: result?.sourceImage?.url || '',
  };
}

export async function mapApiToChangeStyleHistoryItem(data: {
  original: ImageDocument;
  enhanced: ImageDocument;
}): Promise<ChangeStyleHistoryItem> {
  return {
    id: data.enhanced._id || (data.enhanced as unknown as { id?: string }).id || '',
    type: 'change-style',
    status: 'done',
    createdAt: data.enhanced.createdAt || new Date().toISOString(),
    originalImageSrc: data.original.url,
    enhancedImageSrc: data.enhanced.url,
    storageKey: data.enhanced.storageKey,
    version: data.enhanced.version,
    provider: data.enhanced.aiEdits?.[0]?.provider,
    tags: data.enhanced.tags,
  };
}

export async function mapApiToExtractTextHistoryItem(
  data: ExtractTextResponse['result']
): Promise<ExtractTextHistoryItem> {
  return {
    id: Date.now().toString(),
    text: data.text.extractedText,
    createdAt: new Date().toISOString(),
  };
}

export async function mapApiToRecognizeItemsHistoryItem(
  data: RecognizeItemsResponse['result']['text']
): Promise<RecognizeItemsHistoryItem> {
  return {
    id: new Date().getTime().toString(),
    items: data.items,
    totalItemsDetected: data.total_items_detected,
    createdAt: new Date().toISOString(),
  };
}

export async function getImageWithoutBackground(formData: FormData): Promise<RemoveBgHistoryItem> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  try {
    const json = await fetchApi<UploadImageNoBgResponse>('image/gen-img-without-background', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      body: formData,
    });

    if (!json.result) {
      throw new Error('No result returned from remove-bg API');
    }

    console.log('Remove-bg API result:👉👉', json);
    return mapApiToRemoveBgHistoryItem(json.result);
  } catch (error) {
    console.error('Remove-bg API error:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function genSuitableBackgroundById(
  imageId: string
): Promise<SuitableBackgroundHistoryItem> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  try {
    const json = await fetchApi<SuitableBackgroundApiResponse>('image/gen-suitable-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      body: JSON.stringify({ imageId }),
    });

    if (!json.result) {
      throw new Error('No result returned from suitable-background API');
    }
    console.log('Suitable-background API full response:👉👉', json);
    return mapApiToSuitableBackgroundHistoryItem(json.result);
  } catch (error) {
    console.error('Suitable-background API error:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function changeImageStyle(file: File, style: string): Promise<ChangeStyleHistoryItem> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const fd = new FormData();
  fd.append('image', file);
  fd.append('style', style);

  try {
    const json = await fetchApi<{ result: { original: ImageDocument; enhanced: ImageDocument } }>(
      'image/gen-change-image-style',
      {
        method: 'POST',
        headers: {
          Authorization: `hamada ${token || ''}`,
          Accept: 'application/json',
        },
        body: fd,
      }
    );

    if (!json.result) {
      console.error('Change Style API result empty:', json);
      throw new Error('No result returned from Change Style API');
    }
    console.log('Change Style API full response:👉👉', json);
    return mapApiToChangeStyleHistoryItem(json.result);
  } catch (error) {
    console.error('Change Style API error:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function extractTextFromImage(params: {
  file?: File;
  imageId?: string;
}): Promise<ExtractTextHistoryItem> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { file, imageId } = params;

  if (!file && !imageId) {
    throw new Error('Provide an image file or imageId');
  }

  const formData = new FormData();
  if (file) formData.append('image', file);
  if (imageId) formData.append('imageId', imageId);

  try {
    const json = await fetchApi<ExtractTextResponse>('image/extract-text-from-img', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      body: formData,
    });

    console.log('Extract-text API full response:', json);

    if (!json.result?.text) {
      throw new Error('No text returned from extract-text API');
    }
    console.log('extract-text API text result:👉👉', json.result);
    return mapApiToExtractTextHistoryItem(json.result);
  } catch (error) {
    console.error('Extract-text API error:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function recognizeItemsInImage(params: {
  file?: File;
  imageId?: string;
}): Promise<RecognizeItemsHistoryItem> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);
  const { file, imageId } = params;

  if (!file && !imageId) {
    throw new Error('Provide an image file or imageId');
  }

  const formData = new FormData();
  if (file) formData.append('image', file);
  if (imageId) formData.append('imageId', imageId);

  try {
    const json = await fetchApi<RecognizeItemsResponse>('image/recognize-items-in-img', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `hamada ${token || ''}`,
      },
      body: formData,
    });

    console.log('Recognance Items API full ( fulld response:', json);

    if (!json.result?.text?.items) {
      throw new Error('No items returned from recognize-items API');
    }

    console.log('recognize-items API text result:👉👉', json.result);
    return mapApiToRecognizeItemsHistoryItem(json.result.text);
  } catch (error) {
    console.error('Recognize-items API error:❌❌', error);
    redirectOnAuthExpired(error);
    throw error;
  }
}

export async function getUserImages(
  options: { page?: number; size?: number } = {}
): Promise<GetUserImagesResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const params = new URLSearchParams();
  if (typeof options.page !== 'undefined') params.set('page', String(options.page));
  if (typeof options.size !== 'undefined') params.set('size', String(options.size));

  const endpoint = params.toString()
    ? `${GET_USER_IMAGES_ENDPOINT}?${params.toString()}`
    : GET_USER_IMAGES_ENDPOINT;

  const response = await fetchApi<GetUserImagesResponse>(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `hamada ${token || ''}`,
    },
    cache: 'no-cache',
  });

  return response;
}

export async function getAllImages(
  options: {
    page?: number;
    size?: number;
    isPublic?: boolean;
    category?: string;
    tags?: string;
  } = {}
): Promise<GetAllImagesResponse> {
  const token = await getServerCookies(ACCESS_TOKEN_COOKIE_KEY);

  const params = new URLSearchParams();
  if (typeof options.page !== 'undefined') params.set('page', String(options.page));
  if (typeof options.size !== 'undefined') params.set('size', String(options.size));
  if (typeof options.isPublic !== 'undefined') params.set('isPublic', String(options.isPublic));
  if (options.category) params.set('category', options.category);
  if (options.tags) params.set('tags', options.tags);

  const endpoint = params.toString()
    ? `${GET_ALL_IMAGES_ENDPOINT}?${params.toString()}`
    : GET_ALL_IMAGES_ENDPOINT;

  const response = await fetchApi<GetAllImagesResponse>(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `hamada ${token || ''}`,
    },
    cache: 'no-cache',
  });

  return response;
}
