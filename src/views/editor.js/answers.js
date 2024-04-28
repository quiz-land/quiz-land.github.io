import { html, render } from "../../utilities/lib.js";

export function renderAnswersTemplate(questionData, questionIndex) {
    const answersContainerDivElement = document.createElement('div');
    answersContainerDivElement.addEventListener('click', onDelete);

    updateAnswersDivElement();

    function updateAnswersDivElement() {
        render(answersContainerTemplate(questionData, questionIndex, onCreate), answersContainerDivElement);
    }

    return answersContainerDivElement;

    function onCreate(event) {
        event.stopPropagation();
        questionData.tempAnswers.push("");
        updateAnswersDivElement()
    }

    function onDelete(event) {
        const clickedElement = event.target;
        const answerIndex = Number(clickedElement.closest('button[data-index]')?.dataset.index);

        if (isNaN(answerIndex) === false) {
            let correctIndex = questionData.correctIndex;
            correctIndex = correctIndex > answerIndex
                ? correctIndex - 1
                : correctIndex === answerIndex
                    ? null
                    : correctIndex;

            questionData.correctIndex = correctIndex;
            questionData.tempAnswers.splice(answerIndex, 1);

            updateAnswersDivElement();
        }
    }
}

const answersContainerTemplate = (questionData, questionIndex, createHandler) => html`
    ${questionData.isEditorInvoked
        ? html`
            ${questionData.tempAnswers.map((ad, i) => answerEditTemplate(questionData, questionIndex, i, ad))}

            <div class="editor-input">
                <button class="input submit action" @click=${createHandler}>
                    <i class="fas fa-plus-circle"></i>
                    Add answer
                </button>
            </div>`
        : questionData.answers.map((ad, i) => answerPreviewTemplate(questionData, questionIndex, i, ad))}`;

const answerEditTemplate = (questionData, questionIndex, answerIndex, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${answerIndex} ?checked=${answerIndex === questionData.correctIndex} />
            <i class="fas fa-check-circle"></i>
        </label>
        <input class="input" type="text" name="answer-${answerIndex}" .value=${answer || ''} placeholder=${answer ? "" : "Enter anwer"}>
        <button class="input submit action" data-index=${answerIndex}><i class="fas fa-trash-alt"></i></button>
    </div>`;

const answerPreviewTemplate = (questionData, questionIndex, answerIndex, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${answerIndex} ?checked=${answerIndex === questionData.correctIndex} disabled />
            <i class="fas fa-check-circle"></i>
        </label>
        <span>${answer}</span>
    </div>`;