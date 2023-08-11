export type SiteConfig = {
  name: string;
  description: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type StaticConfig = {
  mainNav: MainNavItem[];
};
