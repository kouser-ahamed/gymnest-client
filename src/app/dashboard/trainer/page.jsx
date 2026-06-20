"use client"
import { getSession } from 'better-auth/api';
import React from 'react';
import { useSession } from "@/lib/auth-client";
import TrainerOverview from '@/components/dashboard/TrainerOverview';



const TrainerDashboardPage = () => {

    const {data: session, isPending} = useSession();

    if (isPending) {
        return <div>Loading...</div>;
    }

    const user = session?.user;
    console.log("Session data in TrainerDashboardPage:", session, " Is Loading:", isPending);

    return (
        <div>
            <TrainerOverview user={user} />
        </div>
    );
};

export default TrainerDashboardPage;