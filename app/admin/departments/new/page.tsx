import { DepartmentForm } from "@/components/admin/departments/DepartmentForm";

export const metadata = {
  title: "Add Department | LMC Admin Console",
  description: "Configure a new municipal department in the LMC administration console.",
};

export default function AdminNewDepartmentPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <DepartmentForm isNew={true} />
    </div>
  );
}
