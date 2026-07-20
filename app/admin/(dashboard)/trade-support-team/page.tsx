import TeamDashboard from "@/components/admin/team-dashboard/TeamDashboard";
import { TRADE_SUPPORT_TEAM_GROUP } from "@/lib/trade-support-team";

export default function TradeSupportTeamAdminPage() {
  return (
    <TeamDashboard
      teamName="Trade Support Team"
      teamGroup={TRADE_SUPPORT_TEAM_GROUP}
      publicPath="/TradeSupportTeam"
    />
  );
}
