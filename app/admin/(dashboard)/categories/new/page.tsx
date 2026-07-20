import CategoryForm from "@/components/admin/categories/CategoryForm";
import { createCategoryAction } from "@/app/admin/actions/category-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

interface Props {
  searchParams: Promise<{ group?: string }>;
}

export default async function NewCategoryPage({ searchParams }: Props) {
  const { group } = await searchParams;

  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Category" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <CategoryForm action={createCategoryAction} defaultGroup={group} />
      </div>

    </div>
  );
}
