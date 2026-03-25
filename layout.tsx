import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "許明恩 Astro Hsu — 區塊勢 Blocktrend",
  description:
    "區塊勢創辦人許明恩的數位名片。區塊勢是台灣最大的繁體中文 Web3 訂閱媒體。",
  openGraph: {
    title: "許明恩 Astro Hsu — 區塊勢 Blocktrend",
    description:
      "區塊勢創辦人許明恩的數位名片。區塊勢是台灣最大的繁體中文 Web3 訂閱媒體。",
    type: "profile",
  },
};

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
