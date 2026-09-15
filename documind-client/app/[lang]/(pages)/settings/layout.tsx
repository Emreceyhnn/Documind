import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ayarlar",
  description:
    "Profil bilgilerinizi, şirket hesabınızı ve ekip üyelerini yönetin.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
