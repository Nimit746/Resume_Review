"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  Plus, FileText, BarChart2, Download, Search, 
  MoreVertical, Clock, CheckCircle2, ChevronRight,
  Bell, Settings, Users, Trash2, Edit3
} from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Footer from "../../components/layout/Footer";

// Custom Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const debouncedSearch = useDebounce(searchQuery, 300);

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
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      fetchResumes();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await axios.delete(`/api/resumes?id=${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    } catch (err) {
      alert("Failed to delete resume");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("rf_user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const filteredResumes = resumes.filter(resume => 
    resume.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

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
        <div className="max-w-6xl mx-auto p-6 md:p-10 flex-1 w-full">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resumes by title..." 
                  className="w-full pl-10 pr-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <button className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-primary transition-all shadow-sm">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hello, {user?.name?.split(' ')[0] || "there"}!</h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">Welcome back to your workspace.</p>
            </div>
            <Link href="/editor" className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-gray-800 shadow-xl transition-all">
              <Plus className="w-5 h-5 text-primary" /> Create New
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Performance", value: "0/100", trend: "0%", icon: <BarChart2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Resume Views", value: "0", trend: "0%", icon: <Users className="w-5 h-5" />, color: "text-purple-500", bg: "bg-purple-500/10" },
              { label: "Job Matches", value: "0", trend: "0%", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-500", bg: "bg-green-500/10" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{stat.trend}</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Portfolio Section */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Resumes</h2>
              <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
            </div>

            {filteredResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResumes.map((resume) => (
                  <div key={resume._id} className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] hover:shadow-xl hover:bg-white transition-all group">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-all">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-1">{resume.title}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link href="/editor" className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all">
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleDelete(resume._id)}
                        className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Link href="/editor" className="p-6 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-center hover:border-primary/20 transition-all group">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-4 group-hover:text-primary transition-all">
                     <Plus className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">New Resume</span>
                </Link>
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
                  <Link href="/editor" className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-xl shadow-orange-100">
                    Create First Resume
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
