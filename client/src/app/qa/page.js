"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Send, Bot } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

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

        <div className="max-w-4xl mx-auto p-6 md:p-12 flex-1 w-full pt-0 flex flex-col">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-8 shadow-sm flex-1 flex flex-col min-h-[500px]">
             <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-orange-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Bot className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">ResumeForge AI Assistant</h2>
                <p className="text-gray-500 font-medium text-sm max-w-sm">Ask me anything about your career, resume optimization, or interview prep.</p>
             </div>
             
             <div className="mt-auto pt-6 border-t border-gray-50">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message here..."
                    className="w-full pl-6 pr-16 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl shadow-lg shadow-orange-100 hover:bg-primary/90 transition-all">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
             </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
