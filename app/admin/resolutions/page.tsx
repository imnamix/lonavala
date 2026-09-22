import { ResolutionTable } from "@/components/admin/resolution/ResolutionTable";

export const metadata = {
  title: "Manage Council Resolutions | LMC Admin Console",
  description: "Administrative console to manage LMC Council Resolutions, Gazettes, and Meeting Minutes.",
};

export default function AdminResolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <ResolutionTable />
    </div>
  );
}
