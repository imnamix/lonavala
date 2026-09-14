"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search by keyword...",
  onClear,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
