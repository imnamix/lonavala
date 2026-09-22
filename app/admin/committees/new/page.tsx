import { CommitteeForm } from "@/components/admin/committee/CommitteeForm";

export const metadata = {
  title: "Add Standing Committee | LMC Admin Console",
  description: "Create a new LMC Standing Committee with Chairman and council members.",
};

export default function AdminNewCommitteePage() {
  return <CommitteeForm isNew={true} />;
}
