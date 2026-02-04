import { Metadata } from 'next';
import PricingFullPage from './PricingFullPage';

export const metadata: Metadata = {
  title: 'IMAGINO - Pricing',
  description: 'Explore Our Packages!',
};

export default function PricingPage() {
  return <PricingFullPage />;
}
