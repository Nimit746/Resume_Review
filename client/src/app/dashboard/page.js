import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { getUserResumes, getDashboardStats } from "@/services/resumeService";
import DashboardShell from "@/features/dashboard/components/DashboardShell";
import DashboardTopBar from "@/features/dashboard/components/DashboardTopBar";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import StatsGrid from "@/features/dashboard/components/StatsGrid";
import ResumeList from "@/features/dashboard/components/ResumeList";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  const resumes = await getUserResumes(session.user.id);
  const stats = await getDashboardStats(session.user.id);


  return (
    <DashboardShell user={session.user}>
      <DashboardTopBar />
      <DashboardHeader user={session.user} />
      <StatsGrid initialStats={stats} />
      <ResumeList initialResumes={resumes} />
    </DashboardShell>
  );
}
