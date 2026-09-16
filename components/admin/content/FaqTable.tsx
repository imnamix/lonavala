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
} from "lucide-react";
import { FAQItem } from "@/types";
import {
  getFAQs,
  saveOrUpdateFAQ,
  deleteFAQById,
  toggleFAQActive,
  resetFAQsData,
} from "@/data/faqData";
import { FaqModal } from "@/components/admin/content/FaqModal";

export function FaqTable() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqToEdit, setFaqToEdit] = useState<FAQItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  useEffect(() => {
    setFaqs(getFAQs());
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

  const handleOpenEditModal = (faq: FAQItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFaqToEdit(faq);
    setIsModalOpen(true);
  };

  const handleSaveFaq = (faqData: FAQItem) => {
    const updated = saveOrUpdateFAQ(faqData);
    setFaqs(updated);
    showToast(
      faqToEdit
        ? "FAQ updated successfully."
        : "New FAQ created successfully."
    );
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFAQActive(id);
    setFaqs(updated);
    showToast("Status updated successfully.");
  };

  const handleDeleteFaq = (id: string, question: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete this FAQ?\n\n"${question}"`)) {
      const updated = deleteFAQById(id);
      setFaqs(updated);
      showToast("FAQ deleted.");
      if (expandedFaqId === id) setExpandedFaqId(null);
    }
  };

  const handleResetDefault = () => {
    if (confirm("Reset FAQs to default entries?")) {
      const updated = resetFAQsData();
      setFaqs(updated);
      showToast("FAQs reset to default records.");
    }
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter((f) => {
    return (
      searchQuery === "" ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1F2937] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-[#D9E8DD] shadow-xs space-y-6">
        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#2E8B57] flex items-center justify-center font-bold shadow-2xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1F2937]">
                  Frequently Asked Questions (FAQ)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  {filteredFaqs.length} Items
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage questions and answers shown to citizens.
              </p>
            </div>
          </div>

          {/* Search & Add Button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions & answers..."
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-48 sm:w-64 focus:bg-white focus:border-[#2E8B57] focus:outline-hidden transition-all"
              />
            </div>

            {/* Add FAQ Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-[#2E8B57] text-white hover:bg-[#246E45] font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add FAQ</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredFaqs.length === 0 ? (
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
                className="px-3.5 py-1.5 rounded-xl bg-[#2E8B57] text-white text-xs font-bold hover:bg-[#246E45] cursor-pointer"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#D9E8DD]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FCF9] border-b border-[#D9E8DD] text-gray-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Question</th>
                  <th className="py-3.5 px-4 min-w-[340px]">Answer</th>
                  <th className="py-3.5 px-4 w-28 text-center">Status</th>
                  <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq, index) => {
                  const isExpanded = expandedFaqId === faq.id;
                  const isActive = faq.active !== false;

                  return (
                    <tr
                      key={faq.id}
                      onClick={() => handleOpenEditModal(faq)}
                      className="hover:bg-[#E8F5E9]/50 transition-colors cursor-pointer group"
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-600 inline-flex items-center justify-center text-[10px] font-bold shadow-2xs">
                          {index + 1}
                        </span>
                      </td>

                      {/* Question */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1F2937] text-xs leading-relaxed group-hover:text-[#2E8B57] transition-colors">
                          {faq.question}
                        </div>
                      </td>

                      {/* Answer */}
                      <td className="py-3.5 px-4">
                        <div className="text-gray-600 text-xs leading-relaxed">
                          <p className={isExpanded ? "" : "line-clamp-2"}>
                            {faq.answer}
                          </p>
                          {faq.answer.length > 130 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedFaqId(isExpanded ? null : faq.id);
                              }}
                              className="text-[10px] font-bold text-[#2E8B57] hover:underline mt-0.5 inline-block cursor-pointer"
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
                          onClick={(e) => handleToggleActive(faq.id, e)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors shadow-2xs ${
                            isActive
                              ? "bg-[#2E8B57] text-white hover:bg-[#246E45]"
                              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                          }`}
                        >
                          {isActive ? "● Active" : "○ Inactive"}
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
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#2E8B57] hover:bg-[#E8F5E9] text-gray-700 hover:text-[#2E8B57] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            title="Edit Question & Answer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteFaq(faq.id, faq.question, e)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Footer info & Reset option */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500">
          <p>
            Showing <span className="font-bold text-gray-700">{filteredFaqs.length}</span> of{" "}
            <span className="font-bold text-gray-700">{faqs.length}</span> total FAQs. Click any row or Edit button to modify in popup.
          </p>

          <button
            type="button"
            onClick={handleResetDefault}
            className="text-[11px] text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors cursor-pointer hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to Default FAQs</span>
          </button>
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
