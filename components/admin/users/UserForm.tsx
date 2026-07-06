"use client";

import AdminInput from "../AdminInput";
import AdminSelect from "../AdminSelect";
import AdminSwitch from "../AdminSwitch";
import { useState } from "react";

export default function UserForm() {
  const [active, setActive] = useState(true);

  return (
    <div className="space-y-6">

      <AdminInput
        label="Full Name"
        placeholder="Ahmed Hassan"
      />

      <AdminInput
        label="Email"
        type="email"
        placeholder="ahmed@airarabia.com"
      />

      <AdminSelect
        label="Role"
        options={[
          {
            label: "Administrator",
            value: "admin",
          },
          {
            label: "Supervisor",
            value: "supervisor",
          },
          {
            label: "Agent",
            value: "agent",
          },
        ]}
      />

      <AdminSwitch
        label="Active User"
        checked={active}
        onChange={setActive}
      />

      <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
        Save User
      </button>

    </div>
  );
}