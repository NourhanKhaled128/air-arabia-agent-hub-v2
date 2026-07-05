"use client";

import ArticleInfo from "./ArticleInfo";
import OverviewSection from "./OverviewSection";
import ProcedureSection from "./ProcedureSection";
import DispositionSection from "./DispositionSection";
import EscalationSection from "./EscalationSection";
import NotesSection from "./NotesSection";
import ReferencesSection from "./ReferencesSection";
import RelatedArticlesSection from "./RelatedArticlesSection";
import KeywordsSection from "./KeywordsSection";
import AttachmentsSection from "./AttachmentsSection";
import AirportSection from "./AirportSection";
import PublishSection from "./PublishSection";

export default function ArticleForm() {
  return (
    <form className="space-y-8">

<ArticleInfo />

<OverviewSection />

<ProcedureSection />

<DispositionSection />

<EscalationSection />

<NotesSection />

<ReferencesSection />

<RelatedArticlesSection />

<KeywordsSection />

<AttachmentsSection />

<AirportSection />

<PublishSection />

    </form>
  );
}