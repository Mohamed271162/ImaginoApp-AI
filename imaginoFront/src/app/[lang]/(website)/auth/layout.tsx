'use client';

import Loader from '@/components/shared/Loader/Loader';
import { useRouteLang } from '@/hooks/useLang';
import { useAuthStore } from '@/store/authStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthRootLayout({ children }: AuthLayoutProps) {
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

  return (
    <div
      className="min-h-screen w-full px-4 py-6 flex items-center justify-center"
      style={{ backgroundImage: 'url(/assets/auth/auth_bg.webp)' }}
    >
      <section
        aria-label="Authentication"
        className="
          w-full max-w-md rounded-3xl
          shadow-[0_18px_45px_rgba(15,23,42,0.18)]
          px-6 py-8
          bg-white sm:px-8 sm:py-10
          dark:bg-[color:var(--card)] dark:text-[color:var(--card-foreground)]
        "
      >
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            aria-label="Back to home page"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-main hover:underline transition-all duration-200 dark:text-[color:var(--muted-foreground)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {children}
      </section>
    </div>
  );
}
