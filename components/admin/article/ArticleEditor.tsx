"use client";

import { useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Link2,
  ImagePlus,
} from "lucide-react";

interface ArticleEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function ArticleEditor({
  value = "",
  onChange,
}: ArticleEditorProps) {
  const [content, setContent] = useState(value);

  function update(value: string) {
    setContent(value);
    onChange?.(value);
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-white">

      <div className="flex flex-wrap gap-2 border-b bg-slate-50 p-4">

        {[
          Bold,
          Italic,
          Underline,
          Heading1,
          Heading2,
          List,
          ListOrdered,
          Quote,
          Link2,
          ImagePlus,
        ].map((Icon, index) => (
          <button
            key={index}
            type="button"
            className="rounded-lg border bg-white p-2 hover:bg-slate-100"
          >
            <Icon size={18} />
          </button>
        ))}

      </div>

      <textarea
        value={content}
        onChange={(e) => update(e.target.value)}
        placeholder="Write your article..."
        className="min-h-[550px] w-full resize-none p-6 outline-none"
      />

    </div>
  );
}