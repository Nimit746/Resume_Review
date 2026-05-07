"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-900">
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-white p-10 flex flex-col items-center justify-center gap-8 md:hidden animate-in fade-in zoom-in-95">
          <Link href="/auth/login" onClick={() => setIsOpen(false)} className="text-2xl font-black text-gray-900">Sign In</Link>
          <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="text-2xl font-black text-[#FF6B00]">Get Started</Link>
          <button onClick={() => setIsOpen(false)} className="mt-20 p-4 rounded-full bg-gray-50 text-gray-400"><X /></button>
        </div>
      )}
    </>
  );
}
