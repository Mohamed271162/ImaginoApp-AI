import ProfileSection from '@/components/dashboard/ProfileSection/ProfileSection';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { fetchApi, resShape } from '@/utils/fetchApi';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IMAGINO - Profile Page',
};

export interface PROFILE {
  avaliableCredits: number;
  createdAt: string;
  email: string;
  emailConfirmed: string;
  emailOtp: {
    otp: string;
    expiredAt: string;
  };
  firstName: string;
  fullName: string;
  gender: string;
  id: string;
  is2FAActive: false;
  isActive: true;
  lastName: string;
  password: string;
  passwordOtp: {
    otp: string;
    expiredAt: string;
  };
  pricingPlan: string;
  role: string;
  updatedAt: string;
  _id: string;
  phone?: string;
  age?: number | null;
  profileImage?: {
    secure_url?: string;
  };
}

export default async function page() {
  const response = await fetchApi<resShape>(`user/user-profile`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `hamada ${await getServerCookies(ACCESS_TOKEN_COOKIE_KEY)}`,
    },
  });

  const user = response?.result?.user ? response?.result?.user : ({} as PROFILE);

  return <ProfileSection profile={user} />;
}
