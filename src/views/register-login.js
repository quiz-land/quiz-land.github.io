import { html, render } from "../utilities/lib.js";

import { validateRegisterUserData } from "../utilities/validations.js";
import { login, register } from "../services/usersServices.js";

const updateFormDivElement = createFormDivElement();

const registerSectionId = 'register'
const registerFormId = 'register-form';
const loginSectionId = 'login';
const loginFormId = 'login-form';

export function renderRegisterPageView(context) {
    context.render(formTemplate(updateFormDivElement(registerTemplate()), registerSectionId));
    context.registerForm(registerFormId, onRegister);

    async function onRegister(data, formElement) {
        try {
            validateRegisterUserData(data);

            updateFormDivElement(registerTemplate('', true));

            const userData = {
                email: data.email,
                username:data.username,
                password: data.password
            };

            await register(userData);
            formElement.reset();
            context.page.redirect('/browse');
        } catch (error) {
            updateFormDivElement(registerTemplate(error.message));
        }
    }
}

export function renderLoginPageView(context) {
    context.render(formTemplate(updateFormDivElement(loginTemplate()), loginSectionId));
    context.registerForm(loginFormId, onLogin);

    async function onLogin(data, formElement) {
        try {
            updateFormDivElement(loginTemplate('', true));

            const userData = {
                username:data.username,
                password: data.password
            };

            await login(userData);
            formElement.reset();
            context.page.redirect('/browse');
        } catch (error) {
            updateFormDivElement(loginTemplate(error.message));
        }
    }
}

function createFormDivElement() {
    const formDivElement = document.createElement('div');
    formDivElement.className = 'glass narrow';

    function updateFormDivElement(formTypeTemplateHandler) {
        render(formTypeTemplateHandler, formDivElement);
        return formDivElement;
    }

    return updateFormDivElement;
}

const formTemplate = (formTypeTemplate, sectionId) => html`
    <section id=${sectionId}>
        <div class="pad-large">
            ${formTypeTemplate}
        </div>
    </section>`;

const registerTemplate = (errorMessage, isDisabled) => html`
    <header class="tab layout">
        <a class="tab-item" href="/login">Login</a>
        <h1 class="tab-item active">Register</h1>
    </header>
    <form id=${registerFormId} class="pad-med centered">
        <p class="notification">
            ${errorMessage || ''}
        </p>
        <label class="block centered">Username: 
            <input class="auth-input input" type="text" name="username" ?disabled=${isDisabled}>
        </label>
        <label class="block centered">Email: 
            <input class="auth-input input" type="text" name="email" ?disabled=${isDisabled}>
        </label>
        <label class="block centered">Password:
            <input class="auth-input input" type="password" name="password" ?disabled=${isDisabled}>
        </label>
        <label class="block centered">Repeat: 
            <input class="auth-input input" type="password" name="repass" ?disabled=${isDisabled}>
        </label>
        <input class="block action cta" type="submit" value="Create Account" ?disabled=${isDisabled}>
    </form>
    <footer class="tab-footer">
        Already have an account? <a class="invert" href="/login">Sign in here</a>.
    </footer>`;

const loginTemplate = (errorMessage, isDisabled) => html`
    <header class="tab layout">
        <h1 class="tab-item active">Login</h1>
        <a class="tab-item" href="/register">Register</a>
    </header>
    <form id=${loginFormId} class="pad-med centered">
        <p class="notification">
            ${errorMessage || ''}
        </p>
        <label class="block centered">Username: 
            <input class="auth-input input" type="text" name="username" ?disabled=${isDisabled}>
        </label>
        <label class="block centered">Password:
            <input class="auth-input input" type="password" name="password" ?disabled=${isDisabled}>
        </label>
        <input class="block action cta" type="submit" value="Sign In" ?disabled=${isDisabled}>
    </form>
    <footer class="tab-footer">
        Don't have an account? <a class="invert" href="/register">Create one here</a>.
    </footer>`;