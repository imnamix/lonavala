import { TenderForm } from "@/components/admin/tenders/TenderForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Tender Notice | LMC Admin Console",
  description: "Update municipal tender specifications, timeline schedules, and award details.",
};

export default async function EditTenderPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto py-2">
      <TenderForm tenderId={id} isNew={false} />
    </div>
  );
}
