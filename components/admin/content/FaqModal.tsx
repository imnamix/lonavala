"use client";

import { useState, useEffect } from "react";
import {
  X,
  HelpCircle,
  AlertCircle,
  Save,
  Loader2,
  Tag,
} from "lucide-react";
import { FaqItemDto, CreateFaqPayload } from "@/lib/services/faq.service";

const COMMON_CATEGORIES = [
  "Property Tax",
  "Grievance Redressal",
  "Tourism & Safety",
  "Health & Sanitation",
  "Water Supply",
  "Town Planning & Trade",
  "General & Emergency",
];

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faqData: CreateFaqPayload, id?: number) => Promise<void>;
  faqToEdit?: FaqItemDto | null;
}

export function FaqModal({
  isOpen,
  onClose,
  onSave,
  faqToEdit,
}: FaqModalProps) {
  const isEditing = Boolean(faqToEdit);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("General");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (faqToEdit) {
      setQuestion(faqToEdit.question || "");
      setAnswer(faqToEdit.answer || "");
      setCategory(faqToEdit.category || "General");
      setActive(faqToEdit.active !== false);
    } else {
      setQuestion("");
      setAnswer("");
      setCategory("General");
      setActive(true);
    }
    setErrors({});
  }, [faqToEdit, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { question?: string; answer?: string } = {};
    if (!question.trim()) {
      newErrors.question = "Question is required";
    }
    if (!answer.trim()) {
      newErrors.answer = "Answer is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const payload: CreateFaqPayload = {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim() || "General",
        active: active,
      };

      await onSave(payload, faqToEdit?.id);
      onClose();
    } catch (err) {
      console.error("Failed to save FAQ:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                  {isEditing ? "Edit FAQ" : "Add New FAQ"}
                </span>
                <h2 className="text-xl font-black text-white mt-1">
                  {isEditing ? "Edit Question & Answer" : "New Question & Answer"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Question Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>Question</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>
            <input
              type="text"
              autoFocus
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (errors.question) setErrors((prev) => ({ ...prev, question: undefined }));
              }}
              placeholder="e.g. How can I pay my Property Tax online?"
              className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-gray-50 border transition-all focus:bg-white focus:outline-hidden ${
                errors.question
                  ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20"
                  : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-emerald-100"
              }`}
            />
            {errors.question && (
              <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.question}</span>
              </p>
            )}
          </div>

          {/* Category Input / Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Category</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                list="faq-categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select or enter category..."
                className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:outline-hidden"
              />
              <datalist id="faq-categories">
                {COMMON_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Answer Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                <span>Answer</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>
            <textarea
              rows={5}
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (errors.answer) setErrors((prev) => ({ ...prev, answer: undefined }));
              }}
              placeholder="Enter the official answer or citizen guideline..."
              className={`w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-gray-50 border transition-all focus:bg-white focus:outline-hidden resize-y ${
                errors.answer
                  ? "border-rose-400 ring-2 ring-rose-100 bg-rose-50/20"
                  : "border-gray-200 focus:border-primary focus:ring-2 focus:ring-emerald-100"
              }`}
            />
            {errors.answer && (
              <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.answer}</span>
              </p>
            )}
          </div>

          {/* Active / Inactive Status Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
            <div>
              <p className="text-xs font-bold text-gray-800">
                Status: {active ? "Active" : "Inactive"}
              </p>
              <p className="text-[11px] text-gray-500">
                {active ? "Visible to public website" : "Hidden from public website"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                active ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  active ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSubmitting ? "Saving..." : isEditing ? "Update FAQ" : "Save FAQ"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
