import { Award } from "lucide-react";
import { SectionCard, CollapsibleItem } from "@/features/editor/components/SectionCard";
import { Input } from "@/features/editor/components/FormFields";

export default function CertificationsSection({ data, update }) {
  const add = () => update([...data, { name: "", issuer: "", date: "", url: "" }]);
  const del = (i) => update(data.filter((_, idx) => idx !== i));
  const upd = (i, k, v) => { const a = [...data]; a[i] = { ...a[i], [k]: v }; update(a); };

  return (
    <SectionCard title="Certifications" icon={Award} color="bg-indigo-50 text-indigo-500" onAdd={add} addLabel="Add Cert">
      {data.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No certifications added yet.</p>
      )}
      {data.map((cert, i) => (
        <CollapsibleItem key={i} title={cert.name || "New Cert"} subtitle={cert.issuer} onDelete={() => del(i)}>
          <Input label="Certification Name" value={cert.name}   onChange={(v) => upd(i, "name", v)}   placeholder="AWS Solutions Architect" />
          <Input label="Issuer"             value={cert.issuer} onChange={(v) => upd(i, "issuer", v)} placeholder="Amazon Web Services" />
          <Input label="Date"               value={cert.date}   onChange={(v) => upd(i, "date", v)}   placeholder="Dec 2023" />
          <Input label="URL (optional)"     value={cert.url}    onChange={(v) => upd(i, "url", v)}    placeholder="https://verify.cert.com/..." />
        </CollapsibleItem>
      ))}
    </SectionCard>
  );
}
