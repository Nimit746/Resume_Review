"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/layout/Sidebar";
import {
  Save, Download, Plus, Trash2, ChevronDown, ChevronUp,
  User, FileText, Briefcase, GraduationCap, Wrench, Rocket,
  CheckCircle2, AlertCircle, Loader2, Eye, Edit3, X, Award
} from "lucide-react";

// ─── Default Resume Data ───────────────────────────────────────────────────
const DEFAULT_DATA = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
};

// ─── Toast Component ───────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 3500); return () => clearTimeout(t); }, [onDismiss]);
  const colors = { success: "bg-green-500", error: "bg-red-500", loading: "bg-gray-800" };
  const icons = { success: <CheckCircle2 className="w-4 h-4" />, error: <AlertCircle className="w-4 h-4" />, loading: <Loader2 className="w-4 h-4 animate-spin" /> };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-bold shadow-2xl ${colors[type]} transition-all animate-in`}>
      {icons[type]}{message}
    </div>
  );
}

// ─── Input Components ──────────────────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>}
    <input
      type={type}
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
    />
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>}
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all resize-none"
    />
  </div>
);

// ─── Section Wrapper ───────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, color, children, onAdd, addLabel }) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</h2>
        </div>
        {onAdd && (
          <button onClick={onAdd} className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">
            <Plus className="w-3.5 h-3.5" /> {addLabel || "Add"}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Collapsible Item ──────────────────────────────────────────────────────
function CollapsibleItem({ title, subtitle, onDelete, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div>
          <p className="text-sm font-black text-gray-800">{title || "Untitled"}</p>
          {subtitle && <p className="text-[10px] font-bold text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      {open && <div className="p-4 grid grid-cols-1 gap-3">{children}</div>}
    </div>
  );
}

// ─── Section: Personal ────────────────────────────────────────────────────
function PersonalSection({ data, update }) {
  const f = (k) => (v) => update({ ...data, [k]: v });
  return (
    <SectionCard title="Personal Info" icon={User} color="bg-blue-50 text-blue-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Full Name" value={data.name} onChange={f("name")} placeholder="Jane Doe" />
        <Input label="Professional Title" value={data.title} onChange={f("title")} placeholder="Software Engineer" />
        <Input label="Email" value={data.email} onChange={f("email")} placeholder="jane@example.com" type="email" />
        <Input label="Phone" value={data.phone} onChange={f("phone")} placeholder="+1 (555) 000-0000" />
        <Input label="Location" value={data.location} onChange={f("location")} placeholder="New York, NY" />
        <Input label="LinkedIn" value={data.linkedin} onChange={f("linkedin")} placeholder="linkedin.com/in/janedoe" />
        <Input label="GitHub" value={data.github} onChange={f("github")} placeholder="github.com/janedoe" />
        <Input label="Website" value={data.website} onChange={f("website")} placeholder="janedoe.dev" />
      </div>
    </SectionCard>
  );
}

// ─── Section: Summary ────────────────────────────────────────────────────
function SummarySection({ data, update }) {
  return (
    <SectionCard title="Professional Summary" icon={FileText} color="bg-purple-50 text-purple-500">
      <Textarea value={data} onChange={update} placeholder="A driven software engineer with 5+ years building scalable web applications..." rows={4} />
    </SectionCard>
  );
}

// ─── Section: Experience ──────────────────────────────────────────────────
function ExperienceSection({ data, update }) {
  const add = () => update([...data, { company: "", role: "", startDate: "", endDate: "", current: false, description: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };
  return (
    <SectionCard title="Experience" icon={Briefcase} color="bg-orange-50 text-primary" onAdd={add} addLabel="Add Role">
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No experience added yet.</p>}
      {data.map((exp, i) => (
        <CollapsibleItem key={i} title={exp.role || "New Role"} subtitle={exp.company} onDelete={() => del(i)}>
          <Input label="Company" value={exp.company} onChange={v => upd(i, "company", v)} placeholder="Acme Corp" />
          <Input label="Job Title" value={exp.role} onChange={v => upd(i, "role", v)} placeholder="Senior Engineer" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={exp.startDate} onChange={v => upd(i, "startDate", v)} placeholder="Jan 2022" />
            <Input label="End Date" value={exp.endDate} onChange={v => upd(i, "endDate", v)} placeholder="Present" />
          </div>
          <Textarea label="Description" value={exp.description} onChange={v => upd(i, "description", v)} placeholder="• Led development of..." rows={4} />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}

// ─── Section: Education ───────────────────────────────────────────────────
function EducationSection({ data, update }) {
  const add = () => update([...data, { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };
  return (
    <SectionCard title="Education" icon={GraduationCap} color="bg-green-50 text-green-600" onAdd={add} addLabel="Add Degree">
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No education added yet.</p>}
      {data.map((edu, i) => (
        <CollapsibleItem key={i} title={edu.degree || "New Degree"} subtitle={edu.institution} onDelete={() => del(i)}>
          <Input label="Institution" value={edu.institution} onChange={v => upd(i, "institution", v)} placeholder="MIT" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Degree" value={edu.degree} onChange={v => upd(i, "degree", v)} placeholder="B.Sc." />
            <Input label="Field of Study" value={edu.field} onChange={v => upd(i, "field", v)} placeholder="Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Year" value={edu.startDate} onChange={v => upd(i, "startDate", v)} placeholder="2018" />
            <Input label="End Year" value={edu.endDate} onChange={v => upd(i, "endDate", v)} placeholder="2022" />
          </div>
          <Input label="GPA (optional)" value={edu.gpa} onChange={v => upd(i, "gpa", v)} placeholder="3.9 / 4.0" />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}

// ─── Section: Skills ──────────────────────────────────────────────────────
function SkillsSection({ data, update }) {
  const add = () => update([...data, { category: "", items: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };
  return (
    <SectionCard title="Skills" icon={Wrench} color="bg-yellow-50 text-yellow-600" onAdd={add} addLabel="Add Category">
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skills added yet.</p>}
      {data.map((skill, i) => (
        <CollapsibleItem key={i} title={skill.category || "New Category"} onDelete={() => del(i)}>
          <Input label="Category" value={skill.category} onChange={v => upd(i, "category", v)} placeholder="Frontend" />
          <Input label="Skills (comma-separated)" value={skill.items} onChange={v => upd(i, "items", v)} placeholder="React, TypeScript, Tailwind CSS" />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}

// ─── Section: Projects ────────────────────────────────────────────────────
function ProjectsSection({ data, update }) {
  const add = () => update([...data, { name: "", description: "", url: "", tech: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };
  return (
    <SectionCard title="Projects" icon={Rocket} color="bg-pink-50 text-pink-500" onAdd={add} addLabel="Add Project">
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No projects added yet.</p>}
      {data.map((proj, i) => (
        <CollapsibleItem key={i} title={proj.name || "New Project"} subtitle={proj.tech} onDelete={() => del(i)}>
          <Input label="Project Name" value={proj.name} onChange={v => upd(i, "name", v)} placeholder="MyAwesomeApp" />
          <Input label="Live URL" value={proj.url} onChange={v => upd(i, "url", v)} placeholder="https://myapp.com" />
          <Input label="Technologies (comma-separated)" value={proj.tech} onChange={v => upd(i, "tech", v)} placeholder="Next.js, Prisma, Vercel" />
          <Textarea label="Description" value={proj.description} onChange={v => upd(i, "description", v)} placeholder="Built a full-stack SaaS platform that..." rows={3} />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}

// ─── Section: Certifications ──────────────────────────────────────────────
function CertificationsSection({ data, update }) {
  const add = () => update([...data, { name: "", issuer: "", date: "", url: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };
  return (
    <SectionCard title="Certifications" icon={Award} color="bg-indigo-50 text-indigo-500" onAdd={add} addLabel="Add Cert">
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No certifications added yet.</p>}
      {data.map((cert, i) => (
        <CollapsibleItem key={i} title={cert.name || "New Cert"} subtitle={cert.issuer} onDelete={() => del(i)}>
          <Input label="Certification Name" value={cert.name} onChange={v => upd(i, "name", v)} placeholder="AWS Solutions Architect" />
          <Input label="Issuer" value={cert.issuer} onChange={v => upd(i, "issuer", v)} placeholder="Amazon Web Services" />
          <Input label="Date" value={cert.date} onChange={v => upd(i, "date", v)} placeholder="Dec 2023" />
          <Input label="URL (optional)" value={cert.url} onChange={v => upd(i, "url", v)} placeholder="https://verify.cert.com/..." />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}

// ─── Resume Preview ───────────────────────────────────────────────────────
function ResumePreview({ data }) {
  const { personal, summary, experience, education, skills, projects, certifications } = data;
  if (!personal.name && !personal.email) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200 mb-4 border border-dashed border-gray-200">
          <FileText className="w-8 h-8" />
        </div>
        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">Preview will appear here</p>
        <p className="text-xs text-gray-300 mt-2">Fill in your personal info to get started</p>
      </div>
    );
  }
  return (
    <div id="resume-preview" className="bg-white p-10 min-h-full text-[13px] leading-relaxed" style={{fontFamily:"'Inter',sans-serif",color:"#111827"}}>
      <div style={{borderBottom:"2px solid #111827",paddingBottom:"18px",marginBottom:"20px"}}>
        <div style={{fontSize:"26px",fontWeight:900,letterSpacing:"-0.02em"}}>{personal.name}</div>
        {personal.title && <div style={{fontSize:"12px",fontWeight:700,color:"#c8682d",marginTop:"4px"}}>{personal.title}</div>}
        <div style={{display:"flex",flexWrap:"wrap",gap:"12px",marginTop:"10px",fontSize:"11px",color:"#6b7280",fontWeight:600}}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>
      {summary && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",marginBottom:"6px"}}>Summary</div>
          <div style={{fontSize:"12px",color:"#374151",lineHeight:"1.7"}}>{summary}</div>
        </div>
      )}
      {experience.length > 0 && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",borderTop:"1px solid #f3f4f6",paddingTop:"12px",marginBottom:"10px"}}>Experience</div>
          {experience.map((exp, i) => (
            <div key={i} style={{marginBottom:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:900,fontSize:"13px"}}>{exp.role}</div>
                  <div style={{fontWeight:700,fontSize:"11px",color:"#c8682d"}}>{exp.company}</div>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div style={{fontSize:"10px",color:"#9ca3af",fontWeight:700,whiteSpace:"nowrap",marginLeft:"12px"}}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}</div>
                )}
              </div>
              {exp.description && <div style={{marginTop:"6px",fontSize:"12px",color:"#4b5563",whiteSpace:"pre-line"}}>{exp.description}</div>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",borderTop:"1px solid #f3f4f6",paddingTop:"12px",marginBottom:"10px"}}>Education</div>
          {education.map((edu, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
              <div>
                <div style={{fontWeight:900,fontSize:"13px"}}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                <div style={{fontWeight:700,fontSize:"11px",color:"#c8682d"}}>{edu.institution}</div>
                {edu.gpa && <div style={{fontSize:"10px",color:"#9ca3af"}}>GPA: {edu.gpa}</div>}
              </div>
              {(edu.startDate || edu.endDate) && (
                <div style={{fontSize:"10px",color:"#9ca3af",fontWeight:700,whiteSpace:"nowrap",marginLeft:"12px"}}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",borderTop:"1px solid #f3f4f6",paddingTop:"12px",marginBottom:"10px"}}>Skills</div>
          {skills.map((skill, i) => (
            <div key={i} style={{display:"flex",gap:"8px",fontSize:"12px",marginBottom:"4px"}}>
              {skill.category && <span style={{fontWeight:900,color:"#111827",minWidth:"90px"}}>{skill.category}:</span>}
              <span style={{color:"#4b5563"}}>{skill.items}</span>
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",borderTop:"1px solid #f3f4f6",paddingTop:"12px",marginBottom:"10px"}}>Projects</div>
          {projects.map((proj, i) => (
            <div key={i} style={{marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{fontWeight:900,fontSize:"13px"}}>{proj.name}</div>
                {proj.url && <div style={{fontSize:"10px",color:"#c8682d",fontWeight:700}}>{proj.url}</div>}
              </div>
              {proj.tech && <div style={{fontSize:"10px",color:"#9ca3af",fontWeight:700,marginBottom:"4px"}}>{proj.tech}</div>}
              {proj.description && <div style={{fontSize:"12px",color:"#4b5563"}}>{proj.description}</div>}
            </div>
          ))}
        </div>
      )}
      {certifications.length > 0 && (
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"9px",fontWeight:900,letterSpacing:"0.2em",textTransform:"uppercase",color:"#9ca3af",borderTop:"1px solid #f3f4f6",paddingTop:"12px",marginBottom:"10px"}}>Certifications</div>
          {certifications.map((cert, i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
              <div>
                <div style={{fontWeight:900,fontSize:"13px"}}>{cert.name}</div>
                <div style={{fontWeight:700,fontSize:"11px",color:"#c8682d"}}>{cert.issuer}</div>
              </div>
              {cert.date && <div style={{fontSize:"10px",color:"#9ca3af",fontWeight:700}}>{cert.date}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Editor Page ─────────────────────────────────────────────────────
export default function EditorPage() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [editingTitle, setEditingTitle] = useState(false);
  const [resumeData, setResumeData] = useState(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState("personal");
  const [view, setView] = useState("split");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const storedUser = localStorage.getItem("rf_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus();
  }, [editingTitle]);

  const showToast = (message, type = "success") => setToast({ message, type });
  const dismissToast = useCallback(() => setToast(null), []);
  const update = (section) => (value) => setResumeData(prev => ({ ...prev, [section]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("/api/resumes", { title: resumeTitle, data: resumeData });
      showToast("Resume saved successfully!");
    } catch {
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const el = document.getElementById("resume-preview");
    if (!el) { showToast("Switch to Preview or Split view first.", "error"); return; }
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>${resumeTitle}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Inter',sans-serif;padding:0;}@media print{body{margin:0;}}</style>
      </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  const handleLogout = async () => {
    try { await axios.post("/api/auth/logout"); localStorage.removeItem("rf_user"); window.location.href = "/"; }
    catch { console.error("Logout failed"); }
  };

  const TABS = [
    { id: "personal", label: "Personal", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: Rocket },
    { id: "certifications", label: "Certs", icon: Award },
  ];

  if (!mounted) return null;

  const showEditor = view === "split" || view === "editor";
  const showPreview = view === "split" || view === "preview";

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} user={user} onLogout={handleLogout} />

      <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>

        {/* ── Top Bar ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <Edit3 className="w-4 h-4" />
            </div>
            {editingTitle ? (
              <input ref={titleRef} value={resumeTitle} onChange={e => setResumeTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)} onKeyDown={e => e.key === "Enter" && setEditingTitle(false)}
                className="text-sm font-black text-gray-900 bg-transparent border-b-2 border-primary outline-none w-48" />
            ) : (
              <button onClick={() => setEditingTitle(true)} className="text-sm font-black text-gray-900 hover:text-primary transition-all truncate max-w-[180px]">
                {resumeTitle}
              </button>
            )}
          </div>
          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[["split","Split"],["editor","Editor"],["preview","Preview"]].map(([v,l]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view===v?"bg-white text-gray-900 shadow-sm":"text-gray-400 hover:text-gray-600"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-gray-800 transition-all disabled:opacity-50">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saving ? "Saving…" : "Save"}</span>
            </button>
            <button onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary/90 transition-all shadow-sm shadow-orange-100">
              <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1" style={{height:"calc(100vh - 57px)"}}>

          {/* Editor Panel */}
          {showEditor && (
            <div className={`flex flex-col ${showPreview ? "w-1/2" : "w-full"} overflow-y-auto border-r border-gray-100`}>
              <div className="sticky top-0 z-20 bg-[#F8F9FB] border-b border-gray-100 px-4 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeTab===id?"bg-white text-primary shadow-sm border border-gray-100":"text-gray-400 hover:text-gray-600"}`}>
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
              </div>
              <div className="p-4 space-y-4 flex-1">
                {activeTab === "personal"       && <PersonalSection data={resumeData.personal} update={update("personal")} />}
                {activeTab === "summary"        && <SummarySection data={resumeData.summary} update={update("summary")} />}
                {activeTab === "experience"     && <ExperienceSection data={resumeData.experience} update={update("experience")} />}
                {activeTab === "education"      && <EducationSection data={resumeData.education} update={update("education")} />}
                {activeTab === "skills"         && <SkillsSection data={resumeData.skills} update={update("skills")} />}
                {activeTab === "projects"       && <ProjectsSection data={resumeData.projects} update={update("projects")} />}
                {activeTab === "certifications" && <CertificationsSection data={resumeData.certifications} update={update("certifications")} />}
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <div className={`${showEditor ? "w-1/2" : "w-full"} overflow-y-auto bg-gray-200 flex flex-col`}>
              <div className="sticky top-0 z-20 bg-gray-200 border-b border-gray-300 px-5 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <Eye className="w-3.5 h-3.5" /> Live Preview
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
              </div>
              <div className="flex-1 p-6 flex justify-center">
                <div className="w-full max-w-[680px] min-h-[900px] shadow-2xl rounded-sm overflow-hidden">
                  <ResumePreview data={resumeData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
    </div>
  );
}