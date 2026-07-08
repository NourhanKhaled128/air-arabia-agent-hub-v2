"use client";

import { Plus, Trash2 } from "lucide-react";
import InlineImagesUploader from "./InlineImagesUploader";

export interface NoteInput {
  id: number;
  type: string;
  content: string;
  images: string[];
}

interface Props {
  items: NoteInput[];
  onChange: (items: NoteInput[]) => void;
}

export default function NotesSection({ items, onChange }: Props) {

  function addNote(){
    onChange([...items, { id: Date.now(), type: "Information", content: "", images: [] }]);
  }

  function removeNote(id: number){
    onChange(items.filter(note => note.id !== id));
  }

  function updateNote(id: number, field: keyof NoteInput, value: string) {
    onChange(
      items.map(note => (note.id === id ? { ...note, [field]: value } : note))
    );
  }

  function updateNoteImages(id: number, images: string[]) {
    onChange(
      items.map(note => (note.id === id ? { ...note, images } : note))
    );
  }

  return(

<section className="rounded-3xl bg-white p-8 shadow-sm">

<div className="mb-8 flex items-center justify-between">

<h2 className="text-2xl font-bold">

Notes

</h2>

<button
type="button"
onClick={addNote}
className="flex items-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-white"
>

<Plus size={18}/>

Add Note

</button>

</div>

<div className="space-y-6">

{items.map((note,index)=>(

<div
key={note.id}
className="rounded-2xl border p-6"
>

<div className="mb-4 flex items-center justify-between">

<h3>

Note {index+1}

</h3>

{items.length>1&&(

<button
type="button"
onClick={()=>removeNote(note.id)}
>

<Trash2 className="text-red-700"/>

</button>

)}

</div>

<select
value={note.type}
onChange={(e) => updateNote(note.id, "type", e.target.value)}
className="mb-4 w-full rounded-xl border p-3"
>

<option>Information</option>

<option>Warning</option>

<option>Important</option>

</select>

<textarea
rows={5}
value={note.content}
onChange={(e) => updateNote(note.id, "content", e.target.value)}
placeholder="Internal note..."
className="w-full rounded-xl border p-4"
/>

<InlineImagesUploader
  images={note.images}
  onChange={(images) => updateNoteImages(note.id, images)}
/>

</div>

))}

</div>

</section>

);

}
