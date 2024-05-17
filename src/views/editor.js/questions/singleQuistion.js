import { html, render } from "../../../utilities/lib.js";

import { renderAnswersTemplate } from "../answers.js";
import { onCancel, onChange, onDelete, onEdit, onSave } from "../editorFunctionalities.js";
import { renderNotificationTemplate } from "../../../commonTemplates/notifications.js";
import { loadingOverlayTemplate } from "../../../commonTemplates/loaders.js";

export function renderQuestionTemplate(questionData, index) {
    const questionArticleElement = document.createElement('article');
    questionArticleElement.className = 'editor-question';

    update();

    function update(isDisabled) {
        render(html`
            ${questionData.isEditorInvoked
                ? questionEditTemplate(questionData, index, update, isDisabled)
                :  questionPreviewTemplate(questionData, index, update)}`
            , questionArticleElement);
    }
    
    return questionArticleElement;
}

const questionEditTemplate = (questionData, index, updateQuestionTemplateHandler, isDisabled) => html`
    <div class="layout">
        <div class="question-control">
            <button class="input submit action" @click=${onSave.bind(null, questionData, updateQuestionTemplateHandler)}><i class="fas fa-check-double"></i>
                Save</button>
            <button class="input submit action" @click=${onCancel.bind(null, questionData, index, updateQuestionTemplateHandler)}><i class="fas fa-times"></i> Cancel</button>
        </div>
        <h3>Question ${index + 1}</h3>
    </div>
    <div @change=${(event) => onChange(event, questionData)}>
        <p class="notification">${questionData.errorMessage || ''}</p>
        <textarea
            class="input editor-input editor-text"
            name="text"
            .value=${questionData.tempText || ""}
            placeholder=${questionData.tempText ? "" : "Enter question"}
        ></textarea>
        ${renderAnswersTemplate(questionData, index)}
</div>
    ${isDisabled ? loadingOverlayTemplate() : ""}`;

function questionPreviewTemplate(questionData, index, updateQuestionTemplateHandler) {
    const deleteHandler = onDelete(questionData, index, updateQuestionTemplateHandler);

    return html`
        <div class="layout">
            <div class="question-control">
                <button class="input submit action" @click=${onEdit.bind(null, questionData, updateQuestionTemplateHandler)}><i class="fas fa-edit"></i> Edit</button>
                <button class="input submit action" @click=${deleteHandler.onToggle}><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
            <h3>Question ${index + 1}</h3>
        </div>
        <form>
            <p class="editor-input">${questionData.text}</p>
            ${renderAnswersTemplate(questionData, index)}
            ${questionData.wantToDelete ? renderNotificationTemplate(index, deleteHandler.onAgree, deleteHandler.onRefuse) : ""}
        </form>`
};