import { createQuestion, deleteQuestionData, editQuestionData } from "../../services/questionsService.js";
import { validateQuestionData } from "../../utilities/validations.js";

export const quizInfo = {
    quizId: null,
    questionsData: [],
    updateQuestionsTemplateHandler: null,
};

export function onCreate() {
    quizInfo.questionsData.push({ tempText: "", tempAnswers: ["", ""], isEditorInvoked: true });
    quizInfo.updateQuestionsTemplateHandler();
}

export function onChange(event, questionData) {
    const clickedElement = event.target;
    const clickedElementType = clickedElement.type;
    const clickedElementValue = clickedElement.value;

    if (clickedElementType === 'radio') {
        questionData.tempCorrectIndex = Number(clickedElementValue);
    } else if (clickedElementType === 'text') {
        const answerIndex = Number(clickedElement.name.split('-')[1]);
        questionData.tempAnswers[answerIndex] = clickedElementValue;
    } else if (clickedElementType === 'textarea') {
        questionData.tempText = clickedElementValue;
    }
}

export async function onSave(questionData, updateQuestionTemplateHandler) {
    try {
        validateQuestionData(questionData);

        questionData.errorMessage = '';

        updateQuestionTemplateHandler(true);

        const questionDataToSave = {
            text: questionData.tempText,
            answers: questionData.tempAnswers,
            correctIndex: questionData.tempCorrectIndex,
        };

        const objectId = questionData.objectId;

        const response = objectId
            ? await editQuestionData(quizInfo.quizId, objectId, questionDataToSave)
            : await createQuestion(quizInfo.quizId, questionDataToSave);

        questionData.objectId = response.objectId || objectId;
        questionData.text = questionData.tempText;
        questionData.answers = questionData.tempAnswers;
        questionData.correctIndex = questionData.tempCorrectIndex;
        questionData.isEditorInvoked = false;
    } catch (error) {
        questionData.errorMessage = error.message;
    }

    updateQuestionTemplateHandler();
}

export function onEdit(questionData, updateQuestionTemplateHandler) {
    if (questionData) {
        questionData.tempText = questionData.text;
        questionData.tempAnswers = [...questionData.answers];
        questionData.tempCorrectIndex = questionData.correctIndex;
        questionData.isEditorInvoked = true;

        updateQuestionTemplateHandler();
    }
}

export function onDelete(questionData, questionIndex, updateQuestionTemplateHandler) {
    function onToggle() {
        questionData.wantToDelete = !questionData.wantToDelete;
        updateQuestionTemplateHandler();
    }

    async function onAgree() {
        try {
            await deleteQuestionData(questionData.objectId);
            quizInfo.questionsData.splice(questionIndex, 1);
            quizInfo.updateQuestionsTemplateHandler();
        } catch (error) {
            alert(error.message);
        }
    }

    return {
        onToggle,
        onAgree,
        onRefuse: onToggle,
    }
}

export function onCancel(questionData, questionIndex, updateQuestionTemplateHandler) {
    if (questionData.objectId) {
        questionData.errorMessage = '';
        questionData.isEditorInvoked = false;
        updateQuestionTemplateHandler();
    } else {
        quizInfo.questionsData.splice(questionIndex, 1);
        quizInfo.updateQuestionsTemplateHandler();
    }
}