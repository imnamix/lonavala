import { RecruitmentForm } from "@/components/admin/recruitment/RecruitmentForm";

export const metadata = {
  title: "Create Vacancy Notice | LMC Admin Console",
  description: "Publish a new municipal job vacancy notice and specify eligibility and examination procedures.",
};

export default function NewRecruitmentPage() {
  return (
    <div className="max-w-7xl mx-auto py-2">
      <RecruitmentForm isNew={true} />
    </div>
  );
}
