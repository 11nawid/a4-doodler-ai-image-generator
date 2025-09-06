
'use client';

import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, BotMessageSquare, Brush, Download, Info, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { Separator } from './ui/separator';

const NAV_ITEMS = [
  { href: '/doodler', label: 'A4 Doodler', icon: Brush },
  { href: '/restore', label: 'AI Generator', icon: BotMessageSquare },
];

const SECONDARY_NAV_ITEMS = [
  { href: '/about', label: 'About', icon: Info },
  { href: '/help', label: 'Help & FAQ', icon: LifeBuoy },
]

interface AppNavbarProps {
    children?: ReactNode;
}

const AppNavbar: FC<AppNavbarProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isInstallable, promptInstall } = usePWAInstall();

  const isHomePage = pathname === '/';

  const NavLink = ({ href, label, icon: Icon, className }: { href: string; label: string; icon: React.ElementType; className?: string }) => (
    <Link href={href} passHref>
      <Button
        variant={pathname === href ? 'secondary' : 'ghost'}
        className={cn('w-full justify-start gap-4 px-3 py-5 text-base', className)}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center md:hidden">
          {!isHomePage && (
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-[80vw] max-w-xs flex-col p-4">
                  <SheetHeader className="mb-4 border-b pb-4 text-left">
                      <SheetTitle>
                          <Link
                              href="/"
                              className="flex items-center gap-2"
                              onClick={() => setIsMobileMenuOpen(false)}
                          >
                              <Brush className="h-6 w-6 text-primary" />
                              <span className="font-bold">Doodler App</span>
                          </Link>
                      </SheetTitle>
                  </SheetHeader>
                <nav className="flex flex-1 flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                      <NavLink key={item.href} {...item} />
                  ))}
                  <Separator className="my-2" />
                  {SECONDARY_NAV_ITEMS.map((item) => (
                    <NavLink key={item.href} {...item} />
                  ))}
                  {isInstallable && (
                    <>
                     <Separator className="my-2" />
                     <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 px-3 py-5 text-base"
                        onClick={promptInstall}
                      >
                        <Download className="h-5 w-5" />
                        Install App
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Brush className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Doodler App</span>
          </Link>
          {!isHomePage && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {NAV_ITEMS.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                          "transition-colors hover:text-foreground/80",
                          pathname === item.href ? "text-foreground" : "text-foreground/60"
                      )}
                  >
                      {item.label}
                  </Link>
              ))}
            </nav>
          )}
        </div>
        
        <div className="flex flex-1 items-center justify-center md:hidden">
             <Link href="/" className="flex items-center space-x-2">
                 <Brush className="h-6 w-6 text-primary" />
                <span className="font-bold">Doodler App</span>
            </Link>
        </div>


        <div className="flex items-center justify-end space-x-2">
            {!isHomePage && (
              <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                          "transition-colors hover:text-foreground/80",
                          pathname === item.href ? "text-foreground" : "text-foreground/60"
                      )}
                  >
                      {item.label}
                  </Link>
                ))}
              </nav>
            )}
            {children}
        </div>
      </div>
    </header>
  );
}
export default AppNavbar;
