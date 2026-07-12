"use client";

import { useState } from "react";
import { MessageSquare, Mail } from "lucide-react";
import CopyButton from "./CopyButton";

interface ChatTemplate {
  id: number;
  title: string;
  content: string;
}

interface EmailTemplate {
  id: number;
  title: string;
  subject: string;
  body: string;
}

interface Props {
  chatTemplates: ChatTemplate[];
  emailTemplates: EmailTemplate[];
}

type Tab = "chat" | "email";

export default function ArticleTemplateTabs({ chatTemplates, emailTemplates }: Props) {
  const [tab, setTab] = useState<Tab>(chatTemplates.length > 0 ? "chat" : "email");

  return (
    <section className="rounded-3xl border border-gray-200 dark:border-border-subtle bg-white dark:bg-surface p-8 shadow-sm">

      <h2 className="mb-4 text-3xl font-bold">Templates</h2>

      <div className="mb-6 flex gap-2 border-b border-gray-100 dark:border-border-subtle">

        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            tab === "chat"
              ? "border-red-700 text-red-700 dark:border-brand dark:text-brand"
              : "border-transparent text-gray-500 dark:text-slate-400"
          }`}
        >
          <MessageSquare size={18} />
          Chat Templates
          <span className="rounded-full bg-gray-100 dark:bg-background px-2 py-0.5 text-xs text-gray-600 dark:text-slate-400">
            {chatTemplates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab("email")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-semibold transition ${
            tab === "email"
              ? "border-red-700 text-red-700 dark:border-brand dark:text-brand"
              : "border-transparent text-gray-500 dark:text-slate-400"
          }`}
        >
          <Mail size={18} />
          Email Templates
          <span className="rounded-full bg-gray-100 dark:bg-background px-2 py-0.5 text-xs text-gray-600 dark:text-slate-400">
            {emailTemplates.length}
          </span>
        </button>

      </div>

      {tab === "chat" && (
        chatTemplates.length > 0 ? (
          <div className="space-y-4">
            {chatTemplates.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 dark:border-border-subtle p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</h3>
                  <CopyButton text={item.content} compact />
                </div>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-slate-300">{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400">No chat templates yet.</p>
        )
      )}

      {tab === "email" && (
        emailTemplates.length > 0 ? (
          <div className="space-y-4">
            {emailTemplates.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 dark:border-border-subtle p-6"
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</h3>
                  <CopyButton text={`Subject: ${item.subject}\n\n${item.body}`} compact />
                </div>
                <p className="mb-2 text-sm text-gray-500 dark:text-slate-400">
                  <span className="font-semibold">Subject: </span>
                  {item.subject}
                </p>
                <p className="whitespace-pre-wrap text-gray-700 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-slate-400">No email templates yet.</p>
        )
      )}

    </section>
  );
}
