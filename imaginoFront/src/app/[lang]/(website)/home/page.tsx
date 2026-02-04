import { Metadata } from 'next';
import HomeFullPage from './HomeFullPage';

export const metadata: Metadata = {
  title: 'IMAGINO - Home',
  description: 'Your Best Images Editor!',
};

export default function HomePage() {
  return <HomeFullPage />;
}
