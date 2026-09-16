import { CouncilMemberForm } from "@/components/admin/council/CouncilMemberForm";
import { INITIAL_COUNCIL_MEMBERS } from "@/data/councilData";

export function generateStaticParams() {
  return INITIAL_COUNCIL_MEMBERS.map((member) => ({
    id: member.id,
  }));
}

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
