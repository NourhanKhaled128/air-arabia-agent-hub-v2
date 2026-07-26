"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ArticleInfo from "./ArticleInfo";
import OverviewSection from "./OverviewSection";
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
import ArticleSidebar from "./ArticleSidebar";
import { createScheduledChangeAction } from "@/app/admin/actions/scheduled-change-actions";

interface ArticleWithRelations {
  id: number;
  title: string;
  categoryId: number | null;
  folderId: number | null;
  description: string;
  overview: string;
  author: string;
  status: string;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  procedures: { id: number; title: string | null; content: string; image: string | null }[];
  dispositions: { id: number; category: string | null; code: string | null; content: string; scenario: string | null; images: string[] }[];
  escalations: { id: number; department: string | null; condition: string | null; content: string; images: string[] }[];
  notes: { id: number; type: string; content: string; images: string[] }[];
  references: { id: number; title: string; type: string; link: string | null; images: string[] }[];
  keywords: { id: number; value: string }[];
  scenarios: { id: number; situation: string; response: string; images: string[] }[];
  images: { id: number; image: string }[];
  attachments: { id: number; fileName: string; url: string; mimeType: string; size: number }[];
  chatTemplates: { id: number; title: string; content: string }[];
  emailTemplates: { id: number; title: string; subject: string; body: string }[];
  updates: { id: number; title: string; content: string }[];
}

interface HistoryEntry {
  id: number;
  action: string;
  userName: string;
  createdAt: Date;
}

interface Props {
  article: ArticleWithRelations;
  categories?: { id: number; name: string; folders?: { id: number; name: string }[] }[];
  dispositionCodes?: { code: string; label: string; category?: string | null }[];
  history?: HistoryEntry[];
}

interface EditFormData {
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

function toFormData(article: ArticleWithRelations): EditFormData {
  return {
    title: article.title,
    categoryId: article.categoryId,
    folderId: article.folderId,
    description: article.description,
    overview: article.overview,
    author: article.author,
    status: article.status,
    coverImage: article.coverImage ?? "",
    procedures: article.procedures.map((p) => ({
      id: p.id,
      title: p.title ?? "",
      content: p.content,
      image: p.image ?? "",
    })),
    dispositions: article.dispositions.map((d) => ({
      id: d.id,
      category: d.category ?? "",
      code: d.code ?? "",
      content: d.content,
      scenario: d.scenario ?? "",
      images: d.images,
    })),
    escalations: article.escalations.map((e) => ({
      id: e.id,
      department: e.department ?? "",
      condition: e.condition ?? "",
      content: e.content,
      images: e.images,
    })),
    notes: article.notes.map((n) => ({
      id: n.id,
      type: n.type,
      content: n.content,
      images: n.images,
    })),
    references: article.references.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      link: r.link ?? "",
      images: r.images,
    })),
    keywords: article.keywords.map((k) => k.value),
    scenarios: article.scenarios.map((s) => ({
      id: s.id,
      situation: s.situation,
      response: s.response,
      images: s.images,
    })),
    images: article.images.map((i) => ({ id: i.id, url: i.image })),
    attachments: article.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      url: a.url,
      mimeType: a.mimeType,
      size: a.size,
    })),
    chatTemplates: article.chatTemplates.map((c) => ({
      id: c.id,
      title: c.title,
      content: c.content,
    })),
    emailTemplates: article.emailTemplates.map((e) => ({
      id: e.id,
      title: e.title,
      subject: e.subject,
      body: e.body,
    })),
    updates: article.updates.map((u) => ({
      id: u.id,
      title: u.title,
      content: u.content,
    })),
  };
}

