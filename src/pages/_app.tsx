import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "sonner";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system">
          <Toaster richColors />
          <Component {...pageProps} />
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
