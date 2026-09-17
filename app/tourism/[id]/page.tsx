"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Tag,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  Images,
  Phone,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
} from "lucide-react";
import { TourismDestination, INITIAL_TOURISM_DESTINATIONS } from "@/data/tourismData";
import { getTourismSpotById, getTourismSpots } from "@/lib/services/tourism.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TourismDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [spot, setSpot] = useState<TourismDestination | null>(null);
  const [otherSpots, setOtherSpots] = useState<TourismDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [spotData, allSpots] = await Promise.all([
          getTourismSpotById(id),
          getTourismSpots({ active: true }),
        ]);
        setSpot(spotData);
        if (allSpots) {
          setOtherSpots(allSpots.filter((s) => s.id !== String(id) && s.active !== false).slice(0, 3));
        }
      } catch (err) {
        console.error(`Failed to load tourism destination #${id}:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Combine cover image and gallery images for the full gallery modal
  const allImages = [
    ...(spot?.imageUrl ? [{ id: "cover", url: spot.imageUrl, fileName: "Cover Photo" }] : []),
    ...(spot?.galleryImages || []),
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-500 py-24">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="text-sm font-semibold text-gray-600">Loading destination details...</span>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-200">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Destination Not Found</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            The tourist destination you are looking for does not exist or has been temporarily unlisted.
          </p>
        </div>
        <Link
          href="/tourism"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tourist Spots</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-12">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <Link
            href="/tourism"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Destinations</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>{copied ? "Link Copied!" : "Share Spot"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Showcase Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[340px] sm:h-[460px] rounded-3xl overflow-hidden shadow-lg border border-border">
          <img
            src={spot.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"}
            alt={spot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

          <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            {spot.label && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-text-primary text-xs font-extrabold shadow-md">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span>{spot.label}</span>
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>LMC Verified Eco-Spot</span>
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 text-white space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {spot.name}
            </h1>
            {spot.distance && (
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-200 font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                <span>{spot.distance}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview & Description */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 text-primary font-bold text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>About Destination</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                Overview & Natural Heritage
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                {spot.description}
              </p>
            </section>

            {/* Photo Gallery Grid */}
            {spot.galleryImages && spot.galleryImages.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-primary font-bold text-sm uppercase tracking-wider">
                    <Images className="w-4 h-4" />
                    <span>Photo Gallery</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {spot.galleryImages.length} Photographs
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {spot.galleryImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className="relative h-36 sm:h-44 rounded-2xl overflow-hidden group border border-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                    >
                      <img
                        src={img.url}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                          View Full Photo
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Advisories & Safety Guidelines (Detailed) */}
            {spot.importantPoints && spot.importantPoints.length > 0 && (
              <section className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Advisories & Safety Guidelines</span>
                </div>

                <div className="space-y-3">
                  {spot.importantPoints.map((pt, idx) => (
                    <div
                      key={pt.id || idx}
                      className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs sm:text-sm text-gray-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed font-medium">{pt.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Quick Info & Helpdesk */}
          <div className="space-y-6">
            {/* Highlights & Facts Card */}
            {spot.highlights && spot.highlights.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-border shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Spot Highlights</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {spot.highlights.map((h) => (
                    <div key={h.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <span className="font-bold text-gray-600">{h.key}</span>
                      <span className="font-semibold text-primary text-right">{h.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Municipal Tourist Assistance Card */}
            <div className="bg-gradient-to-br from-primary to-primary-hover text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm sm:text-base">Tourist Assistance Desk</h3>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                For on-spot safety assistance, guided permits, or lost & found reporting at hill locations.
              </p>

              <div className="space-y-2 pt-2 border-t border-white/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">LMC Tourism Helpline:</span>
                  <a href="tel:18002330101" className="font-bold text-white underline">
                    1800-233-0101
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-100">Emergency Police:</span>
                  <a href="tel:112" className="font-bold text-white underline">
                    112 (24x7)
                  </a>
                </div>
              </div>
            </div>

            {/* Municipal Council Notice */}
            <div className="bg-primary-surface p-5 rounded-3xl border border-border text-xs space-y-2 text-gray-600">
              <div className="flex items-center gap-2 font-bold text-text-primary">
                <Info className="w-4 h-4 text-primary" />
                <span>Eco-Zone Rules</span>
              </div>
              <p className="leading-relaxed">
                Lonavala & Khandala hill ranges are plastic-restricted ecological zones. Please use designated bins and preserve the pristine flora & fauna.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Other Destinations Carousel/Grid */}
      {otherSpots.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-border space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Discover More</span>
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
                Other Popular Tourist Spots
              </h3>
            </div>
            <Link
              href="/tourism"
              className="text-xs font-bold text-primary hover:underline hidden sm:inline-block"
            >
              View All ({otherSpots.length + 1}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSpots.map((other) => (
              <Link
                key={other.id}
                href={`/tourism/${other.id}`}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs hover:shadow-lg hover:border-primary transition-all group flex flex-col justify-between"
              >
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={other.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"}
                    alt={other.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {other.label && (
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full text-text-primary shadow-xs">
                      {other.label}
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                    {other.name}
                  </h4>
                  {other.distance && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">{other.distance}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Photo Modal */}
      {selectedPhotoIndex !== null && spot.galleryImages && spot.galleryImages[selectedPhotoIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-transparent flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="w-full flex items-center justify-between text-white px-2">
              <span className="text-xs font-semibold">
                Photo {selectedPhotoIndex + 1} of {spot.galleryImages.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl">
              <img
                src={spot.galleryImages[selectedPhotoIndex].url}
                alt="Full View"
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Navigation Controls */}
            {spot.galleryImages.length > 1 && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev === 0 ? spot.galleryImages!.length - 1 : prev - 1) : 0
                    )
                  }
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedPhotoIndex((prev) =>
                      prev !== null ? (prev === spot.galleryImages!.length - 1 ? 0 : prev + 1) : 0
                    )
                  }
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
