import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CINEPULSE | 영화 흥행 인텔리전스",
  description: "박스오피스 TOP 10과 영화 관객수·매출 예측을 한눈에.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
