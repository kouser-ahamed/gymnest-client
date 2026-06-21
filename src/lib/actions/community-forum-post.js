"use server";

import { serverMutation } from "../core/server";


// Post a new community forum post Trainer 
export const postCommunityForumPost = async (formData) => {
    return await serverMutation('/api/community-forum-posts', formData);
}

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
// export const postCommunityForumPost = async (formData) => {
//     const res = await fetch(`${baseUrl}/api/community-forum-posts`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//     })
//     return res.json();
// }

