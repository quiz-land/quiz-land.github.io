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
            let tempCorrectIndex = questionData.tempCorrectIndex;
            tempCorrectIndex = tempCorrectIndex > answerIndex
                ? tempCorrectIndex - 1
                : tempCorrectIndex === answerIndex
                    ? null
                    : tempCorrectIndex;

            questionData.tempCorrectIndex = tempCorrectIndex;
            questionData.tempAnswers.splice(answerIndex, 1);

            updateAnswersDivElement();
        }
    }
}

const answersContainerTemplate = (questionData, questionIndex, createHandler) => html`
    ${questionData.isEditorInvoked
        ? html`
            ${questionData.tempAnswers.map((ad, i) => answerEditTemplate(questionIndex, i, i === questionData.tempCorrectIndex, ad))}

            <div class="editor-input">
                <button class="input submit action" @click=${createHandler}>
                    <i class="fas fa-plus-circle"></i>
                    Add answer
                </button>
            </div>`
        : questionData.answers.map((ad, i) => answerPreviewTemplate(questionIndex, i, i === questionData.correctIndex, ad))}`;

const answerEditTemplate = (questionIndex, answerIndex, isChecked, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${answerIndex} ?checked=${isChecked} />
            <i class="fas fa-check-circle"></i>
        </label>
        <input class="input" type="text" name="answer-${answerIndex}" .value=${answer || ''} placeholder=${answer ? "" : "Enter anwer"}>
        <button class="input submit action" data-index=${answerIndex}><i class="fas fa-trash-alt"></i></button>
    </div>`;

const answerPreviewTemplate = (questionIndex, answerIndex, isChecked, answer) => html`
    <div class="editor-input">
        <label class="radio">
            <input class="input" type="radio" name="question-${questionIndex}" value=${answerIndex} ?checked=${isChecked} disabled />
            <i class="fas fa-check-circle"></i>
        </label>
        <span>${answer}</span>
    </div>`;