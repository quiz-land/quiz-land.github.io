import { html } from "../utilities/lib.js";

export const loadingOverlayTemplate = () => html`
    <div class="loading-overlay working"></div>`;

export const dotsLoaderTemplate = () => html`
    <div class="container-loader">
        <div class="loader"></div>
    </div>`;

export const spinnerLoaderTemplate = () => html`
    <div class="container-loader">
        <div class="spinner-loader"></div>
    </div>`;