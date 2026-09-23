import { UpdateForm } from "@/components/admin/updates/UpdateForm";

export const metadata = {
  title: "Edit Important Update | LMC Admin Console",
  description: "Edit announcement tag details, action types, or custom page content.",
};

interface AdminEditUpdatePageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function AdminEditUpdatePage({
  params,
}: AdminEditUpdatePageProps) {
  const resolvedParams = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <UpdateForm updateId={resolvedParams.id} isNew={false} />
    </div>
  );
}
