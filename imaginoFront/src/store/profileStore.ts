import { create } from 'zustand';
import type { PROFILE } from '@/app/[lang]/dashboard/profile/page';

export type ClientProfile = Omit<PROFILE, 'password' | 'passwordOtp' | 'emailOtp'>;

type BasicInfoUpdate = {
  fullName: string;
  phone?: string | null;
  age?: number | null;
  gender?: string | null;
};

interface ProfileState {
  profile: ClientProfile | null;
  isEditing: boolean;

  setProfile: (profile: ClientProfile | null) => void;
  startEditing: () => void;
  stopEditing: () => void;

  updateBasicInfo: (payload: BasicInfoUpdate) => void;
  setProfileImage: (url: string | null) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isEditing: false,

  setProfile: (profile) => set({ profile }),

  startEditing: () => set({ isEditing: true }),
  stopEditing: () => set({ isEditing: false }),

  updateBasicInfo: (payload) =>
    set((state) => {
      if (!state.profile) return state;

      const { fullName, phone, age, gender } = payload;

      return {
        profile: {
          ...state.profile,
          fullName,
          phone: phone ?? state.profile.phone,
          age: age ?? state.profile.age,
          gender: gender ?? state.profile.gender,
        },
      };
    }),

  setProfileImage: (url) =>
    set((state) => {
      if (!state.profile) return state;

      return {
        profile: {
          ...state.profile,
          profileImage: url ? { secure_url: url } : undefined,
        },
      };
    }),

  reset: () => set({ profile: null, isEditing: false }),
}));
