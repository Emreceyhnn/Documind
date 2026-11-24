import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Box } from "@mui/material";
import { routing } from "@/i18n/routing";
import { SITE_URL, localizedUrl } from "@/app/lib/site";
import LandingHeader from "@/app/components/landing/LandingHeader";
import LandingFooter from "@/app/components/landing/LandingFooter";
import {
  FAQ_KEYS,
  Faq,
  Features,
  FinalCta,
  Hero,
  HowItWorks,
  TechStack,
} from "@/app/components/landing/LandingSections";
import { MAIN_CONTENT_ID } from "@/app/components/landing/constants";

type PageParams = { params: Promise<{ lang: string }> };

const OG_LOCALES: Record<string, string> = { en: "en_US", tr: "tr_TR" };

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) return {};

  const t = await getTranslations({ locale: lang, namespace: "Landing.meta" });
  const title = t("title");
  const description = t("description");
  const url = localizedUrl(lang, "");

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, "")])
        ),
        "x-default": localizedUrl(routing.defaultLocale, ""),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: "DocuMind",
      title,
      description,
      locale: OG_LOCALES[lang],
      alternateLocale: routing.locales
        .filter((l) => l !== lang)
        .map((l) => OG_LOCALES[l]),
      images: [
        {
          url: "/og-image.jpg",
          width: 1376,
          height: 768,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

/** Escape "<" so structured data can never close the surrounding script tag. */
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function LandingPage({ params }: PageParams) {
  const { lang } = await params;
  if (!hasLocale(routing.locales, lang)) notFound();
  setRequestLocale(lang);

  const t = await getTranslations({ locale: lang, namespace: "Landing" });
  const url = localizedUrl(lang, "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: t("meta.title"),
        description: t("meta.description"),
        inLanguage: lang,
        isPartOf: { "@type": "WebSite", name: "DocuMind", url: SITE_URL },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: lang,
        mainEntity: FAQ_KEYS.map((key) => ({
          "@type": "Question",
          name: t(`faq.items.${key}.q`),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(`faq.items.${key}.a`),
          },
        })),
      },
    ],
  };

  return (
    <Box className="landing" sx={{ flex: 1, bgcolor: "background.default" }}>
      <a className="skip-link" href={`#${MAIN_CONTENT_ID}`}>
        {t("nav.skip")}
      </a>

      <LandingHeader />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <Features />
        <TechStack />
        <Faq />
        <FinalCta />
      </main>

      <LandingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
      />
    </Box>
  );
}
