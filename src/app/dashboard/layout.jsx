import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import React from 'react';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


const DashboardLayout = async({children}) => {

     const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user || null;

    
    return (
       <div className="flex h-screen bg-white dark:bg-[#070b14]">
  
  <DashboardSidebar user={user} />

  <div className="flex flex-1 flex-col overflow-hidden">

    <div className="border-b border-white/10 p-4">
      Dashboard Navbar
    </div>

    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>

  </div>
</div>
    );
};

export default DashboardLayout;