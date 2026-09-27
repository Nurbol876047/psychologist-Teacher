import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ptSerif, ibmPlexSans } from "@/lib/fonts";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Мұғалімге психологиялық қолдау",
  description:
    "Қазақстан мектеп мұғалімдеріне арналған ИИ-психолог платформасы",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kk">
      <body
        className={`${inter.variable} ${ptSerif.variable} ${ibmPlexSans.variable} font-sans bg-white text-primary-dark antialiased`}
      >
        <LangProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </LangProvider>
      </body>
    </html>
  );
}
