import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "sonner";

import { montserrat, delaGothic } from "@/config/fonts";
import Head from "next/head";
import Loader from "@/components/Loader";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

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
            {loading ? (
              <div className="grid h-screen w-screen place-items-center">
                <Loader size="lg" color="primary" />
              </div>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
