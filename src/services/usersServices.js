import * as api from './api.js';
import { auth } from '../utilities/auth.js';

const endpoints = {
    REGISTER: 'users',
    LOGIN: 'login',
    LOGOUT: 'logout'
};

export async function register(data) {
    const response = await api.post(endpoints.REGISTER, data);
    auth.saveUserData(assembleUserData(response, data.username));
}

export async function login(data) {
    const response = await api.post(endpoints.LOGIN, data);
    auth.saveUserData(assembleUserData(response));
}

export async function logout() {
    await api.post(endpoints.LOGOUT);
    auth.removeUserData();
}

function assembleUserData(data, username) {
    return {
        id: data.objectId,
        username: username || data.username,
        accessToken: data.sessionToken,
    };
}