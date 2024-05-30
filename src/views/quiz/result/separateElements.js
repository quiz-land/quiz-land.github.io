import { html, render } from "../../../utilities/lib.js";

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
        render(spinnerLoaderTemplate(), questionsDetailsDivElement);

        const questionsData = await getQuestionsByQuizId(quizId);
        const questionsContainer = questionsData
            .map((qd, i) => createQuestionArticleElement(qd, i, questionsAnswers[i]));

        render(questionsContainer.map(qc => qc.questionArticleElement), questionsDetailsDivElement);
        return questionsContainer.map(qc => qc.update);

    }

    return {
        questionsDetailsDivElement,
        update,
    };
}

function createQuestionArticleElement(questionData, questionIndex, selectedIndex) {
    const questionArticleElement = document.createElement('article');
    questionArticleElement.className = "preview";

    const isCorrectAnswered = questionData.correctIndex === selectedIndex;

    update();

    function update(currentButtonTextContent) {
        const wantToSee = currentButtonTextContent && currentButtonTextContent !== "Close";
        const buttonTextContent = wantToSee ? "Close" : isCorrectAnswered ? "See question" : "Reveal answer";

        render(html`
                <span class="s-${isCorrectAnswered ? "correct" : "incorrect"}">
                    Question ${questionIndex + 1}
                    <i class="fas fa-check"></i>
                </span>
                <div class="right-col">
                    <button class="action" data-question-index="${questionIndex}">${buttonTextContent}</button>
                </div>
                ${wantToSee
                    ? html`<div class="question-details">
                        <p>${questionData.text}</p>
                        ${questionData.answers.map((a, i) => answerTemplate(i === questionData.correctIndex, i === selectedIndex, a))}
                    </div>`
                    : ""
                }`,
            questionArticleElement
        );
    }

    return {
        questionArticleElement,
        update
    };
}

const answerTemplate = (isCurrentAnswerCorrect, isCurrentAnswerSelected, answer) => html`
    <div class="s-answer">
        <span class=${isCurrentAnswerCorrect ? "s-correct" : isCurrentAnswerSelected ? "s-incorrect" : ""}>
            ${answer}
            ${isCurrentAnswerCorrect
        ? html`
                    <i class="fas fa-check"></i>
                    <strong>Correct answer</strong>`
        : isCurrentAnswerSelected
            ? html`
                        <i class="fas fa-times"></i>
                        <strong>Your choice</strong>`
            : ""
    }
        </span>
    </div>`;