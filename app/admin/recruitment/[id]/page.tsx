import { RecruitmentForm } from "@/components/admin/recruitment/RecruitmentForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Vacancy Notice | LMC Admin Console",
  description: "Update municipal job vacancy details, timelines, and candidate selection results.",
};

export default async function EditRecruitmentPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto py-2">
      <RecruitmentForm recruitmentId={id} isNew={false} />
    </div>
  );
}
