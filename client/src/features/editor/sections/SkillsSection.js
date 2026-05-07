import { Wrench } from "lucide-react";
import { SectionCard, CollapsibleItem } from "@/features/editor/components/SectionCard";
import { Input } from "@/features/editor/components/FormFields";

export default function SkillsSection({ data, update }) {
  const add = () => update([...data, { category: "", items: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };

  return (
    <SectionCard title="Skills" icon={Wrench} color="bg-yellow-50 text-yellow-600" onAdd={add} addLabel="Add Category">
      {data.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No skills added yet.</p>
      )}
      {data.map((skill, i) => (
        <CollapsibleItem key={i} title={skill.category || "New Category"} onDelete={() => del(i)}>
          <Input label="Category"                  value={skill.category} onChange={(v) => upd(i, "category", v)} placeholder="Frontend" />
          <Input label="Skills (comma-separated)"  value={skill.items}    onChange={(v) => upd(i, "items", v)}    placeholder="React, TypeScript, Tailwind CSS" />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}
