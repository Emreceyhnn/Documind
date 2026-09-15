import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yapay Zeka Sohbeti",
  description:
    "Dokümanlarınızla sohbet edin, yapay zeka ile anında kaynak gösterimli yanıtlar alın.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
