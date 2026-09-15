import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş Yap",
  description: "DocuMind platformuna güvenli giriş yapın.",
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
