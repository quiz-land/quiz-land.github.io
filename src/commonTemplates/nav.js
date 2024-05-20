import { html, render } from "../utilities/lib.js";

import { auth } from "../utilities/auth.js";
import { logout } from "../services/usersServices.js";

export function updateNavigation(page, spanElement) {
    const templateToRender = auth.hasLoggedInUser()
        ? userTemplate(page)
        : guestTemplate();
    
    render(templateToRender, spanElement);
}

const userTemplate = (page) => html`
    <div id="user-nav">
        <a class="nav-link" href="/create">Create</a>
        <a class="nav-link profile-link" href="#"><i class="fas fa-user-circle"></i></a>
        <a id="logoutBtn" class="nav-link" href="javascript:void(0)" @click=${(event) => onLogout(event, page)}>Logout</a>
    </div>`;

const guestTemplate = () => html`
    <div id="guest-nav">
        <a class="nav-link" href="/login">Sign in</a>
    </div>`;

async function onLogout(event, page) {
    event.preventDefault();

    try {
        await logout();
        page.redirect('/');
    } catch (error) {
        alert(error.message);
    }
}