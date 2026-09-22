import { CourtSessionForm } from "@/components/admin/court/CourtSessionForm";

export const metadata = {
  title: "Schedule Court Session | LMC Admin Console",
  description: "Schedule a new court hearing session or record previous session history.",
};

export default function NewCourtSessionPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <CourtSessionForm isEdit={false} />
    </div>
  );
}
