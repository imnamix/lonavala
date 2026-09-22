import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata = {
  title: "Edit Project | LMC Admin Console",
  description: "Update municipal project timeline, physical progress, and execution milestones.",
};

export default async function AdminEditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="max-w-7xl mx-auto">
      <ProjectForm projectId={resolvedParams.id} isNew={false} />
    </div>
  );
}
