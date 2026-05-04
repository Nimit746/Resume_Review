import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-primary mb-4 block">
              ResumeForge
            </Link>
            <p className="text-gray-500 max-w-xs">
              Building professional, ATS-optimized resumes in minutes with the power of AI.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/editor" className="text-gray-500 hover:text-primary transition-colors">Editor</Link></li>
              <li><Link href="/ats-checker" className="text-gray-500 hover:text-primary transition-colors">ATS Checker</Link></li>
              <li><Link href="/cover-letter" className="text-gray-500 hover:text-primary transition-colors">Cover Letter</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
