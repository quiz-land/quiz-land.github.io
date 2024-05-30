import { html, render, classMap } from "../../../utilities/lib.js";

export function createQuestionIndexesDivElement(questionsData, quizId) {
    const questionIndexesDivElement = document.createElement('div');

    function update(questionIndex) {
        render(questionsData.map((qd, i) => questionIndexTemplate(quizId, i === questionIndex, qd.selectedIndex !== undefined, i)), questionIndexesDivElement);
        return questionIndexesDivElement;
    }

    return update;
}

function questionIndexTemplate(quizId, isCurrent, isAnswered, questionIndex) {
    const classes = {
        'q-index': true,
        'q-current': isCurrent,
        'q-answered': isAnswered,
    };

    return html`<a class=${classMap(classes)} href="/quiz/${quizId}?question=${questionIndex + 1}"></a>`
}

export function createQuestionsRemainingDivElement() {
    const questionsRemainingDivElement = document.createElement('div');

    function update(unansweredQuestionsCount) {
        render(html`<span class="block">${unansweredQuestionsCount} question${unansweredQuestionsCount === 1 ? "" : "s"} remaining</span>`, questionsRemainingDivElement);
        return questionsRemainingDivElement;
    }

    return update;
}

export function createAnswerDivElement(questionIndex, answerIndex, isSelected, answer) {
    const answerDivElement = document.createElement('div');
    render(answerTemplate(questionIndex, answerIndex, isSelected, answer), answerDivElement);
    return answerDivElement
}

const answerTemplate = (questionIndex, answerIndex, isSelected, answer) => html`
    <label class="q-answer radio">
        <input class="input" type="radio" name="question-${questionIndex}" value=${answerIndex} .checked=${isSelected}/>
        <i class="fas fa-check-circle"></i>
        ${answer}
    </label>`;