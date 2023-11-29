import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import { Toaster } from "sonner";

import { montserrat, delaGothic } from "@/config/fonts";
import Head from "next/head";
import useToastTheme from "@/hooks/useToastTheme";
import { useRouter } from "next/router";
import Layout from "@/layouts/core/layout";
import PrivateRoute from "@/utils/private-route";
import { Provider } from "jotai";
import { I18nProvider } from "locales";

const MyApp = ({
  Component,
  pageProps,
}: AppProps & { pageProps: { session: Session | null } }) => {
  const { session, locale, ...restPageProps } = pageProps;
  const router = useRouter();
  const { toastTheme } = useToastTheme();

  return (
    <I18nProvider locale={locale}>
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
              <Toaster richColors theme={toastTheme} closeButton />
              {router.pathname.startsWith("/info") ||
              router.pathname.startsWith("/auth") ? (
                <Component {...restPageProps} />
              ) : (
                <Provider>
                  <PrivateRoute>
                    <Layout>
                      <Component {...restPageProps} />
                    </Layout>
                  </PrivateRoute>
                </Provider>
              )}
            </main>
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
    </I18nProvider>
  );
};

export default api.withTRPC(MyApp);
