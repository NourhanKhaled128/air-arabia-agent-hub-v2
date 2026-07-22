import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ContentSuggestionsTable from "@/components/admin/content-suggestions/ContentSuggestionsTable";
import { getContentSuggestions } from "@/lib/content-suggestion-service";

export default async function ContentSuggestionsPage() {
  const suggestions = await getContentSuggestions();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Content Suggestions"
        description="Structured 'suggest an edit' requests from agents — distinct from the Yes/No feedback rating."
      />

      <ContentSuggestionsTable suggestions={suggestions} />
    </div>
  );
}
