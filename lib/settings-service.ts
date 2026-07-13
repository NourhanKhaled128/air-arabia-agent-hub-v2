import { prisma } from "@/lib/prisma";

export const SETTINGS_DEFAULTS: Record<string, string> = {
  appName: "Air Arabia Champion Hub",
  appUrl: "https://airarabia-championhub.local",
  appDescription: "Internal knowledge portal for Air Arabia contact center champions.",
  primaryColor: "#C8102E",
  secondaryColor: "#1F2937",
  companyName: "Air Arabia",
  emailNotifications: "true",
  pushNotifications: "true",
  announcementAlerts: "true",
  sessionTimeout: "30",
  loginAttempts: "5",
  twoFactorAuth: "false",
};

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await prisma.appSetting.findMany();
  const stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return { ...SETTINGS_DEFAULTS, ...stored };
}

export async function saveSettings(values: Record<string, string>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.appSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
}
