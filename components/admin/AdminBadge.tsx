interface Props {
  children: React.ReactNode;
  color?:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "gray";
}

export default function AdminBadge({
  children,
  color = "gray",
}: Props) {
  const styles = {
    red: "bg-red-100 text-red-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-amber-100 text-amber-700",
    gray: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}