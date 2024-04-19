import { auth } from "./../utilities/auth.js";

const host = 'https://parseapi.back4app.com';

export async function requester(method, url, body) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': 'EE4Bqd7zVKfXGOKKcZqRk9ZDoW6MsiPmuOLucC4Q',
            'X-Parse-REST-API-Key': 'bnFTl3EDN8jxcg5DTZdTWPWGAZ5o6TIxYF5qxCtX',
        },
    };

    if (body) {
        options.headers['content-type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const loggedInUserData = auth.getLoggedInUserData();

    if (loggedInUserData) {
        options.headers['X-Parse-Session-Token'] = loggedInUserData.accessToken;
    }

    const request = await fetch(`${host}/${url}`, options);

    if (!request.ok) {
        const errorResponse = await request.json();

        throw new Error(errorResponse.error);
    }
    
    return await request.json();
}

export const get = requester.bind(null, 'GET');
export const post = requester.bind(null, 'POST');
export const put = requester.bind(null, 'PUT');
export const del = requester.bind(null, 'DELETE');