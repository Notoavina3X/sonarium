import { useTheme } from "next-themes";
import React from "react";
import { type ToastTheme } from "@/types";

function useToastTheme() {
  const [toastTheme, setToastTheme] = React.useState<ToastTheme>("system");
  const { theme } = useTheme();

  React.useEffect(() => {
    switch (theme) {
      case "system":
        setToastTheme("system");
        break;
      case "dark":
        setToastTheme("dark");
        break;
      case "light":
        setToastTheme("light");
        break;
      default:
        setToastTheme("system");
        break;
    }
  }, [theme]);

  return { toastTheme };
}

export default useToastTheme;
