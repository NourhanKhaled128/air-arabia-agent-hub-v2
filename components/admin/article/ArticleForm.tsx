"use client";

import { useForm } from "react-hook-form";
import { createArticle } from "@/app/actions/article";
import { ArticleFormData } from "@/types/article";

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
  const { register, handleSubmit, reset } = useForm<ArticleFormData>({
    defaultValues: {
      author: "Nourhan Khaled",
    },
  });

  async function onSubmit(data: ArticleFormData) {
    try {
      await createArticle(data);

      alert("✅ Article saved successfully!");

      reset();

    } catch (error) {
      console.error(error);

      alert("❌ Failed to save article.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <ArticleInfo register={register} />

      <OverviewSection register={register} />

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