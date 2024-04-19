import { html } from "../../utilities/lib.js";

import { validateRegisterUserData } from "../../utilities/validations.js";
import { login, register } from "../../services/usersServices.js";

const registerFormId = 'register-form';
const loginFormId = 'login-form';

export function renderRegisterPageView(context) {
    context.render(registerTemplate());
    context.registerForm(registerFormId, onRegister);

    async function onRegister(data, formElement) {
        try {
            validateRegisterUserData(data);

            const userData = {
                email: data.email,
                username:data.username,
                password: data.password
            };

            await register(userData);
            formElement.reset();
            context.page.redirect('/browse');
        } catch (error) {
            context.render(registerTemplate(error.message));
        }
    }
}

export function renderLoginPageView(context) {
    context.render(loginViewTemplate());
    context.registerForm(loginFormId, onLogin);

    async function onLogin(data, formElement) {
        try {
            const userData = {
                username:data.username,
                password: data.password
            };

            await login(userData);
            formElement.reset();
            context.page.redirect('/browse');
        } catch (error) {
            context.render(loginViewTemplate(error.message));
        }
    }
}

const registerTemplate = (errorMessage) => html`
    <section id="register">
        <div class="pad-large">
            <div class="glass narrow">
                <header class="tab layout">
                    <a class="tab-item" href="/login">Login</a>
                    <h1 class="tab-item active">Register</h1>
                </header>
                <form id=${registerFormId} class="pad-med centered">
                    <p class="notification">
                        ${errorMessage || ''}
                    </p>
                    <label class="block centered">Username: <input class="auth-input input" type="text"
                            name="username" /></label>
                    <label class="block centered">Email: <input class="auth-input input" type="text"
                            name="email" /></label>
                    <label class="block centered">Password: <input class="auth-input input" type="password"
                            name="password" /></label>
                    <label class="block centered">Repeat: <input class="auth-input input" type="password"
                            name="repass" /></label>
                    <input class="block action cta" type="submit" value="Create Account" />
                </form>
                <footer class="tab-footer">
                    Already have an account? <a class="invert" href="/login">Sign in here</a>.
                </footer>
            </div>
        </div>
    </section>`;

const loginViewTemplate = (errorMessage) => html`
    <section id="login">
        <div class="pad-large">
            <div class="glass narrow">
                <header class="tab layout">
                    <h1 class="tab-item active">Login</h1>
                    <a class="tab-item" href="/register">Register</a>
                </header>
                <form id=${loginFormId} class="pad-med centered">
                    <p class="notification">
                        ${errorMessage || ''}
                    </p>
                    <label class="block centered">Username: <input class="auth-input input" type="text"
                            name="username" /></label>
                    <label class="block centered">Password: <input class="auth-input input" type="password"
                            name="password" /></label>
                    <input class="block action cta" type="submit" value="Sign In" />
                </form>
                <footer class="tab-footer">
                    Don't have an account? <a class="invert" href="/register">Create one here</a>.
                </footer>
            </div>
        </div>
    </section>`;