"use client";

import { Eye } from "lucide-react";
import ResumePreview from "./ResumePreview";
import { cn } from "@/lib/utils";

export default function PreviewPanel({ resumeData, fullWidth }) {
  return (
    <div className={cn("overflow-y-auto bg-gray-200 flex flex-col", fullWidth ? "w-full" : "w-1/2")}>
      {/* Preview Header */}
      <div className="sticky top-0 z-20 bg-gray-200 border-b border-gray-300 px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5" /> Live Preview
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-6 flex justify-center">
        <div className="w-full max-w-[680px] min-h-[900px] shadow-2xl rounded-sm overflow-hidden">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}
