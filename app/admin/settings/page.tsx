import {
  Settings,
  Globe,
  Palette,
  Shield,
  Database,
  Bell,
  Save,
} from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          System Settings
        </h1>

        <p className="mt-3 text-slate-500">
          Configure your Air Arabia Agent Hub platform.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Globe className="text-red-700" />
            <h2 className="text-xl font-bold">General</h2>
          </div>

          <div className="space-y-5">
            <input
              defaultValue="Air Arabia Agent Hub"
              className="w-full rounded-xl border p-3"
              placeholder="Application Name"
            />

            <input
              defaultValue="https://airarabia-agenthub.local"
              className="w-full rounded-xl border p-3"
              placeholder="Application URL"
            />

            <textarea
              rows={4}
              defaultValue="Internal knowledge portal for Air Arabia contact center agents."
              className="w-full rounded-xl border p-3"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Palette className="text-red-700" />
            <h2 className="text-xl font-bold">Branding</h2>
          </div>

          <div className="space-y-5">
            <input
              defaultValue="#C8102E"
              className="w-full rounded-xl border p-3"
              placeholder="Primary Color"
            />

            <input
              defaultValue="#1F2937"
              className="w-full rounded-xl border p-3"
              placeholder="Secondary Color"
            />

            <input
              defaultValue="Air Arabia"
              className="w-full rounded-xl border p-3"
              placeholder="Company Name"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Bell className="text-red-700" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              Email Notifications
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex items-center justify-between">
              Push Notifications
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex items-center justify-between">
              Announcement Alerts
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="text-red-700" />
            <h2 className="text-xl font-bold">Security</h2>
          </div>

          <div className="space-y-5">
            <input
              type="number"
              defaultValue={30}
              className="w-full rounded-xl border p-3"
              placeholder="Session Timeout"
            />

            <input
              type="number"
              defaultValue={5}
              className="w-full rounded-xl border p-3"
              placeholder="Login Attempts"
            />

            <label className="flex items-center justify-between">
              Two-Factor Authentication
              <input type="checkbox" />
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <Database className="text-red-700" />
            <h2 className="text-xl font-bold">Maintenance</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50">
              Backup Database
            </button>

            <button className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50">
              Clear Cache
            </button>

            <button className="rounded-xl border px-6 py-3 font-semibold hover:bg-slate-50">
              Rebuild Search Index
            </button>

            <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
              <span className="inline-flex items-center gap-2">
                <Save size={18} />
                Save Settings
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}