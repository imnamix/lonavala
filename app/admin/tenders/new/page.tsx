import { TenderForm } from "@/components/admin/tenders/TenderForm";

export const metadata = {
  title: "Create New Tender Notice | LMC Admin Console",
  description: "Publish a new municipal e-tender notice and specify bidding schedules and financial estimates.",
};

export default function NewTenderPage() {
  return (
    <div className="max-w-7xl mx-auto py-2">
      <TenderForm isNew={true} />
    </div>
  );
}
