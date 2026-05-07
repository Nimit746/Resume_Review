"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export function SectionCard({ title, icon: Icon, color, children, onAdd, addLabel }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center", color)}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h2>
        </div>
        {onAdd && (
          <Button
            onClick={onAdd}
            variant="ghost"
            size="sm"
            className="text-[10px] text-[#FF6B00] uppercase tracking-widest"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> {addLabel || "Add"}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

export function CollapsibleItem({ title, subtitle, onDelete, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-3">
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <p className="text-sm font-black text-gray-800">{title || "Untitled"}</p>
          {subtitle && <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      {open && <div className="p-4 grid grid-cols-1 gap-3">{children}</div>}
    </div>
  );
}
