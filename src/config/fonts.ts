import { Montserrat, Dela_Gothic_One as DelaGothic } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const delaGothic = DelaGothic({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-delaGothic",
});
