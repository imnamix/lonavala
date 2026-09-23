"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/citizen/dashboard");
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
      Redirecting to Citizen Dashboard...
    </div>
  );
}
