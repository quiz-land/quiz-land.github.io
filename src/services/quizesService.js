import * as api from './api.js';
import { assembleData } from './commonHelper.js';

const pathname = '/classes/Quiz';

const search = {
    quizWithQuestions: `"questionsCount":{"$gt":0}`,
    quizesByText: (text) => `"title": {"$regex":"${text}", "$options": "i"}`, 
    quizesByTopic: (topic) => `${topic !== 'all' ? `, "topic":"${topic}"` : ""}`, 
    quizesCount: 'count=1',
}

export async function getQuizesCount() {
    const response = await api.get(`${pathname}?where={${search.quizWithQuestions}}&${search.quizesCount}`);
    return response.count;
}

export async function getQuizesData() {
    const response = await api.get(`${pathname}?where={${search.quizWithQuestions}}`);
    return response.results;
}

export async function getQuizesDataByTextAndTopic([text, topic]) {
    const queryString = `${search.quizesByText(text)}${search.quizesByTopic(topic)}, ${search.quizWithQuestions}`;
    const response = await api.get(`${pathname}?where={${queryString}}`);
    return response.results;
}

export async function getQuizById(id) {
    return api.get(`${pathname}/${id}?include=creator&keys=title,description,topic,questionsCount,creator.username`);
}

export async function createQuiz(data) {
    const quizData = assembleData(data);
    return api.post(pathname, quizData);
}

export async function editQuizData(id, data) {
    const quizData = assembleData(data);
    return api.put(`${pathname}/${id}`, quizData);
}