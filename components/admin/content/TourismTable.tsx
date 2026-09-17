"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  Images,
  Search,
  Tag,
  Loader2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TourismDestination } from "@/data/tourismData";
import {
  getTourismSpots,
  toggleTourismSpotActive,
  deleteTourismSpot,
} from "@/lib/services/tourism.service";

export function TourismTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<TourismDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTourismSpots();
      setDestinations(data);
    } catch (err: any) {
      console.error("Error fetching tourism spots:", err);
      setError("Failed to load tourism spots from API. Using local fallback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleToggleActive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setTogglingId(id);
      const res = await toggleTourismSpotActive(id);
      if (res.data) {
        setDestinations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, active: res.data!.active } : d))
        );
      } else {
        // Optimistic toggle fallback
        setDestinations((prev) =>
          prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
        );
      }
    } catch (err) {
      console.error(`Failed to toggle active status for spot #${id}:`, err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteDestination = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (destinations.length <= 1) {
      alert("At least one tourism destination must remain configured.");
      return;
    }
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTourismSpot(id);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(`Failed to delete spot #${id}:`, err);
      alert("Failed to delete tourism destination. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.distance.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Main Table Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-text-primary">Tourism Destinations & Attractions</h3>
              <p className="text-xs text-gray-500">
                {destinations.length} destinations configured in database. Click any row to edit details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-44 sm:w-56 focus:bg-white focus:border-primary focus:outline-hidden"
              />
            </div>

            <button
              type="button"
              onClick={fetchDestinations}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Refresh tourism destinations"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            </button>

            {/* <Link
              href="/tourism"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Page</span>
            </Link> */}

            <Link
              href="/admin/content/tourism/new"
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span> Add Destination</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4"># / Photo</th>
                <th className="py-3.5 px-4">Destination Name</th>
                <th className="py-3.5 px-4">Category / Label</th>
                <th className="py-3.5 px-3 text-center">Highlights</th>
                <th className="py-3.5 px-3 text-center">Advisories</th>
                <th className="py-3.5 px-3 text-center">Gallery</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-xs font-semibold">Loading tourism destinations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <Compass className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">No tourism destinations found</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {searchQuery ? "Try refining your search query" : "Click '+ Add Destination' to create one"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDestinations.map((dest, index) => {
                  const isDeleting = deletingId === dest.id;
                  const isToggling = togglingId === dest.id;

                  return (
                    <tr
                      key={dest.id}
                      onClick={() => router.push(`/admin/content/tourism/${dest.id}`)}
                      className={`hover:bg-primary-light/50 transition-colors cursor-pointer group ${
                        isDeleting ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {/* Index & Thumbnail */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 relative shadow-2xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={dest.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80"}
                              alt={dest.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Destination Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-text-primary text-xs leading-tight group-hover:text-primary transition-colors">
                          {dest.name}
                        </div>
                        {dest.distance && (
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-xs">
                            {dest.distance}
                          </div>
                        )}
                      </td>

                      {/* Category Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-light text-primary font-bold text-[11px] border border-emerald-200/80">
                          <Tag className="w-3 h-3 text-primary" />
                          <span>{dest.label || "Attraction"}</span>
                        </span>
                      </td>

                      {/* Highlights Count */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                          {dest.highlights?.length || 0} specs
                        </span>
                      </td>

                      {/* Advisories Count */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200">
                          {dest.importantPoints?.length || 0} points
                        </span>
                      </td>

                      {/* Gallery Count */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-200 flex items-center justify-center gap-1 mx-auto w-fit">
                          <Images className="w-2.5 h-2.5 text-blue-600" />
                          <span>{dest.galleryImages?.length || 0}</span>
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={(e) => handleToggleActive(dest.id, e)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                            dest.active
                              ? "bg-primary text-white hover:bg-primary-hover"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          } ${isToggling ? "opacity-60 cursor-wait" : ""}`}
                        >
                          {isToggling ? "..." : dest.active ? "● Active" : "○ Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/admin/content/tourism/${dest.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Edit destination details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </Link>

                          {destinations.length > 1 && (
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={(e) => handleDeleteDestination(dest.id, dest.name, e)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                              title="Delete destination"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
