import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { getCategoryById } from "@/lib/category-service";
import { updateCategoryAction } from "@/app/admin/actions/category-actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId)) {
    notFound();
  }

  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const boundUpdate = updateCategoryAction.bind(null, categoryId);

  return (
    <div className="space-y-8">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          Edit Category
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <CategoryForm
          action={boundUpdate}
          submitLabel="Save Changes"
          category={category}
        />
      </div>

    </div>
  );
}
