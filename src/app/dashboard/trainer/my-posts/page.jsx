import { getCommunityForumPosts } from '@/lib/api/community-forum-post';
import { getUserSession } from '@/lib/core/session';
import React from 'react';

const TrainerCommunityAllForumPage = async () => {

    const user = await getUserSession();
    const communityPost = await getCommunityForumPosts(user?.id);

    console.log('communityPost', communityPost);

    return (
        <div>
            Trainer Community All Forum Page
        </div>
    );
};

export default TrainerCommunityAllForumPage;