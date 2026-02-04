'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProfileInfoCardSkeleton from '../ProfileInfoCard/ProfileInfoCardSkeleton';
import type { PROFILE } from '@/app/[lang]/dashboard/profile/page';
import { useProfileStore } from '@/store/profileStore';

const ProfileInfoCard = dynamic(
  () => import('../ProfileInfoCard/ProfileInfoCard').then((mod) => mod.default),
  {
    loading: () => <ProfileInfoCardSkeleton />,
    ssr: false,
  }
);

export default function ProfileSection({ profile }: { profile: PROFILE }) {
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    setProfile(profile);
  }, [profile, setProfile]);

  return <ProfileInfoCard />;
}
