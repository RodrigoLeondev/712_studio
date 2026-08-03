import { useEffect, useState } from 'react';
import type { NavProps } from '@/domain/navigation/types';
import { NAV_LINKS } from '@/infrastructure/lib/constants';
import { cn, scrollToSection } from '@/infrastructure/lib/utils/helpers';

const defaultLinks = NAV_LINKS.map((link) => ({ ...link }));

export default function Nav({
  logo = '712',
  links = defaultLinks,
  ctaText = 'Contact',
  ctaLink = '#contact',
}: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The whole nav stays hidden until the hero logo scrolls out of view, so the
  // logo "hands off" from the hero into the nav.
  useEffect(() => {
    const heroLogo = document.querySelector('[data-hero-logo]');
    if (!heroLogo) {
      setShowNav(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(heroLogo);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-dark/70 backdrop-blur-md shadow-lg' : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Desktop — convergence on scroll */}
        <div className="hidden w-full items-center justify-center md:flex">
          <a
            href="#hero"
            className={cn(
              'shrink-0 transition-all duration-500',
              showNav ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none',
            )}
            aria-hidden={!showNav}
            tabIndex={showNav ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
          >
            <img src="/images/Logo_SieteDoce.svg" alt={logo} className="h-8 w-auto" />
          </a>

          {/* Spacer 1: between logo and links — shrinks on scroll */}
          <div
            className={cn(
              'transition-[flex-grow] duration-[3500ms] ease-in-out min-w-[1.5rem]',
              isScrolled ? 'grow-0' : 'grow', 
            )}
          />

          <ul className="flex items-center gap-12 shrink-0">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors hover:text-accent',
                    'text-light/80',
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Spacer 2: between links and CTA — shrinks on scroll */}
          <div
            className={cn(
              'transition-[flex-grow] duration-[2500ms] ease-in-out min-w-[1.5rem]',
              isScrolled ? 'grow-0' : 'grow',
            )}
          />

          <a
            href={ctaLink}
            className={cn(
              'shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-all duration-500 hover:bg-accent/90',
              showNav ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none',
            )}
            aria-hidden={!showNav}
            tabIndex={showNav ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(ctaLink);
            }}
          >
            {ctaText}
          </a>
        </div>

        {/* Mobile */}
        <div className="flex w-full items-center justify-between md:hidden">
          <a
            href="#hero"
            className={cn(
              'shrink-0 transition-all duration-500',
              showNav ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none',
            )}
            aria-hidden={!showNav}
            tabIndex={showNav ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
          >
            <img src="/images/Logo_SieteDoce.svg" alt={logo} className="h-8 w-auto" />
          </a>

          <button
            type="button"
            className="flex flex-col gap-1.5"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={cn('block h-0.5 w-6 bg-white transition', isMenuOpen && 'translate-y-2 rotate-45')} />
            <span className={cn('block h-0.5 w-6 bg-white transition', isMenuOpen && 'opacity-0')} />
            <span className={cn('block h-0.5 w-6 bg-white transition', isMenuOpen && '-translate-y-2 -rotate-45')} />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-light/10 bg-dark/95 px-4 py-6 md:hidden">
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-light/80 hover:text-accent"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={ctaLink}
                className="inline-block rounded-full bg-accent px-5 py-2 text-sm text-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(ctaLink);
                }}
              >
                {ctaText}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
