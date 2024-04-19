import { createQuiz, getQuizById } from "../../services/quizesService.js";
import { quizTopics } from "../../utilities/common.js";
import { validateQuizData } from "../../utilities/validations.js";
import { html, ifDefined } from "./../../utilities/lib.js";
import { questionsTemplate } from "./questions.js";

const formId = 'create-form';

export async function renderEditorView(context) {
    const quizId = context.params.id;
    let quizData = null;

    if (quizId) {
        quizData = await getQuizById(quizId);
    }

    context.render(editorTemplate(quizData));
    context.registerForm(formId, onSave);

    async function onSave(data, formElement) {
        try {
            validateQuizData(data);

            const quizData = {
                title: data.title,
                topic: data.topic,
                description: data.description,
            };
            
            const response = await createQuiz(quizData);
            formElement.reset();
            context.page.redirect(`/edit/${response.objectId}`);
        } catch (error) {
            context.render(editorTemplate(quizId, error.message));
        }
    }
}

const editorTemplate = (quizData, errorMessage) => html`
    <section id="editor">

        <header class="pad-large">
            <h1>${quizData ? "Edit" : "New"} quiz</h1>
        </header>

        <div class="pad-large alt-page">
            <form id=${formId}>
                <p class="notification">
                    ${errorMessage || ''}
                </p>
                <label class="editor-label layout">
                    <span class="label-col">Title:</span>
                    <input class="input i-med" type="text" name="title" .value=${quizData ? quizData.title : ""}>
                </label>
                <label class="editor-label layout">
                    <span class="label-col">Topic:</span>
                    <select class="input i-med" name="topic"}>
                        <option value="all" ?selected=${quizData}>-- Select category</option>
                        ${Object.entries(quizTopics)
                            .map(([k, v]) => html`<option value=${k} ?selected=${quizData?.topic === k}>${v}</option>`)}
                    </select>
                </label><label class="editor-label layout">
                    <span class="label-col">Desciption:</span>
                    <textarea class="input i-med" type="text" name="description" .value=${quizData ? quizData.description : ""}></textarea>
                </label>
                <input class="input submit action" type="submit" value=${quizData ? "Edit" : "Save"}>
            </form>
        </div>

        ${quizData ? questionsTemplate() : ''}

    </section>`;