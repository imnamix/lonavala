import { CourtSessionsTable } from "@/components/admin/court/CourtSessionsTable";

export const metadata = {
  title: "Court Sessions & Previous Hearing History Table | LMC Admin Console",
  description: "Schedule upcoming sessions with title and date, and maintain previous sessions history.",
};

export default function AdminCourtSessionsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CourtSessionsTable />
    </div>
  );
}
