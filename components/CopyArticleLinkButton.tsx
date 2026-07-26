"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function CopyArticleLinkButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      title="Copy link to this article"
      className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-border-subtle px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-surface-muted print:hidden"
    >
      {copied ? <Check size={16} /> : <Link2 size={16} />}
      {copied ? "Copied" : "Copy Link"}
    </button>
  );
}
