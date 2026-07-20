import TeamDashboard from "@/components/admin/team-dashboard/TeamDashboard";
import { CUSTOMER_SUPPORT_TEAM_GROUP } from "@/lib/customer-support-team";

export default function CustomerSupportTeamAdminPage() {
  return (
    <TeamDashboard
      teamName="Customer Support Team"
      teamGroup={CUSTOMER_SUPPORT_TEAM_GROUP}
      publicPath="/CustomerSupportTeam"
    />
  );
}
