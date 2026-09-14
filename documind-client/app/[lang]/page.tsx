import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function RootPage({
  params,
}: PageProps<"/[lang]">) {
  const { lang } = await params;
  redirect({ href: "/auth/sign-in", locale: lang as Locale });
}
