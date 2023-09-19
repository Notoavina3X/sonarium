import { atom } from "jotai";

export type TrackSelected = {
  id: string;
  image: string;
  title: string;
  titleLowercase: string;
  authorId?: string;
  author: string;
  url: string;
  source: "spotify" | "youtube";
} | null;

export const trackSelectedAtom = atom<TrackSelected>(null);
