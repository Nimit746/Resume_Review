import React from "react";
import { cn } from "@/lib/utils";

export const Input = ({ label, value, onChange, placeholder, type = "text", className }) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && (
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:bg-white transition-all"
    />
  </div>
);

export const Textarea = ({ label, value, onChange, placeholder, rows = 3, className }) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label && (
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </label>
    )}
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 focus:bg-white transition-all resize-none"
    />
  </div>
);
