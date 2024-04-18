import { render } from "./../utilities/lib.js";

import { layoutTemplate } from "./../views/layout/layoutView.js";
import { navigationTemplate } from "./../views/layout/nav.js";
import { auth } from "./../utilities/auth.js";

const formsHandles = {};

const bodyElement = document.body;

export function decorateContext(context, next) {
    const hasLoggedInUser = auth.hasLoggedInUser();

    context.render = (currentTemplate) => render(layoutTemplate(navigationTemplate(hasLoggedInUser, context.page), currentTemplate), bodyElement);
    context.registerForm = (formId, handler) => formsHandles[formId] = handler;

    next();
}

bodyElement.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const formElement = event.target;

    const handler = formsHandles[formElement.id];

    if (typeof handler === "function") {
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData);

        handler(data, formElement);
    }
});