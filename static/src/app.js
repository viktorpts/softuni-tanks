import page from './lib/page.mjs';
import { addLogout } from './middelwares/logout.js';
import { addRender } from './middelwares/render.js';
import { addSession } from './middelwares/session.js';
import { canvasView } from './views/canvas.js';
import { catalogView } from './views/catalog.js';
import { createView } from './views/create.js';
import { detailsView } from './views/details.js';
import { homeView } from './views/home.js';
import { loginView } from './views/login.js';
import { regsiterView } from './views/register.js';


const main = document.getElementById('main');

page(addSession());
page(addLogout());
page(addRender(main));
page('/index.html', '/');
page('/', homeView);
page('/login', loginView);
page('/register', regsiterView);
page('/games', catalogView);
page('/games/:id', detailsView);
page('/play/:id', canvasView);
page('/create', createView);

page.start();


