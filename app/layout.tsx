import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { PublicLayoutWrapper } from "@/components/layout/PublicLayoutWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Lonavala Municipal Council | Official Citizen Portal",
  description:
    "Official website of Lonavala Municipal Council (LMC), Government of Maharashtra. Online property tax, water bills, 5-step grievance redressal, tourism guide, and civic transparency.",
  keywords: [
    "Lonavala Municipal Council",
    "LMC Lonavala",
    "Lonavala Property Tax",
    "Lonavala Grievance Redressal",
    "Bhushi Dam timings",
    "Tiger Point Lonavala",
    "Lonavala Tourism",
    "Aaple Sarkar Lonavala",
  ],
  icons: {
    icon: "/images/logo-192.png",
    shortcut: "/favicon.ico",
    apple: "/images/logo-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-primary-surface text-text-primary">
        <LanguageProvider>
          <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
