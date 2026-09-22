"use client";

import { use, useEffect, useState } from "react";
import { CourtMemberForm } from "@/components/admin/court/CourtMemberForm";
import { getMemberById } from "@/lib/services/court.service";
import { CourtCommitteeMember } from "@/types";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface EditCourtMemberPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCourtMemberPage({ params }: EditCourtMemberPageProps) {
  const resolvedParams = use(params);
  const [member, setMember] = useState<CourtCommitteeMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMember() {
      try {
        setLoading(true);
        const data = await getMemberById(resolvedParams.id);
        setMember(data);
      } catch (err) {
        console.error("Failed to load member:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMember();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-border text-center space-y-4 shadow-xs">
        <h2 className="text-lg font-bold text-gray-800">Member Not Found</h2>
        <p className="text-xs text-gray-500">
          The requested committee member does not exist or may have been deleted.
        </p>
        <Link
          href="/admin/court/members"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Members</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <CourtMemberForm initialData={member} isEdit={true} />
    </div>
  );
}
