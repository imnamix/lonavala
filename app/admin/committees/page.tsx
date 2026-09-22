import { CommitteeTable } from "@/components/admin/committee/CommitteeTable";

export const metadata = {
  title: "Manage Standing Committees | LMC Admin Console",
  description: "Administrative console to manage LMC Standing Committees, Chairpersons, and Members.",
};

export default function AdminCommitteesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <CommitteeTable />
    </div>
  );
}
