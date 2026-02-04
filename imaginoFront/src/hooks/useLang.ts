'use client';

import { useParams } from 'next/navigation';

export function useRouteLang(defaultLang: string = 'en') {
  
  const params = useParams<{ lang?: string }>();

  const paramLang =
    typeof params?.lang === 'string' && params.lang.length > 0 ? params.lang : undefined;

  return paramLang ?? defaultLang;
}
