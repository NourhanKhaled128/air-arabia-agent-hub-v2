"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PhoneCall, Briefcase } from "lucide-react";

interface Props {
  collapsed: boolean;
  onNavigate?: () => void;
}

const TEAMS = [
  { label: "Main Hub", fullLabel: "Main Hub", href: "/", icon: Home, prefix: null as string | null },
  { label: "CS Team", fullLabel: "Customer Support Team", href: "/CustomerSupportTeam", icon: PhoneCall, prefix: "/CustomerSupportTeam" },
  { label: "Trade Team", fullLabel: "Trade Support Team", href: "/TradeSupportTeam", icon: Briefcase, prefix: "/TradeSupportTeam" },
];

export default function TeamSwitcher({ collapsed, onNavigate }: Props) {
  const pathname = usePathname();

  function isActive(prefix: string | null) {
    if (prefix === null) {
      return !pathname.startsWith("/CustomerSupportTeam") && !pathname.startsWith("/TradeSupportTeam");
    }
    return pathname.startsWith(prefix);
  }

  return (
    <div className={`mb-6 gap-1.5 px-1 ${collapsed ? "flex flex-col items-center" : "grid grid-cols-3"}`}>
      {TEAMS.map((team) => {
        const Icon = team.icon;
        const active = isActive(team.prefix);

        return (
          <Link
            key={team.href}
            href={team.href}
            onClick={onNavigate}
            title={team.fullLabel}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-center text-[11px] font-semibold transition ${
              collapsed ? "mb-1 w-11" : ""
            } ${
              active
                ? "bg-brand text-white shadow"
                : "bg-gray-100 dark:bg-surface-muted text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-brand"
            }`}
          >
            <Icon size={16} />
            {!collapsed && <span className="truncate">{team.label}</span>}
          </Link>
        );
      })}
    </div>
  );
}
