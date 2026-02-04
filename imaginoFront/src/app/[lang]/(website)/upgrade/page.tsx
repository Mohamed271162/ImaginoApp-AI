import { Metadata } from 'next';
import PricingPage from '../pricing/page';

export const metadata: Metadata = {
  title: 'IMAGINO - Upgrade Plan',
  description: 'Upgrade Your Plan Now!',
};
export default function UpgradePage() {
  return <PricingPage />;
}
