import { UpdateForm } from "@/components/admin/updates/UpdateForm";

export const metadata = {
  title: "New Important Update | LMC Admin Console",
  description: "Create announcement tags and configure on-click actions for homepage citizens.",
};

export default function AdminNewUpdatePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <UpdateForm isNew={true} />
    </div>
  );
}
