import { User } from "lucide-react";
import { SectionCard } from "@/features/editor/components/SectionCard";
import { Input } from "@/features/editor/components/FormFields";

export default function PersonalSection({ data, update }) {
  const f = (k) => (v) => update({ ...data, [k]: v });
  return (
    <SectionCard title="Personal Info" icon={User} color="bg-blue-50 text-blue-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input label="Full Name"          value={data.name}     onChange={f("name")}     placeholder="Jane Doe" />
        <Input label="Professional Title" value={data.title}    onChange={f("title")}    placeholder="Software Engineer" />
        <Input label="Email"              value={data.email}    onChange={f("email")}    placeholder="jane@example.com" type="email" />
        <Input label="Phone"              value={data.phone}    onChange={f("phone")}    placeholder="+1 (555) 000-0000" />
        <Input label="Location"           value={data.location} onChange={f("location")} placeholder="New York, NY" />
        <Input label="LinkedIn"           value={data.linkedin} onChange={f("linkedin")} placeholder="linkedin.com/in/janedoe" />
        <Input label="GitHub"             value={data.github}   onChange={f("github")}   placeholder="github.com/janedoe" />
        <Input label="Website"            value={data.website}  onChange={f("website")}  placeholder="janedoe.dev" />
      </div>
    </SectionCard>
  );
}
