import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function downloadTextAsFile(filename, text) {
  if (!text) return;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateResumeHtml(title, data) {
  const { personal = {}, summary = "", experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  
  const experienceHtml = experience.length > 0 ? `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-bottom: 10px;">Experience</div>
      ${experience.map(exp => `
        <div style="margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <div style="font-weight: 900; font-size: 13px;">${exp.role || ""}</div>
              <div style="font-weight: 700; font-size: 11px; color: #FF6B00;">${exp.company || ""}</div>
            </div>
            ${(exp.startDate || exp.endDate) ? `<div style="font-size: 10px; color: #9ca3af; font-weight: 700; white-space: nowrap; margin-left: 12px;">${exp.startDate || ""}${exp.endDate ? ` – ${exp.endDate}` : ""}</div>` : ""}
          </div>
          ${exp.description ? `<div style="margin-top: 6px; font-size: 12px; color: #4b5563; white-space: pre-line;">${exp.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  const educationHtml = education.length > 0 ? `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-bottom: 10px;">Education</div>
      ${education.map(edu => `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div>
            <div style="font-weight: 900; font-size: 13px;">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
            <div style="font-weight: 700; font-size: 11px; color: #FF6B00;">${edu.institution || ""}</div>
            ${edu.gpa ? `<div style="font-size: 10px; color: #9ca3af;">GPA: ${edu.gpa}</div>` : ""}
          </div>
          ${(edu.startDate || edu.endDate) ? `<div style="font-size: 10px; color: #9ca3af; font-weight: 700; white-space: nowrap; margin-left: 12px;">${edu.startDate || ""}${edu.endDate ? ` – ${edu.endDate}` : ""}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  const skillsHtml = skills.length > 0 ? `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-bottom: 10px;">Skills</div>
      ${skills.map(s => `
        <div style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 4px;">
          ${s.category ? `<span style="font-weight: 900; color: #111827; min-width: 90px;">${s.category}:</span>` : ""}
          <span style="color: #4b5563;">${s.items || ""}</span>
        </div>
      `).join("")}
    </div>
  ` : "";

  const projectsHtml = projects.length > 0 ? `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-bottom: 10px;">Projects</div>
      ${projects.map(proj => `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="font-weight: 900; font-size: 13px;">${proj.name || ""}</div>
            ${proj.url ? `<div style="font-size: 10px; color: #FF6B00; font-weight: 700;">${proj.url}</div>` : ""}
          </div>
          ${proj.tech ? `<div style="font-size: 10px; color: #9ca3af; font-weight: 700; margin-bottom: 4px;">${proj.tech}</div>` : ""}
          ${proj.description ? `<div style="font-size: 12px; color: #4b5563;">${proj.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  const certificationsHtml = certifications.length > 0 ? `
    <div style="margin-bottom: 16px;">
      <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px; margin-bottom: 10px;">Certifications</div>
      ${certifications.map(cert => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 900; font-size: 13px;">${cert.name || ""}</div>
            <div style="font-weight: 700; font-size: 11px; color: #FF6B00;">${cert.issuer || ""}</div>
          </div>
          ${cert.date ? `<div style="font-size: 10px; color: #9ca3af; font-weight: 700;">${cert.date}</div>` : ""}
        </div>
      `).join("")}
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Resume"}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
  <style>
    @page {
      margin: 0;
      size: auto;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; padding: 32px 40px; background: #fff; color: #111827; }
    @media print {
      body {
        padding: 24px 32px;
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto; font-size: 13px; line-height: 1.6;">
    <div style="border-bottom: 2px solid #111827; padding-bottom: 18px; margin-bottom: 20px;">
      <div style="font-size: 26px; font-weight: 900; letter-spacing: -0.02em;">${personal.name || ""}</div>
      ${personal.title ? `<div style="font-size: 12px; font-weight: 700; color: #FF6B00; margin-top: 4px;">${personal.title}</div>` : ""}
      <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; font-size: 11px; color: #6b7280; font-weight: 600;">
        ${personal.email ? `<span>${personal.email}</span>` : ""}
        ${personal.phone ? `<span>${personal.phone}</span>` : ""}
        ${personal.location ? `<span>${personal.location}</span>` : ""}
        ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ""}
        ${personal.github ? `<span>${personal.github}</span>` : ""}
        ${personal.website ? `<span>${personal.website}</span>` : ""}
      </div>
    </div>
    ${summary ? `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 9px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px;">Summary</div>
        <div style="font-size: 12px; color: #374151; line-height: 1.7;">${summary}</div>
      </div>
    ` : ""}
    ${experienceHtml}
    ${educationHtml}
    ${skillsHtml}
    ${projectsHtml}
    ${certificationsHtml}
  </div>
</body>
</html>`;
}

export function printResume(title, data) {
  const html = generateResumeHtml(title, data);
  printHtml(title, html);
}

export function generateCoverLetterHtml(title, content) {
  const formattedContent = (content || "")
    .split("\n\n")
    .map(p => `<p style="margin-bottom: 16px; line-height: 1.8;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || "Cover Letter"}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
  <style>
    @page {
      margin: 0;
      size: auto;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; padding: 48px; background: #fff; color: #1f2937; }
    @media print {
      body {
        padding: 36px 48px;
        margin: 0;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div style="max-width: 750px; margin: 0 auto; font-size: 14px; color: #374151;">
    <div style="margin-bottom: 30px; border-bottom: 2px solid #ea580c; padding-bottom: 15px;">
      <h1 style="font-size: 24px; font-weight: 900; color: #111827; letter-spacing: -0.02em;">${title || "Cover Letter"}</h1>
    </div>
    <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8; color: #374151;">
      ${formattedContent || "<p>No content provided.</p>"}
    </div>
  </div>
</body>
</html>`;
}

export function printCoverLetter(title, content) {
  const html = generateCoverLetterHtml(title, content);
  printHtml(title, html);
}

export function printHtml(title, html) {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    try {
      iframe.contentWindow.print();
    } catch (e) {
      console.error("Print error:", e);
    } finally {
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  }, 400);
}


