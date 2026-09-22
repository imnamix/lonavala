"use client";

import { use, useEffect, useState } from "react";
import { CourtProceedingForm } from "@/components/admin/court/CourtProceedingForm";
import { getProceedingById } from "@/lib/services/court.service";
import { AdalatUpdate } from "@/types";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditCourtProceedingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCourtProceedingPage({ params }: EditCourtProceedingPageProps) {
  const resolvedParams = use(params);
  const [proceeding, setProceeding] = useState<AdalatUpdate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProceeding() {
      try {
        const data = await getProceedingById(resolvedParams.id);
        setProceeding(data);
      } catch (err) {
        console.error("Failed to load court proceeding:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProceeding();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!proceeding) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-border text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-gray-800">Proceeding Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested proceeding record does not exist or may have been deleted.
        </p>
        <Link
          href="/admin/court/proceedings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Proceedings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CourtProceedingForm initialData={proceeding} isEdit={true} />
    </div>
  );
}
