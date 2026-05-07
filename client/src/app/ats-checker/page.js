"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Plus, Target, Zap, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/shared/Sidebar";
import Footer from "@/components/shared/Footer";

export default function ATSChecker() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const storedUser = localStorage.getItem("rf_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("rf_user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" selected`);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste a job description");
      return;
    }

    setIsAnalyzing(true);
    const toastId = toast.loading("Analyzing your resume against the job description...");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      // Using direct URL to Python backend for now. 
      // In production, this should be an environment variable or handled via proxy.
      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(`${pythonBackendUrl}/ats-analyze`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResults(response.data);
      toast.success("Analysis complete!", { id: toastId });
    } catch (err) {
      console.error("Analysis failed", err);
      toast.error(err.response?.data?.detail || "Analysis failed. Please make sure the backend is running.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen font-inter overflow-x-hidden relative">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <div className="px-6 md:px-12 py-6 flex items-center gap-4">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">ATS Checker</h1>
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-12 flex-1 w-full pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  Input Data
                </h3>

                {/* File Upload */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx,.txt" 
                  className="hidden" 
                />
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer group mb-6 text-center
                    ${file ? "border-green-100 bg-green-50/30" : "border-gray-100 bg-gray-50/50 hover:bg-white hover:border-primary/20"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm transition-all
                    ${file ? "bg-green-500 text-white" : "bg-white text-gray-300 group-hover:text-primary"}`}>
                    {file ? <CheckCircle2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-widest transition-all
                    ${file ? "text-green-600" : "text-gray-400 group-hover:text-primary"}`}>
                    {file ? file.name : "Upload Resume (PDF/DOCX)"}
                  </p>
                  {file && <p className="text-[10px] text-green-500 font-bold mt-1 uppercase tracking-wider">File Selected</p>}
                </div>

                {/* Job Description */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Job Description</label>
                  <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-64 bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-medium text-gray-600"
                  />
                </div>

                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-8 bg-gray-900 hover:bg-black text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-primary text-primary" />
                      Run ATS Analysis
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {results ? (
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                        <Target className="w-4 h-4" />
                      </div>
                      Analysis Result
                    </h3>
                    <div className="px-4 py-2 bg-gray-900 rounded-2xl text-white font-black text-sm">
                      Score: {results.score}%
                    </div>
                  </div>

                    {/* Matching Keywords */}
                    <div className="mb-8">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Matching Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.matching_keywords.map((kw, i) => {
                          const text = typeof kw === "object" ? (kw.keyword || kw.text || JSON.stringify(kw)) : kw;
                          return (
                            <span key={i} className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[11px] font-bold border border-green-100 shadow-sm transition-all hover:bg-green-100">
                              {text}
                            </span>
                          );
                        })}
                        {results.matching_keywords.length === 0 && <p className="text-xs text-gray-400 font-medium italic">No matches found</p>}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="mb-8">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.missing_keywords.map((kw, i) => {
                          const text = typeof kw === "object" ? (kw.keyword || kw.text || JSON.stringify(kw)) : kw;
                          return (
                            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-[11px] font-bold border border-red-100 shadow-sm transition-all hover:bg-red-100">
                              {text}
                            </span>
                          );
                        })}
                        {results.missing_keywords.length === 0 && <p className="text-xs text-gray-400 font-medium italic">None missing!</p>}
                      </div>
                    </div>

                    {/* Improvements */}
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Suggested Improvements</h4>
                      <ul className="space-y-4">
                        {results.improvements.map((imp, i) => {
                          const isObject = typeof imp === "object" && imp !== null;
                          const category = isObject ? (imp.category || "General") : null;
                          const description = isObject ? (imp.description || imp.text || JSON.stringify(imp)) : imp;

                          return (
                            <li key={i} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex gap-4 transition-all hover:bg-white hover:shadow-md hover:border-primary/10">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(255,107,0,0.4)]" />
                              <div className="space-y-1">
                                {category && (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{category}</span>
                                )}
                                <p className="text-xs text-gray-700 font-semibold leading-relaxed">
                                  {description}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 shadow-sm text-center border-dashed flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-200 mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest">Ready for analysis</h3>
                  <p className="text-xs text-gray-300 mt-2 max-w-[200px] mx-auto leading-relaxed">Upload your resume and provide a job description to see your ATS score.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 text-center flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 text-primary" /> Powered by ResumeForge AI
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
