"use client";

import { useEffect, useState, use } from "react";
import { TourismDestinationForm } from "@/components/admin/content/TourismDestinationForm";
import { TourismDestination } from "@/data/tourismData";
import { getTourismSpotById } from "@/lib/services/tourism.service";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTourismDestinationPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [destination, setDestination] = useState<TourismDestination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestination() {
      try {
        setLoading(true);
        const data = await getTourismSpotById(id);
        setDestination(data);
      } catch (err) {
        console.error(`Failed to load destination #${id}:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-16 flex flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-semibold">Loading destination details...</span>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-text-primary">Destination not found</h3>
        <p className="text-xs text-gray-500">The destination you are trying to edit could not be found.</p>
        <Link
          href="/admin/content/tourism"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Tourism Destinations</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <TourismDestinationForm initialData={destination} />
    </div>
  );
}
