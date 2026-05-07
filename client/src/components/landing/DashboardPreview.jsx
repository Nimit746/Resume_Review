"use client";

import React from 'react';
import { 
  Layout, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Trophy,
  Search,
  Settings,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Brain
} from 'lucide-react';

const DashboardPreview = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto group">
      {/* Background Glows */}
      <div className="absolute -inset-10 bg-gradient-to-r from-[#FF6B00]/20 to-orange-400/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-1000"></div>
      
      {/* Main Container */}
      <div className="relative bg-white border-[12px] border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[500px] md:h-[600px]">
        
        {/* Sidebar Mock */}
        <div className="hidden md:flex w-20 lg:w-64 bg-gray-50 border-r border-gray-100 flex-col p-4">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-gray-900 hidden lg:block">ResumeForge</span>
          </div>
          
          <div className="space-y-2 flex-1">
            {[
              { icon: Layout, label: "Dashboard", active: true },
              { icon: FileText, label: "My Resumes" },
              { icon: MessageSquare, label: "AI Consultant" },
              { icon: Search, label: "Job Tracker" },
              { icon: Settings, label: "Settings" }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-default ${
                  item.active ? 'bg-white shadow-sm border border-gray-100 text-[#FF6B00]' : 'text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm hidden lg:block">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-auto p-4 bg-orange-50 rounded-2xl hidden lg:block">
            <div className="flex items-center gap-2 mb-2 text-[#FF6B00]">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Premium Plan</span>
            </div>
            <p className="text-[10px] text-orange-600 font-bold leading-tight">Unlimited AI Generation enabled.</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Header */}
          <div className="h-16 border-b border-gray-50 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
              <span>My Resumes</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900">Senior Product Designer</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200" />
                 ))}
               </div>
               <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-black">Export PDF</button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor Pane */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30 scrollbar-hide">
              <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-gray-100 p-8 min-h-full">
                <div className="h-4 w-48 bg-gray-900 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-400 rounded mb-8" />
                
                <div className="space-y-6">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
                        <div className="h-3 w-full bg-gray-100 rounded" />
                      </div>
                      <div className="flex gap-3 relative group/suggestion">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0" />
                        <div className="h-3 w-4/5 bg-orange-100 rounded border-b-2 border-orange-200" />
                        {/* Suggestion Popover */}
                        <div className="absolute top-6 left-4 bg-white shadow-2xl rounded-lg p-3 border border-orange-100 w-64 z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="flex items-center gap-2 mb-2">
                             <Brain className="w-3.5 h-3.5 text-[#FF6B00]" />
                             <span className="text-[10px] font-black text-[#FF6B00] uppercase">AI Suggestion</span>
                           </div>
                           <p className="text-[11px] text-gray-600 font-medium">&quot;Quantify your impact. Try adding &apos;Led a team of 10 to increase conversion by 15%&apos;&quot;</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
                        <div className="h-3 w-full bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-6 bg-gray-50 rounded-full border border-gray-100" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Sidebar */}
            <div className="w-72 bg-white border-l border-gray-50 p-6 flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">ATS Analysis</h4>
                <div className="relative w-32 h-32 mx-auto">
                   <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                     <circle 
                      cx="64" cy="64" r="56" 
                      fill="none" 
                      stroke="#FF6B00" 
                      strokeWidth="8" 
                      strokeDasharray={351.8}
                      strokeDashoffset={351.8 * (1 - 0.94)}
                      strokeLinecap="round"
                      className="animate-[progress_2s_ease-out_forwards]"
                    />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-3xl font-black text-gray-900">94</span>
                     <span className="text-[10px] font-bold text-gray-400">EXCELLENT</span>
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-[10px] font-black text-green-800 uppercase">Keywords Meta</div>
                    <div className="text-[11px] text-green-700 font-bold">12/12 Match</div>
                  </div>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                   <TrendingUp className="w-4 h-4 text-[#FF6B00]" />
                   <div>
                     <div className="text-[10px] font-black text-orange-800 uppercase">Market Score</div>
                     <div className="text-[11px] text-orange-700 font-bold">Top 5% for Role</div>
                   </div>
                </div>
              </div>

              <div className="mt-auto bg-gray-900 rounded-2xl p-4 relative overflow-hidden group/chat">
                <div className="absolute top-0 right-0 p-2 text-white/20">
                  <MessageSquare className="w-12 h-12 -mr-4 -mt-4 rotate-12" />
                </div>
                <p className="text-[11px] text-white/70 mb-3 relative z-10 font-medium">Ask AI to fix the &quot;About Me&quot; section for more impact.</p>
                <button className="w-full py-2 bg-[#FF6B00] text-white rounded-lg text-[10px] font-black uppercase tracking-wider relative z-10">
                  Ask Consultant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Status Badges */}
      <div className="absolute -top-6 -right-6 bg-white shadow-2xl rounded-2xl p-4 border border-gray-100 hidden md:block animate-bounce-slow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900">+42%</div>
            <div className="text-[10px] font-bold text-gray-400">Interview Rate</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { stroke-dashoffset: 351.8; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardPreview;
