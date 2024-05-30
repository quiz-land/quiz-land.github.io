import * as api from './api.js';
import { auth } from '../utilities/auth.js';
import { addPointerData, assembleData } from './commonHelper.js';

const endpoint = '/classes/Submission';

export async function getSubmissionByCreatorIdAndQuizIdWithTheHighestResult(quizId) {
    const loggedInUserData = auth.getLoggedInUserData();
    const pointersData = JSON.stringify({ quiz: addPointerData('Quiz', quizId), creator: addPointerData('_User', loggedInUserData?.id) });
    const response = await api.get(`${endpoint}?where=${pointersData}&order=-resultInPercentage&keys=correctAnsweredQuestionsCount,totalQuestionsCount,resultInPercentage`);
    return response.results[0];
}

export async function getSubmissionById(id) {
    return api.get(`${endpoint}/${id}?include=quiz&keys=questionsAnswers,correctAnsweredQuestionsCount,totalQuestionsCount,resultInPercentage,quiz.title`);
}

export async function createSubmission(data, quizId) {
    const submissionData = assembleData(data, quizId);
    return api.post(endpoint, submissionData);
}