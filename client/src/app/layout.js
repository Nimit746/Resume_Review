import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/shared/LayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ResumeForge | AI-Powered Resume Builder",
  description: "Build premium, ATS-friendly resumes in minutes with AI.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}

