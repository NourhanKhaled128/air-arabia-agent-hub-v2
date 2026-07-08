"use client";

import AdminListTable from "@/components/admin/AdminListTable";
import AdminBadge from "@/components/admin/AdminBadge";
import EscalationRowActions from "./EscalationRowActions";
import { deleteManyEscalationContactsAction } from "@/app/admin/actions/escalation-actions";

interface EscalationContact {
  id: number;
  issueType: string;
  escalateTo: string;
  contactInfo: string;
  active: boolean;
}

interface Props {
  escalations: EscalationContact[];
}

export default function EscalationContactsTable({ escalations }: Props) {
  return (
    <AdminListTable
      columns={[
        { key: "issueType", label: "Issue Type" },
        { key: "escalateTo", label: "Escalate To" },
        { key: "contactInfo", label: "Contact Info" },
        { key: "status", label: "Status" },
      ]}
      data={escalations}
      searchPlaceholder="Search escalation contacts..."
      searchFn={(item, query) => {
        const q = query.toLowerCase();
        return (
          item.issueType.toLowerCase().includes(q) ||
          item.escalateTo.toLowerCase().includes(q) ||
          item.contactInfo.toLowerCase().includes(q)
        );
      }}
      filters={[
        {
          key: "active",
          label: "Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      ]}
      filterFn={(item, values) => {
        if (values.active === "active" && !item.active) return false;
        if (values.active === "inactive" && item.active) return false;
        return true;
      }}
      onDeleteMany={deleteManyEscalationContactsAction}
      emptyMessage="No escalation contacts yet."
      renderRow={(escalation) => (
        <>
          <td className="px-6 py-5 font-semibold">{escalation.issueType}</td>
          <td className="px-6 py-5">{escalation.escalateTo}</td>
          <td className="px-6 py-5">{escalation.contactInfo}</td>
          <td className="px-6 py-5">
            <AdminBadge color={escalation.active ? "green" : "gray"}>
              {escalation.active ? "Active" : "Inactive"}
            </AdminBadge>
          </td>
          <td className="px-6 py-5">
            <EscalationRowActions id={escalation.id} />
          </td>
        </>
      )}
    />
  );
}
