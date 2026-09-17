"use client";

import { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Tag,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  FaqItemDto,
  CreateFaqPayload,
  getFaqs,
  createFaq,
  updateFaq,
  toggleFaqActive,
  deleteFaq,
} from "@/lib/services/faq.service";
import { FaqModal } from "@/components/admin/content/FaqModal";

export function FaqTable() {
  const [faqs, setFaqs] = useState<FaqItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FaqItemDto | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const data = await getFaqs();
      setFaqs(data);
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
      showToast("Failed to load FAQs from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenCreateModal = () => {
    setFaqToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqItemDto, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFaqToEdit(faq);
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (faqData: CreateFaqPayload, id?: number) => {
    if (id) {
      const res = await updateFaq(id, faqData);
      if (res.data) {
        setFaqs((prev) => prev.map((f) => (f.id === id ? res.data! : f)));
      } else {
        await fetchFaqs();
      }
      showToast("FAQ updated successfully.");
    } else {
      const res = await createFaq(faqData);
      if (res.data) {
        setFaqs((prev) => [res.data!, ...prev]);
      } else {
        await fetchFaqs();
      }
      showToast("New FAQ created successfully.");
    }
  };

  const handleToggleActive = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setTogglingId(id);
      const res = await toggleFaqActive(id);
      if (res.data) {
        setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, active: res.data!.active } : f)));
      } else {
        setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
      }
      showToast("FAQ status updated.");
    } catch (err) {
      console.error("Failed to toggle FAQ status:", err);
      showToast("Failed to update status.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteFaq = async (id: number, question: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      try {
        setDeletingId(id);
        await deleteFaq(id);
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        showToast("FAQ deleted successfully.");
        if (expandedFaqId === id) setExpandedFaqId(null);
      } catch (err) {
        console.error("Failed to delete FAQ:", err);
        showToast("Failed to delete FAQ.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category || "General")))];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      searchQuery === "" ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      (f.category || "General").toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-border shadow-xs space-y-6">
        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center font-bold shadow-2xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-text-primary">
                  Frequently Asked Questions (FAQ)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  {faqs.length} Total
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage questions and answers stored in the database and shown on the website.
              </p>
            </div>
          </div>

          {/* Search, Refresh & Add Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions & answers..."
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-44 sm:w-56 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
              />
            </div>

            <button
              type="button"
              onClick={fetchFaqs}
              disabled={loading}
              className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Refresh FAQs from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            </button>

            {/* <Link
              href="/#faq"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View on Homepage</span>
            </Link> */}

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs font-semibold">Loading FAQs from database...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700">No FAQs found</p>
              <p className="text-xs text-gray-500 mt-1">
                {searchQuery
                  ? "Try adjusting your search query."
                  : "Get started by adding your first Question & Answer."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Clear Search
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover cursor-pointer"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary-surface border-b border-border text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[260px]">Question</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Category</th>
                  <th className="py-3.5 px-4 min-w-[320px]">Answer</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqId === faq.id;
                  const isActive = faq.active;
                  const isDeleting = deletingId === faq.id;
                  const isToggling = togglingId === faq.id;

                  return (
                    <tr
                      key={faq.id}
                      onClick={() => handleOpenEditModal(faq)}
                      className={`hover:bg-primary-light/50 transition-colors cursor-pointer group ${
                        isDeleting ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-600 inline-flex items-center justify-center text-[10px] font-bold shadow-2xs">
                          {index + 1}
                        </span>
                      </td>

                      {/* Question */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-text-primary text-xs leading-relaxed group-hover:text-primary transition-colors">
                          {faq.question}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/70">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span>{faq.category || "General"}</span>
                        </span>
                      </td>

                      {/* Answer */}
                      <td className="py-3.5 px-4">
                        <div className="text-gray-600 text-xs leading-relaxed">
                          <p className={isExpanded ? "" : "line-clamp-2"}>
                            {faq.answer}
                          </p>
                          {faq.answer.length > 120 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedFaqId(isExpanded ? null : faq.id);
                              }}
                              className="text-[10px] font-bold text-primary hover:underline mt-0.5 inline-block cursor-pointer"
                            >
                              {isExpanded ? "Show Less" : "Show Full Answer..."}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Active / Inactive Status Toggle */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isToggling}
                          onClick={(e) => handleToggleActive(faq.id, e)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-2xs ${
                            isActive
                              ? "bg-primary text-white hover:bg-primary-hover"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          } ${isToggling ? "opacity-60 cursor-wait" : ""}`}
                        >
                          {isToggling ? "..." : isActive ? "● Active" : "○ Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(faq)}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary hover:bg-primary-light text-gray-700 hover:text-primary text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title="Edit Question & Answer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={(e) => handleDeleteFaq(faq.id, faq.question, e)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            title="Delete FAQ"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
          <p>
            Showing <span className="font-bold text-gray-700">{filteredFaqs.length}</span> of{" "}
            <span className="font-bold text-gray-700">{faqs.length}</span> total FAQs stored in database. Click any row or Edit button to modify in popup.
          </p>
        </div>
      </div>

      {/* Popup Modal for Create & Edit */}
      <FaqModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFaq}
        faqToEdit={faqToEdit}
      />
    </div>
  );
}
