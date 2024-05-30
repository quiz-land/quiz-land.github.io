import { html, render } from "../../../../utilities/lib.js";

import { renderQuestionTemplate } from "./singleQuistion.js";
import { onCreate, quizInfo } from "../editorFunctionalities.js";

export function renderQuestionsTemplate(quizId, questionsData, updateQuestionTemplateHandler) {
    quizInfo.quizId = quizId;
    quizInfo.questionsData = questionsData;
    quizInfo.onUpdateQuestionsTemplate = update;
    quizInfo.onUpdateQuestionsCount = updateQuestionTemplateHandler;

    const questionsDivElement = document.createElement('div');

    update();
    
    return questionsDivElement;

    function update() {
        render(questionsTemplate(questionsData), questionsDivElement);
    }
}

const questionsTemplate = (questionsData, cancelHandler) => html`
    <header class="pad-large">
        <h2>Questions</h2>
    </header>

    <div class="pad-large alt-page">
        ${questionsData.map((qd, i) => renderQuestionTemplate(qd, i, cancelHandler))}
    </div>

    <article class="editor-question">
        <div class="editor-input">
            <button class="input submit action" @click=${onCreate}>
                <i class="fas fa-plus-circle"></i>
                Add question
            </button>
        </div>
    </article>`;