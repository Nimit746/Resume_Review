import React from "react";
import { Bell, Settings } from "lucide-react";
import Button from "@/components/ui/Button";

export default function DashboardTopBar() {
  return (
    <div className="flex justify-end items-center mb-10">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="icon" className="text-gray-400">
          <Bell className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="icon" className="text-gray-400">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
