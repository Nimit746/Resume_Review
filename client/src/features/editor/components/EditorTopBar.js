"use client";

import { useRef } from "react";
import { Save, Download, Edit3, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function EditorTopBar({
  resumeTitle,
  editingTitle,
  setEditingTitle,
  setResumeTitle,
  view,
  setView,
  saving,
  onSave,
  onDownload,
}) {
  const titleRef = useRef(null);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between gap-3 shadow-sm">
      {/* Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] shrink-0">
          <Edit3 className="w-4 h-4" />
        </div>
        {editingTitle ? (
          <input
            ref={titleRef}
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            autoFocus
            className="text-sm font-black text-gray-900 bg-transparent border-b-2 border-[#FF6B00] outline-none w-48"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="text-sm font-black text-gray-900 hover:text-[#FF6B00] transition-all truncate max-w-[180px]"
          >
            {resumeTitle}
          </button>
        )}
      </div>

      {/* View Switcher */}
      <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {[["split", "Split"], ["editor", "Editor"], ["preview", "Preview"]].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
              view === v ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onSave}
          disabled={saving}
          variant="dark"
          size="sm"
          className="gap-2"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{saving ? "Saving…" : "Save"}</span>
        </Button>
        <Button
          onClick={onDownload}
          variant="primary"
          size="sm"
          className="gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export PDF</span>
        </Button>
      </div>
    </div>
  );
}
