"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Dashboard and Auth pages have their own navigation structure
  const isApp = pathname.startsWith("/dashboard") || 
                pathname.startsWith("/editor") || 
                pathname.startsWith("/ats-checker") || 
                pathname.startsWith("/cover-letter") || 
                pathname.startsWith("/qa");
                
  const isStandalone = isApp || pathname.startsWith("/resume") || pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isStandalone && <Navbar />}
        <main className={!isStandalone ? "pt-16 min-h-screen" : "min-h-screen"}>
          {children}
        </main>
        {!isStandalone && <Footer />}
      </body>
    </html>
  );
}
