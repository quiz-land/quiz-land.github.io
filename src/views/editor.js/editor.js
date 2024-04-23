import { getQuestionsByQuizId } from "../../services/questionsService.js";
import { createQuiz, editQuizData, getQuizById } from "../../services/quizesService.js";
import { quizTopics } from "../../utilities/common.js";
import { validateQuizData } from "../../utilities/validations.js";
import { html, render } from "./../../utilities/lib.js";
import { renderQuestionsTemplate } from "./questions.js";

const formId = 'create-form';

export async function renderEditorView(context) {
    const quizId = context.params.id;
    let quizData = null;
    let questionsData = [];

    if (quizId) {
        [ quizData, questionsData ] = await Promise.all([
            getQuizById(quizId),
            getQuestionsByQuizId(quizId),
        ]);
    }
    
    const updateFormDivElement = createFormDivElement();

    context.render(editorTemplate(quizData, updateFormDivElement(quizData), questionsData));
    context.registerForm(formId, onSave);

    async function onSave(data) {
        try {
            validateQuizData(data);

            updateFormDivElement(data, '', true);

            const quizData = {
                title: data.title,
                topic: data.topic,
                description: data.description,
            };

            const response = quizId
                ? await editQuizData(quizId, quizData)
                : await createQuiz(quizData);

            context.page.redirect(`/edit/${quizId || response.objectId}`);
        } catch (error) {
            updateFormDivElement(data, error.message);
        }
    }
}

function createFormDivElement() {
    const formDivElement = document.createElement('div');
    formDivElement.className = 'pad-large alt-page';

    function updateFormDivElement(quizData, errorMessage, isDisabled) {
        render(formTemplate(quizData, errorMessage, isDisabled), formDivElement);
        return formDivElement;
    }

    return updateFormDivElement;
}

const editorTemplate = (quizData, formDivElement, questionsData) => html`
    <section id="editor">

        <header class="pad-large">
            <h1>${quizData ? "Edit" : "New"} quiz</h1>
        </header>

        ${formDivElement}

        ${quizData ? renderQuestionsTemplate(questionsData) : ''}

    </section>`;

const formTemplate = (quizData, errorMessage, isDisabled) => html`
    <form id=${formId}>
        <p class="notification">
            ${errorMessage || ''}
        </p>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title" .value=${quizData ? quizData.title : ""} ?disabled=${isDisabled}>
        </label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic" ?disabled=${isDisabled}>
                <option value="all" ?selected=${quizData}>-- Select category</option>
                ${Object.entries(quizTopics)
        .map(([k, v]) => html`<option value=${k} ?selected=${quizData?.topic === k}>${v}</option>`)}
            </select>
        </label><label class="editor-label layout">
            <span class="label-col">Desciption:</span>
            <textarea class="input i-med" type="text" name="description" .value=${quizData ? quizData.description : ""} ?disabled=${isDisabled}></textarea>
        </label>
        <input class="input submit action" type="submit" value=${quizData ? "Edit" : "Save"} ?disabled=${isDisabled}>
    </form>`;