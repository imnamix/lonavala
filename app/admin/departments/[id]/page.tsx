import { DepartmentForm } from "@/components/admin/departments/DepartmentForm";

export function generateStaticParams() {
  return [];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDepartmentPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="max-w-7xl mx-auto">
      <DepartmentForm deptId={id} isNew={false} />
    </div>
  );
}
