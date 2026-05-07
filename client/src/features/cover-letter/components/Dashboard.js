"use client";

import { motion } from "framer-motion";
import { Mail, Edit3, Download, Trash2, Sparkles, Wand2, Search } from "lucide-react";

export default function Dashboard({ 
  coverLetters, 
  onStartNew, 
  onEdit, 
  onDelete,
  searchQuery,
  setSearchQuery
}) {
  return (
    <motion.div 
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-all" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letters by title..." 
            className="w-full pl-10 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {coverLetters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverLetters.map((cl) => (
            <div key={cl._id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">{cl.title}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Modified {new Date(cl.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(cl)}
                    className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all hover:bg-white border border-transparent hover:border-gray-100"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all hover:bg-white border border-transparent hover:border-gray-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => onDelete(cl._id)}
                  className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-red-500 transition-all hover:bg-white border border-transparent hover:border-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-6 border border-gray-100 border-dashed">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-400 text-sm max-w-xs font-medium">
            We couldn&apos;t find any cover letters matching &quot;{searchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-16 shadow-sm text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Write Better Letters</h2>
          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-10 max-w-sm mx-auto">Generate professional, tailored cover letters in seconds. Our AI analyzes the job description to highlight your strengths.</p>
          <button 
            onClick={onStartNew}
            className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto"
          >
            < Wand2 className="w-5 h-5 text-primary" /> Start Writing Now
          </button>
        </div>
      )}
    </motion.div>
  );
}
