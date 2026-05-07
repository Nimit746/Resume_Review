"use client";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function LayoutProvider({ children }) {
  const pathname = usePathname();
  
  const isApp = pathname.startsWith("/dashboard") || 
                pathname.startsWith("/editor") || 
                pathname.startsWith("/ats-checker") || 
                pathname.startsWith("/cover-letter") || 
                pathname.startsWith("/qa");
                
  const isStandalone = isApp || pathname.startsWith("/resume") || pathname.startsWith("/auth");

  return (
    <>
      {!isStandalone && <Navbar />}
      <main className={!isStandalone ? "pt-16 min-h-screen" : "min-h-screen"}>
        {children}
      </main>
      {!isStandalone && <Footer />}
      <Toaster position="top-right" />
    </>
  );
}
