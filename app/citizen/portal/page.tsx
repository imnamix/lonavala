"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isCitizenLoggedIn } from "@/lib/services/citizen.service";

export default function CitizenPortalRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    if (isCitizenLoggedIn()) {
      router.replace("/citizen/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
