import { page } from "./utilities/lib.js";

import { decorateContext } from "./middlewares/decorateContext.js";

import { renderHomeView } from "./views/home.js";
import { renderLoginPageView, renderRegisterPageView } from "./views/register-login.js";
import { renderEditorView } from "./views/quiz/editor/editor.js";
import { renderBrowseView } from "./views/browse.js";
import { renderQuizDetailsView } from "./views/quiz/quizDetails.js";
import { renderQuizView } from "./views/quiz/contestMode/quiz.js";
import { loadQuizByIdAndItsQuestionsPromise, loadQuizByIdAndItsSubmissionByCreatorIdPromise } from "./middlewares/loadData.js";
import { renderResultView } from "./views/quiz/result/result.js";

page(decorateContext);

page('/', renderHomeView);
page('/register', renderRegisterPageView);
page('/login', renderLoginPageView);
page('/browse', renderBrowseView);
page('/browse/search', renderBrowseView);
page('/details/:id', loadQuizByIdAndItsSubmissionByCreatorIdPromise, renderQuizDetailsView);
page('/quiz/:id', loadQuizByIdAndItsQuestionsPromise, renderQuizView);
page('/result/:id', renderResultView);
page('/create', renderEditorView);
page('/edit/:id', loadQuizByIdAndItsQuestionsPromise, renderEditorView);

page.start();