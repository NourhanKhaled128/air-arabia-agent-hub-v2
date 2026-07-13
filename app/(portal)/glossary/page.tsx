export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import GlossaryFinder from "@/components/GlossaryFinder";
import { GLOSSARY_ENTRIES } from "@/lib/glossary-data";
import { isSidebarLinkEnabled } from "@/lib/sidebar-service";

export default async function GlossaryPage() {
  if (!(await isSidebarLinkEnabled("/glossary"))) notFound();

  return (
    <>
      <PageHeader
        title="Glossary"
        subtitle="Acronyms and terms used across the Knowledge Base and Training — PNR, OTB, SSR and the rest."
      />

      <GlossaryFinder entries={GLOSSARY_ENTRIES} />
    </>
  );
}
