import { createSubmission } from "../../../services/submissionsService.js";

export const quizInfo = {
    quizId: null,
    questionsData: [],
};

export function onChange(event, questionIndex, updateElements) {
    quizInfo.questionsData[questionIndex].selectedIndex = Number(event.target.value);
    updateElements.questionIndexes(questionIndex);
    updateElements.questionsRemaining(getUnansweredQuestionsCount());
}

export function onAction(questionIndex, actionType, context, toggleHandler) {
    const unAnsweredQuestionsCount = getUnansweredQuestionsCount();

    const questionText = actionType === "restart"
        ? 'Are you sure want to restart the quiz?'
        : unAnsweredQuestionsCount > 0
            ? `You still have ${unAnsweredQuestionsCount} unanswered question${unAnsweredQuestionsCount === 1 ? "" : "s"}. Are you sure you want to submit the answers anyway?`
            : 'Are you sure you want to submit the answers?';

    function onAgree() {
        if (actionType === "restart") {
            context.page.redirect(`/quiz/${quizInfo.quizId}`);
        } else {
            onSubmit(context);
        }
    }

    return {
        questionText,
        onAgree,
        onRefuse: () => toggleHandler(questionIndex),
    };
}

async function onSubmit(context) {
    try {
        const response = await createSubmission(assembleSubmissionData(), quizInfo.quizId);
        context.page.redirect(`/result/${quizInfo.quizId}?submissionId=${response.objectId}`);
    } catch (error) {
        alert(error.message);
    }
}

export function getUnansweredQuestionsCount() {
    return quizInfo.questionsData.filter(qd => qd.selectedIndex === undefined).length;
}

function assembleSubmissionData() {
    const questionsAnswers = quizInfo.questionsData.map(qd => qd.selectedIndex);
    const correctAnsweredQuestionsCount = questionsAnswers.filter((qa, i) => qa === quizInfo.questionsData[i].correctIndex).length;
    const totalQuestionsCount = quizInfo.questionsData.length;
    const resultInPercentage = Number((correctAnsweredQuestionsCount / totalQuestionsCount).toFixed(2)) * 100;
    
    return {
        questionsAnswers,
        correctAnsweredQuestionsCount,
        totalQuestionsCount,
        resultInPercentage,
    };
}