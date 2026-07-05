"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function KeywordsSection() {

  const [keywords, setKeywords] = useState<string[]>([]);
  const [value, setValue] = useState("");

  function addKeyword() {

    if (!value.trim()) return;

    if (keywords.includes(value.trim())) return;

    setKeywords([...keywords, value.trim()]);

    setValue("");

  }

  function removeKeyword(keyword: string) {

    setKeywords(
      keywords.filter(item => item !== keyword)
    );

  }

  return (

    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Keywords

      </h2>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            e.preventDefault();

            addKeyword();

          }

        }}
        placeholder="Type keyword then press Enter"
        className="w-full rounded-xl border p-3"
      />

      <div className="mt-6 flex flex-wrap gap-3">

        {keywords.map(keyword => (

          <div
            key={keyword}
            className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700"
          >

            {keyword}

            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
            >

              <X size={16} />

            </button>

          </div>

        ))}

      </div>

    </section>

  );

}