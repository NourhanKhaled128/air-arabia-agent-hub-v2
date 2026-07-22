import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import TeamForm from "@/components/admin/teams/TeamForm";
import { getTeamById } from "@/lib/team-service";
import { getTeamQuizStats } from "@/lib/quiz-service";
import { updateTeamAction } from "@/app/admin/actions/team-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: Props) {
  const { id } = await params;
  const teamId = Number(id);
  if (!Number.isInteger(teamId)) notFound();

  const team = await getTeamById(teamId);
  if (!team) notFound();

  const stats = await getTeamQuizStats(teamId);
  const boundUpdate = updateTeamAction.bind(null, teamId);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit Team"
        breadcrumbs={[{ label: "Teams", href: "/admin/teams" }, { label: team.name }]}
      />

      <AdminFormCard title="Team Details">
        <TeamForm action={boundUpdate} submitLabel="Save Changes" team={team} />
      </AdminFormCard>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Quiz Performance</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">Quizzes Completed</p>
            <p className="mt-1 text-3xl font-bold">{stats.completed}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">Passed</p>
            <p className="mt-1 text-3xl font-bold">{stats.passed}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">Average Score</p>
            <p className="mt-1 text-3xl font-bold">
              {stats.avgPercentage != null ? `${stats.avgPercentage}%` : "—"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Members ({team.members.length})</h2>
        {team.members.length === 0 ? (
          <p className="text-slate-500">No agents assigned to this team yet.</p>
        ) : (
          <ul className="space-y-2">
            {team.members.map((member) => (
              <li key={member.id} className="flex items-center justify-between rounded-xl border p-3">
                <span className="font-semibold">{member.name}</span>
                <span className="text-slate-500">{member.email}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
