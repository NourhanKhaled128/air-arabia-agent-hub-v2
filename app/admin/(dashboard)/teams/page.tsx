import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import TeamsTable from "@/components/admin/teams/TeamsTable";
import { getTeams } from "@/lib/team-service";
import { getTeamQuizStats } from "@/lib/quiz-service";

export default async function TeamsPage() {
  const teams = await getTeams();

  const leaderboard = (
    await Promise.all(
      teams.map(async (team) => ({
        id: team.id,
        name: team.name,
        members: team._count.members,
        stats: await getTeamQuizStats(team.id),
      }))
    )
  ).sort((a, b) => (b.stats.avgPercentage ?? -1) - (a.stats.avgPercentage ?? -1));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Teams"
        description="Group agents into teams/shifts for grouped quiz analytics."
        actions={
          <AdminButton href="/admin/teams/new">
            + New Team
          </AdminButton>
        }
      />

      {leaderboard.some((t) => t.stats.completed > 0) && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Leaderboard — Average Score</h2>
          <ul className="space-y-2">
            {leaderboard.map((team, i) => (
              <li
                key={team.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <span className="font-semibold">{team.name}</span>
                  <span className="text-sm text-slate-500">({team.members} members)</span>
                </span>
                <span className="font-bold text-red-700">
                  {team.stats.avgPercentage != null ? `${team.stats.avgPercentage}%` : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TeamsTable teams={teams} />
    </div>
  );
}
