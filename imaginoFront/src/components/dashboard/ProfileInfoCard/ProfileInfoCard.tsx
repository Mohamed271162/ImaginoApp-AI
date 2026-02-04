'use client';

import { useProfileStore } from '@/store/profileStore';
import ProfileImageSection from './ProfileImageSection';
import ProfileInfoEditForm from './ProfileInfoEditForm';
import ProfileInfoView from './ProfileInfoView';

import { useRouteLang } from '@/hooks/useLang';
import { forgotPassword } from '@/services/Auth.service';
import { setCookie } from '@/services/ClientCookies.service';
import { RESET_EMAIL_COOKIE_KEY } from '@/utils/Cookies.keys';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileInfoCard() {
  const profile = useProfileStore((state) => state.profile);
  const isEditing = useProfileStore((state) => state.isEditing);
  const startEditing = useProfileStore((state) => state.startEditing);
  const stopEditing = useProfileStore((state) => state.stopEditing);
  const updateBasicInfo = useProfileStore((state) => state.updateBasicInfo);
  const setProfileImage = useProfileStore((state) => state.setProfileImage);
  const [loadingForgetPassword, setLoadingForgetPassword] = useState<boolean>(false);

  const lang = useRouteLang();
  const router = useRouter();

  if (!profile) {
    return null;
  }

  const handleEdit = () => startEditing();
  const handleCancel = () => stopEditing();

  const handleUpdated = (updated: {
    fullName: string;
    phone?: string | null;
    age?: number | null;
    gender?: string | null;
  }) => {
    updateBasicInfo(updated);
    stopEditing();
  };

  const handleProfileImageChange = (url: string | null) => {
    setProfileImage(url);
  };

  const handleChangePassword = async () => {
    toast.loading('Loading...');
    setLoadingForgetPassword(true);
    if (!profile.email) {
      toast.error('No email found for this profile.');
      return;
    }

    const { ok, response } = await forgotPassword(profile.email);

    if (!ok) {
      toast.dismiss();
      toast.error(response.errMsg || 'Something went wrong!');
      setLoadingForgetPassword(false);
      if (response.errMsg === 'Your OTP not expired yet') {
        setCookie(RESET_EMAIL_COOKIE_KEY, profile.email, 1);
        setLoadingForgetPassword(false);
        router.push(`/${lang}/dashboard/profile/reset-password`);
      }
      return;
    }

    setCookie(RESET_EMAIL_COOKIE_KEY, profile.email, 1);
    setLoadingForgetPassword(false);
    toast.dismiss();
    router.push(`/${lang}/dashboard/profile/reset-password`);
  };

  return (
    <section
      className="rounded-2xl p-5 shadow-sm"
      style={{
        background: 'var(--card)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="max-w-2xl mx-auto">
        <ProfileImageSection profile={profile} onProfileImageChange={handleProfileImageChange} />

        {isEditing ? (
          <ProfileInfoEditForm
            profile={profile}
            onCancel={handleCancel}
            onUpdated={handleUpdated}
          />
        ) : (
          <ProfileInfoView
            loadingForgetPassword={loadingForgetPassword}
            profile={profile}
            onEdit={handleEdit}
            onChangePassword={handleChangePassword}
          />
        )}
      </div>
    </section>
  );
}
