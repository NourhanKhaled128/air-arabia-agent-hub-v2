export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import QuickReferenceTabs from "@/components/QuickReferenceTabs";
import { getQuickReferenceHubs } from "@/lib/quick-reference-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

export default async function QuickReferencePage() {
  if (!(await isSidebarLinkEnabled("/quick-reference"))) notFound();

  const hubs = await getQuickReferenceHubs();

  return (
    <>
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4 print:mb-4">
        <PageHeader
          title="Quick Reference"
          subtitle="Condensed, hub-by-hub facts for mid-call lookups — the full detail lives in Training and the Knowledge Base."
        />
        <PrintButton />
      </div>

      <QuickReferenceTabs hubs={hubs} />
    </>
  );
}
