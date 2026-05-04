"use client";

import { Download, Share2, Printer, MapPin, Mail, Phone, Globe } from "lucide-react";

export default function PublicResumeView({ params }) {
  const resumeData = {
    name: "John Doe",
    role: "Senior Software Engineer",
    contact: {
      email: "john@example.com",
      phone: "+1 234 567 890",
      location: "New York, NY",
      website: "johndoe.dev"
    },
    summary: "Dedicated Senior Software Engineer with over 8 years of experience in building high-performance web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering complex projects on time.",
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Senior Full Stack Developer",
        period: "2020 - Present",
        description: "Leading the development of a microservices-based e-commerce platform. Managed a team of 10 engineers and improved system response time by 40% using GraphQL and Redis caching."
      },
      {
        company: "Innovate Web Systems",
        role: "Software Engineer",
        period: "2016 - 2020",
        description: "Developed and maintained several client-facing web applications. Implemented automated testing workflows reducing bug reports by 25%."
      }
    ],
    education: [
      {
        school: "State University of Technology",
        degree: "Bachelor of Science in Computer Science",
        year: "2016"
      }
    ],
    skills: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "AWS", "Docker"]
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 print:p-0 print:bg-white">
      {/* Action Bar (Hidden on Print) */}
      <div className="max-w-[850px] mx-auto mb-8 flex justify-between items-center print:hidden">
        <h1 className="text-gray-500 font-bold flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center">RF</span> Resume View
        </h1>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 shadow-lg shadow-orange-100 flex items-center gap-2 transition-all">
            <Share2 className="w-4 h-4" /> Share Link
          </button>
        </div>
      </div>

      {/* Resume Document */}
      <div className="max-w-[850px] mx-auto bg-white shadow-2xl min-h-[1100px] p-16 print:shadow-none print:p-8">
        <header className="mb-12 border-b-8 border-gray-900 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-4">{resumeData.name}</h2>
              <p className="text-2xl font-bold text-primary tracking-widest uppercase">{resumeData.role}</p>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                {resumeData.contact.location} <MapPin className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                {resumeData.contact.email} <Mail className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                {resumeData.contact.phone} <Phone className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                {resumeData.contact.website} <Globe className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </div>
        </header>

        <section className="mb-12">
          <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
            Professional Summary <div className="h-[2px] flex-1 bg-gray-100"></div>
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">{resumeData.summary}</p>
        </section>

        <section className="mb-12">
          <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
            Work Experience <div className="h-[2px] flex-1 bg-gray-100"></div>
          </h3>
          <div className="space-y-10">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-gray-100">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-primary rounded-full"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 uppercase">{exp.company}</h4>
                    <p className="text-lg font-bold text-gray-500">{exp.role}</p>
                  </div>
                  <span className="text-sm font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase">{exp.period}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <section className="md:col-span-2">
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
              Education <div className="h-[2px] flex-1 bg-gray-100"></div>
            </h3>
            {resumeData.education.map((edu, i) => (
              <div key={i}>
                <h4 className="text-lg font-black text-gray-900 uppercase">{edu.school}</h4>
                <p className="text-gray-600 font-bold">{edu.degree}</p>
                <p className="text-gray-400 text-sm font-bold mt-1">Class of {edu.year}</p>
              </div>
            ))}
          </section>
          
          <section>
            <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
              Skills <div className="h-[2px] flex-1 bg-gray-100"></div>
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-300 uppercase tracking-[0.5em] font-black">
          <span>Verified by ResumeForge</span>
          <span>Resumeforge.com</span>
        </footer>
      </div>
    </div>
  );
}
