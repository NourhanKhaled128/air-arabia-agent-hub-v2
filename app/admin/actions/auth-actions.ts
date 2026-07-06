"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  getExpectedAdminSessionToken,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !isValidAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, getExpectedAdminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete(ADMIN_SESSION_COOKIE);

  redirect("/admin/login");
}
