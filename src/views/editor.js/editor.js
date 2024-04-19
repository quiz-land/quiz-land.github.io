import { html } from "./../../utilities/lib.js";
import { questionsTemplate } from "./questions.js";

export function renderEditorView(context) {
    const quizId = context.params.id;
    context.render(editorTemplate(quizId));
}

const editorTemplate = (quizId) => html`
    <section id="editor">

        <header class="pad-large">
            <h1>New quiz</h1>
        </header>

        <div class="pad-large alt-page">
            <form>
                <label class="editor-label layout">
                    <span class="label-col">Title:</span>
                    <input class="input i-med" type="text" name="title">
                </label>
                <label class="editor-label layout">
                    <span class="label-col">Topic:</span>
                    <select class="input i-med" name="topic">
                        <option value="all">All Categories</option>
                        <option value="it">Languages</option>
                        <option value="hardware">Hardware</option>
                        <option value="software">Tools and Software</option>
                    </select>
                </label><label class="editor-label layout">
                    <span class="label-col">Desciption:</span>
                    <textarea class="input i-med" type="text" name="description"></textarea>
                </label>
                <input class="input submit action" type="submit" value="Save">
            </form>
        </div>

        ${quizId ? questionsTemplate() : ''}

    </section>`;