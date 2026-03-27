import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Алекс | Автоматизація продажів для експертів",
  description:
    "Налаштую чат-боти та воронки, які замість тебе прогрівають аудиторію, видають матеріали та приймають платежі 24/7.",
  openGraph: {
    title: "Алекс | Автоматизація продажів для експертів",
    description:
      "Від хаосу та ручної роботи до системи, визнання та стабільного доходу.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
