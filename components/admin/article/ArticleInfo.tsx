"use client";

import { UseFormRegister } from "react-hook-form";
import { ArticleFormData } from "@/types/article";

interface Props {
  register: UseFormRegister<ArticleFormData>;
}

export default function ArticleInfo({
  register,
}: Props) {

  return (

    <section className="rounded-3xl bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">

        Article Information

      </h2>

      <div className="grid gap-6 lg:grid-cols-2">

        <div>

          <label className="mb-2 block">

            Title

          </label>

          <input

            {...register("title")}

            className="w-full rounded-xl border p-3"

          />

        </div>


        <div>

          <label className="mb-2 block">

            Category

          </label>

          <input

            {...register("category")}

            className="w-full rounded-xl border p-3"

          />

        </div>

        <div>

          <label className="mb-2 block">

            Author

          </label>

          <input

            {...register("author")}

            defaultValue="Nourhan Khaled"

            className="w-full rounded-xl border p-3"

          />

        </div>

      </div>

      <div className="mt-6">

        <label className="mb-2 block">

          Description

        </label>

        <textarea

          {...register("description")}

          rows={4}

          className="w-full rounded-xl border p-4"

        />

      </div>

    </section>

  );

}