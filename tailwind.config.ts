import { type Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
// import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons"

export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    nextui(),
    // iconsPlugin({
    //   // Select the icon collections you want to use
    //   collections: getIconCollections(["mdi", "lucide"]),
    // }),
  ],
} satisfies Config;
