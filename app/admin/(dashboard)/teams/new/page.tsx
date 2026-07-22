import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import TeamForm from "@/components/admin/teams/TeamForm";
import { createTeamAction } from "@/app/admin/actions/team-actions";

export default function NewTeamPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New Team"
        breadcrumbs={[{ label: "Teams", href: "/admin/teams" }, { label: "New Team" }]}
      />

      <AdminFormCard title="Team Details">
        <TeamForm action={createTeamAction} />
      </AdminFormCard>
    </div>
  );
}
