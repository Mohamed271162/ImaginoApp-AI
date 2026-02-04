'use client';

import {
  deleteProfileImageAction,
  uploadProfileImageAction,
} from '@/services/ProfileActions.service';
import { ClientProfile } from '@/store/profileStore';
import type { resShape } from '@/utils/fetchApi';
import { handleApiResponse } from '@/utils/RequestHelpers';
import Image from 'next/image';
import { useRef, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';

type Props = {
  profile: ClientProfile;
  onProfileImageChange: (url: string | null) => void;
};

export default function ProfileImageSection({ profile, onProfileImageChange }: Props) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const profileImageUrl = profile?.profileImage?.secure_url ?? null;

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousUrl = profile?.profileImage?.secure_url ?? null;
    const tempUrl = URL.createObjectURL(file);

    onProfileImageChange(tempUrl);

    try {
      setIsUploadingImage(true);

      const response = await uploadProfileImageAction(file);

      const ok = handleApiResponse(response, {
        successMessage: 'Profile image updated!',
      });

      if (!ok) {
        onProfileImageChange(previousUrl);
        return;
      }

      const newUrl =
        response.result?.profileImage ?? response.result?.imageUrl ?? previousUrl ?? tempUrl;

      onProfileImageChange(newUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to upload image. Please try again.';
      toast.error(message);
      console.error('Upload profile image error:', err);
      onProfileImageChange(previousUrl);
    } finally {
      setIsUploadingImage(false);
      URL.revokeObjectURL(tempUrl);
      e.target.value = '';
    }
  };

  const handleDeleteImage = async () => {
    if (!profileImageUrl) return;

    const previousUrl = profileImageUrl;
    onProfileImageChange(null);

    try {
      setIsDeletingImage(true);

      const response = (await deleteProfileImageAction()) as resShape;

      const ok = handleApiResponse(response, {
        successMessage: 'Profile image deleted!',
      });

      if (!ok) {
        onProfileImageChange(previousUrl as string);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete image. Please try again.';
      toast.error(message);
      console.error('Delete profile image error:', err);
      onProfileImageChange(previousUrl as string);
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="h-20 w-20 rounded-full overflow-hidden border flex-shrink-0"
        style={{
          borderColor: 'var(--border)',
          background: 'color-mix(in srgb, var(--card) 96%, transparent)',
        }}
      >
        {profileImageUrl ? (
          <Image
            width={100}
            height={100}
            src={profileImageUrl as string}
            alt="Profile"
            loading="eager"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-[color:var(--muted-foreground)]">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleTriggerFileInput}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition"
            style={{
              border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--card) 100%, transparent)',
              color: 'var(--card-foreground)',
            }}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? 'Uploading...' : 'Upload Image'}
          </button>

          <button
            type="button"
            onClick={handleDeleteImage}
            className="rounded-md px-3 py-1.5 text-xs font-medium transition"
            style={{
              border: '1px solid var(--border)',
              background: 'color-mix(in srgb, var(--card) 100%, transparent)',
              color: 'var(--card-foreground)',
            }}
            disabled={isDeletingImage || !profileImageUrl}
          >
            {isDeletingImage ? 'Deleting...' : 'Delete Image'}
          </button>
        </div>

        <p className="text-[10px] text-[color:var(--muted-foreground)]">
          Upload a square image (JPG, PNG, GIF).
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
    </div>
  );
}
