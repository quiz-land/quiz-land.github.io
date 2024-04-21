import * as api from './api.js';
import { auth } from '../utilities/auth.js';

const endpoint = '/classes/Quiz';

export async function getQuizById(id) {
    return api.get(`${endpoint}/${id}`);
}

export async function editQuizData(id, data) {
    const quizData = Object.assign({ creator: addCreatorData() }, data);
    return api.put(`${endpoint}/${id}`, quizData);
}

export async function createQuiz(data) {
    const quizData = Object.assign({ creator: addCreatorData() }, data);
    return api.post(endpoint, quizData);
}

function addCreatorData() {
    const loggedInUserData = auth.getLoggedInUserData();

    return {
        '__type': "Pointer",
        'className': "_User",
        'objectId': loggedInUserData.id,
    };
}