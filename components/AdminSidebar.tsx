"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {

LayoutDashboard,

FileText,

Folder,

Megaphone,

GraduationCap,

Settings,

LogOut,

} from "lucide-react";

const menu=[

{
title:"Dashboard",
href:"/admin",
icon:LayoutDashboard
},

{
title:"Articles",
href:"/admin/articles",
icon:FileText
},

{
title:"Categories",
href:"/admin/categories",
icon:Folder
},

{
title:"Announcements",
href:"/admin/announcements",
icon:Megaphone
},

{
title:"Training",
href:"/admin/training",
icon:GraduationCap
},

{
title:"Settings",
href:"/admin/settings",
icon:Settings
},

];

export default function AdminSidebar(){

const pathname=usePathname();

return(

<aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r bg-white">

<div className="border-b p-8">

<h1 className="text-3xl font-bold text-red-700">

AIR ARABIA

</h1>

<p className="text-gray-500">

Admin Portal

</p>

</div>

<nav className="flex-1 p-4">

{menu.map(item=>{

const Icon=item.icon;

const active=pathname===item.href;

return(

<Link

key={item.title}

href={item.href}

className={`mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition

${active

?

"bg-red-50 text-red-700 border-l-4 border-red-700"

:

"hover:bg-red-50"

}

`}

>

<Icon size={20}/>

<span>

{item.title}

</span>

</Link>

);

})}

</nav>

<div className="border-t p-5">

<button className="flex items-center gap-3 text-red-700">

<LogOut size={20}/>

Logout

</button>

</div>

</aside>

);

}