"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, Bot } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import Footer from "@/components/shared/Footer";
import AIConsultant from "@/features/dashboard/components/AIConsultant";

export default function QA() {
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
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Consultant</h1>
        </div>

        <div className="max-w-4xl mx-auto p-6 md:p-12 flex-1 w-full pt-0">
          <AIConsultant />
        </div>
        <Footer />
      </main>
    </div>
  );
}
