import { GraduationCap } from "lucide-react";
import { SectionCard, CollapsibleItem } from "@/features/editor/components/SectionCard";
import { Input } from "@/features/editor/components/FormFields";

export default function EducationSection({ data, update }) {
  const add = () =>
    update([...data, { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };

  return (
    <SectionCard title="Education" icon={GraduationCap} color="bg-green-50 text-green-600" onAdd={add} addLabel="Add Degree">
      {data.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No education added yet.</p>
      )}
      {data.map((edu, i) => (
        <CollapsibleItem key={i} title={edu.degree || "New Degree"} subtitle={edu.institution} onDelete={() => del(i)}>
          <Input label="Institution" value={edu.institution} onChange={(v) => upd(i, "institution", v)} placeholder="MIT" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Degree"        value={edu.degree} onChange={(v) => upd(i, "degree", v)} placeholder="B.Sc." />
            <Input label="Field of Study" value={edu.field}  onChange={(v) => upd(i, "field", v)}  placeholder="Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Year" value={edu.startDate} onChange={(v) => upd(i, "startDate", v)} placeholder="2018" />
            <Input label="End Year"   value={edu.endDate}   onChange={(v) => upd(i, "endDate", v)}   placeholder="2022" />
          </div>
          <Input label="GPA (optional)" value={edu.gpa} onChange={(v) => upd(i, "gpa", v)} placeholder="3.9 / 4.0" />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}
