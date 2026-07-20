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
import { getCurrentAdminUser, requireAdminUser } from "@/lib/admin-dal";

async function currentUserName() {
  const user = await getCurrentAdminUser();
  return user?.name ?? "System";
}

export async function createCategoryAction(formData: FormData) {
  await requireAdminUser();

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
  await requireAdminUser();

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
  await requireAdminUser();

  await deleteCategory(id);

  await logAction("Deleted", "Category", id, await currentUserName());

  revalidatePath("/admin/categories");
}

export async function deleteManyCategoriesAction(ids: number[]) {
  await requireAdminUser();

  await prisma.category.deleteMany({ where: { id: { in: ids } } });

  await logAction("Deleted", "Category", null, await currentUserName());

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}

export async function createCategoryFolderAction(categoryId: number, name: string) {
  await requireAdminUser();

  const folder = await createCategoryFolder({
    categoryId,
    name,
  });

  await logAction("Created", "Category Folder", folder.id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function renameCategoryFolderAction(id: number, categoryId: number, name: string) {
  await requireAdminUser();

  await updateCategoryFolder(id, { name });

  await logAction("Updated", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function toggleCategoryFolderVisibleAction(id: number, categoryId: number, visible: boolean) {
  await requireAdminUser();

  await updateCategoryFolder(id, { visible });

  await logAction("Updated", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function reorderCategoryFoldersAction(categoryId: number, orderedIds: number[]) {
  await requireAdminUser();

  await Promise.all(
    orderedIds.map((id, index) => updateCategoryFolder(id, { order: index }))
  );

  await logAction("Reordered", "Category Folder", categoryId, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/", "layout");
}

export async function deleteCategoryFolderAction(id: number, categoryId: number) {
  await requireAdminUser();

  await deleteCategoryFolder(id);

  await logAction("Deleted", "Category Folder", id, await currentUserName());

  revalidatePath(`/admin/categories/${categoryId}`);
  revalidatePath("/admin/articles");
  revalidatePath("/", "layout");
}
