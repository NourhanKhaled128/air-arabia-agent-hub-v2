import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { getCategoryById } from "@/lib/category-service";
import { updateCategoryAction } from "@/app/admin/actions/category-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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

      <AdminPageHeader title="Edit Category" />

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
