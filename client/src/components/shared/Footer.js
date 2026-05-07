import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-6">
              <Image src="/logo.png" alt="ResumeForge Logo" width={36} height={36} className="rounded-xl object-contain" /> ResumeForge
            </Link>
            <p className="text-gray-500 max-w-xs font-medium leading-relaxed">
              The world&apos;s most advanced AI resume builder. Optimized for ATS, designed for humans.
            </p>
          </div>
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="/editor" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">Resume Editor</Link></li>
              <li><Link href="/ats-checker" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">ATS Checker</Link></li>
              <li><Link href="/cover-letter" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">Cover Letter Builder</Link></li>
              <li><Link href="/qa" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">AI Consultant</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px] mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-bold text-gray-400 hover:text-[#FF6B00] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-bold text-gray-400 hover:text-[#FF6B00] uppercase tracking-widest transition-colors">Twitter</Link>
            <Link href="#" className="text-xs font-bold text-gray-400 hover:text-[#FF6B00] uppercase tracking-widest transition-colors">LinkedIn</Link>
            <Link href="#" className="text-xs font-bold text-gray-400 hover:text-[#FF6B00] uppercase tracking-widest transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

