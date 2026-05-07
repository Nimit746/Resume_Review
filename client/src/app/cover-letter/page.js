"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, ChevronLeft 
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "@/components/shared/Sidebar";
import Footer from "@/components/shared/Footer";

// Sub-components
import Dashboard from "@/features/cover-letter/components/Dashboard";
import Builder   from "@/features/cover-letter/components/Builder";
import Editor    from "@/features/cover-letter/components/Editor";

export default function CoverLetter() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [view, setView] = useState("dashboard"); // dashboard, builder
  const [coverLetters, setCoverLetters] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Builder/Editor state
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [title, setTitle] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLetters = coverLetters.filter(letter => 
    letter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchCoverLetters = async () => {
    try {
      const res = await axios.get("/api/cover-letters");
      setCoverLetters(res.data.coverLetters);
    } catch (err) {
      console.error("Failed to fetch cover letters");
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get("/api/resumes");
      setResumes(res.data.resumes);
    } catch (err) {
      console.error("Failed to fetch resumes");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const storedUser = localStorage.getItem("rf_user");
      if (storedUser) setUser(JSON.parse(storedUser));
      fetchCoverLetters();
      fetchResumes();
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

  const startNew = () => {
    setCurrentId(null);
    setTitle("My New Cover Letter");
    setJobDescription("");
    setGeneratedContent("");
    setSelectedResumeId("");
    setUploadedFile(null);
    setView("builder");
  };

  const editExisting = (cl) => {
    setCurrentId(cl._id);
    setTitle(cl.title);
    setJobDescription(cl.jobDescription);
    setGeneratedContent(cl.content);
    setSelectedResumeId(cl.resumeId || "");
    setUploadedFile(null);
    setView("builder");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      await axios.delete(`/api/cover-letters?id=${id}`);
      setCoverLetters(coverLetters.filter(c => c._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please provide a job description");
      return;
    }

    if (!selectedResumeId && !uploadedFile) {
      toast.error("Please select or upload a resume");
      return;
    }

    setIsLoading(true);
    const tid = toast.loading("AI is crafting your cover letter...");

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      } else {
        const res = resumes.find(r => r._id === selectedResumeId);
        const resumeText = JSON.stringify(res.data);
        formData.append("resume_text", resumeText);
      }

      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://localhost:8000";
      const response = await axios.post(`${pythonBackendUrl}/generate-cover-letter`, formData);
      setGeneratedContent(response.data.cover_letter);
      toast.success("Cover letter generated!", { id: tid });
    } catch (err) {
      console.error("Generation failed", err);
      toast.error("Failed to generate cover letter", { id: tid });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please provide a title");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/api/cover-letters", {
        id: currentId,
        title,
        content: generatedContent,
        jobDescription,
        resumeId: selectedResumeId || null
      });
      toast.success("Saved successfully");
      fetchCoverLetters();
      setView("dashboard");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    toast.success("Copied to clipboard");
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
        <div className="px-6 md:px-12 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {view === "builder" && (
              <button 
                onClick={() => setView("dashboard")}
                className="p-2 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 shadow-sm border border-transparent hover:border-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {view === "dashboard" ? "Cover Letters" : "Letter Builder"}
            </h1>
          </div>
          {view === "dashboard" && (
            <button 
              onClick={startNew}
              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 shadow-xl transition-all"
            >
              <Plus className="w-4 h-4 text-primary" /> Create New
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12 flex-1 w-full pt-0">
          <AnimatePresence mode="wait">
            {view === "dashboard" ? (
              <Dashboard 
                coverLetters={filteredLetters}
                onStartNew={startNew}
                onEdit={editExisting}
                onDelete={handleDelete}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            ) : (
              <motion.div 
                key="builder-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <Builder 
                  title={title}
                  setTitle={setTitle}
                  resumes={resumes}
                  selectedResumeId={selectedResumeId}
                  setSelectedResumeId={setSelectedResumeId}
                  uploadedFile={uploadedFile}
                  setUploadedFile={setUploadedFile}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  onGenerate={handleGenerate}
                  isLoading={isLoading}
                />
                <Editor 
                  generatedContent={generatedContent}
                  setGeneratedContent={setGeneratedContent}
                  onSave={handleSave}
                  onCopy={copyToClipboard}
                  isLoading={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Footer />
      </main>
    </div>
  );
}
