import { html, render, until } from "../../../utilities/lib.js";

import { getSubmissionByCreatorIdAndQuizIdWithTheHighestResult, getSubmissionById } from "../../../services/submissionsService.js";
import { getQuestionsByQuizId } from "../../../services/questionsService.js";
import { spinnerLoaderTemplate } from "../../../commonTemplates/loaders.js";

export async function quizResultTemplate(submissionId, quizId, detailsToggleHandler) {
    const [submissionDataById, submissionDatadWithTheHighestResult] = await Promise.all([
        getSubmissionById(submissionId),
        getSubmissionByCreatorIdAndQuizIdWithTheHighestResult(quizId),
    ]);

    return html`
        <article class="details glass">
            <h1>Quiz Results</h1>
            <h2>${submissionDataById.quiz.title}</h2>

                <div class="result-quiz">
                    <span>Your current result:</span>
                    <span class="s-correct">${submissionDataById.correctAnsweredQuestionsCount} / ${submissionDataById.totalQuestionsCount} correct answers</span>
                    <span class="s-correct">${submissionDataById.resultInPercentage}%</span>
                </div>

                <div class="result-quiz">
                    <span>Your best result:</span>
                    <span class="s-correct">${submissionDatadWithTheHighestResult.correctAnsweredQuestionsCount} / ${submissionDatadWithTheHighestResult.totalQuestionsCount} correct answers</span>
                    <span class="s-correct">${submissionDatadWithTheHighestResult.resultInPercentage}%</span>
                </div>

            <a class="action cta" href="/quiz/${submissionDataById.quiz.objectId}"><i class="fas fa-sync-alt"></i> Retake Quiz</a>
            <a class="action cta" href="javascript:void(0)" @click=${(event) => detailsToggleHandler(event, submissionDataById.questionsAnswers)}>
                <i class="fas fa-clipboard-list"></i> 
                <span>See Details</span>
            </a>

        </article>`;
}

export function createQuestionsDetailsDivElement() {
    const questionsDetailsDivElement = document.createElement('div');
    questionsDetailsDivElement.className = "pad-large alt-page";

    async function update(quizId, questionsAnswers) {
        const contentToRender = quizId !== undefined
            ? until(questionsTemplate(quizId, questionsAnswers), spinnerLoaderTemplate())
            : "";
        
        render(contentToRender, questionsDetailsDivElement);
    }

    return {
        questionsDetailsDivElement,
        update,
    };
}

async function questionsTemplate(quizId, questionsAnswers) {
    const questionsData = await getQuestionsByQuizId(quizId);
    return questionsData.map((qd, i) => singleQuestionTemplate(i, qd.correctIndex, questionsAnswers[i]));
}

function singleQuestionTemplate(questionIndex, correctIndex, selectedIndex) {
    const isCorrectAnswered = correctIndex === selectedIndex;
    
    return html`
        <article class="preview">
            <span class="s-${isCorrectAnswered ? "correct" : "incorrect"}">
                Question ${questionIndex + 1}
                <i class="fas fa-check"></i>
            </span>
            <div class="right-col">
                <button class="action" data-question-info="${questionIndex}-${selectedIndex}">${isCorrectAnswered ? "See question" : "Reveal answer"}</button>
            </div>
            <div class="question-details"></div>
        </article>`;
}