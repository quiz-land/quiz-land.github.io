import { html } from "../utilities/lib.js";

export const confirmActionTemplate = (questionToDeleteInfo) => html`
    <section id="popAlert">
        <aside>
            <h2>Are you sure want to delete Question ${questionToDeleteInfo.index + 1}?</h2>
            <button type="button" @click=${questionToDeleteInfo.onAgree.bind(null, questionToDeleteInfo.id, questionToDeleteInfo.index)}>Yes</button>
            <button type="button" @click=${questionToDeleteInfo.onRefuse}>No</button>
        </aside>
    </section>`;