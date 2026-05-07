"use client";

import { useRef } from "react";
import { History, FileText, Wand2, Loader2 } from "lucide-react";

export default function Builder({
  title,
  setTitle,
  resumes,
  selectedResumeId,
  setSelectedResumeId,
  uploadedFile,
  setUploadedFile,
  jobDescription,
  setJobDescription,
  onGenerate,
  isLoading
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setSelectedResumeId("");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          Details
        </h3>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-b border-gray-100 focus:border-primary text-sm font-bold text-gray-600 focus:outline-none px-2 py-1 text-right"
          placeholder="Untitled Letter"
        />
      </div>

      <div className="space-y-6">
        {/* Resume Selection */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">1. Select Resume</label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select 
              value={selectedResumeId}
              onChange={(e) => {
                setSelectedResumeId(e.target.value);
                setUploadedFile(null);
              }}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
            >
              <option value="">Saved Resumes...</option>
              {resumes.map(r => (
                <option key={r._id} value={r._id}>{r.title}</option>
              ))}
            </select>
            <button 
              onClick={() => fileInputRef.current.click()}
              className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-3 transition-all
                ${uploadedFile ? "border-green-200 bg-green-50 text-green-600" : "border-gray-100 text-gray-400 hover:border-primary/30"}`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[80px]">
                {uploadedFile ? uploadedFile.name : "Upload PDF"}
              </span>
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.docx,.txt"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">2. Job Description</label>
          <textarea 
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to help AI personalize your letter..."
            className="w-full h-48 bg-gray-50 border border-gray-100 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium text-gray-600"
          />
        </div>

        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Wand2 className="w-4 h-4 fill-primary text-primary" />
          )}
          Generate with AI
        </button>
      </div>
    </div>
  );
}
