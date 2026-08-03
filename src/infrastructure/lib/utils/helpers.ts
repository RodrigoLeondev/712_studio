export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function scrollToSection(href: string): void {
  const id = href.replace('#', '');
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: 'smooth' });
}

export function formatPrice(price: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}
