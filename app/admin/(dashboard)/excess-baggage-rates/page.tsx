import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ExcessBaggageUploadForm from "@/components/admin/excess-baggage/ExcessBaggageUploadForm";
import ExcessBaggageRatesPreview from "@/components/admin/excess-baggage/ExcessBaggageRatesPreview";
import { getAllExcessBaggageRates } from "@/lib/excess-baggage-service";

export default async function ExcessBaggageRatesPage() {
  const rates = await getAllExcessBaggageRates();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Excess Baggage Rates"
        description="Upload the latest rates workbook to update G9, 3O, 9P and E5 rates everywhere they're quoted — the Knowledge Base article, chat/email templates and decision tree for each hub."
      />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <ExcessBaggageUploadForm />
      </div>

      <ExcessBaggageRatesPreview rates={rates} />
    </div>
  );
}
