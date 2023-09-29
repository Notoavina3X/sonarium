import { type Prisma } from "@prisma/client";

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

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  isFollowing: boolean;
};

export type Post = {
  id: string;
  sharedPost?: {
    id: string;
    description: string | null;
    tags: string[];
    track: Prisma.JsonValue;
    createdAt: Date;
    user: User;
  } | null;
  description: string | null;
  tags: string[];
  track: Prisma.JsonValue;
  createdAt: Date;
  user: User;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  commentCount: number;
  sharedCount: number;
  bookmarkCount: number;
};

export type SharedPost = {
  id: string;
  description: string | null;
  tags?: string[];
  track: Prisma.JsonValue;
  createdAt: Date;
  user: User;
};

export type Comment = {
  id: string;
  userId: string;
  postId: string;
  parentId: string | null;
  content: string;
  tags: string[];
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    username: string | null;
  };
  isLiked: boolean;
  likeCount: number;
  repliesCount: number;
};

export type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  isFollowing: boolean;
};

export type Notif = {
  message: string;
  id: string;
  createdAt: Date;
  author: {
    username: string | null;
    image: string | null;
  } | null;
  content: {
    id: string;
    type: string;
    postId: string;
  };
  isRead: boolean;
};
