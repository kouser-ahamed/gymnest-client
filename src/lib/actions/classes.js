"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const createClass = async (formData) => {
    const res = await fetch(`${baseUrl}/api/classes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    return res.json();
}

