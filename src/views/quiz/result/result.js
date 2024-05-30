import { html, render, until } from "../../../utilities/lib.js";

import { spinnerLoaderTemplate } from "../../../commonTemplates/loaders.js";
import { createQuestionsDetailsDivElement, quizResultTemplate } from "./separateElements.js";

export function renderResultView(context) {
    const submissionId = context.querystring.split('=')[1];
    const quizId = context.params.id;

    const { questionsDetailsDivElement, update } = createQuestionsDetailsDivElement();
    questionsDetailsDivElement.addEventListener('click', onQuestionDetailsToggle);

    let updateQuestionArticleElementHandlers = undefined;

    context.render(resultTemplate(submissionId, quizId, onDetailsToggle, questionsDetailsDivElement));

    async function onDetailsToggle(event, questionsAnswers) {
        const clickedElement = event.target;
        clickedElement.disabled = true;
        const spanElement = clickedElement.children[1] || clickedElement;

        if (spanElement.textContent.includes('See')) {
            updateQuestionArticleElementHandlers = await update(quizId, questionsAnswers);
            spanElement.textContent = ' Hide Details';
        } else {
            spanElement.textContent = ' See Details';
            render("", questionsDetailsDivElement);
        }
        
        clickedElement.disabled = false;
    }

    async function onQuestionDetailsToggle(event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'BUTTON') {
            clickedElement.disabled = true;
            const questionIdex = Number(clickedElement.dataset.questionIndex);
            await updateQuestionArticleElementHandlers[questionIdex](clickedElement.textContent);
            clickedElement.disabled = false;
        }

    }
}

const resultTemplate = (submissionId, quizId, detailsToggleHandler, questionsDetailsDivElement) => html`
    <section id="summary">
        <div class="hero layout">
            ${until(quizResultTemplate(submissionId, quizId, detailsToggleHandler), spinnerLoaderTemplate())}
        </div>

        ${questionsDetailsDivElement}

    </section>`;