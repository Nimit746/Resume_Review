import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { getResumeById } from "@/services/resumeService";
import EditorShell from "@/features/editor/components/EditorShell";

export default async function EditorPage({ searchParams }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  const { id } = await searchParams;
  let resume = null;

  if (id) {
    resume = await getResumeById(session.user.id, id);
    if (!resume) {
      redirect("/dashboard");
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center font-black text-gray-200 uppercase tracking-widest">Loading Editor...</div>}>
      <EditorShell user={session.user} initialResume={resume} />
    </Suspense>
  );
}