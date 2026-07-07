import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { role: true },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: { role: true },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  roleId: number;
  status?: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashPassword(data.password),
      roleId: data.roleId,
      status: data.status ?? "Active",
    },
  });
}

export async function updateUser(
  id: number,
  data: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
    status?: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      roleId: data.roleId,
      status: data.status,
      ...(data.password ? { passwordHash: hashPassword(data.password) } : {}),
    },
  });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}
