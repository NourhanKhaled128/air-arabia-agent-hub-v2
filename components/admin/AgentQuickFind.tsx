"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  email: string;
}

interface Props {
  agents: Agent[];
}

export default function AgentQuickFind({ agents }: Props) {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return agents
      .filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, agents]);

  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
        <Search size={18} className="text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find an agent by name or email..."
          className="w-full outline-none"
        />
      </div>

      {matches.length > 0 && (
        <ul className="mt-3 space-y-2">
          {matches.map((agent) => (
            <li key={agent.id}>
              <Link
                href={`/admin/portal-users/${agent.id}/activity`}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">{agent.name}</span>
                <span className="text-sm text-slate-500">{agent.email}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
