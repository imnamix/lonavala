import { NoticeForm } from "@/components/admin/notices/NoticeForm";

export const metadata = {
  title: "Edit Notice & Gazette | LMC Admin Console",
  description: "Edit and update an existing municipal notice or gazette publication.",
};

export default async function AdminEditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="max-w-7xl mx-auto">
      <NoticeForm noticeId={resolvedParams.id} isNew={false} />
    </div>
  );
}
