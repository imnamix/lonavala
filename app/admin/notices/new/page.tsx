import { NoticeForm } from "@/components/admin/notices/NoticeForm";

export const metadata = {
  title: "New Notice & Gazette | LMC Admin Console",
  description: "Create and publish a new municipal notice, order, circular, or gazette.",
};

export default function AdminNewNoticePage() {
  return (
    <div className="max-w-7xl mx-auto">
      <NoticeForm isNew={true} />
    </div>
  );
}
