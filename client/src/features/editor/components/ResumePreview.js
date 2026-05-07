import { FileText } from "lucide-react";

const SectionHeading = ({ label }) => (
  <div style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginBottom: "10px" }}>
    {label}
  </div>
);

export default function ResumePreview({ data }) {
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
    <div id="resume-preview" className="bg-white p-10 min-h-full text-[13px] leading-relaxed" style={{ fontFamily: "'Inter',sans-serif", color: "#111827" }}>

      {/* Header */}
      <div style={{ borderBottom: "2px solid #111827", paddingBottom: "18px", marginBottom: "20px" }}>
        <div style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-0.02em" }}>{personal.name}</div>
        {personal.title && <div style={{ fontSize: "12px", fontWeight: 700, color: "#FF6B00", marginTop: "4px" }}>{personal.title}</div>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "10px", fontSize: "11px", color: "#6b7280", fontWeight: 600 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "6px" }}>Summary</div>
          <div style={{ fontSize: "12px", color: "#374151", lineHeight: "1.7" }}>{summary}</div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionHeading label="Experience" />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: "13px" }}>{exp.role}</div>
                  <div style={{ fontWeight: 700, fontSize: "11px", color: "#FF6B00" }}>{exp.company}</div>
                </div>
                {(exp.startDate || exp.endDate) && (
                  <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, whiteSpace: "nowrap", marginLeft: "12px" }}>
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}
                  </div>
                )}
              </div>
              {exp.description && (
                <div style={{ marginTop: "6px", fontSize: "12px", color: "#4b5563", whiteSpace: "pre-line" }}>{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionHeading label="Education" />
          {education.map((edu, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "13px" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</div>
                <div style={{ fontWeight: 700, fontSize: "11px", color: "#FF6B00" }}>{edu.institution}</div>
                {edu.gpa && <div style={{ fontSize: "10px", color: "#9ca3af" }}>GPA: {edu.gpa}</div>}
              </div>
              {(edu.startDate || edu.endDate) && (
                <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, whiteSpace: "nowrap", marginLeft: "12px" }}>
                  {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionHeading label="Skills" />
          {skills.map((skill, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", fontSize: "12px", marginBottom: "4px" }}>
              {skill.category && <span style={{ fontWeight: 900, color: "#111827", minWidth: "90px" }}>{skill.category}:</span>}
              <span style={{ color: "#4b5563" }}>{skill.items}</span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionHeading label="Projects" />
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 900, fontSize: "13px" }}>{proj.name}</div>
                {proj.url && <div style={{ fontSize: "10px", color: "#FF6B00", fontWeight: 700 }}>{proj.url}</div>}
              </div>
              {proj.tech && <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, marginBottom: "4px" }}>{proj.tech}</div>}
              {proj.description && <div style={{ fontSize: "12px", color: "#4b5563" }}>{proj.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <SectionHeading label="Certifications" />
          {certifications.map((cert, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "13px" }}>{cert.name}</div>
                <div style={{ fontWeight: 700, fontSize: "11px", color: "#FF6B00" }}>{cert.issuer}</div>
              </div>
              {cert.date && <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700 }}>{cert.date}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
