"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createPortalSession, deletePortalSession } from "@/lib/portal-session";
import { logAction } from "@/lib/audit-service";
import { requirePortalUser } from "@/lib/portal-dal";

export async function portalLoginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/login?error=1");
  }

  const user = await prisma.portalUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user || user.status !== "Active" || !verifyPassword(password, user.passwordHash)) {
    redirect("/login?error=1");
  }

  await prisma.portalUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await logAction("Login", "PortalUser", user.id, user.name);
  await createPortalSession(user.id);

  redirect("/");
}

export async function portalLogoutAction() {
  await deletePortalSession();
  redirect("/login");
}

export async function markOnboardingSeenAction() {
  const user = await requirePortalUser();
  await prisma.portalUser.update({ where: { id: user.id }, data: { hasSeenOnboarding: true } });
}
