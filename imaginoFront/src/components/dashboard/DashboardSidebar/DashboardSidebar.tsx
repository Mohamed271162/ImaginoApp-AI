'use client';

import { useProfileStore } from '@/store/profileStore';
import clsx from 'clsx';
import { LucideProps } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Activity,
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from 'react';

export interface NavLink {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}
interface DashboardSidebarProps {
  collapsed?: boolean;
  navItems: NavLink[];
  setCollapsed?: Dispatch<SetStateAction<boolean>>;
  onNavigate?: () => void;
}

export default function DashboardSidebar({
  collapsed = false,

  onNavigate,
  navItems,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const name = profile?.firstName + ' ' + profile?.lastName;
  const email = profile?.email;
  const image = profile?.profileImage?.secure_url;

  const handleItemClick = (href: string) => {
    router.push(href);
    if (onNavigate) onNavigate();
  };

  return (
    <aside
      className={clsx(
        'h-screen flex flex-col transition-[width] duration-300 shrink-0 border-e border-1',
        collapsed ? 'w-20' : 'w-64'
      )}
      style={{ minWidth: collapsed ? 80 : 256 }}
      aria-label="Dashboard sidebar"
    >
      <div
        className="flex flex-col items-center gap-3 py-6 px-3 border-b"
        style={{
          background: 'color-mix(in srgb, var(--card) 100%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className={clsx(
            'relative rounded-full overflow-hidden ring-1',
            collapsed ? 'w-10 h-10' : 'w-14 h-14'
          )}
          style={{ boxShadow: 'var(--sidebar-ring, none)' }}
        >
          <Image
            src={image ? image : '/assets/dashboard/profile.webp'}
            alt="Profile avatar"
            width={56}
            height={56}
            className="object-contain w-[56px] h-[56px]"
            loading="eager"
          />
        </div>

        {!collapsed && (
          <div className="text-center">
            <p
              style={{ color: 'var(--card-foreground)' }}
              className="text-sm font-semibold truncate"
            >
              <Activity>{name ? name : 'User Name'}</Activity>
            </p>
            <p style={{ color: 'var(--muted-foreground)' }} className="text-xs truncate">
              <Activity>{email ? email : 'user@email.com'}</Activity>
            </p>
          </div>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto px-2 py-4"
        style={{ background: 'var(--card)' }}
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname?.startsWith(item.href);

          return (
            <div key={item.href} className="relative my-1">
              <button
                onClick={() => handleItemClick(item.href)}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  'group relative cursor-pointer flex items-center w-full gap-3 rounded-md transition-colors duration-150 px-3 py-2 text-sm font-medium text-left focus:outline-none',
                  collapsed ? 'justify-center px-0' : ''
                )}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                style={{
                  background: active ? 'var(--main-color)' : 'transparent',
                  color: active
                    ? 'var(--primary-foreground, var(--foreground))'
                    : 'var(--foreground)',
                  borderColor: 'transparent',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item.href);
                  }
                }}
              >
                <span
                  className={clsx('flex items-center justify-center', collapsed ? 'w-full' : 'w-6')}
                  aria-hidden
                >
                  <Icon
                    className={clsx(
                      'h-5 w-5',
                      active
                        ? 'text-[color:var(--primary-foreground, var(--foreground))]'
                        : 'text-[color:var(--main-color)]'
                    )}
                    aria-hidden
                  />
                </span>

                {!collapsed && (
                  <span
                    className="truncate"
                    style={{
                      color: active
                        ? 'var(--primary-foreground, var(--foreground))'
                        : 'var(--foreground)',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
