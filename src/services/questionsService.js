import * as api from './api.js';
import { addPointerData, assembleData } from './commonHelper.js';

const endpoint = '/classes/Question';

export async function getQuestionsByQuizId(quizId) {
    const quizPointerData = JSON.stringify({ quiz: addPointerData('Quiz', quizId) });
    const response = await api.get(`${endpoint}?where=${quizPointerData}`);
    return response.results;
}

export async function createQuestion(data, quizId) {
    const questionData = assembleData(data, quizId);
    return api.post(endpoint, questionData);
}

export async function editQuestionData(id, data, quizId) {
    const questionData = assembleData(data, quizId);
    return api.put(`${endpoint}/${id}`, questionData);
}

export async function deleteQuestionData(id) {
    return api.del(`${endpoint}/${id}`);
}