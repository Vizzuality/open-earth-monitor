'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import { navLinks } from './constants';

const MainMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="flex h-full justify-between" data-testid="main-navigation">
      {navLinks.map((link) => {
        const isActive = `/${pathname.split('/')[1]}` === link.href;
        return (
          <Link
            className={cn(
              'flex h-full min-w-[180px] items-center justify-center border-l border-r border-secondary-900 text-center font-satoshi font-bold text-secondary-500 transition-colors hover:bg-secondary-900',
              {
                'bg-secondary-500 text-brand-500 hover:text-secondary-500': isActive,
              }
            )}
            href={link.href}
            key={link.name}
            data-testid={link['data-testid']}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainMenu;
