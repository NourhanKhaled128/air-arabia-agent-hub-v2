import PageHeader from "@/components/PageHeader";
import GlossaryFinder from "@/components/GlossaryFinder";
import { GLOSSARY_ENTRIES } from "@/lib/glossary-data";

export default function GlossaryPage() {
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
