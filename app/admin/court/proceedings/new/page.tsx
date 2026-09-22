import { CourtProceedingForm } from "@/components/admin/court/CourtProceedingForm";

export const metadata = {
  title: "Add Court Proceeding & Order | LMC Admin Console",
  description: "Record a new court proceeding, hearing update, or certified order copy.",
};

export default function NewCourtProceedingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <CourtProceedingForm isEdit={false} />
    </div>
  );
}
