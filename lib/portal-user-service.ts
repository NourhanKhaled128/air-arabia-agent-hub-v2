import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

const ALLOWED_EMAIL_DOMAINS = ["airarabia.com", "gocozmo.com"];

export function isAllowedPortalEmailDomain(email: string) {
  const domain = email.trim().toLowerCase().split("@")[1];
  return !!domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
}

export async function getPortalUsers() {
  return prisma.portalUser.findMany({ orderBy: { name: "asc" } });
}

export async function getPortalUserById(id: number) {
  return prisma.portalUser.findUnique({ where: { id } });
}

export async function createPortalUser(data: {
  name: string;
  email: string;
  password: string;
  status?: string;
}) {
  if (!isAllowedPortalEmailDomain(data.email)) {
    throw new Error("Email must be an @airarabia.com or @gocozmo.com address.");
  }

  return prisma.portalUser.create({
    data: {
      name: data.name,
      email: data.email.trim().toLowerCase(),
      passwordHash: hashPassword(data.password),
      status: data.status ?? "Active",
    },
  });
}

export async function updatePortalUser(
  id: number,
  data: { name?: string; email?: string; password?: string; status?: string }
) {
  if (data.email && !isAllowedPortalEmailDomain(data.email)) {
    throw new Error("Email must be an @airarabia.com or @gocozmo.com address.");
  }

  return prisma.portalUser.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email?.trim().toLowerCase(),
      status: data.status,
      ...(data.password ? { passwordHash: hashPassword(data.password) } : {}),
    },
  });
}

export async function deletePortalUser(id: number) {
  return prisma.portalUser.delete({ where: { id } });
}
