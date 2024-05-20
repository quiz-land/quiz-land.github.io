import { html, until } from "../utilities/lib.js";

import { auth } from "../utilities/auth.js";
import { getQuizById } from "../services/quizesService.js";
import { spinnerLoaderTemplate } from "../commonTemplates/loaders.js";

export function renderQuizDetailsView(context) {
    const hasLoggedInUser = auth.hasLoggedInUser();
    context.render(until(quizDetailsTemplate(context.params.id, hasLoggedInUser), spinnerLoaderTemplate()));
}

async function quizDetailsTemplate(quizId, hasLoggedInUser) {
    const quizData = await getQuizById(quizId);

    return html`
        <section id="details">
            <div class="pad-large alt-page">
                    <article class="details">
                        <h1>${quizData.title}</h1>
                        <span class="quiz-topic">A quiz by <a href="#">${quizData.creator.username}</a> on the topic of ${quizData.topic}</span>
                        <div class="quiz-meta">
                            <span>${quizData.questionsCount} Questions</span>
                            <span>|</span>
                            <span>Taken TODO times</span>
                        </div>
                        <p class="quiz-desc">${quizData.description}</p>

                        ${hasLoggedInUser
                            ? html`
                                <div>
                                    <a class="cta action" href="#">Begin Quiz</a>
                                </div>`
                            : ""
                         }

                    </article>
            </div>
        </section>`;
}