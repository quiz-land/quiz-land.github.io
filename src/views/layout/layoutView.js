import { html } from "../../utilities/lib.js";

export const layoutTemplate = (navigationTemplate, currentTemplate) => html`
    <div id="container">
        ${navigationTemplate}
        <main id="content">
            ${currentTemplate}
        </main>
        <footer id="footer">
            Viktor Kostadinov &copy; 2021
        </footer>
    </div>`;