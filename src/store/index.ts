import type { SharedPost } from "@/types";
import { atom } from "jotai";

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
