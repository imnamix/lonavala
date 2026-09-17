import { CouncilMemberForm } from "@/components/admin/council/CouncilMemberForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCouncilMemberPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <CouncilMemberForm memberId={id} isNew={false} />
    </div>
  );
}
