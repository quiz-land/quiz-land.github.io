import { page } from "./utilities/lib.js";

import { decorateContext } from "./middlewares/decorateContext.js";

import { renderHomeView } from "./views/home.js";
import { renderLoginPageView, renderRegisterPageView } from "./views/register-login.js";
import { renderEditorView } from "./views/editor.js/editor.js";
import { renderBrowseView } from "./views/browse.js";

page(decorateContext);

page('/', renderHomeView);
page('/register', renderRegisterPageView);
page('/login', renderLoginPageView);
page('/browse', renderBrowseView);
page('/create', renderEditorView);
page('/edit/:id', renderEditorView);

page.start();