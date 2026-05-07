import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-white font-inter">
      {/* Left: Decorative Side */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF6B00]/20 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-900/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        <div className="relative z-10 max-w-lg">
          <Link href="/" className="text-3xl font-black text-white flex items-center gap-2 mb-12">
            <Image src="/logo.png" alt="ResumeForge Logo" width={40} height={40} className="rounded-lg object-contain" /> ResumeForge
          </Link>
          <h2 className="text-6xl font-black text-white leading-tight mb-8">Elevate Your Career with <span className="text-[#FF6B00] underline">Precision.</span></h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">The ultimate platform for professional resume building and career tracking.</p>
          
          <div className="space-y-6">
            {[
              "AI-Optimized Keyword targeting",
              "Premium print-ready templates",
              "Real-time ATS score feedback",
              "Custom AI cover letter generation"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4 text-gray-300 font-bold">
                <div className="w-6 h-6 bg-[#FF6B00]/20 rounded-lg flex items-center justify-center text-[#FF6B00] border border-[#FF6B00]/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Content Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 relative">
        <div className="max-w-md w-full">
          <div className="mb-12">
            <div className="lg:hidden mb-12">
              <Link href="/" className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Image src="/logo.png" alt="ResumeForge Logo" width={32} height={32} className="rounded-lg object-contain" /> ResumeForge
              </Link>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{title}</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{subtitle}</p>
          </div>

          {children}
        </div>
        
        <div className="absolute bottom-8 flex items-center gap-2 text-gray-300 text-xs font-black uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> SSL Secure
        </div>
      </div>
    </div>
  );
}
