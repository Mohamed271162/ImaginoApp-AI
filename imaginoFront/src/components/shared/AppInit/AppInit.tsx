'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function AppInit() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
