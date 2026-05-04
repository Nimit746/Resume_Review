"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Sparkles, Wand2, Mail } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

export default function CoverLetter() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cover Letter</h1>
        </div>

        <div className="max-w-4xl mx-auto p-6 md:p-12 flex-1 w-full pt-0 flex flex-col justify-center">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Sparkles className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Write Better Letters</h2>
              <p className="text-gray-500 font-medium text-sm leading-relaxed mb-10">Generate professional, tailored cover letters in seconds. Our AI analyzes the job description to highlight your most relevant strengths.</p>

              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-3">
                <Wand2 className="w-5 h-5 text-primary" /> Start Writing Now
              </button>

              <div className="mt-10 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <Mail className="w-3 h-3 text-primary" /> Personalized for every role
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
