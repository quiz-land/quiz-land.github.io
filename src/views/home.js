import { html, until } from "../utilities/lib.js";

import { getQuizesCount } from "../services/quizesService.js";
import { quizTopics } from "../utilities/common.js";
import { dotsLoaderTemplate } from "../commonTemplates/loaders.js";
import { auth } from "../utilities/auth.js";

export function renderHomeView(context) {
    const hasLoggedInUser = auth.hasLoggedInUser();

    context.render(homeTemplate(hasLoggedInUser));
}

const homeTemplate = (hasLoggedInUser) => html`
    <section id="welcome">

        <div class="hero layout">
            <div class="splash right-col"><i class="fas fa-clipboard-list"></i></div>
            <div class="glass welcome">
                <h1>Welcome to the Quiz Land!</h1>
                ${until(greetingTemplate(), dotsLoaderTemplate())}
                <a class="action cta" href=${hasLoggedInUser ? "/create" : "/login"}>
                    ${hasLoggedInUser ? "Create a new quiz" : "Sign in to create a quiz"}</a>
            </div>
        </div>

        <div class="pad-large alt-page">
            <h2>Our most recent quiz:</h2>

            <article class="preview layout">
                <div class="right-col">
                    <a class="action cta" href="#">View Quiz</a>
                </div>
                <div class="left-col">
                    <h3>Extensible Markup Language</h3>
                    <span class="quiz-topic">Topic: Languages</span>
                    <div class="quiz-meta">
                        <span>15 questions</span>
                        <span>|</span>
                        <span>Taken 54 times</span>
                    </div>
                </div>
            </article>

            <div>
                <a class="action cta" href="/browse">Browse all quizes</a>
            </div>
        </div>
    </section>`;

async function greetingTemplate() {
    const quizesCount = await getQuizesCount();
    
    return html`
        <p>
            Challenge yourself with over ${quizesCount} quizes in ${Object.keys(quizTopics).length} topics. 
            <a href="/browse">Browse all quizes</a>.
        </p>`;
}