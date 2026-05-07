import { FileText } from "lucide-react";
import { SectionCard } from "@/features/editor/components/SectionCard";
import { Textarea } from "@/features/editor/components/FormFields";

export default function SummarySection({ data, update }) {
  return (
    <SectionCard title="Professional Summary" icon={FileText} color="bg-purple-50 text-purple-500">
      <Textarea
        value={data}
        onChange={update}
        placeholder="A driven software engineer with 5+ years building scalable web applications..."
        rows={4}
      />
    </SectionCard>
  );
}
