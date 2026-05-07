import { Rocket } from "lucide-react";
import { SectionCard, CollapsibleItem } from "@/features/editor/components/SectionCard";
import { Input, Textarea } from "@/features/editor/components/FormFields";

export default function ProjectsSection({ data, update }) {
  const add = () => update([...data, { name: "", description: "", url: "", tech: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };

  return (
    <SectionCard title="Projects" icon={Rocket} color="bg-pink-50 text-pink-500" onAdd={add} addLabel="Add Project">
      {data.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No projects added yet.</p>
      )}
      {data.map((proj, i) => (
        <CollapsibleItem key={i} title={proj.name || "New Project"} subtitle={proj.tech} onDelete={() => del(i)}>
          <Input label="Project Name"                  value={proj.name}        onChange={(v) => upd(i, "name", v)}        placeholder="MyAwesomeApp" />
          <Input label="Live URL"                      value={proj.url}         onChange={(v) => upd(i, "url", v)}         placeholder="https://myapp.com" />
          <Input label="Technologies (comma-separated)" value={proj.tech}        onChange={(v) => upd(i, "tech", v)}        placeholder="Next.js, Prisma, Vercel" />
          <Textarea label="Description"                value={proj.description} onChange={(v) => upd(i, "description", v)} placeholder="Built a full-stack SaaS platform that..." rows={3} />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}
