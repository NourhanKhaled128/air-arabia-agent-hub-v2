import PageHeader from "@/components/PageHeader";
import DispositionCodeFinder from "@/components/DispositionCodeFinder";
import { getActiveDispositionCodes } from "@/lib/disposition-service";

export default async function DispositionCodesPage() {
  const dispositions = await getActiveDispositionCodes();

  return (
    <>
      <PageHeader
        title="Disposition Codes"
        subtitle="Reference list of call-outcome codes to select after each call."
      />

      <DispositionCodeFinder dispositions={dispositions} />
    </>
  );
}
