import AdminPageHeader from "@/components/admin/AdminPageHeader";
import GlossaryManager from "@/components/admin/glossary/GlossaryManager";
import { getGlossaryEntries } from "@/lib/glossary-service";

export default async function AdminGlossaryPage() {
  const entries = await getGlossaryEntries();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Glossary"
        description="Manage the acronyms and terms shown on the champion-facing Glossary page."
      />

      <GlossaryManager entries={entries} />
    </div>
  );
}
