import * as api from './api.js';
import { auth } from '../utilities/auth.js';

const endpoint = '/classes/Question';

export async function getQuestionsByQuizId(quizId) {
    const quizPointerData = JSON.stringify({ quiz: addPointerData('Quiz', quizId) });
    const response = await api.get(`${endpoint}?where=${quizPointerData}`);
    return response.results;
}

export async function createQuestion(quizId, data) {
    const questionData = assembleQuizData(quizId, data);
    return api.post(endpoint, questionData);
}

export async function editQuestionData(quizId, id, data) {
    const questionData = assembleQuizData(quizId, data);
    return api.put(`${endpoint}/${id}`, questionData);
}

export async function deleteQuestionData(id) {
    return api.del(`${endpoint}/${id}`);
}

function assembleQuizData(quizId, data) {
    const loggedInUserData = auth.getLoggedInUserData();

    return Object.assign(
        {
            quiz: addPointerData('Quiz', quizId),
            creator: addPointerData('_User', loggedInUserData.id),
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