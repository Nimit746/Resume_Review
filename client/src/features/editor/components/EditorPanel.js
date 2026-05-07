"use client";

import {
  User, FileText, Briefcase, GraduationCap, Wrench, Rocket, Award,
} from "lucide-react";
import PersonalSection       from "@/features/editor/sections/PersonalSection";
import SummarySection        from "@/features/editor/sections/SummarySection";
import ExperienceSection     from "@/features/editor/sections/ExperienceSection";
import EducationSection      from "@/features/editor/sections/EducationSection";
import SkillsSection         from "@/features/editor/sections/SkillsSection";
import ProjectsSection       from "@/features/editor/sections/ProjectsSection";
import CertificationsSection from "@/features/editor/sections/CertificationsSection";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "personal",       label: "Personal",    icon: User },
  { id: "summary",        label: "Summary",     icon: FileText },
  { id: "experience",     label: "Experience",  icon: Briefcase },
  { id: "education",      label: "Education",   icon: GraduationCap },
  { id: "skills",         label: "Skills",      icon: Wrench },
  { id: "projects",       label: "Projects",    icon: Rocket },
  { id: "certifications", label: "Certs",       icon: Award },
];

export default function EditorPanel({ resumeData, update, activeTab, setActiveTab, fullWidth }) {
  return (
    <div className={cn("flex flex-col overflow-y-auto border-r border-gray-100", fullWidth ? "w-full" : "w-1/2")}>
      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-[#F8F9FB] border-b border-gray-100 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all",
              activeTab === id
                ? "bg-white text-[#FF6B00] shadow-sm border border-gray-100"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="p-4 space-y-4 flex-1">
        {activeTab === "personal"       && <PersonalSection       data={resumeData.personal}       update={update("personal")} />}
        {activeTab === "summary"        && <SummarySection        data={resumeData.summary}        update={update("summary")} />}
        {activeTab === "experience"     && <ExperienceSection     data={resumeData.experience}     update={update("experience")} />}
        {activeTab === "education"      && <EducationSection      data={resumeData.education}      update={update("education")} />}
        {activeTab === "skills"         && <SkillsSection         data={resumeData.skills}         update={update("skills")} />}
        {activeTab === "projects"       && <ProjectsSection       data={resumeData.projects}       update={update("projects")} />}
        {activeTab === "certifications" && <CertificationsSection data={resumeData.certifications} update={update("certifications")} />}
      </div>
    </div>
  );
}
