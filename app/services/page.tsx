"use client";

import { useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { CITIZEN_SERVICES } from "@/data/mockData";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { SearchBar } from "@/components/shared/SearchBar";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Revenue & Finance",
    "Utilities & Water",
    "Vital Statistics",
    "Town Planning",
    "Commerce & Revenue",
    "Licenses & Permissions",
    "Digital Services",
  ];

  const filteredServices = CITIZEN_SERVICES.filter((srv) => {
    const matchesSearch =
      srv.title.toLowerCase().includes(search.toLowerCase()) ||
      srv.description.toLowerCase().includes(search.toLowerCase()) ||
      srv.department.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || srv.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10">
      {/* Header */}
      <div className="bg-[#E8F5E9]/60 border-y border-[#D9E8DD] py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E8B57] bg-white px-3 py-1 rounded-full border border-[#D9E8DD]">
              Doorstep e-Services
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] mt-3">
              Citizen Services Directory
            </h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Explore and apply for civic licenses, birth & death records, building sanctions, water connections, and municipal tax clearance with simplified paperless procedures.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#D9E8DD] shadow-xs">
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search services (Property Tax, Water, Trade...)"
              />
            </div>
            <div className="text-xs font-semibold text-gray-500 shrink-0">
              Showing <strong className="text-[#2E8B57]">{filteredServices.length}</strong> of{" "}
              {CITIZEN_SERVICES.length} Services
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#2E8B57] text-white shadow-xs"
                    : "bg-white border border-[#D9E8DD] text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E8B57]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
