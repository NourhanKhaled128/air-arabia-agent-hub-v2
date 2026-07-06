"use client";

import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

export default function AnnouncementComposer() {
  return (
    <div className="space-y-6">

      <AdminInput
        label="Announcement Title"
        placeholder="Title..."
      />

      <AdminSelect
        label="Audience"
        options={[
          { label: "All Agents", value: "all" },
          { label: "Reservations", value: "reservation" },
          { label: "Airport", value: "airport" },
          { label: "Finance", value: "finance" },
        ]}
      />

      <AdminSelect
        label="Priority"
        options={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
          { label: "Critical", value: "critical" },
        ]}
      />

      <AdminTextarea
        label="Announcement"
        placeholder="Write announcement..."
      />

      <div className="flex justify-end">

        <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
          Publish Announcement
        </button>

      </div>

    </div>
  );
}