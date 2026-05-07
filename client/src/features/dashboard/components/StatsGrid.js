import React from "react";
import { BarChart2, Users, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const statsConfig = {
  performance: { icon: BarChart2, color: "text-blue-500", bg: "bg-blue-500/10" },
  views: { icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  matches: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" }
};

export default function StatsGrid({ initialStats = [] }) {
  const displayStats = initialStats.length > 0 ? initialStats : [
    { label: "Performance", value: "0/100", trend: "0%", id: "performance" },
    { label: "Resume Views", value: "0", trend: "0%", id: "views" },
    { label: "Job Matches", value: "0", trend: "0%", id: "matches" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {displayStats.map((stat, i) => {
        const config = statsConfig[stat.id] || statsConfig.performance;
        const Icon = config.icon;
        return (
          <Card key={i} className="group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", config.bg, config.color)}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </Card>
        );
      })}
    </div>
  );
}
