import { html } from "../../../utilities/lib.js";

import { spinnerLoaderTemplate } from "../../../commonTemplates/loaders.js";
import { renderNotificationTemplate } from "../../../commonTemplates/notifications.js";
import { createAnswerDivElement, createQuestionIndexesDivElement, createQuestionsRemainingDivElement } from "./separeteElements.js";
import { getUnansweredQuestionsCount, onAction, onChange, quizInfo } from "./quizFunctionalities.js";

let quizData = null;
let questionsData = [];

export async function renderQuizView(context) {
    if (quizData === null || context.querystring === '') {
        context.render(spinnerLoaderTemplate());

        [quizData, questionsData] = await context.quizByIdAndItsQuestionsPromise;
    }

    quizInfo.quizId = quizData.objectId;
    quizInfo.questionsData = questionsData;

    const updateDivElements = {
        questionIndexes: createQuestionIndexesDivElement(questionsData, quizData.objectId),
        questionsRemaining: createQuestionsRemainingDivElement(questionsData),
    };

    update(Number(context.querystring.split('=')[1] - 1 || 0));

    function update(questionIndex, actionType) {
        context.render(quizTemplate(questionIndex, updateDivElements, onToggle, context, actionType));
    }

    function onToggle(questionIndex, actionType) {
        update(questionIndex, actionType);
    }
}

const quizTemplate = (questionIndex, updateDivElements, toggleHandler, context, actionType) => {
    const currentQuestionData = questionsData[questionIndex];

    return html`
        <section id="quiz">
            <header class="pad-large">
                <h1>${quizData.title}: Question ${questionIndex + 1} / ${questionsData.length}</h1>
                <nav class="layout q-control">
                    <span class="block">Question index</span>
                    ${updateDivElements.questionIndexes(questionIndex)}
                </nav>
            </header>
            <div class="pad-large alt-page">
                <article class="question">
                    <p class="q-text">${currentQuestionData.text}</p>
                    <div @change=${(event) => onChange(event, questionIndex, updateDivElements)}>
                        ${currentQuestionData.answers.map((a, i) => createAnswerDivElement(questionIndex, i, i === currentQuestionData.selectedIndex, a))}
                    </div>
                    <nav class="q-control">
                        ${updateDivElements.questionsRemaining(getUnansweredQuestionsCount())}
                        ${questionIndex > 0 ? html`
                            <a class="action" href="/quiz/${quizData.objectId}?question=${questionIndex}">
                                <i class="fas fa-arrow-left"></i> 
                                Previous
                            </a>` : ""}
                        <a class="action" href="javascript:void(0)" @click=${toggleHandler.bind(null, questionIndex, "restart")}>
                            <i class="fas fa-sync-alt"></i> 
                                Start over
                        </a>
                        <div class="right-col">
                            ${questionIndex < questionsData.length - 1 ? html`
                                <a class="action" href="/quiz/${quizData.objectId}?question=${questionIndex + 2}">
                                    Next 
                                    <i class="fas fa-arrow-right"></i>
                                </a>` : ""}
                            <a class="action" href="javascript:void(0)" @click=${toggleHandler.bind(null, questionIndex, "submit")}>Submit answers</a>
                        </div>
                    </nav>
                </article>
            </div>
            ${actionType ? renderNotificationTemplate(onAction(questionIndex, actionType, context, toggleHandler)) : ""}
        </section>`;
}