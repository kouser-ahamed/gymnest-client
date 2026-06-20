"use client"
import { getSession } from 'better-auth/api';
import React from 'react';
import { useSession } from "@/lib/auth-client";



const TrainerDashboardPage = () => {

    const {data: session, isPending} = useSession();

    if (isPending) {
        return <div>Loading...</div>;
    }

    const user = session?.user;
    console.log("Session data in TrainerDashboardPage:", session, " Is Loading:", isPending);

    return (
        <div>
            <h2 className="text-2xl font-bold">Welcome Back, {user?.name}!</h2>
        </div>
    );
};

export default TrainerDashboardPage;