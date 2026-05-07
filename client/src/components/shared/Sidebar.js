"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Edit3, Shield, Mail, MessageSquare, 
  PanelLeftClose, PanelLeft, X 
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Sidebar({ isOpen, onToggle, user, onLogout }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Editor", href: "/editor", icon: Edit3 },
    { name: "ATS Checker", href: "/ats-checker", icon: Shield },
    { name: "Cover Letter", href: "/cover-letter", icon: Mail },
    { name: "AI Consultant", href: "/qa", icon: MessageSquare },
  ];

  return (
    <aside className={cn(
      "bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 z-40 transition-all duration-300 ease-in-out",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Logo / Toggle Area */}
        <div className={cn(
          "flex items-center mb-10 transition-all gap-2",
          isOpen ? "justify-between px-2" : "justify-center"
        )}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="ResumeForge Logo" width={32} height={32} className="rounded-lg object-contain" />
            {isOpen && <span className="text-xl font-black text-gray-900 tracking-tighter">ResumeForge</span>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn("bg-gray-50 text-gray-400 hover:text-[#FF6B00]", !isOpen && "hover:bg-[#FF6B00]/5")}
          >
            {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 py-2.5 rounded-xl font-bold transition-all text-xs group",
                  isOpen ? "px-4" : "justify-center",
                  isActive 
                    ? "bg-[#FF6B00]/10 text-[#FF6B00]" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 min-w-[20px]",
                  isActive ? "text-[#FF6B00]" : "text-gray-400 group-hover:text-gray-600"
                )} /> 
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        {/* Profile Section */}
        <div className={cn(
          "mt-auto transition-all",
          isOpen ? "p-5 bg-gray-50 rounded-[2rem] border border-gray-100/50" : "flex flex-col items-center gap-4"
        )}>
          <div className={cn("flex items-center", isOpen ? "gap-3" : "justify-center")}>
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-[#FF6B00] text-white flex items-center justify-center font-black text-lg shadow-sm">
              {user?.name?.[0] || "U"}
            </div>
            {isOpen && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-black text-gray-900 truncate leading-none mb-1">{user?.name || "User"}</p>
                <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-tighter">{user?.email || "user@example.com"}</p>
              </div>
            )}
          </div>
          {isOpen ? (
            <div className="flex justify-end mt-3">
              <button onClick={onLogout} className="text-[10px] font-black text-[#FF6B00] hover:underline transition-all uppercase tracking-widest">Logout</button>
            </div>
          ) : (
            <button onClick={onLogout} className="p-2 text-gray-400 hover:text-[#FF6B00] transition-all">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

