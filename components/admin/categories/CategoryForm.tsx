import AdminInput from "../AdminInput";
import AdminTextarea from "../AdminTextarea";
import AdminSelect from "../AdminSelect";

interface Category {
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  visible: boolean;
  order: number;
  group: string;
}

interface Props {
  action: (formData: FormData) => void;
  submitLabel?: string;
  category?: Category;
}

export default function CategoryForm({
  action,
  submitLabel = "Save Category",
  category,
}: Props) {
  return (
    <form action={action} className="space-y-6">

      <AdminInput
        name="name"
        label="Category Name"
        placeholder="Reservations"
        defaultValue={category?.name}
        required
      />

      <AdminInput
        name="slug"
        label="Slug"
        placeholder="reservations"
        defaultValue={category?.slug}
        required
      />

      <AdminTextarea
        name="description"
        label="Description"
        placeholder="Category description..."
        defaultValue={category?.description ?? ""}
      />

      <AdminSelect
        name="color"
        label="Color"
        defaultValue={category?.color ?? "bg-red-100 text-red-700"}
        options={[
          { label: "Red", value: "bg-red-100 text-red-700" },
          { label: "Blue", value: "bg-blue-100 text-blue-700" },
          { label: "Emerald", value: "bg-emerald-100 text-emerald-700" },
          { label: "Amber", value: "bg-amber-100 text-amber-700" },
          { label: "Violet", value: "bg-violet-100 text-violet-700" },
        ]}
      />

      <AdminInput
        name="icon"
        label="Icon (optional)"
        placeholder="folder"
        defaultValue={category?.icon ?? ""}
      />

      <div className="grid gap-6 md:grid-cols-2">

        <AdminInput
          name="group"
          label="Sidebar Group"
          placeholder="Knowledge Base"
          defaultValue={category?.group ?? "Knowledge Base"}
        />

        <AdminInput
          type="number"
          name="order"
          label="Sidebar Order"
          placeholder="0"
          defaultValue={category?.order ?? 0}
        />

      </div>

      <label className="flex items-center gap-3 font-semibold">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={category?.visible ?? true}
          className="h-5 w-5 rounded border-gray-300"
        />
        Show in champion sidebar
      </label>

      <button
        type="submit"
        className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
      >
        {submitLabel}
      </button>

    </form>
  );
}
