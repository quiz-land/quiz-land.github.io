import { render } from "./../utilities/lib.js";

import { navigationTemplate } from "../commonTemplates/nav.js";
import { auth } from "./../utilities/auth.js";

const formsHandles = {};

const headerElement = document.querySelector('header');
const mainElement = document.querySelector('main');

export function decorateContext(context, next) {
    renderNavgation(context.page);
    context.render = (currentTemplate) => render(currentTemplate, mainElement);
    context.registerForm = (formId, handler) => formsHandles[formId] = handler;

    next();
}

function renderNavgation(page) {
    const hasLoggedInUser = auth.hasLoggedInUser();
    render(navigationTemplate(hasLoggedInUser, page), headerElement);
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