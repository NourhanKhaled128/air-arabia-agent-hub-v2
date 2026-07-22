"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import TeamRowActions from "./TeamRowActions";
import { deleteManyTeamsAction } from "@/app/admin/actions/team-actions";

interface Team {
  id: number;
  name: string;
  _count: { members: number };
}

interface Props {
  teams: Team[];
}

export default function TeamsTable({ teams }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "name", label: "Name" },
        { key: "members", label: "Members" },
      ]}
      data={teams}
      searchPlaceholder="Search teams..."
      searchFn={(team, query) => team.name.toLowerCase().includes(query.toLowerCase())}
      onDeleteMany={deleteManyTeamsAction}
      emptyMessage="No teams yet."
      renderRow={(team) => (
        <>
          <td className="px-6 py-5 font-semibold">{team.name}</td>
          <td className="px-6 py-5 text-slate-600">{team._count.members}</td>
          <td className="px-6 py-5">
            <TeamRowActions id={team.id} />
          </td>
        </>
      )}
    />
  );
}
