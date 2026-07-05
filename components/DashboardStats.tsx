"use client";

import {
  BookOpen,
  Bell,
  Plane,
  Clock3,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Knowledge Articles"
        value="148"
        icon={<BookOpen className="text-white" size={32} />}
        color="bg-red-600"
      />

      <StatCard
        title="Notifications"
        value="7"
        icon={<Bell className="text-white" size={32} />}
        color="bg-blue-600"
      />

    </div>
  );
}