'use client';

import '@/app/globals.css';
import AppInit from '@/components/shared/AppInit/AppInit';
import Footer from '@/components/shared/Footer/Footer';
import Navbar from '@/components/shared/Navbar/Navbar';
import { useRouteLang } from '@/hooks/useLang';
import { languages } from '@/i18n/settings';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { useEffect, useMemo, useState } from 'react';

export default function LangLayout({ children }: { children: React.ReactNode }) {
  const lang = useRouteLang();
  const router = useRouter();
  const [isValidLang, setIsValidLang] = useState(true);
  const isSupportedLang = useMemo(() => languages.some((l) => l.code === lang), [lang]);

  useEffect(() => {
    if (!isSupportedLang) {
      setIsValidLang(false);
      router.replace('/en');
    } else {
      setIsValidLang(true);
    }
  }, [isSupportedLang, router]);

  return (
    <>
      <AppInit />
      <Toaster position="top-center" closeButton richColors toastOptions={{ duration: 4000 }} />
      <Navbar />

      {isValidLang ? (
        <main lang={lang} className={`flex-1`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          {children}
        </main>
      ) : null}
      <Footer />
    </>
  );
}
