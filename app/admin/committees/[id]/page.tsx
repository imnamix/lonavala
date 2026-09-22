import { CommitteeForm } from "@/components/admin/committee/CommitteeForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Standing Committee | LMC Admin Console",
  description: "Update LMC Standing Committee details, Chairperson, and council members.",
};

export default async function AdminEditCommitteePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CommitteeForm committeeId={resolvedParams.id} isNew={false} />;
}
