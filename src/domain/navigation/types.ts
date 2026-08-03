export interface NavLink {
  label: string;
  href: string;
}

export interface NavProps {
  logo?: string;
  links?: NavLink[];
  ctaText?: string;
  ctaLink?: string;
}
