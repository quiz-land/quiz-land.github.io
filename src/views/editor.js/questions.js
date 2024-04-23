import { html, render } from "../../utilities/lib.js";
import { renderAnswersTemplate } from "./answers.js";

let questionsData = [];
const updateQuestionsDivElement = createQuestionsDivElement();

export function renderQuestionsTemplate(inputQuestionsData) {
    questionsData = inputQuestionsData;

    return questionsTemplate(updateQuestionsDivElement());
}

function onCreate() {
    questionsData.push({ answers: ["", ""], isEditorInvoked: true });
    updateQuestionsDivElement();
}

function onEdit(questionId) {
    const questionData = questionsData.find(qd => qd.objectId === questionId);
    
    if (questionData) {
        questionData.isEditorInvoked = true;
        updateQuestionsDivElement();
    }
}

function onCancel(questionId) {
    const questionIndex = questionsData.findIndex(qd => qd.objectId === questionId);

    if (questionIndex !== -1) {
        if (questionId) {
            questionsData[questionIndex].isEditorInvoked = false;
        } else {
            questionsData.splice(questionIndex, 1);
        }
        
        updateQuestionsDivElement();
    }
}

function createQuestionsDivElement() {
    const questionsContainerDivElement = document.createElement('div');
    questionsContainerDivElement.className = 'pad-large alt-page';

    function updateQuestionsDivElement() {
        const qs = questionsData.map((qd, i) => {
            const q = qd.isEditorInvoked ? questionEditTemplate(qd, i) : questionPreviewTemplate(qd, i);
            return q;
        });
        
        render(html`
                    ${qs}

                    <article class="editor-question">
                        <div class="editor-input">
                            <button class="input submit action" @click=${onCreate}>
                                <i class="fas fa-plus-circle"></i>
                                Add question
                            </button>
                        </div>
                    </article>`, questionsContainerDivElement);

        return questionsContainerDivElement;
    }

    return updateQuestionsDivElement;
}

export const questionsTemplate = (questionsContainerDivElement) => html`
    <header class="pad-large">
        <h2>Questions</h2>
    </header>

    ${questionsContainerDivElement}
`;

const questionEditTemplate = (questionData, index) => html`
    <article class="editor-question">
        <div class="layout">
            <div class="question-control">
                <button class="input submit action"><i class="fas fa-check-double"></i>
                    Save</button>
                <button class="input submit action" @click=${onCancel.bind(null, questionData.objectId)}><i class="fas fa-times"></i> Cancel</button>
            </div>
            <h3>Question ${index + 1}</h3>
        </div>
        <form>
            <textarea class="input editor-input editor-text" name="text" .value=${questionData.text || ""} placeholder=${questionData.text ? "" : "Enter question"}></textarea>
            
            ${questionData.answers && renderAnswersTemplate(questionData.answers, questionData.isEditorInvoked, index, questionData.correctIndex)}

            <div class="editor-input">
                <button class="input submit action">
                    <i class="fas fa-plus-circle"></i>
                    Add answer
                </button>
            </div>
        </form>
    </article>`;

const questionPreviewTemplate = (questionData, index) => html`
    <article class="editor-question">
        <div class="layout">
            <div class="question-control">
                <button class="input submit action" @click=${onEdit.bind(null, questionData.objectId)}><i class="fas fa-edit"></i> Edit</button>
                <button class="input submit action"><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
            <h3>Question ${index + 1}</h3>
        </div>
        <form>
            <p class="editor-input">${questionData.text}</p>
            
            ${renderAnswersTemplate(questionData.answers, questionData.isEditorInvoked, index, questionData.correctIndex)}
        </form>
    </article>`;