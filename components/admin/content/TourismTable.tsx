"use client";

import { useState } from "react";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  Images,
  Search,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TourismDestination, INITIAL_TOURISM_DESTINATIONS } from "@/data/tourismData";

export function TourismTable() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [destinations, setDestinations] = useState<TourismDestination[]>(INITIAL_TOURISM_DESTINATIONS);

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDestinations(
      destinations.map((d) => (d.id === id ? { ...d, active: !d.active } : d))
    );
  };

  const handleDeleteDestination = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (destinations.length <= 1) {
      alert("At least one tourism destination must remain configured.");
      return;
    }
    if (confirm("Are you sure you want to delete this destination?")) {
      setDestinations(destinations.filter((d) => d.id !== id));
    }
  };

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Main Table Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E8B57] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1F2937]">Tourism Destinations</h3>
              <p className="text-xs text-gray-500">
                {destinations.length} destinations published. Click any row or edit button to manage content.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-48 sm:w-60 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden"
              />
            </div>

            <Link
              href="/admin/content/tourism/new"
              className="px-4 py-2 rounded-xl bg-[#2E8B57] text-white hover:bg-[#246E45] font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Destination</span>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#D9E8DD]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FCF9] border-b border-[#D9E8DD] text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4"># / Photo</th>
                <th className="py-3.5 px-4">Destination Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-3 text-center">Highlights</th>
                <th className="py-3.5 px-3 text-center">Advisories</th>
                <th className="py-3.5 px-3 text-center">Gallery</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDestinations.map((dest, index) => (
                <tr
                  key={dest.id}
                  onClick={() => router.push(`/admin/content/tourism/${dest.id}`)}
                  className="hover:bg-[#E8F5E9]/50 transition-colors cursor-pointer group"
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
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </td>

                  {/* Destination Name */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1F2937] text-xs leading-tight group-hover:text-[#2E8B57] transition-colors">
                      {dest.name}
                    </div>
                  </td>

                  {/* Category Column */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F5E9] text-[#2E8B57] font-bold text-[11px] border border-emerald-200/80">
                      <Tag className="w-3 h-3 text-[#2E8B57]" />
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
                      onClick={(e) => handleToggleActive(dest.id, e)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        dest.active
                          ? "bg-[#2E8B57] text-white hover:bg-[#246E45]"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {dest.active ? "● Active" : "○ Inactive"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/content/tourism/${dest.id}`}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#2E8B57] hover:bg-[#E8F5E9] text-gray-700 hover:text-[#2E8B57] text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Edit destination details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Edit</span>
                      </Link>

                      {destinations.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDestination(dest.id, e)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                          title="Delete destination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
