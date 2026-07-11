"use client";

import { useState } from "react";
import { Check, Copy as CopyIcon } from "lucide-react";

interface Props {
  text: string;
  compact?: boolean;
}

export default function CopyButton({
  text,
  compact = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className={`flex shrink-0 items-center gap-1.5 rounded-lg font-semibold transition ${
        compact ? "px-2.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
      } ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-red-700 text-white hover:bg-red-800"
      }`}
    >
      {copied ? <Check size={14} /> : <CopyIcon size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}