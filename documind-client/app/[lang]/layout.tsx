import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { routing } from "@/i18n/routing";
import { getCurrentUser } from "../lib/api/auth";
import AuthContextProvider from "../lib/auth/AuthContext";
import MuiThemeProvider from "../components/MuiThemeProvider";
import "../styles/globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "DocuMind",
  description: "Ask questions about your documents and get cited answers.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }
  setRequestLocale(lang);

  const initialUser = await getCurrentUser();

  return (
    <html
      lang={lang}
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <AppRouterCacheProvider>
            <MuiThemeProvider>
              <AuthContextProvider initialUser={initialUser}>
                {children}
              </AuthContextProvider>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
