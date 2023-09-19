import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Sonarium",
  description: "Social Media to share, discuss about music and mood",
  links: {
    twitter: "https://twitter.com/NotoavinaRz",
    github: "https://github.com/Notoavina3X",
  },
  mainNav: [
    {
      title: "For you",
      href: "/",
      icon: "feed",
      isActive: false,
    },
    {
      title: "Following",
      href: "/following",
      icon: "users-group-rounded",
      isActive: false,
    },
    {
      title: "Explore",
      href: "/explore",
      icon: "compass",
      isActive: false,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: "bell",
      isActive: false,
    },
    {
      title: "Favoris",
      href: "/favoris",
      icon: "star",
      isActive: false,
    },
    {
      title: "Settings & Support",
      href: "/settings",
      icon: "settings-minimalistic",
      isActive: false,
    },
  ],
};
