import * as api from './api.js';
import { auth } from '../utilities/auth.js';

const endpoint = '/classes/Question';

export async function getQuestionsByQuizId(quizId) {
    const quizPointerData = JSON.stringify({ quiz: addPointerData('Quiz', quizId) });
    const response = await api.get(`${endpoint}?where=${quizPointerData}`);
    return response.results;
}

export async function editQuestionData(id, data) {
    const questionData = assembleQuizData(data);
    return api.put(`${endpoint}/${id}`, questionData);
}

export async function createQuestion(data) {
    const questionData = assembleQuizData(data);
    return api.post(endpoint, questionData);
}

function assembleQuizData(data) {
    return Object.assign(
        {
            quiz: addPointerData('Quiz', data.quizId),
            creator: addPointerData('_User', auth.getLoggedInUserData()),
        },
        data
    );
}

function addPointerData(className, objectId) {
    return {
        '__type': "Pointer",
        className,
        objectId,
    };
}