import { DepartmentForm } from "@/components/admin/departments/DepartmentForm";
import { INITIAL_DEPARTMENTS } from "@/data/departmentData";

export function generateStaticParams() {
  return INITIAL_DEPARTMENTS.map((dept) => ({
    id: dept.slug,
  }));
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
