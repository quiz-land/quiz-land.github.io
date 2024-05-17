import { html, render } from "../utilities/lib.js";

export function renderNotificationTemplate(questionIndex, agreeHandler, refuseHandler) {
    const notificationDivElement = document.createElement('div');
    notificationDivElement.className = 'notification';

    update();

    function update(isDisabled) {
        render(confirmActionTemplate(questionIndex, agreeHandler.bind(null, update), refuseHandler, isDisabled), notificationDivElement);
    }
    
    return notificationDivElement;
}

const confirmActionTemplate = (questionIndex, agreeHandler, refuseHandler, isDisabled) => html`
    <section id="popAlert">
        <aside>
            <h2>Are you sure want to delete Question ${questionIndex + 1}?</h2>
            <button type="button" @click=${agreeHandler} ?disabled=${isDisabled}>Yes</button>
            <button type="button" @click=${refuseHandler} ?disabled=${isDisabled}>No</button>
        </aside>
    </section>`;