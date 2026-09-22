"use client";

import { use, useEffect, useState } from "react";
import { CourtSessionForm } from "@/components/admin/court/CourtSessionForm";
import { getCourtSessionById } from "@/lib/services/court-session.service";
import { CourtSession } from "@/types";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditCourtSessionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCourtSessionPage({ params }: EditCourtSessionPageProps) {
  const resolvedParams = use(params);
  const [session, setSession] = useState<CourtSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCourtSessionById(resolvedParams.id);
        setSession(data);
      } catch (err) {
        console.error("Failed to load court session for edit:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-800">Session Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested session record does not exist or may have been deleted.
        </p>
        <Link
          href="/admin/court/sessions"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sessions</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CourtSessionForm initialData={session} isEdit={true} />
    </div>
  );
}
