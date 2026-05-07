import { Briefcase } from "lucide-react";
import { SectionCard, CollapsibleItem } from "../components/SectionCard";
import { Input, Textarea } from "../components/FormFields";

export default function ExperienceSection({ data, update }) {
  const add = () =>
    update([...data, { company: "", role: "", startDate: "", endDate: "", current: false, description: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };

  return (
    <SectionCard title="Experience" icon={Briefcase} color="bg-orange-50 text-[#FF6B00]" onAdd={add} addLabel="Add Role">
      {data.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No experience added yet.</p>
      )}
      {data.map((exp, i) => (
        <CollapsibleItem key={i} title={exp.role || "New Role"} subtitle={exp.company} onDelete={() => del(i)}>
          <Input label="Company"   value={exp.company}     onChange={(v) => upd(i, "company", v)}     placeholder="Acme Corp" />
          <Input label="Job Title" value={exp.role}        onChange={(v) => upd(i, "role", v)}        placeholder="Senior Engineer" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={exp.startDate} onChange={(v) => upd(i, "startDate", v)} placeholder="Jan 2022" />
            <Input label="End Date"   value={exp.endDate}   onChange={(v) => upd(i, "endDate", v)}   placeholder="Present" />
          </div>
          <Textarea label="Description" value={exp.description} onChange={(v) => upd(i, "description", v)} placeholder="• Led development of..." rows={4} />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}
