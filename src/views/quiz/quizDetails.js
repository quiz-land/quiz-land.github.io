import { html, until } from "../../utilities/lib.js";

import { auth } from "../../utilities/auth.js";
import { spinnerLoaderTemplate } from "../../commonTemplates/loaders.js";

export function renderQuizDetailsView(context) {
    const hasLoggedInUser = auth.hasLoggedInUser();
    context.render(until(quizDetailsTemplate(context.quizByIdAndItsSubmissionByCreatorIdPromise, hasLoggedInUser), spinnerLoaderTemplate()));
}

async function quizDetailsTemplate(quizByIdAndItsSubmissionByCreatorIdPromise, hasLoggedInUser) {
    const [ quizData, submissionData ] = await quizByIdAndItsSubmissionByCreatorIdPromise;

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
                            ? submissionData !== undefined
                                ? retakeQuizTemplate(submissionData, quizData.objectId)
                                : beginQuizTemplate(quizData.objectId)
                            : ""
                         }

                    </article>
            </div>
        </section>`;
}

const retakeQuizTemplate = (submissionData, quizId) => html`
    <div class="retake-quiz">
        <span>Your best result:</span>
        <span class="s-correct">${submissionData.correctAnsweredQuestionsCount} / ${submissionData.totalQuestionsCount} correct answers</span>
        <span class="s-correct">${submissionData.resultInPercentage}%</span>
        <div>
            <a class="cta action" href="/quiz/${quizId}">
            <i class="fas fa-sync-alt"></i> Retake Quiz
            </a>
        </div>
    </div>`;

const beginQuizTemplate = (quizId) => html`
    <div class="begin-quiz">
        <a class="cta action" href="/quiz/${quizId}">Begin Quiz</a>
    </div>`