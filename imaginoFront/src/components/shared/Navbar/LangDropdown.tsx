'use client';

import { languages } from '@/i18n/settings';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function LangDropdown({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((lng) => pathname.startsWith(`/${lng.code}`))?.code || 'en';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleScroll = () => setOpen(false);

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const changeLang = (newLang: string) => {
    if (newLang === currentLang) return setOpen(false);

    const pathWithoutLang = pathname.replace(/^\/(en|ar)/, '');
    router.push(`/${newLang}${pathWithoutLang}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Language selector"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          mobile ? 'w-full justify-center' : ''
        }`}
      >
        <span className="uppercase font-medium text-sm">{currentLang}</span>
        {!mobile && <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className={`absolute ${
            mobile ? 'top-full -left-10 mt-2' : 'right-0 mt-2'
          } z-50 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl min-w-[120px]`}
        >
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLang(lng.code)}
              className={`w-full px-4 py-2 text-left text-sm whitespace-nowrap hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                currentLang === lng.code
                  ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {lng.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
