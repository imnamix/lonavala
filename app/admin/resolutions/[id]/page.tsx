import { ResolutionForm } from "@/components/admin/resolution/ResolutionForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Council Resolution | LMC Admin Console",
  description: "Update LMC Council Resolution record and attached PDF document.",
};

export default async function AdminEditResolutionPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ResolutionForm resolutionId={resolvedParams.id} isNew={false} />;
}
