import { html } from "../utilities/lib.js";

import { logout } from "../services/usersServices.js";

export const navigationTemplate = (hasLoggedInUser, page) => html`
    <header id="titlebar">
        <nav>
            <a class="logotype" href="/"><i class="fas fa-question-circle"></i><i
                    class="merge fas fa-check-circle"></i><span>Quiz Fever</span></a>
            <div class="navigation">
                <a class="nav-link" href="/browse">Browse</a>
                ${hasLoggedInUser
                    ? userTemplate(page)
                    : guestTemplate()
                }
            </div>
        </nav>
    </header>`;

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