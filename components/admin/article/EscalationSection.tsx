"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function EscalationSection() {

  const [items,setItems]=useState([{id:1}]);

  function addItem(){
    setItems([...items,{id:Date.now()}]);
  }

  function removeItem(id:number){
    setItems(items.filter(item=>item.id!==id));
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
placeholder="Department"
className="mb-4 w-full rounded-xl border p-3"
/>

<input
placeholder="Condition"
className="mb-4 w-full rounded-xl border p-3"
/>

<textarea
rows={4}
placeholder="Escalation instructions..."
className="w-full rounded-xl border p-4"
/>

</div>

))}

</div>

</section>

);

}