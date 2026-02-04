'use client';

import { DashboardLayoutShell } from '@/components/dashboard/DashboardLayoutShell/DashboardLayoutShell';
import { useRouteLang } from '@/hooks/useLang';
import { useAuthStore } from '@/store/authStore';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const lang = useRouteLang();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/${lang}/dashboard/profile`);
    }
  }, [isAuthenticated, lang, router]);

  if (loading) {
    return <Loader />;
  }

  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
