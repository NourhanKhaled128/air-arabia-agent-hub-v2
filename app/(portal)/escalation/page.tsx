import PageHeader from "@/components/PageHeader";
import EscalationContactFinder from "@/components/EscalationContactFinder";
import { getActiveEscalationContacts } from "@/lib/escalation-service";

export default async function EscalationPage() {
  const escalations = await getActiveEscalationContacts();

  return (
    <>
      <PageHeader
        title="Escalation Contacts"
        subtitle="Who to escalate each issue type to, and how to reach them."
      />

      <EscalationContactFinder escalations={escalations} />
    </>
  );
}
