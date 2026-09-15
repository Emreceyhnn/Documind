import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description:
    "DocuMind ile yapay zeka destekli doküman analizine ücretsiz başlayın.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
