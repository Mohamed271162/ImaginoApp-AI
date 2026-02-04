'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Container from '../Container/Container';
import { useTheme } from 'next-themes';

export default function Footer() {
  const { theme } = useTheme();
  const pathname = usePathname();

  if (pathname.includes('/auth') || pathname.includes('/dashboard')) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
          <div>
            <Image
              width={100}
              height={50}
              src={`/${theme === 'dark' ? 'logo-dark.png' : 'logo.png'}`}
              alt="Imagino logo"
              className=" w-auto mb-4"
            />
            <p className="mt-4 text-neutral-500 dark:text-neutral-400 text-xs">
              Imagino Pte Ltd © {year}
            </p>
          </div>

          <FooterColumn title="Products" items={['Imagino', 'Imagino API']} />
          <FooterColumn
            title="Company"
            items={['TikTok', 'Instagram', 'Twitter', '小红书', 'Contact']}
          />
          <FooterColumn title="Resources" items={['FAQ', 'Blogs', 'Gallery', 'Privacy', 'Terms']} />
          <FooterColumn
            title="Product Categories"
            items={[
              'Skincare & beauty',
              'Beverage',
              'Candle',
              'Soap',
              'Furniture',
              'Jewelry',
              'Necklace',
              'Pet products',
              'Watches',
            ]}
          />
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-3 text-neutral-800 dark:text-neutral-200">{title}</h3>
      <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
        {items.map((item) => (
          <li key={item}>
            <Link
              href={`${item.toLowerCase()}`}
              className="hover:underline hover:text-neutral-800 dark:hover:text-white"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
