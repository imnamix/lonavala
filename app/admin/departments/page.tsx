import { DepartmentTable } from "@/components/admin/departments/DepartmentTable";

export const metadata = {
  title: "Manage Departments | LMC Admin Console",
  description: "Configure and manage municipal departments, head officers, contacts, and public services.",
};

export default function AdminDepartmentsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <DepartmentTable />
    </div>
  );
}