export default function EditArticleForm({
  article,
  categories = [],
  dispositionCodes = [],
  history = [],
}: Props) {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleText, setScheduleText] = useState("");

  const [form, setForm] = useState<EditFormData>(() => toFormData(article));

  function updateField(name: string, value: string | number | null) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function save() {

    setLoading(true);

    try {

      const response = await fetch(
        `/api/articles/${article.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      alert("Article updated successfully.");

      router.push("/admin/articles");

      router.refresh();

    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );

    } finally {

      setLoading(false);

    }

  }

  async function scheduleForLater() {
    if (!scheduleDate) {
      alert("Pick an effective date first.");
      return;
    }
    if (!scheduleText.trim()) {
      alert("Enter the text to add after the Overview.");
      return;
    }

    setScheduling(true);

    try {
      await createScheduledChangeAction({
        entityType: "Article",
        entityId: article.id,
        label: `${form.title} — scheduled overview update`,
        effectiveDate: new Date(scheduleDate),
        payload: { appendToOverview: scheduleText.trim() },
      });

      alert(`Scheduled — this text will be added after the Overview on ${new Date(scheduleDate).toLocaleString()}. The live article is unchanged until then.`);

      setScheduleDate("");
      setScheduleText("");

      router.push("/admin/scheduled-changes");

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setScheduling(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">

      <div className="space-y-8 lg:col-span-2">

      <ArticleInfo
        data={form}
        updateField={updateField}
        categories={categories}
      />

      <OverviewSection
        data={form}
        updateField={updateField}
      />

      <ProcedureSection
        items={form.procedures}
        onChange={(procedures) => setForm((prev) => ({ ...prev, procedures }))}
      />

      <ScenarioSection
        items={form.scenarios}
        onChange={(scenarios) => setForm((prev) => ({ ...prev, scenarios }))}
      />

      <DispositionSection
        items={form.dispositions}
        onChange={(dispositions) => setForm((prev) => ({ ...prev, dispositions }))}
        dispositionCodes={dispositionCodes}
      />

      <EscalationSection
        items={form.escalations}
        onChange={(escalations) => setForm((prev) => ({ ...prev, escalations }))}
      />

      <NotesSection
        items={form.notes}
        onChange={(notes) => setForm((prev) => ({ ...prev, notes }))}
      />

      <ReferencesSection
        items={form.references}
        onChange={(references) => setForm((prev) => ({ ...prev, references }))}
      />

      <KeywordsSection
        keywords={form.keywords}
        onChange={(keywords) => setForm((prev) => ({ ...prev, keywords }))}
      />

      <PhotosSection
        items={form.images}
        onChange={(images) => setForm((prev) => ({ ...prev, images }))}
      />

      <AttachmentsSection
        items={form.attachments}
        onChange={(attachments) => setForm((prev) => ({ ...prev, attachments }))}
      />

      <ChatTemplatesSection
        items={form.chatTemplates}
        onChange={(chatTemplates) => setForm((prev) => ({ ...prev, chatTemplates }))}
      />

      <EmailTemplatesSection
        items={form.emailTemplates}
        onChange={(emailTemplates) => setForm((prev) => ({ ...prev, emailTemplates }))}
      />

      <UpdatesSection
        items={form.updates}
        onChange={(updates) => setForm((prev) => ({ ...prev, updates }))}
        history={history}
      />

      <section className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">

        <h2 className="mb-2 text-2xl font-bold">Schedule an Overview update</h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          Stages text to be appended after the current Overview, automatically, on the date below — it does not
          touch anything else on this article, and the live article is unchanged until then.
        </p>

        <label className="mb-4 block text-sm font-semibold text-gray-700 dark:text-slate-300">
          Text to add after the Overview
          <textarea
            rows={3}
            value={scheduleText}
            onChange={(e) => setScheduleText(e.target.value)}
            placeholder="e.g. Effective 1 August 2026, ..."
            className="mt-2 w-full rounded-xl border p-4 font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            Effective date
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>

          <button
            onClick={scheduleForLater}
            disabled={scheduling || loading}
            className="rounded-xl border border-red-700 px-6 py-3 font-semibold text-red-700 dark:text-red-400"
          >
            {scheduling ? "Scheduling..." : "Schedule for later"}
          </button>
        </div>

      </section>

      <div className="flex justify-end gap-3">
        <a
          href={`/admin/articles/${article.id}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-300 px-8 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Preview
        </a>

        <button
          onClick={save}
          disabled={loading || scheduling}
          className="rounded-xl bg-red-700 px-8 py-3 font-semibold text-white"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      </div>

      <div className="lg:col-span-1">
        <ArticleSidebar
          author={article.author}
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
        />
      </div>

    </div>
  );
}
