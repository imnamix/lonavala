import { ResolutionForm } from "@/components/admin/resolution/ResolutionForm";

export const metadata = {
  title: "Add Council Resolution | LMC Admin Console",
  description: "Create a new LMC Council Resolution record.",
};

export default function AdminNewResolutionPage() {
  return <ResolutionForm isNew={true} />;
}
