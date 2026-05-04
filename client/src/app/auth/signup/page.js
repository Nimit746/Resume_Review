"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShieldCheck, Mail, Lock, User, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("/api/auth/signup", formData);
      // Store user info in localStorage for UI greeting, but middleware handles route protection
      localStorage.setItem("rf_user", JSON.stringify(response.data.user));
      router.push("/dashboard");
      router.refresh(); // Refresh to ensure middleware catches the new cookie
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-inter">
      {/* Left: Decorative Side */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 max-w-lg">
          <Link href="/" className="text-3xl font-black text-white flex items-center gap-2 mb-12">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">R</span> ResumeForge
          </Link>
          <h2 className="text-6xl font-black text-white leading-tight mb-8">Elevate Your Career with <span className="text-primary underline">Precision.</span></h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">The ultimate platform for professional resume building and career tracking.</p>
          
          <div className="space-y-6">
            {[
              "AI-Optimized Keyword targeting",
              "Premium print-ready templates",
              "Real-time ATS score feedback",
              "Custom AI cover letter generation"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-300 font-bold">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="lg:hidden mb-12">
              <Link href="/" className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">R</span> ResumeForge
              </Link>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Join our professional community today</p>
          </div>

          <div className="space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-700 hover:bg-gray-50 transition-all group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-300 font-black uppercase tracking-[0.3em]">OR USE EMAIL</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary/50 focus:bg-white focus:outline-none transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary/50 focus:bg-white focus:outline-none transition-all font-bold"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary/50 focus:bg-white focus:outline-none transition-all font-bold"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-primary/90 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70 group"
              >
                {loading ? "Registering..." : "Create Account"}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="text-center mt-12 text-gray-400 font-bold">
              Already a member? <Link href="/auth/login" className="text-primary hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-8 flex items-center gap-2 text-gray-300 text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> SSL Secure
        </div>
      </div>
    </div>
  );
}
