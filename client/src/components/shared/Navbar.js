import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span
           className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="ResumeForge Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain transition-all duration-300 group-hover:scale-105"
            />
          </span>
          <span className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-[#FF6B00] group-hover:to-[#FF8C42] transition-all duration-300">
            ResumeForge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/#features" className="text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors">Features</Link>
          <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors">Dashboard</Link>
          <Link href="/auth/login" className="text-sm font-black text-gray-900 hover:text-[#FF6B00] transition-colors">Sign In</Link>
          <Button href="/auth/signup" variant="primary" size="md">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}

