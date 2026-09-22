import { CourtMemberForm } from "@/components/admin/court/CourtMemberForm";

export const metadata = {
  title: "Add Court Committee Member | LMC Admin Console",
  description: "Create a new member record for the Hon. Court & Legal Affairs Committee.",
};

export default function NewCourtMemberPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <CourtMemberForm isEdit={false} />
    </div>
  );
}
