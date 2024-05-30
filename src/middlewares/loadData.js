import { getQuizById } from "../services/quizesService.js";
import { getQuestionsByQuizId } from "../services/questionsService.js";
import { getSubmissionByCreatorIdAndQuizIdWithTheHighestResult } from "../services/submissionsService.js";

export function loadQuizByIdPromise(context, next) {
    const quizId = context.params.id;
    
    if (quizId !== undefined) {
        context.quizByIdPromise = getQuizById(quizId);
    }

    next();
}

export function loadQuizByIdAndItsQuestionsPromise(context, next) {
    const quizId = context.params.id;

    context.quizByIdAndItsQuestionsPromise = Promise.all([
        getQuizById(quizId),
        getQuestionsByQuizId(quizId),
    ]);

    next();
}

export function loadQuizByIdAndItsSubmissionByCreatorIdPromise(context, next) {
    const quizId = context.params.id;

    context.quizByIdAndItsSubmissionByCreatorIdPromise = Promise.all([
        getQuizById(quizId),
        getSubmissionByCreatorIdAndQuizIdWithTheHighestResult(quizId),
    ]);

    next();
}