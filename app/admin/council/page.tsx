import { CouncilTable } from "@/components/admin/council/CouncilTable";

export const metadata = {
  title: "Manage Councils & Corporators | LMC Admin Console",
  description: "Administrative console to manage LMC Council members, ward corporators, and leadership directory.",
};

export default function AdminCouncilPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <CouncilTable />
    </div>
  );
}
