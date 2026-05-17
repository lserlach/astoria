import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Travel — туры и отели",
  description: "Онлайн-подбор туров и отелей. Прототип интерфейса.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        {children}
      </body>
    </html>
  );
}
