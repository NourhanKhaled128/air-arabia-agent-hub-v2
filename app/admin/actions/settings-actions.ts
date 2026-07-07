"use server";

import { revalidatePath } from "next/cache";
import { saveSettings } from "@/lib/settings-service";

export async function saveSettingsAction(formData: FormData) {
  await saveSettings({
    appName: formData.get("appName") as string,
    appUrl: formData.get("appUrl") as string,
    appDescription: formData.get("appDescription") as string,
    primaryColor: formData.get("primaryColor") as string,
    secondaryColor: formData.get("secondaryColor") as string,
    companyName: formData.get("companyName") as string,
    emailNotifications: formData.get("emailNotifications") === "on" ? "true" : "false",
    pushNotifications: formData.get("pushNotifications") === "on" ? "true" : "false",
    announcementAlerts: formData.get("announcementAlerts") === "on" ? "true" : "false",
    sessionTimeout: formData.get("sessionTimeout") as string,
    loginAttempts: formData.get("loginAttempts") as string,
    twoFactorAuth: formData.get("twoFactorAuth") === "on" ? "true" : "false",
  });

  revalidatePath("/admin/settings");
}
