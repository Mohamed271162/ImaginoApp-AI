'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react';

export default function ThemeDropdown({ mobile = false }: { mobile?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onScroll = () => setOpen(false);

    window.addEventListener('click', close);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const options = [
    { name: 'Light', icon: <Sun className="h-4 w-4" />, value: 'light' },
    { name: 'Dark', icon: <Moon className="h-4 w-4" />, value: 'dark' },
    { name: 'System', icon: <Laptop className="h-4 w-4" />, value: 'system' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={`flex items-center gap-1 px-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
          mobile ? 'w-full justify-center' : ''
        }`}
        aria-label="Theme menu"
      >
        {theme === 'system' ? (
          <Laptop className="h-4 w-4" />
        ) : theme === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        {!mobile && <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className={`absolute ${
            mobile ? 'top-full mt-2 -left-15' : 'right-0 mt-2'
          } z-50 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl min-w-[130px]`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm whitespace-nowrap hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => {
                setTheme(opt.value as 'light' | 'dark' | 'system');
                setOpen(false);
              }}
            >
              {opt.icon}
              {opt.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
