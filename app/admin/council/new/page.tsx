import { CouncilMemberForm } from "@/components/admin/council/CouncilMemberForm";

export const metadata = {
  title: "Add Council Member | LMC Admin Console",
  description: "Register a new council member or ward corporator to the LMC directory.",
};

export default function AdminNewCouncilMemberPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <CouncilMemberForm isNew={true} />
    </div>
  );
}
