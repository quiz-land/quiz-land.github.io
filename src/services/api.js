import { auth } from "./../utilities/auth.js";

const host = 'https://parseapi.back4app.com';

export async function requester(method, url, body) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': 'OLuO2LThvnjY4jKRSEbWYZBJPgxewvLkFVnmjv3p',
            'X-Parse-REST-API-Key': 'SFF1mDqUbgHlXOrlUQYNJC4ssIy2SJ497a0s2ljM',
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