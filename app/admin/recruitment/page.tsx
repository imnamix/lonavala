import { RecruitmentTable } from "@/components/admin/recruitment/RecruitmentTable";

export const metadata = {
  title: "Recruitment & Careers Management | LMC Admin Console",
  description: "Manage municipal employment gazettes, vacancies, qualification criteria, and selection results.",
};

export default function AdminRecruitmentPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <RecruitmentTable />
    </div>
  );
}
