export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import GlossaryFinder from "@/components/GlossaryFinder";
import { getGlossaryEntries } from "@/lib/glossary-service";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

export default async function GlossaryPage() {
  if (!(await isSidebarLinkEnabled("/glossary"))) notFound();

  const entries = await getGlossaryEntries();

  return (
    <>
      <PageHeader
        title="Glossary"
        subtitle="Acronyms and terms used across the Knowledge Base and Training — PNR, OTB, SSR and the rest."
      />

      <GlossaryFinder entries={entries} />
    </>
  );
}
