import { TourismDestinationForm } from "@/components/admin/content/TourismDestinationForm";
import { INITIAL_TOURISM_DESTINATIONS } from "@/data/tourismData";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return INITIAL_TOURISM_DESTINATIONS.map((dest) => ({
    id: dest.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTourismDestinationPage({ params }: PageProps) {
  const { id } = await params;
  const destination = INITIAL_TOURISM_DESTINATIONS.find((d) => d.id === id) || INITIAL_TOURISM_DESTINATIONS[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <TourismDestinationForm initialData={destination} />
    </div>
  );
}
