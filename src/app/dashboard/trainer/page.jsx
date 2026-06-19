import { getSession } from 'better-auth/api';
import React from 'react';


const TrainerDashboardPage = () => {
    const {data: session, isLoading} = getSession();
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const user = session?.user;

    return (
        <div>
            <h2> Trainer Dashboard</h2>
        </div>
    );
};

export default TrainerDashboardPage;