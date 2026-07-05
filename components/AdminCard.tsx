interface Props{

title:string;

value:string;

}

export default function AdminCard({

title,

value,

}:Props){

return(

<div className="rounded-3xl bg-white p-6 shadow-sm">

<p className="text-gray-500">

{title}

</p>

<h2 className="mt-3 text-5xl font-bold">

{value}

</h2>

</div>

);

}