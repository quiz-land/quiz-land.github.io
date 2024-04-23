import { html, render } from "../../utilities/lib.js";

let answersData = [];

export function renderAnswersTemplate(inputAnswersData, isEditorInvoked, questionIndex, correctIndex) {
    answersData = inputAnswersData;

    return createAnswersDivElement(isEditorInvoked, questionIndex, correctIndex);
}

/*function onCreate() {
    answersData.push({ invokeEdit: true });
    updateanswersDivElement(answersData);
}

function onEdit(answerId) {
    const answerData = answersData.find(qd => qd.objectId === answerId);

    if (answerData) {
        answerData.invokeEdit = true;
        updateanswersDivElement(answersData);
    }
}*/

function createAnswersDivElement(isEditorInvoked, questionIndex, correctIndex) {
    const answersContainerDivElement = document.createElement('div');

    render(answersContainerTemplate(isEditorInvoked, questionIndex, correctIndex), answersContainerDivElement);

    return answersContainerDivElement;
}

const answersContainerTemplate = (isEditorInvoked, questionIndex, correctIndex) => html`
    ${isEditorInvoked
        ? answersData.map((ad, i) => answerEditTemplate(questionIndex, i, correctIndex, ad))
        : answersData.map((ad, i) => answerPreviewTemplate(questionIndex, i, correctIndex, ad))}`;

const answerEditTemplate = (questionIndex, index, correctIndex, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${index} ?checked=${index === correctIndex} />
            <i class="fas fa-check-circle"></i>
        </label>
        <input class="input" type="text" name="answer-${index}" .value=${answer || ''} placeholder=${answer ? "" : "Enter anwer"}>
        <button class="input submit action"><i class="fas fa-trash-alt"></i></button>
    </div>`;

const answerPreviewTemplate = (questionIndex, index, correctIndex, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${index} ?checked=${index === correctIndex} disabled />
            <i class="fas fa-check-circle"></i>
        </label>
        <span>${answer}</span>
    </div>`;