"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import AuthLayout from "@/features/auth/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", formData);
      localStorage.setItem("rf_user", JSON.stringify(response.data.user));
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Enter your credentials to continue">
      <div className="space-y-8">
        <button className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-700 hover:bg-gray-50 transition-all group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Login with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-300 font-black uppercase tracking-[0.3em]">OR USE EMAIL</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#FF6B00] transition-colors" />
              <input 
                type="email" 
                required
                placeholder="john@example.com"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#FF6B00]/50 focus:bg-white focus:outline-none transition-all font-bold"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Password</label>
              <Link href="#" className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest hover:underline">Forgot Password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-[#FF6B00] transition-colors" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#FF6B00]/50 focus:bg-white focus:outline-none transition-all font-bold"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FF6B00] text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-[#FF6B00]/90 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70 group"
          >
            {loading ? "Signing in..." : "Login to Workspace"}
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-12 text-gray-400 font-bold">
          Not a member yet? <Link href="/auth/signup" className="text-[#FF6B00] hover:underline">Create Account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

