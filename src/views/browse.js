import { html, until } from "../utilities/lib.js";

import { getQuizesData, getQuizesDataByTextAndTopic } from "../services/quizesService.js";
import { spinnerLoaderTemplate } from "../commonTemplates/loaders.js";
import { quizTopics } from "../utilities/common.js";

const searchFormId = 'search-form';

export function renderBrowseView(context) {
    context.render(browseTemplate(assembleSearchedData(context.querystring)));
    context.registerForm(searchFormId, onSearch);

    function onSearch(data) {
        const text = `text=${data.query.trim().split(' ').join('+')}`;
        const topic = `topic=${quizTopics[data.topic] ? `${quizTopics[data.topic].split(' ').join('+')}` : data.topic}`;
        const queryString = encodeURI(`${text}&${topic}`);
        context.page.redirect(`/browse/search?${queryString}`);
    }
}

const browseTemplate = (searchedData) => html`
    <section id="browse">
        <header class="pad-large">
            <form id=${searchFormId} class="browse-filter">
                <input class="input" type="text" name="query">
                <select class="input" name="topic">
                    <option value="all">All Categories</option>
                    ${Object.entries(quizTopics).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
                </select>
                <input class="input submit action" type="submit" value="Filter Quizes">
            </form>
            <h1>All quizes</h1>
        </header>
        ${until(quizesTemplate(searchedData), spinnerLoaderTemplate())}
    </section>`;

async function quizesTemplate(searchedData) {
    const quizesData = searchedData
        ? await getQuizesDataByTextAndTopic(searchedData)
        : await getQuizesData();

    return html`
        <div class="pad-large alt-page">
            ${quizesData.map(singleQuizTemplate)}
        </div>`;
}

const singleQuizTemplate = (quizata) => html`
    <article class="preview layout">
        <div class="right-col">
            <a class="action cta" href="/details/${quizata.objectId}">View Quiz</a>
        </div>
        <div class="left-col">
            <h3><a class="quiz-title-link" href="/details/${quizata.objectId}">${quizata.title}</a></h3>
            <span class="quiz-topic">Topic: ${quizata.topic}</span>
            <div class="quiz-meta">
                <span>${quizata.questionsCount} questions</span>
                <span>|</span>
                <span>Taken TODO times</span>
            </div>
        </div>
    </article>`;

function assembleSearchedData(querystring) {
    if (querystring !== "") {
        querystring = querystring.split('&')
            .reduce((acc, qs) => {
                acc.push(qs.split('=')[1]);
                return acc;
            }, []);
    }

    return querystring;
}