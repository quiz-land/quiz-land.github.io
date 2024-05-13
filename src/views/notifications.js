import { html } from "../utilities/lib.js";

export const confirmActionTemplate = (questionIndex, agreeHandler, refuseHandler) => html`
    <section id="popAlert">
        <aside>
            <h2>Are you sure want to delete Question ${questionIndex + 1}?</h2>
            <button type="button" @click=${agreeHandler}>Yes</button>
            <button type="button" @click=${refuseHandler}>No</button>
        </aside>
    </section>`;