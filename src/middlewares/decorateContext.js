import { render } from "./../utilities/lib.js";

import { updateNavigation } from "../commonTemplates/nav.js";

const formsHandles = {};

const spanElement = document.getElementById('guest-or-user-nav');
const mainElement = document.querySelector('main');

export function decorateContext(context, next) {
    updateNavigation(context.page, spanElement);

    context.render = (currentTemplate) => render(currentTemplate, mainElement);
    context.registerForm = (formId, handler) => formsHandles[formId] = handler;
    
    next();
}

mainElement.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formElement = event.target;

    const handler = formsHandles[formElement.id];

    if (typeof handler === "function") {
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData);

        handler(data, formElement);
    }
});