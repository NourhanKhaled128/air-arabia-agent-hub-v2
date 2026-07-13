export default function GeneralSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-700">
          Administration
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          General Settings
        </h1>

        <p className="mt-3 text-slate-500">
          Configure the Air Arabia Champion Hub.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Application Name
            </label>

            <input
              defaultValue="Air Arabia Champion Hub"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Company
            </label>

            <input
              defaultValue="Air Arabia"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Support Email
            </label>

            <input
              defaultValue="support@airarabia.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Time Zone
            </label>

            <select className="w-full rounded-xl border border-slate-300 px-4 py-3">
              <option>Asia/Dubai</option>
              <option>Africa/Cairo</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}