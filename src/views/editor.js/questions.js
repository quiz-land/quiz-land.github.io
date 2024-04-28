import { html, render } from "../../utilities/lib.js";

import { confirmActionTemplate } from "../notifications.js";
import { renderAnswersTemplate } from "./answers.js";
import { onCancel, onChange, onCreate, onDeleteToggle, onEdit, onSave, update } from "./questions/qustionsFunctionalities.js";

let quizId = undefined;
let questionsData = [];
update.handler = createQuestionsDivElement();

export function renderQuestionsTemplate(inputQuizId, inputQuestionsData) {
    quizId = inputQuizId;
    questionsData = JSON.parse(JSON.stringify(inputQuestionsData));
    questionsData.forEach(qd => qd.tempAnswers = [...qd.answers]);

    return questionsTemplate(update.handler());
}

function createQuestionsDivElement() {
    const questionsContainerDivElement = document.createElement('div');
    questionsContainerDivElement.className = 'pad-large alt-page';

    function updateQuestionsDivElement() {
        render(questionsContainerTemlate(), questionsContainerDivElement);

        return questionsContainerDivElement;
    }

    return updateQuestionsDivElement;
}

const questionsTemplate = (questionsContainerDivElement) => html`
    <header class="pad-large">
        <h2>Questions</h2>
    </header>

    ${questionsContainerDivElement}
`;

const questionsContainerTemlate = () => html`
    ${questionsData.map((qd, i) => qd.isEditorInvoked ? questionEditTemplate(qd, i) : questionPreviewTemplate(qd, i))}

    <article class="editor-question">
        <div class="editor-input">
            <button class="input submit action" @click=${onCreate.bind(null, questionsData)}>
                <i class="fas fa-plus-circle"></i>
                Add question
            </button>
        </div>
    </article>
    
    ${questionsData.questionToDeleteInfo ? confirmActionTemplate(questionsData.questionToDeleteInfo) : ""}`

const questionEditTemplate = (questionData, index) => html`
    <article class="editor-question" data-index=${index}>
        <div class="layout">
            <div class="question-control">
                <button class="input submit action" @click=${onSave.bind(null, quizId, questionData)}><i class="fas fa-check-double"></i>
                    Save</button>
                <button class="input submit action" @click=${onCancel.bind(null, questionsData, index)}><i class="fas fa-times"></i> Cancel</button>
            </div>
            <h3>Question ${index + 1}</h3>
        </div>
        <form @change=${(event) => onChange(event, questionData)}>
            <p class="notification">${questionData.errorMessage || ''}</p>
            <textarea class="input editor-input editor-text" name="text" .value=${questionData.text || ""} placeholder=${questionData.text ? "" : "Enter question"}></textarea>
            ${renderAnswersTemplate(questionData, index)}
        </form>
        ${questionData.isDisabled ? html`<div class="loading-overlay working"></div>` : ""}
    </article>`;

const questionPreviewTemplate = (questionData, index) => html`
    <article class="editor-question">
        <div class="layout">
            <div class="question-control">
                <button class="input submit action" @click=${onEdit.bind(null, questionData)}><i class="fas fa-edit"></i> Edit</button>
                <button class="input submit action" @click=${onDeleteToggle.bind(null, questionsData, questionData.objectId, index)}><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
            <h3>Question ${index + 1}</h3>
        </div>
        <form>
            <p class="editor-input">${questionData.text}</p>
            ${renderAnswersTemplate(questionData, index)}
        </form>
    </article>`;