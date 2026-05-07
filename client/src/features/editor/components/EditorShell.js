"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/shared/Sidebar";
import EditorTopBar from "./EditorTopBar";
import EditorPanel from "./EditorPanel";
import PreviewPanel from "./PreviewPanel";

import { useResume } from "@/hooks/useResume";
import { DEFAULT_RESUME_DATA } from "@/constants/editor";

export default function EditorShell({ user, initialResume }) {
  const {
    resumeData,
    resumeTitle,
    setResumeTitle,
    resumeId,
    saving,
    updateSection,
    saveResume,
  } = useResume(initialResume);

  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeTab,    setActiveTab]    = useState("personal");
  const [view,         setView]         = useState("split");

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("rf_user");
      window.location.href = "/";
    } catch {
      console.error("Logout failed");
    }
  };

  // Handlers
  const handleSave = () => saveResume();

  const handleDownload = () => {
    const el = document.getElementById("resume-preview");
    if (!el) { toast.error("Switch to Preview or Split view first."); return; }
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${resumeTitle}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;padding:0;}@media print{body{margin:0;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  const showEditor  = view === "split" || view === "editor";
  const showPreview = view === "split" || view === "preview";

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} user={user} onLogout={handleLogout} />

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <EditorTopBar
          resumeTitle={resumeTitle}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          setResumeTitle={setResumeTitle}
          view={view}
          setView={setView}
          saving={saving}
          onSave={handleSave}
          onDownload={handleDownload}
        />

        <div className="flex flex-1" style={{ height: "calc(100vh - 57px)" }}>
          {showEditor && (
            <EditorPanel
              resumeData={resumeData}
              update={updateSection}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              fullWidth={!showPreview}
            />
          )}
          {showPreview && (
            <PreviewPanel
              resumeData={resumeData}
              fullWidth={!showEditor}
            />
          )}
        </div>
      </main>
    </div>
  );
}
