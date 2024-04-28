import { createQuestion, deleteQuestionData, editQuestionData } from "../../../services/questionsService.js";
import { validateQuestionData } from "../../../utilities/validations.js";

export const update = {};

export function onCreate(questionsData) {
    questionsData.push({ answers: ["", ""], tempAnswers: ["", ""], isEditorInvoked: true });
    update.handler();
}

export function onChange(event, questionData) {
    const clickedElement = event.target;
    const clickedElementType = clickedElement.type;
    const clickedElementValue = clickedElement.value;

    if (clickedElementType === 'radio') {
        questionData.correctIndex = Number(clickedElementValue);
    } else if (clickedElementType === 'text') {
        const answerIndex = Number(clickedElement.name.split('-')[1]);
        questionData.tempAnswers[answerIndex] = clickedElementValue;
    } else if (clickedElementType === 'textarea') {
        questionData.text = clickedElementValue;
    }
}

export async function onSave(quizId, questionData) {
    try {
        questionData.answers = questionData.tempAnswers;

        validateQuestionData(questionData);

        questionData.errorMessage = '';
        questionData.isDisabled = true;

        update.handler();

        const objectId = questionData.objectId;

        const questionDataToSave = { objectId, text: questionData.text, answers: questionData.answers, correctIndex: questionData.correctIndex };

        const response = objectId
            ? await editQuestionData(quizId, objectId, questionDataToSave)
            : await createQuestion(quizId, questionDataToSave);

        questionData.objectId = response.objectId || objectId;
        questionData.isEditorInvoked = false;
    } catch (error) {
        questionData.errorMessage = error.message;
    }

    questionData.isDisabled = false;
    update.handler();
}

export function onEdit(questionData) {
    if (questionData) {
        questionData.isEditorInvoked = true;
        update.handler();
    }
}

export function onDeleteToggle(questionsData, questionId, questionIndex) {
    questionsData.questionToDeleteInfo = { id: questionId, index: questionIndex, onAgree, onRefuse }
    update.handler();

    function onRefuse() {
        questionsData.questionToDeleteInfo = undefined;
        update.handler();
    }

    async function onAgree(questionId, questionIndex) {
        try {
            await deleteQuestionData(questionId);
            questionsData.splice(questionIndex, 1);
            questionsData.questionToDeleteInfo = undefined;
            update.handler();
        } catch (error) {
            alert(error.message);
        }
    }
}

export function onCancel(questionsData, questionIndex) {
    const questionData = questionsData[questionIndex];

    if (questionData.text) {
        questionData.tempAnswers = [...questionData.answers];
        questionData.isEditorInvoked = false;
        questionData.errorMessage = '';
    } else {
        questionsData.splice(questionIndex, 1);
    }

    update.handler();
}