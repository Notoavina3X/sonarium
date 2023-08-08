import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "sonner";

import { montserrat, delaGothic } from "@/config/fonts";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Sonarium</title>
        <meta
          name="description"
          content="Sonarium, the social network to share, discuss about music and mood"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system">
          <main
            className={`${montserrat.variable} ${delaGothic.variable} font-sans antialiased`}
          >
            <Toaster richColors />
            <Component {...pageProps} />
          </main>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
