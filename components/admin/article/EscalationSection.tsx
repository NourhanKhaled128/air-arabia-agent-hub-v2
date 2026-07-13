"use client";

import { Plus, Trash2 } from "lucide-react";
import InlineImagesUploader from "./InlineImagesUploader";
import { uploadFile, pastedImageFile } from "@/lib/upload-client";

export interface EscalationInput {
  id: number;
  department: string;
  condition: string;
  content: string;
  images: string[];
}

interface Props {
  items: EscalationInput[];
  onChange: (items: EscalationInput[]) => void;
}

export default function EscalationSection({ items, onChange }: Props) {

  function addItem(){
    onChange([...items, { id: Date.now(), department: "", condition: "", content: "", images: [] }]);
  }

  function removeItem(id: number){
    onChange(items.filter(item => item.id !== id));
  }

  function updateItem(id: number, field: keyof EscalationInput, value: string) {
    onChange(
      items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function updateItemImages(id: number, images: string[]) {
    onChange(
      items.map(item => (item.id === id ? { ...item, images } : item))
    );
  }

  async function handlePaste(id: number, e: React.ClipboardEvent) {
    const file = pastedImageFile(e);
    if (!file) return;
    e.preventDefault();
    const url = await uploadFile(file);
    if (url) {
      const item = items.find((i) => i.id === id);
      if (item) updateItemImages(id, [...item.images, url]);
    }
  }

  return(

<section className="rounded-3xl bg-white p-8 shadow-sm">

<div className="mb-8 flex items-center justify-between">

<h2 className="text-2xl font-bold">

Escalation

</h2>

<button
type="button"
onClick={addItem}
className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
>

<Plus size={18}/>

Add Escalation

</button>

</div>

<div className="space-y-6">

{items.map((item,index)=>(

<div
key={item.id}
className="rounded-2xl border p-6"
>

<div className="mb-4 flex items-center justify-between">

<h3 className="font-semibold">

Escalation {index+1}

</h3>

{items.length>1&&(

<button
type="button"
onClick={()=>removeItem(item.id)}
>

<Trash2 className="text-red-700"/>

</button>

)}

</div>

<input
value={item.department}
onChange={(e) => updateItem(item.id, "department", e.target.value)}
placeholder="Department"
className="mb-4 w-full rounded-xl border p-3"
/>

<input
value={item.condition}
onChange={(e) => updateItem(item.id, "condition", e.target.value)}
placeholder="Condition"
className="mb-4 w-full rounded-xl border p-3"
/>

<textarea
rows={4}
value={item.content}
onChange={(e) => updateItem(item.id, "content", e.target.value)}
onPaste={(e) => handlePaste(item.id, e)}
placeholder="Escalation instructions... (paste a screenshot to attach it)"
className="w-full rounded-xl border p-4"
/>

<InlineImagesUploader
  images={item.images}
  onChange={(images) => updateItemImages(item.id, images)}
/>

</div>

))}

</div>

</section>

);

}
