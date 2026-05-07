"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Download, Trash2, Edit3, Plus, Search, Loader2, UploadCloud } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResumeList({ initialResumes }) {
  const [resumes, setResumes] = useState(initialResumes);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsImporting(true);
    const toastId = toast.loading("AI is parsing your resume... This may take a few seconds.");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/resumes/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const newResume = response.data.resume;
      setResumes([newResume, ...resumes]);
      toast.success("Resume imported successfully!", { id: toastId });
    } catch (err) {
      console.error("Import failed:", err);
      toast.error(err.response?.data?.error || "Failed to import resume", { id: toastId });
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = null;
    }
  };

  const performDelete = async (id) => {
    try {
      await axios.delete(`/api/resumes?id=${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success("Resume deleted successfully");
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Resumes</h2>
        <div className="w-full md:w-64">
          <Input 
            icon={Search}
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredResumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume) => (
            <Card key={resume._id} className="group bg-gray-50 hover:bg-white">
              <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-2xl flex items-center justify-center text-[#FF6B00] mb-6 group-hover:scale-110 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1 truncate">{resume.title}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="secondary" size="icon" href={`/editor?id=${resume._id}`}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => setConfirmingDelete(resume._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
          <Link href="/editor" className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center hover:border-[#FF6B00]/20 transition-all group">
             <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-4 group-hover:text-[#FF6B00] transition-all">
               <Plus className="w-5 h-5" />
             </div>
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">New Resume</span>
          </Link>

          <label className={`p-6 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all group relative cursor-pointer
            ${isImporting ? "bg-gray-50/50 border-primary/20" : "hover:border-[#FF6B00]/20"}`}>
             <input 
               type="file" 
               className="hidden" 
               accept=".pdf,.docx,.txt"
               onChange={handleImport}
               disabled={isImporting}
             />
             {isImporting ? (
               <>
                 <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                 <span className="text-xs font-black text-primary uppercase tracking-widest">Importing...</span>
               </>
             ) : (
               <>
                 <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-4 group-hover:text-[#FF6B00] transition-all">
                   <UploadCloud className="w-5 h-5" />
                 </div>
                 <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Import Resume</span>
               </>
             )}
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-100 border-dashed">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">
            {searchQuery ? "No matching resumes" : "No resumes yet"}
          </h3>
          <p className="text-gray-400 text-sm max-w-xs font-medium mb-10">
            {searchQuery ? `We couldn't find any resumes matching "${searchQuery}"` : "Start by creating your first AI-powered resume to land your dream job."}
          </p>
          {!searchQuery && (
            <Button href="/editor" variant="primary" size="md">
              Create First Resume
            </Button>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmingDelete && (
        <div className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-sm w-full p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-gray-500 font-bold mb-8 leading-relaxed">This action cannot be undone. Your resume data will be permanently removed.</p>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                size="md" 
                className="flex-1 text-[10px] tracking-widest uppercase"
                onClick={() => setConfirmingDelete(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                size="md" 
                className="flex-1 text-[10px] tracking-widest uppercase"
                onClick={() => { performDelete(confirmingDelete); setConfirmingDelete(null); }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
