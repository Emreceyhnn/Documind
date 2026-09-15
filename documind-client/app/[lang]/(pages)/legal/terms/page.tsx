import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import LegalPage from "@/app/components/LegalPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Legal.terms" });
  return { title: t("title") };
}

export default function TermsPage() {
  return <LegalPage namespace="Legal.terms" />;
}
