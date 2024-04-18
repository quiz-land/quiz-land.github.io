import * as api from './api.js';

const endpoint = 'data/solutions';

export async function getAll() {
    return api.get(`${endpoint}?sortBy=_createdOn%20desc`);
}

export async function create(data) {
    return api.post(endpoint, data);
}

export async function getById(id) {
    return api.get(`${endpoint}/${id}`);
}

export async function editById(id, data) {
    return api.put(`${endpoint}/${id}`, data);
}

export async function deleteById(id) {
    return api.del(`${endpoint}/${id}`);
}