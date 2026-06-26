import { getUserSession } from '@/lib/core/session';
import React from 'react';
import AddClassPageForm from './AddClassPageForm';

const TrainerAddClassPage = async () => {

  const user = await getUserSession();
    return (
        <div>
            <AddClassPageForm user={user} />
        </div>
    );
};

export default TrainerAddClassPage;