"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  createCategoryFolder,
  updateCategoryFolder,
  deleteCategoryFolder,
} from "@/lib/category-service";
import { logAction } from "@/lib/audit-service";
import { getCurrentAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createCategoryAction(formData: FormData) {
  const category = await createCategory({
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    color: formData.get("color") as string,
    icon: formData.get("icon") as string,
    visible: formData.get("visible") === "on",
    order: Number(formData.get("order") ?? 0),
    group: (formData.get("group") as string) || "Knowledge Base",
  });

  await logAction("Created", "Category", category.id, await currentUserName());

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
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
    visible: formData.get("visible") === "on",
    order: Number(formData.get("order") ?? 0),
    group: (formData.get("group") as string) || "Knowledge Base",
  });

  await logAction("Updated", "Category", id, await currentUserName());

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(id: number) {
  await deleteCategory(id);

  await logAction("Deleted", "Category", id, await currentUserName());

  revalidatePath("/admin/categories");
}

export async function deleteManyCategoriesAction(ids: number[]) {
  await prisma.category.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Category", null, await currentUserName());

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function createCategoryFolderAction(categoryId: number, name: string) {
  const folder = await createCategoryFolder({
    categoryId,
    name,
  });

  await logAction("Created", "Category Folder", folder.id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function renameCategoryFolderAction(id: number, categoryId: number, name: string) {
  await updateCategoryFolder(id, { name });

  await logAction("Updated", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function toggleCategoryFolderVisibleAction(id: number, categoryId: number, visible: boolean) {
  await updateCategoryFolder(id, { visible });

  await logAction("Updated", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function deleteCategoryFolderAction(id: number, categoryId: number) {
  await deleteCategoryFolder(id);

  await logAction("Deleted", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/admin/articles");
  revalidatePath("/", "layout");
}
