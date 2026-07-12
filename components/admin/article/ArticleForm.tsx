"use client";

import { useState } from "react";

import ArticleInfo from "./ArticleInfo";
import OverviewSection from "./OverviewSection";
import PublishSection from "./PublishSection";
import ProcedureSection, { type ProcedureStepInput } from "./ProcedureSection";
import DispositionSection, { type DispositionInput } from "./DispositionSection";
import EscalationSection, { type EscalationInput } from "./EscalationSection";
import NotesSection, { type NoteInput } from "./NotesSection";
import ReferencesSection, { type ReferenceInput } from "./ReferencesSection";
import KeywordsSection from "./KeywordsSection";
import ScenarioSection, { type ScenarioInput } from "./ScenarioSection";
import PhotosSection, { type PhotoInput } from "./PhotosSection";
import AttachmentsSection, { type AttachmentInput } from "./AttachmentsSection";
import ChatTemplatesSection, { type ChatTemplateInput } from "./ChatTemplatesSection";
import EmailTemplatesSection, { type EmailTemplateInput } from "./EmailTemplatesSection";
import UpdatesSection, { type UpdateInput } from "./UpdatesSection";

interface ArticleFormData {
  title: string;
  categoryId: number | null;
  folderId: number | null;
  description: string;
  overview: string;
  author: string;
  status: string;
  coverImage: string;
  procedures: ProcedureStepInput[];
  dispositions: DispositionInput[];
  escalations: EscalationInput[];
  notes: NoteInput[];
  references: ReferenceInput[];
  keywords: string[];
  scenarios: ScenarioInput[];
  images: PhotoInput[];
  attachments: AttachmentInput[];
  chatTemplates: ChatTemplateInput[];
  emailTemplates: EmailTemplateInput[];
  updates: UpdateInput[];
}

interface Props {
  categories?: { id: number; name: string; folders?: { id: number; name: string }[] }[];
  dispositionCodes?: { code: string; label: string }[];
  defaultAuthor?: string;
}

const emptyFormData: ArticleFormData = {
  title: "",
  categoryId: null,
  folderId: null,
  description: "",
  overview: "",
  author: "",
  status: "Draft",
  coverImage: "",
  procedures: [],
  dispositions: [],
  escalations: [],
  notes: [],
  references: [],
  keywords: [],
  scenarios: [],
  images: [],
  attachments: [],
  chatTemplates: [],
  emailTemplates: [],
  updates: [],
};

export default function ArticleForm({ categories = [], dispositionCodes = [], defaultAuthor = "" }: Props) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ArticleFormData>({
    ...emptyFormData,
    author: defaultAuthor,
  });

  function updateField(name: string, value: string | number | null) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Failed to save article."
        );
      }

      alert("Article created successfully!");

      setFormData(emptyFormData);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <ArticleInfo
        data={formData}
        updateField={updateField}
        categories={categories}
      />

      <OverviewSection
        data={formData}
        updateField={updateField}
      />

      <ProcedureSection
        items={formData.procedures}
        onChange={(procedures) => setFormData((prev) => ({ ...prev, procedures }))}
      />

      <ScenarioSection
        items={formData.scenarios}
        onChange={(scenarios) => setFormData((prev) => ({ ...prev, scenarios }))}
      />

      <DispositionSection
        items={formData.dispositions}
        onChange={(dispositions) => setFormData((prev) => ({ ...prev, dispositions }))}
        dispositionCodes={dispositionCodes}
      />

      <EscalationSection
        items={formData.escalations}
        onChange={(escalations) => setFormData((prev) => ({ ...prev, escalations }))}
      />

      <NotesSection
        items={formData.notes}
        onChange={(notes) => setFormData((prev) => ({ ...prev, notes }))}
      />

      <ReferencesSection
        items={formData.references}
        onChange={(references) => setFormData((prev) => ({ ...prev, references }))}
      />

      <KeywordsSection
        keywords={formData.keywords}
        onChange={(keywords) => setFormData((prev) => ({ ...prev, keywords }))}
      />

      <PhotosSection
        items={formData.images}
        onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
      />

      <AttachmentsSection
        items={formData.attachments}
        onChange={(attachments) => setFormData((prev) => ({ ...prev, attachments }))}
      />

      <ChatTemplatesSection
        items={formData.chatTemplates}
        onChange={(chatTemplates) => setFormData((prev) => ({ ...prev, chatTemplates }))}
      />

      <EmailTemplatesSection
        items={formData.emailTemplates}
        onChange={(emailTemplates) => setFormData((prev) => ({ ...prev, emailTemplates }))}
      />

      <UpdatesSection
        items={formData.updates}
        onChange={(updates) => setFormData((prev) => ({ ...prev, updates }))}
      />

      <PublishSection
        loading={loading}
      />
    </form>
  );
}
