import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        delaGothic: ["var(--font-delaGothic)", "sans-serif"],
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#e4e4e7",
            primary: {
              50: "#ffe9dd",
              100: "#ffc5af",
              200: "#ffa17e",
              300: "#ff7b4c",
              400: "#ff571a",
              500: "#e63d00",
              600: "#b42f00",
              700: "#812000",
              800: "#4f1100",
              900: "#210300",

              foreground: "#e4e4e7",
              DEFAULT: "#e63d00",
            },
          },
        },
        dark: {
          colors: {
            background: "#0d0d11",
            primary: {
              50: "#210300",
              100: "#4f1100",
              200: "#812000",
              300: "#b42f00",
              400: "#e63d00",
              500: "#ff571a",
              600: "#ff7b4c",
              700: "#ffa17e",
              800: "#ffc5af",
              900: "#ffe9dd",

              foreground: "#0d0d11",
              DEFAULT: "#e63d00",
            },
          },
        },
      },
    }),
  ],
} satisfies Config;
