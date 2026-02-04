'use client';

import { useRouteLang } from '@/hooks/useLang';
import { useAuthStore } from '@/store/authStore';
import { Menu, UserIcon, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Container from '../Container/Container';
// import LangDropdown from './LangDropdown';
import MobileNav from './MobileNav';
import { useTheme } from 'next-themes';

const ThemeDropdown = dynamic(() => import('./ThemeDropdown'), { ssr: false });

export default function Navbar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lang = useRouteLang();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  if (pathname.includes('/auth') || pathname.includes('/dashboard')) return null;

  const avatarInitials = (() => {
    const base =
      user?.fullName || user?.name || (user?.email ? user.email.split('@')[0] : '') || '';

    if (!base) return '';

    return base
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  })();

  const avatar = (
    <Link
      href={`/${lang}/dashboard/profile`}
      className="flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-xs font-semibold text-neutral-800 hover:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 h-8 w-8"
      aria-label="Profile"
    >
      {avatarInitials ? <span>{avatarInitials}</span> : <UserIcon className="h-4 w-4" />}
    </Link>
  );

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-white/80 backdrop-blur-md dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800">
        <Container>
          <nav className="flex items-center justify-between py-5">
            <Link href={`/${lang}`} className="flex items-center gap-2">
              <Image
                src={`/${theme === 'dark' ? 'logo-dark.png' : 'logo.png'}`}
                width={125}
                height={50}
                alt="Imagino Logo"
                className=" w-auto"
              />
              {/* <span className="font-semibold text-lg tracking-tight dark:text-white">Imagino</span> */}
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {/* <LangDropdown /> */}
              <ThemeDropdown />
              <Link href={`/${lang}/home`} className="hover:opacity-80 transition">
                Home
              </Link>
              <Link href={`/${lang}/blogs`} className="hover:opacity-80 transition">
                Blogs
              </Link>
              <Link href={`/${lang}/gallery`} className="hover:opacity-80 transition">
                Gallery
              </Link>
              <Link href={`/${lang}/faq`} className="hover:opacity-80 transition">
                FAQ
              </Link>
              {isAuth ? (
                <Link href={`/${lang}/upgrade`} className="hover:opacity-80 transition">
                  Upgrade
                </Link>
              ) : (
                <Link href={`/${lang}/pricing`} className="hover:opacity-80 transition">
                  Pricing
                </Link>
              )}
              {!isAuth && (
                <>
                  <Link href={`/${lang}/auth/login`} className="hover:opacity-80 transition">
                    Log in
                  </Link>

                  <Link
                    href={`/${lang}/auth/register`}
                    className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-semibold hover:bg-yellow-300 transition"
                  >
                    Get started
                  </Link>
                </>
              )}
              {isAuth && avatar}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              {/* <LangDropdown mobile /> */}
              <ThemeDropdown mobile />
              {isAuth && avatar}
              <button
                aria-label="Toggle menu"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav"
                className="p-2"
                onClick={() => setIsMobileOpen((prev) => !prev)}
              >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <MobileNav
        isAuth={isAuth}
        lang={lang}
        setIsMobileOpen={setIsMobileOpen}
        isMobileOpen={isMobileOpen}
      />
    </>
  );
}
