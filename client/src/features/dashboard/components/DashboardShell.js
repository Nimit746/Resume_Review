"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/Sidebar";
import Footer from "@/components/shared/Footer";
import axios from "axios";

export default function DashboardShell({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("rf_user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen font-inter overflow-x-hidden relative">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
        user={user} 
        onLogout={handleLogout} 
      />

      <main className={`flex-1 transition-all duration-300 flex flex-col min-h-screen ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex-1 w-full">
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
