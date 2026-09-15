import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "DocuMind | Yapay Zeka Destekli Doküman Analiz ve Soru-Cevap",
    template: "%s | DocuMind",
  },
  description:
    "Kurumsal ve kişisel dokümanlarınızı yükleyin, yapay zeka (RAG) ile anında sohbet edin ve doğrudan kaynak gösterilen doğru yanıtlar alın.",
  applicationName: "DocuMind",
  authors: [{ name: "DocuMind Team" }],
  generator: "Next.js",
  keywords: [
    "DocuMind",
    "Doküman Analizi",
    "Yapay Zeka",
    "RAG",
    "PDF Soru Cevap",
    "AI Document Assistant",
    "Document QA",
    "AI Chat",
    "Vektör Arama",
    "Kaynak Gösterimli Yapay Zeka",
  ],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "DocuMind - Yapay Zeka Destekli Doküman Analiz Platformu",
    description:
      "Dokümanlarınızla sohbet edin, yapay zeka ile anında yanıtlar ve tam kaynak gösterimleri alın.",
    url: "https://documind.app",
    siteName: "DocuMind",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DocuMind AI Document Analysis & Chat",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind - AI Document QA Platform",
    description:
      "Ask questions about your documents and get cited answers with exact source citations.",
    images: ["/og-image.jpg"],
    creator: "@documind",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "DocuMind",
    operatingSystem: "All",
    applicationCategory: "BusinessApplication",
    description:
      "Yapay zeka destekli doküman analiz ve kaynak gösterimli soru-cevap platformu.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <html
      lang={lang}
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
