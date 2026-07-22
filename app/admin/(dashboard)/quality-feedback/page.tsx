import AdminPageHeader from "@/components/admin/AdminPageHeader";
import QualityFeedbackManager from "@/components/admin/quality/QualityFeedbackManager";
import { getAllQualityReviews } from "@/lib/quality-review-service";
import { getPortalUsers } from "@/lib/portal-user-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

export default async function QualityFeedbackPage() {
  const [reviews, agents, admin] = await Promise.all([
    getAllQualityReviews(),
    getPortalUsers(),
    getCurrentAdminUser(),
  ]);

  const canManage = admin?.role.permissions.includes("manage_quality") ?? false;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Quality Feedback"
        description="QA/team-lead ratings and notes left against agents — visible to the agent on their own Account page."
      />

      <QualityFeedbackManager agents={agents} reviews={reviews} canManage={canManage} />
    </div>
  );
}
