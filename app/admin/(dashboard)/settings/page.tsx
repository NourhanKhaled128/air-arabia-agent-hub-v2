import Link from "next/link";
import {
  Globe,
  Palette,
  Shield,
  Database,
  Bell,
  Save,
} from "lucide-react";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminFormCard from "@/components/admin/AdminFormCard";
import AdminInput from "@/components/admin/AdminInput";
import AdminTextarea from "@/components/admin/AdminTextarea";
import { getSettings } from "@/lib/settings-service";
import { saveSettingsAction } from "@/app/admin/actions/settings-actions";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="System Settings"
        description="Configure your Air Arabia Champion Hub platform."
      />

      <form action={saveSettingsAction} className="space-y-8">

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminFormCard title="General">
            <div className="mb-6 -mt-2 flex items-center gap-3">
              <Globe className="text-red-700" size={20} />
            </div>

            <div className="space-y-5">
              <AdminInput
                name="appName"
                label="Application Name"
                defaultValue={settings.appName}
              />

              <AdminInput
                name="appUrl"
                label="Application URL"
                defaultValue={settings.appUrl}
              />

              <AdminTextarea
                name="appDescription"
                label="Description"
                rows={4}
                defaultValue={settings.appDescription}
              />
            </div>
          </AdminFormCard>

          <AdminFormCard title="Branding">
            <div className="mb-6 -mt-2 flex items-center gap-3">
              <Palette className="text-red-700" size={20} />
            </div>

            <div className="space-y-5">
              <AdminInput
                name="primaryColor"
                label="Primary Color"
                defaultValue={settings.primaryColor}
              />

              <AdminInput
                name="secondaryColor"
                label="Secondary Color"
                defaultValue={settings.secondaryColor}
              />

              <AdminInput
                name="companyName"
                label="Company Name"
                defaultValue={settings.companyName}
              />
            </div>
          </AdminFormCard>

          <AdminFormCard title="Notifications">
            <div className="mb-6 -mt-2 flex items-center gap-3">
              <Bell className="text-red-700" size={20} />
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between font-medium">
                Email Notifications
                <input
                  type="checkbox"
                  name="emailNotifications"
                  defaultChecked={settings.emailNotifications === "true"}
                  className="h-5 w-5 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between font-medium">
                Push Notifications
                <input
                  type="checkbox"
                  name="pushNotifications"
                  defaultChecked={settings.pushNotifications === "true"}
                  className="h-5 w-5 rounded border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between font-medium">
                Announcement Alerts
                <input
                  type="checkbox"
                  name="announcementAlerts"
                  defaultChecked={settings.announcementAlerts === "true"}
                  className="h-5 w-5 rounded border-slate-300"
                />
              </label>
            </div>
          </AdminFormCard>

          <AdminFormCard title="Security">
            <div className="mb-6 -mt-2 flex items-center gap-3">
              <Shield className="text-red-700" size={20} />
            </div>

            <div className="space-y-5">
              <AdminInput
                type="number"
                name="sessionTimeout"
                label="Session Timeout (minutes)"
                defaultValue={settings.sessionTimeout}
              />

              <AdminInput
                type="number"
                name="loginAttempts"
                label="Max Login Attempts"
                defaultValue={settings.loginAttempts}
              />

              <label className="flex items-center justify-between font-medium">
                Two-Factor Authentication
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  defaultChecked={settings.twoFactorAuth === "true"}
                  className="h-5 w-5 rounded border-slate-300"
                />
              </label>
            </div>
          </AdminFormCard>

          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <Database className="text-red-700" size={20} />
              <h2 className="text-xl font-bold">Maintenance</h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/admin/backup"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-50"
              >
                Backup & Restore
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Save size={18} />
                  Save Settings
                </span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
