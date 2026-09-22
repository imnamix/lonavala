import { TenderTable } from "@/components/admin/tenders/TenderTable";

export const metadata = {
  title: "Tenders & Contracts Management | LMC Admin Console",
  description: "Manage e-tender notices, bidding schedules, earnest money deposits, and contractor awards.",
};

export default function AdminTendersPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <TenderTable />
    </div>
  );
}
