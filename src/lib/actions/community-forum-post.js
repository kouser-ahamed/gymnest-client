"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const postCommunityForumPost = async (formData) => {
    const res = await fetch(`${baseUrl}/api/community-forum-posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    return res.json();
}

