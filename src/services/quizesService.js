import * as api from './api.js';
import { auth } from '../utilities/auth.js';

const endpoint = '/classes/Quiz';

export async function getQuizesCount() {
    const queryString = JSON.stringify({ questionsCount: { "$gt": 0 } });
    const response = await api.get(`${endpoint}?where=${queryString}&count=1`);
    return response.count;
}

export async function getQuizesData() {
    return api.get(endpoint);
}

export async function getQuizById(id) {
    return api.get(`${endpoint}/${id}`);
}

export async function editQuizData(id, data) {
    const quizData = assembleQuizData(data);
    return api.put(`${endpoint}/${id}`, quizData);
}

export async function createQuiz(data) {
    const quizData = assembleQuizData(data);
    return api.post(endpoint, quizData);
}

function assembleQuizData(data) {
    return Object.assign({ creator: addCreatorData() }, data)
}

function addCreatorData() {
    const loggedInUserData = auth.getLoggedInUserData();

    return {
        '__type': "Pointer",
        'className': "_User",
        'objectId': loggedInUserData.id,
    };
}