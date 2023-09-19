export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type NavLink = {
  title: string;
  href: string;
  icon: string;
  isActive: boolean;
};

export type MainNavItem = NavItem;

export type MainNavLink = NavLink;

export type StaticConfig = {
  mainNav: MainNavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: MainNavLink[];
};

export type ToastTheme = "dark" | "light" | "system" | undefined;
