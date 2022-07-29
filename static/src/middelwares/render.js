import { render } from '../lib/lit-html.js';
import { layoutTemplate } from '../views/layout.js';


export function addRender(main) {
    let ctxCache = null;

    return (ctx, next) => {
        ctxCache = ctx;
        ctx.render = renderMain;

        next();
    };

    function renderMain(templateResult) {
        render(layoutTemplate(templateResult, ctxCache.onLogout, ctxCache.user), main);
    }
}