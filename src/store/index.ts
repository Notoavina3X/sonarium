import type { Comment, Post, SharedPost } from "@/types";
import { atom } from "jotai";
import { Key } from "react";

export const isModalOpenAtom = atom<boolean>(false);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const tracklistAtom = atom<any[]>([]);

export type TrackSelected = {
  id: string;
  image: string;
  title: string;
  titleLowercase: string;
  authorId: string;
  author: string;
  url: string;
  source: "spotify" | "youtube";
} | null;

export const trackSelectedAtom = atom<TrackSelected>(null);

export type sharingPost = {
  postSelected: SharedPost | undefined;
  isSharing: boolean;
};

export const sharingPostAtom = atom<sharingPost>({
  postSelected: undefined,
  isSharing: false,
});

export type updatePost = {
  postSelected: Post | undefined;
  isUpdating: boolean;
};

export const updatePostAtom = atom<updatePost>({
  postSelected: undefined,
  isUpdating: false,
});

export type CommentPost = {
  postSelected: SharedPost | undefined;
  isCommenting: boolean;
};

export const commentAtom = atom<CommentPost>({
  postSelected: undefined,
  isCommenting: false,
});

export const unreadAtom = atom<number>(0);

export type DeleteAtom = {
  type: "post" | "comment" | undefined;
  instance: Post | Comment | undefined;
  isDeleting: boolean;
};

export const deleteAtom = atom<DeleteAtom>({
  type: undefined,
  instance: undefined,
  isDeleting: false,
});

export const exploreQueryAtom = atom<string>("");
export const toQueryAtom = atom<string | undefined>(undefined);
export const exploreTabAtom = atom<Key>("default");

export const isEditingAtom = atom<boolean>(false);
