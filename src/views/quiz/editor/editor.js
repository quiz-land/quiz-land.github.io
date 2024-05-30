import { html, render } from "./../../../utilities/lib.js";

import { createQuiz, editQuizData } from "../../../services/quizesService.js";
import { quizTopics } from "../../../utilities/common.js";
import { validateQuizData } from "../../../utilities/validations.js";
import { renderQuestionsTemplate } from "./questions/questions.js";

const updateFormDivElement = createFormDivElement();
const formId = 'create-form';

export async function renderEditorView(context) {
    const quizId = context.params.id;
    let quizData = null;
    let questionsData = [];

    if (quizId) {
        [ quizData, questionsData ] = await context.quizByIdAndItsQuestionsPromise;
    }

    context.render(editorTemplate(quizId, quizData, questionsData, onUpdateQuetionsCount));
    context.registerForm(formId, onSave);

    async function onSave(data) {
        try {
            validateQuizData(data);

            updateFormDivElement(quizId, data, '', true);

            const quizData = {
                title: data.title,
                topic: quizTopics[data.topic],
                description: data.description,
            };

            if (quizId === undefined) {
                const response = await createQuiz(quizData);
                context.page.redirect(`/edit/${response.objectId}`);
            } else {
                await editQuizData(quizId, quizData);
                updateFormDivElement(quizId, quizData);
            }
        } catch (error) {
            updateFormDivElement(quizId, data, error.message);
        }
    }

    async function onUpdateQuetionsCount() {
        try {
            await editQuizData(quizId, { questionsCount: questionsData.length });
        } catch (error) {
            alert(error.message);
        }
    }
}

function createFormDivElement() {
    const formDivElement = document.createElement('div');
    formDivElement.className = 'pad-large alt-page';

    function updateFormDivElement(quizId, quizData, errorMessage, isDisabled) {
        render(formTemplate(quizId, quizData, errorMessage, isDisabled), formDivElement);
        return formDivElement;
    }

    return updateFormDivElement;
}

const editorTemplate = (quizId, quizData, questionsData, updateQuetionsCountHandler) => html`
    <section id="editor">

        <header class="pad-large">
            <h1>${quizData ? "Edit" : "New"} quiz</h1>
        </header>

        ${updateFormDivElement(quizId, quizData)}

        ${quizData ? renderQuestionsTemplate(quizId, questionsData, updateQuetionsCountHandler) : ''}

    </section>`;

const formTemplate = (quizId, quizData, errorMessage, isDisabled) => html`
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
                ${Object.entries(quizTopics).map(([k, v]) => html`<option value=${k} ?selected=${quizData?.topic === v}>${v}</option>`)}
            </select>
        </label><label class="editor-label layout">
            <span class="label-col">Desciption:</span>
            <textarea class="input i-med" type="text" name="description" .value=${quizData ? quizData.description : ""} ?disabled=${isDisabled}></textarea>
        </label>
        <input class="input submit action" type="submit" value=${quizId ? "Edit" : "Save"} ?disabled=${isDisabled}>
    </form>`;