"use client";

import { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "@/types/article";

interface Props {
  register: UseFormRegister<ArticleFormData>;
}

export default function OverviewSection({ register }: Props) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Overview
      </h2>

      <textarea
        {...register("overview")}
        rows={12}
        placeholder="Write article overview..."
        className="w-full rounded-xl border border-gray-300 p-4"
      />

    </section>
  );
}