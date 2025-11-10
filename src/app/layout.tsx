import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { Suspense } from "react";
import Loading from "@/components/loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Price Fix",
  description: "Sistema de gestão de vendas e produtos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background text-text`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
