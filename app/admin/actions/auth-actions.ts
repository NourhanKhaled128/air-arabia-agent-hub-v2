"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/admin/login?error=1");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (
    !user ||
    user.status !== "Active" ||
    !verifyPassword(password, user.passwordHash)
  ) {
    redirect("/admin/login?error=1");
  }

  await createSession(user.id);

  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
