"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function NotesSection(){

const [notes,setNotes]=useState([{id:1}]);

function addNote(){
setNotes([...notes,{id:Date.now()}]);
}

function removeNote(id:number){
setNotes(notes.filter(note=>note.id!==id));
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

{notes.map((note,index)=>(

<div
key={note.id}
className="rounded-2xl border p-6"
>

<div className="mb-4 flex items-center justify-between">

<h3>

Note {index+1}

</h3>

{notes.length>1&&(

<button
type="button"
onClick={()=>removeNote(note.id)}
>

<Trash2 className="text-red-700"/>

</button>

)}

</div>

<select
className="mb-4 w-full rounded-xl border p-3"
>

<option>Information</option>

<option>Warning</option>

<option>Important</option>

</select>

<textarea
rows={5}
placeholder="Internal note..."
className="w-full rounded-xl border p-4"
/>

</div>

))}

</div>

</section>

);

}