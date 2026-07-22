import { prisma } from "@/lib/prisma";

export const PERMISSION_KEYS = [
  "manage_articles",
  "manage_categories",
  "manage_sidebar",
  "manage_announcements",
  "manage_training",
  "manage_users",
  "manage_roles",
  "manage_settings",
  "view_analytics",
  "manage_media",
  "manage_quality",
];

export async function getRoles() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return roles;
}

export async function getRoleById(id: number) {
  return prisma.role.findUnique({
    where: { id },
  });
}

export async function createRole(data: {
  name: string;
  color?: string;
  permissions?: string[];
}) {
  return prisma.role.create({
    data: {
      name: data.name,
      color: data.color || "bg-slate-100 text-slate-700",
      permissions: data.permissions ?? [],
    },
  });
}

export async function updateRole(
  id: number,
  data: { name?: string; color?: string; permissions?: string[] }
) {
  return prisma.role.update({
    where: { id },
    data,
  });
}

export async function deleteRole(id: number) {
  return prisma.role.delete({
    where: { id },
  });
}
