import { page } from "./utilities/lib.js";

import { decorateContext } from "./middlewares/decorateContext.js";

import { renderHomeView } from "./views/homeView.js";
import { renderLoginPageView, renderRegisterPageView } from "./views/layout/auth.js";
import { renderEditorView } from "./views/editor.js/editor.js";

page(decorateContext);

page('/', renderHomeView);
page('/register', renderRegisterPageView);
page('/login', renderLoginPageView);
page('/create', renderEditorView);

page.start();