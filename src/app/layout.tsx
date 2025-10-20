import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Navbar } from "../components/layout/Navbar";
import { ThemeProvider } from "../context/ThemeContext";
import { Footer } from "../components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Preço Certo Clone",
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
        className={`${inter.className} flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Navbar />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
