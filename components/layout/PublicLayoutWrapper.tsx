"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="grow pt-[76px] sm:pt-[84px]">{children}</main>
      <Footer />
    </div>
  );
}
