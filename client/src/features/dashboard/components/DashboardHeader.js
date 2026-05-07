import React from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DashboardHeader({ user }) {
  const firstName = user?.name?.split(' ')[0] || "there";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hello, {firstName}!</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Welcome back to your workspace.</p>
      </div>
      <Button href="/editor" variant="dark" size="md">
        <Plus className="w-5 h-5 text-[#FF6B00] mr-2" /> Create New
      </Button>
    </div>
  );
}
