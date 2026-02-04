import HistorySection from '@/components/dashboard/HistorySection/HistorySection';
import type { Metadata } from 'next';
import { getUserGallery } from '@/services/Gallery.service';
import type { HistoryItem } from '@/types/history';

export const metadata: Metadata = {
  title: 'IMAGINO - History',
};

export default async function page() {
  const items: HistoryItem[] = await getUserGallery();

  return <HistorySection items={items} />;
}
