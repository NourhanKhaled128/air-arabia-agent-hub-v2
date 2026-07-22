import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import TeamsTable from "@/components/admin/teams/TeamsTable";
import { getTeams } from "@/lib/team-service";

export default async function TeamsPage() {
  const teams = await getTeams();

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

      <TeamsTable teams={teams} />
    </div>
  );
}
