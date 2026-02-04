'use client';

import dynamic from 'next/dynamic';
import HistoryListSkeleton from '../HistoryList/HistoryListSkeleton';
import type { HistoryItem } from '@/types/history';

const HistoryList = dynamic<{ initialItems: HistoryItem[] }>(
  () => import('../HistoryList/HistoryList').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <HistoryListSkeleton />,
  }
);

export default function HistorySection({ items }: { items: HistoryItem[] }) {
  return <HistoryList initialItems={items} />;
}
