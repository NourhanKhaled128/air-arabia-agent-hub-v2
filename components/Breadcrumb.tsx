interface Props{

category:string;

title:string;

}

export default function Breadcrumb({
category,
title,
}:Props){

return(

<div className="mb-8 text-sm text-gray-500 dark:text-slate-400">

Home

<span className="mx-2">

/

</span>

Knowledge

<span className="mx-2">

/

</span>

{category}

<span className="mx-2">

/

</span>

<span className="font-semibold text-black dark:text-slate-100">

{title}

</span>

</div>

);

}