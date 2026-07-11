import { Info } from "lucide-react";

interface Props {
  message?: string;
}

export default function NotAvailableNotice({
  message = "Not available in this environment.",
}: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-border-subtle p-6 text-slate-500 dark:text-slate-400">
      <Info size={20} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}
