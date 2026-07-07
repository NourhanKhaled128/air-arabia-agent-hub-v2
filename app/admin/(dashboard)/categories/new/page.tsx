import CategoryForm from "@/components/admin/categories/CategoryForm";
import { createCategoryAction } from "@/app/admin/actions/category-actions";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default function NewCategoryPage() {
  return (
    <div className="space-y-8">

      <AdminPageHeader title="New Category" />

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <CategoryForm action={createCategoryAction} />
      </div>

    </div>
  );
}
