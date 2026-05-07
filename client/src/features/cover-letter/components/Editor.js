"use client";

import { Edit3, Copy, Save, Mail } from "lucide-react";

export default function Editor({
  generatedContent,
  setGeneratedContent,
  onSave,
  onCopy,
  isLoading
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col min-h-[600px] relative">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          Editor
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={onCopy}
            className="p-2.5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-orange-100 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      <textarea 
        value={generatedContent}
        onChange={(e) => setGeneratedContent(e.target.value)}
        placeholder="Start typing or use AI to generate..."
        className="flex-1 w-full bg-transparent border-none focus:outline-none text-sm font-medium leading-relaxed text-gray-600 resize-none pb-8 z-10"
      />

      {!generatedContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
          <Mail className="w-20 h-20 text-gray-300 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-300">Nothing written yet</p>
        </div>
      )}
    </div>
  );
}
