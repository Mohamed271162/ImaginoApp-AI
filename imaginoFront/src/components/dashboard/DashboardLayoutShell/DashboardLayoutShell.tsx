'use client';

import { useRouteLang } from '@/hooks/useLang';
import clsx from 'clsx';
import { History, LifeBuoy, User } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';
import DashboardNavbar from '../DashboardNavbar/DashboardNavbar';
import { NavLink } from '../DashboardSidebar/DashboardSidebar';
import DashboardSidebarSkeleton from '../DashboardSidebar/DashboardSidebarSkeleton';
const DashboardSidebar = dynamic(() => import('../DashboardSidebar/DashboardSidebar'), {
  ssr: false,
  loading: () => <DashboardSidebarSkeleton />,
});

interface DashboardLayoutShellProps {
  children: ReactNode;
}

export function DashboardLayoutShell({ children }: DashboardLayoutShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const lang = useRouteLang();

  const navItems: NavLink[] = [
    { href: `/${lang}/dashboard/profile`, label: 'Profile', icon: User },
    { href: `/${lang}/dashboard/history`, label: 'History', icon: History },
    {
      href: `/${lang}/dashboard/help-support`,
      label: 'Help & Support',
      icon: LifeBuoy,
    },
  ];

  return (
    <div
      className={clsx(
        'flex min-h-screen',
        'bg-[color:var(--background)]',
        'text-[color:var(--foreground)]'
      )}
    >
      <div
        className={clsx('hidden lg:block transition-all duration-300', collapsed ? 'w-20' : 'w-64')}
      >
        <DashboardSidebar navItems={navItems} collapsed={collapsed} />
      </div>

      <div
        className={clsx(
          'fixed inset-0 z-50 lg:hidden transition-opacity duration-200',
          mobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'color-mix(in srgb, #000 30%, transparent)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />

        <div
          className={clsx(
            'absolute left-0 top-0 h-screen w-64 transform transition-transform duration-300',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <DashboardSidebar
            navItems={navItems}
            collapsed={false}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <DashboardNavbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />
        <section className="flex-1 px-4 py-6 lg:px-8" style={{ color: 'var(--foreground)' }}>
          {children}
        </section>
      </div>
    </div>
  );
}
