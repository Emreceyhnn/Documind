import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokümanlarım",
  description:
    "Yüklenen dokümanlarınızı yönetin, PDF ve Word dosyalarını analiz için sisteme ekleyin.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
