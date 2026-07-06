"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/category-service";

export async function createCategoryAction(formData: FormData) {
  await createCategory({
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
  });

  revalidatePath("/admin/categories");
}

export async function updateCategoryAction(
  id: number,
  formData: FormData
) {
  await updateCategory(id, {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: number) {
  await deleteCategory(id);

  revalidatePath("/admin/categories");
}