import { CourtProceedingsTable } from "@/components/admin/court/CourtProceedingsTable";

export const metadata = {
  title: "Court Proceedings & Orders Table | LMC Admin Console",
  description: "Manage High Court writs, NGT hearings, Lok Adalat compromise records, and certified orders.",
};

export default function AdminCourtProceedingsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CourtProceedingsTable />
    </div>
  );
}
