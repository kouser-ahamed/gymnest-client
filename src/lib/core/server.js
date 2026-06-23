const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


export const serverFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`);

    // handle 401, 404, 403

    return res.json();

}




export const serverMutation = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    // handle 401, 404, 403
    return res.json();
}



export const serverDelete = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    // handle 401, 404, 403
    return res.json();
}




export const serverUpdate = async (path, data) => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    // handle 401, 404, 403
    return res.json();
}




