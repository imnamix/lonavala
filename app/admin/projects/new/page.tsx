import { ProjectForm } from "@/components/admin/projects/ProjectForm";

export const metadata = {
  title: "Add New Project | LMC Admin Console",
  description: "Create and publish a new municipal infrastructure or capital works project.",
};

export default function AdminNewProjectPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <ProjectForm isNew={true} />
    </div>
  );
}
