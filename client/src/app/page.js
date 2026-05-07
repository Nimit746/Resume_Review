import Link from "next/link";
import Image from "next/image";
import { Zap, Shield, Star, ArrowRight, Sparkles, Trophy, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import MobileMenu from "@/components/shared/MobileMenu";

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-hidden bg-white font-inter">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Image src="/logo.png" alt="ResumeForge Logo" width={36} height={36} className="rounded-xl object-contain" /> ResumeForge
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors">Features</Link>
          <Link href="#success" className="text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors">Success Stories</Link>
          <Link href="/auth/login" className="text-sm font-black text-gray-900 hover:text-[#FF6B00] transition-colors">Sign In</Link>
          <Button href="/auth/signup" variant="primary" size="md">
            Get Started
          </Button>
        </div>

        <MobileMenu />
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-56 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF6B00]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-200/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B00] text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4" /> Professional Resume Solution
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight mb-8 leading-[1.1]">
              Elevate Your <span className="text-[#FF6B00] italic">Career</span> with AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              The world&apos;s most advanced AI resume builder. Optimized for ATS, designed for humans, and built to land you interviews.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
              <Button href="/auth/signup" variant="primary" size="lg" className="group">
                Build My Resume <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button href="/auth/login" variant="secondary" size="lg">
                Sign In
              </Button>
            </div>

            {/* Dashboard Preview */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B00]/20 to-orange-300/20 rounded-[3rem] blur-2xl opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white bg-gray-50">
                <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                   <p className="text-gray-400 font-bold italic">Application Preview Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24">
          {[
            { label: "Methodology", value: "Proven" },
            { label: "Templates", value: "Premium" },
            { label: "Infrastructure", value: "Secure" },
            { label: "Generation", value: "Fast" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900">{stat.value}</span>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Built for the Modern Job Market</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">Standard resumes don&apos;t cut it anymore. You need an edge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: <Zap className="w-10 h-10 text-[#FF6B00]" />, 
                title: "AI-Powered Content", 
                desc: "Our neural networks analyze successful resume patterns to suggest the perfect bullet points for your specific role.",
                color: "bg-orange-50"
              },
              { 
                icon: <Trophy className="w-10 h-10 text-[#FF6B00]" />, 
                title: "ATS-Dominant", 
                desc: "Every template is rigorously tested against major Applicant Tracking Systems to ensure maximum readability.",
                color: "bg-blue-50"
              },
              { 
                icon: <Shield className="w-10 h-10 text-[#FF6B00]" />, 
                title: "Bank-Grade Security", 
                desc: "Your professional data is yours. We use industry-standard encryption to protect your personal information.",
                color: "bg-green-50"
              }
            ].map((f, i) => (
              <Card key={i} padding="p-10" className="group hover:shadow-2xl hover:shadow-[#FF6B00]/5 duration-500">
                <div className={`w-20 h-20 ${f.color} rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="success" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Success Stories</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-orange-400 fill-current" />)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "User Name", role: "Professional Role", text: "ResumeForge has been an essential tool for my professional growth and career development." },
              { name: "User Name", role: "Professional Role", text: "The templates and AI suggestions made a significant difference in my job search experience." },
              { name: "User Name", role: "Professional Role", text: "A powerful platform that delivers consistent quality and professional results every time." }
            ].map((t, i) => (
              <Card key={i} padding="p-10" className="bg-gray-50 hover:bg-white hover:shadow-2xl duration-500">
                <p className="text-lg text-gray-700 italic mb-8 leading-relaxed">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF6B00]/10 flex items-center justify-center font-bold text-[#FF6B00] text-xl">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{t.name}</h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto bg-[#FF6B00] rounded-[3.5rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -mr-64 -mt-64 blur-3xl"></div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Start Building Your <br/>Future <span className="italic underline">Today.</span></h2>
          <p className="text-xl md:text-2xl text-orange-50 mb-12 max-w-3xl mx-auto font-medium">Join the professional ranks and command the career you deserve.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button href="/auth/signup" variant="secondary" size="lg" className="bg-white text-[#FF6B00] hover:bg-orange-50 px-12">
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

