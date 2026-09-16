import { FaqTable } from "@/components/admin/content/FaqTable";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminFaqContentPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-xs">
        <Link
          href="/admin/content"
          className="text-gray-500 hover:text-[#2E8B57] font-semibold flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Content Modules</span>
        </Link>
      </div>
      <FaqTable />
    </div>
  );
}
