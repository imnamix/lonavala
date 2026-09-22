import { CourtMembersTable } from "@/components/admin/court/CourtMembersTable";

export const metadata = {
  title: "Court Committee Members Table | LMC Admin Console",
  description: "Manage LMC Court Committee chairpersons, corporators, and legal officers in tabular view.",
};

export default function AdminCourtMembersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CourtMembersTable />
    </div>
  );
}
