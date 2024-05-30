import { html, render } from "../utilities/lib.js";

export function renderNotificationTemplate(handler) {
    const notificationDivElement = document.createElement('div');
    notificationDivElement.className = 'notification';

    update();

    function update(isDisabled) {
        render(confirmActionTemplate(handler, update, isDisabled), notificationDivElement);
    }
    
    return notificationDivElement;
}

const confirmActionTemplate = (handler, updateHandler, isDisabled) => html`
    <section id="popAlert">
        <aside>
            <h2>${handler.questionText}</h2>
            <button type="button" @click=${handler.onAgree.bind(null, updateHandler)} ?disabled=${isDisabled}>Yes</button>
            <button type="button" @click=${handler.onRefuse} ?disabled=${isDisabled}>No</button>
        </aside>
    </section>`;